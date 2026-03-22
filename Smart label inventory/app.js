

// --- Store ---
class UserStore {
    constructor() {
        this.STORAGE_KEY = 'smart_label_users';
    }

    getUsers() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    }

    addUser(user) {
        const users = this.getUsers();
        if (users.find(u => u.email === user.email)) {
            throw new Error('Email already registered');
        }
        users.push(user);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    }

    validateUser(email, password) {
        const users = this.getUsers();
        return users.find(u => u.email === email && u.password === password);
    }

    updatePassword(email, newPassword) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email);
        if (user) {
            user.password = newPassword;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
            return true;
        }
        return false;
    }
}

class ArtifactStore {
    constructor() {
        this.STORAGE_KEY = 'smart_label_inventory_v6';
        this.AUTH_KEY = 'smart_label_user';
        this.AUDIT_KEY = 'smart_label_audit';

        // Initialize with data from data.js if empty
        if (!localStorage.getItem(this.STORAGE_KEY) && typeof INITIAL_ARTIFACTS !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(INITIAL_ARTIFACTS));
        }

        if (!localStorage.getItem(this.AUDIT_KEY)) {
            localStorage.setItem(this.AUDIT_KEY, JSON.stringify([]));
        }
    }

    getArtifacts(query = null) {
        if (query) {
            return VirtualInventory.search(query);
        }
        // Return a slice for the initial dashboard load
        const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        const virtuals = [];
        // Load the first 100 items for initial view
        for (let i = stored.length; i < stored.length + 100; i++) {
            if (i < VirtualInventory.total) {
                virtuals.push(VirtualInventory.getAt(i));
            }
        }
        return [...stored, ...virtuals];
    }

    getArtifact(id) {
        const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        const fromStore = stored.find(a => a.id === id);
        if (fromStore) return fromStore;

        // Check virtuals (simple numeric ID parsing ART-000001)
        const idNum = parseInt(id.replace('ART-', ''));
        const index = idNum - 1;
        if (!isNaN(index) && index >= 0 && index < VirtualInventory.total) {
            return VirtualInventory.getAt(index);
        }
        return null;
    }

    addArtifact(artifact) {
        const artifacts = this.getArtifacts();
        artifact.id = `ART-${Date.now().toString().slice(-4)}`; // Simple ID
        artifacts.push(artifact);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(artifacts));
        this.logAudit('Created Artifact', artifact.id);
        return artifact;
    }

    deleteArtifact(id) {
        let artifacts = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        const originalLength = artifacts.length;
        artifacts = artifacts.filter(a => a.id !== id);

        if (artifacts.length < originalLength) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(artifacts));
            this.logAudit('Deleted Artifact', id);
        } else {
            // It might be a virtual artifact, we can't delete those from the engine
            this.logAudit('Attempted Delete (Virtual)', id);
            alert("Cannot delete historical archive records (Virtual Artifacts).");
        }
    }

    // Auth
    login(username, role) {
        const user = { username, role };
        localStorage.setItem(this.AUTH_KEY, JSON.stringify(user));
        return user;
    }

    logout() {
        localStorage.removeItem(this.AUTH_KEY);
        // Reload to clear state
        window.location.hash = '';
        window.location.reload();
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.AUTH_KEY));
    }

    // Audit
    logAudit(action, targetId) {
        const user = this.getCurrentUser();
        if (!user) return;

        const logs = JSON.parse(localStorage.getItem(this.AUDIT_KEY) || '[]');
        logs.unshift({
            timestamp: new Date().toISOString(),
            user: user.username,
            action: action,
            targetId: targetId
        });
        localStorage.setItem(this.AUDIT_KEY, JSON.stringify(logs));
    }

    getAuditLog() {
        return JSON.parse(localStorage.getItem(this.AUDIT_KEY) || '[]');
    }
}

// --- App ---
class App {
    constructor() {
        this.appEl = document.getElementById('app');
        this.store = new ArtifactStore();
        this.userStore = new UserStore();

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.route());

        // Initial route
        this.route();
    }

    route() {
        const hash = window.location.hash;
        const user = this.store.getCurrentUser();

        // Default or Home -> Landing Page
        if (hash === '' || hash === '#home') {
            this.renderLanding();
            return;
        }

        // Auth Guard for other routes
        if (!user && hash !== '#login') {
            window.location.hash = '#login';
            return;
        }

        this.appEl.innerHTML = ''; // Clear content

        if (hash === '#login') {
            this.renderLogin();
        } else if (hash === '' || hash === '#dashboard') {
            this.renderDashboard(user);
        } else if (hash === '#add') {
            if (user.role !== 'admin') {
                window.location.hash = '#dashboard';
                return;
            }
            this.renderAddArtifact();
        } else if (hash.startsWith('#detail/')) {
            const id = hash.split('/')[1];
            this.renderDetail(id);
        } else if (hash === '#description') {
            this.renderDescription();
        }
    }

    renderLanding() {
        const landingEl = Components.LandingPage(() => {
            window.location.hash = '#login';
        });
        this.appEl.appendChild(landingEl);
    }

    renderLogin() {
        const loginEl = Components.Login(
            (data) => { // Login
                // Backdoor for specific admin
                if (data.email === 'nandakumar1982@gmail.com') {
                    this.store.login('Karthi', 'admin');
                    window.location.hash = '#dashboard';
                    return;
                }

                const user = this.userStore.validateUser(data.email, data.password);
                if (user) {
                    const promptDone = localStorage.getItem('smart_label_save_prompt_done') === 'true';
                    if (!promptDone) {
                        this.showSaveInfoPrompt(data.email, data.password, () => {
                            this.store.login(user.name, user.role);
                            window.location.hash = '#dashboard';
                        });
                    } else {
                        // Choice already made, just login
                        this.store.login(user.name, user.role);
                        window.location.hash = '#dashboard';
                    }
                } else {
                    alert('Incorrect username/password');
                    throw new Error('Incorrect username/password');
                }
            },
            (data) => { // Signup
                try {
                    this.userStore.addUser(data);
                    const promptDone = localStorage.getItem('smart_label_save_prompt_done') === 'true';
                    if (!promptDone) {
                        this.showSaveInfoPrompt(data.email, data.password, () => {
                            alert('Account created! Please login.');
                        });
                    } else {
                        // Even if prompt was done once, we might want to save this NEW account
                        this.showSaveInfoPrompt(data.email, data.password, () => {
                            alert('Account created! Please login.');
                        });
                    }
                    return true;
                } catch (e) {
                    alert(e.message);
                    throw e;
                }
            },
            // Forgot Password Callback
            (email, newPassword) => {
                return this.userStore.updatePassword(email, newPassword);
            },
            // Get Remembered Accounts
            () => {
                return JSON.parse(localStorage.getItem('smart_label_remembered_accounts') || '[]');
            },
            // Get All Registered Emails
            () => {
                return this.userStore.getUsers().map(u => u.email);
            }
        );
        this.appEl.appendChild(loginEl);
    }

    renderDashboard(user) {
        const artifacts = this.store.getArtifacts();

        // Add Logout button in header
        const logoutBtn = document.createElement('button');
        logoutBtn.innerText = `Logout (${user.username})`;
        logoutBtn.className = 'btn btn-secondary';
        logoutBtn.style.position = 'absolute';
        logoutBtn.style.top = '1.5rem';
        logoutBtn.style.left = '1.5rem'; // Moved to left to avoid blocking other buttons
        logoutBtn.style.zIndex = '10';
        logoutBtn.onclick = () => this.store.logout();

        this.appEl.appendChild(logoutBtn);

        const dashboardEl = Components.Dashboard(
            artifacts,
            (route) => window.location.hash = `#${route}`, // Navigate
            (id) => { // Delete
                this.store.deleteArtifact(id);
                this.route(); // Re-render
            },
            user.role,
            this.store // Pass store for search suggestions
        );
        this.appEl.appendChild(dashboardEl);
    }

    renderAddArtifact() {
        const formEl = Components.ArtifactForm(
            (data) => { // Submit
                this.store.addArtifact(data);
                window.location.hash = '#dashboard';
            },
            () => window.location.hash = '#dashboard' // Cancel
        );
        this.appEl.appendChild(formEl);
    }

    renderDetail(id) {
        const artifact = this.store.getArtifact(id);
        if (!artifact) {
            window.location.hash = '#dashboard';
            return;
        }

        // Log view
        this.store.logAudit('Viewed Artifact', id);

        const auditLog = this.store.getAuditLog().filter(l => l.targetId === id || !l.targetId); // Filter for this artifact (optional, currently global log)

        const detailEl = Components.ArtifactDetail(
            artifact,
            () => window.location.hash = '#dashboard',
            auditLog
        );

        this.appEl.appendChild(detailEl);

        // Initialize Map & QR after mounting
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            if (detailEl.mount) detailEl.mount();
        }, 0);
    }

    renderDescription() {
        const descEl = Components.SiteDescription(() => {
            window.location.hash = '#dashboard';
        });
        this.appEl.appendChild(descEl);
    }

    showSaveInfoPrompt(email, password, onComplete) {
        // Create a simple modal overlay
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.inset = '0';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        modal.className = 'animate-fade-in save-info-modal';

        const content = document.createElement('div');
        content.className = 'glass-panel';
        content.style.maxWidth = '400px';
        content.style.width = '90%';
        content.style.textAlign = 'center';
        content.style.padding = '3rem';
        content.style.borderRadius = '24px';
        content.style.background = 'white';

        content.innerHTML = `
            <div style="background: var(--primary-light); color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 1.5rem;">
                <i class="fas fa-save"></i>
            </div>
            <h3 style="margin-bottom: 1rem; color: var(--primary-dark);">Save Login Info?</h3>
            <p style="color: #666; margin-bottom: 2.5rem; line-height: 1.5;">Do you want your account information (Login Information), to be saved?</p>
            <div style="display: flex; gap: 1rem;">
                <button id="noBtn" class="btn btn-secondary" style="flex: 1; padding: 1rem; border-radius: 12px; font-weight: 700;">No</button>
                <button id="yesBtn" class="btn btn-primary pulse-primary" style="flex: 1; padding: 1rem; border-radius: 12px; font-weight: 700;">Yes</button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        modal.querySelector('#yesBtn').onclick = () => {
            // Save to multi-account list
            const accounts = JSON.parse(localStorage.getItem('smart_label_remembered_accounts') || '[]');
            if (!accounts.find(a => a.email === email)) {
                accounts.push({ email, password });
                localStorage.setItem('smart_label_remembered_accounts', JSON.stringify(accounts));
            } else {
                // Update password for existing remembered account
                const acc = accounts.find(a => a.email === email);
                acc.password = password;
                localStorage.setItem('smart_label_remembered_accounts', JSON.stringify(accounts));
            }

            localStorage.setItem('smart_label_save_credentials', 'true');
            localStorage.setItem('smart_label_remember_user', email);
            localStorage.setItem('smart_label_remember_pass', password);
            localStorage.setItem('smart_label_save_prompt_done', 'true');
            document.body.removeChild(modal);
            onComplete();
        };

        modal.querySelector('#noBtn').onclick = () => {
            localStorage.setItem('smart_label_save_credentials', 'false');
            localStorage.setItem('smart_label_save_prompt_done', 'true');
            document.body.removeChild(modal);
            onComplete();
        };
    }
}

// --- Paper Wrinkle Effects ---
const PaperWrinkles = {
    // Add random wrinkle lines to an artifact card
    addToCard(card) {
        if (card.dataset.wrinkled) return; // Don't double-apply
        card.dataset.wrinkled = 'true';

        const wrinkleCount = 2 + Math.floor(Math.random() * 3); // 2-4 wrinkles per card

        for (let i = 0; i < wrinkleCount; i++) {
            const wrinkle = document.createElement('div');
            wrinkle.className = 'paper-wrinkle paper-wrinkle-line';

            // Random position within the card
            const top = Math.random() * 90 + 5; // 5% to 95%
            const left = -10 + Math.random() * 20; // slight offset
            const angle = -30 + Math.random() * 60; // -30° to 30°
            const width = 60 + Math.random() * 80; // 60% to 140% of card width
            const height = 1 + Math.random() * 2.5; // 1px to 3.5px thin

            wrinkle.style.top = `${top}%`;
            wrinkle.style.left = `${left}%`;
            wrinkle.style.width = `${width}%`;
            wrinkle.style.height = `${height}px`;
            wrinkle.style.transform = `rotate(${angle}deg)`;
            wrinkle.style.animationDelay = `${Math.random() * 0.3}s`;
            wrinkle.style.opacity = (0.3 + Math.random() * 0.5).toString();

            card.appendChild(wrinkle);
        }
    },

    // Add a subtle page-level wrinkle overlay
    addPageOverlay() {
        if (document.querySelector('.page-wrinkle-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'page-wrinkle-overlay';

        const creaseCount = 4 + Math.floor(Math.random() * 3); // 4-6 page wrinkles

        for (let i = 0; i < creaseCount; i++) {
            const crease = document.createElement('div');
            crease.className = 'wrinkle-crease';

            const top = Math.random() * 100;
            const left = -5 + Math.random() * 10;
            const angle = -20 + Math.random() * 40;
            const width = 80 + Math.random() * 40; // wide creases
            const height = 1 + Math.random() * 2;

            crease.style.top = `${top}%`;
            crease.style.left = `${left}%`;
            crease.style.width = `${width}%`;
            crease.style.height = `${height}px`;
            crease.style.transform = `rotate(${angle}deg)`;

            overlay.appendChild(crease);
        }

        document.body.appendChild(overlay);
    },

    // Watch for new artifact cards and apply wrinkles
    observe() {
        this.addPageOverlay();

        // Apply to existing cards
        document.querySelectorAll('.artifact-card').forEach(card => {
            this.addToCard(card);
        });

        // Watch for dynamically added cards
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    // Check if node IS an artifact card
                    if (node.classList && node.classList.contains('artifact-card')) {
                        this.addToCard(node);
                    }
                    // Check children for artifact cards
                    if (node.querySelectorAll) {
                        node.querySelectorAll('.artifact-card').forEach(card => {
                            this.addToCard(card);
                        });
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
};

// Start App
const app = new App();

// Initialize paper wrinkle effects
PaperWrinkles.observe();
