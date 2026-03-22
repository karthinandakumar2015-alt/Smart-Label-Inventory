const Components = {
    // Utility to create elements safely
    createElement: (tag, className, innerHTML = '') => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        el.innerHTML = innerHTML;
        return el;
    },

    LandingPage: (onEnter) => {
        const container = document.createElement('div');
        container.className = 'animate-fade-in';
        container.style.height = '100vh';
        container.style.overflowY = 'auto';
        container.style.scrollBehavior = 'smooth';
        container.style.background = 'var(--gradient-primary)';
        container.style.color = 'white';
        container.style.position = 'relative';

        // Styles for Marquee
        const style = document.createElement('style');
        style.textContent = `
            @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            .marquee-container {
                display: flex;
                overflow: hidden;
                width: 100%;
                opacity: 0.3;
                pointer-events: none;
                position: absolute;
                top: 0;
                z-index: 0;
            }
            .marquee-content {
                display: flex;
                animation: marquee 60s linear infinite;
            }
            .marquee-item {
                flex: 0 0 auto;
                width: 300px;
                height: 200px;
                margin-right: 2rem;
                border-radius: 8px;
                overflow: hidden;
            }
            .marquee-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                filter: grayscale(0.5);
            }
        `;
        container.appendChild(style);

        // Simulated Artifact Images for Marquee
        // We use INITIAL_ARTIFACTS if available, loosely coupled
        let marqueeImages = [];
        if (typeof INITIAL_ARTIFACTS !== 'undefined') {
            marqueeImages = INITIAL_ARTIFACTS.slice(0, 20).map(a => `<div class="marquee-item"><img src="${a.photos[0]}" alt="${a.name}"></div>`).join('');
        }
        // Duplicate for seamless loop
        const marqueeHtml = `
            <div class="marquee-container">
                <div class="marquee-content">
                    ${marqueeImages}
                    ${marqueeImages}
                </div>
            </div>
        `;

        container.innerHTML += `
            ${marqueeHtml}
            <div style="position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 2rem;">
                <h1 style="font-size: 4rem; margin-bottom: 1rem; text-shadow: 0 4px 6px rgba(0,0,0,0.3); letter-spacing: 2px;">Smart Label Inventory</h1>
                <p style="font-size: 1.5rem; margin-bottom: 3rem; opacity: 0.9; max-width: 800px; line-height: 1.6;">
                    Revolutionizing archaeological management with intelligent tracking and comprehensive data integration.
                </p>
                
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                    <button id="enterBtn" class="btn" style="background: white; color: var(--primary-dark); padding: 1rem 3rem; font-size: 1.2rem; border-radius: 50px; box-shadow: 0 10px 20px rgba(0,0,0,0.2); transition: transform 0.2s;">
                        Enter Portal <i class="fas fa-arrow-right"></i>
                    </button>
                    <button id="learnMoreBtn" class="btn" style="background: transparent; border: 2px solid white; color: white; padding: 1rem 3rem; font-size: 1.2rem; border-radius: 50px; transition: background 0.2s;">
                        Learn More
                    </button>
                </div>
            </div>

            <div id="info-section" style="background: white; color: var(--text-dark); padding: 5rem 2rem;">
                <div style="max-width: 1000px; margin: 0 auto;">
                    <h2 style="text-align: center; margin-bottom: 4rem; font-size: 2.5rem; color: var(--primary-dark);">Our Innovation</h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 4rem;">
                        <div style="text-align: center;">
                            <div style="width: 80px; height: 80px; background: var(--primary-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: white; font-size: 2rem;">
                                <i class="fas fa-tag"></i>
                            </div>
                            <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">Smart Label</h3>
                            <p style="color: #666; line-height: 1.6;">
                                Our proprietary Smart Label technology integrates battery-powered GPS tracking with QR code data storage. This allows for real-time location monitoring and instant access to artifact history, ensuring security and accessibility for every item in the collection.
                            </p>
                        </div>

                        <div style="text-align: center;">
                            <div style="width: 80px; height: 80px; background: var(--secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: white; font-size: 2rem;">
                                <i class="fas fa-boxes"></i>
                            </div>
                            <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">Inventory Management</h3>
                            <p style="color: #666; line-height: 1.6;">
                                A centralized dashboard for global artifact oversight. Manage collections, track shipments, and audit access with our secure, role-based platform. From excavation site to museum display, we provide total visibility.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style="background: var(--primary-dark); color: white; padding: 2rem; text-align: center; font-size: 0.9rem;">
                &copy; ${new Date().getFullYear()} Smart Label Archeology Dept. | Innovation Team
            </div>
        `;
        container.querySelector('#enterBtn').onclick = onEnter;
        container.querySelector('#learnMoreBtn').onclick = () => {
            container.querySelector('#info-section').scrollIntoView({ behavior: 'smooth' });
        };

        return container;
    },

    Login: (onLogin, onSignup, onResetPassword, getRememberedAccounts, getAllEmails) => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.inset = '0';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.overflow = 'hidden';

        // Background Slideshow Layer
        const bgLayer = document.createElement('div');
        bgLayer.style.position = 'absolute';
        bgLayer.style.inset = '0';
        bgLayer.style.zIndex = '-1';
        container.appendChild(bgLayer);

        // Dark Overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.inset = '0';
        overlay.style.background = 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)';
        overlay.style.backdropFilter = 'blur(6px)';
        overlay.style.zIndex = '0';
        container.appendChild(overlay);

        const formWrapper = document.createElement('div');
        formWrapper.style.position = 'relative';
        formWrapper.style.zIndex = '1';
        formWrapper.style.width = '100%';
        formWrapper.style.maxWidth = '420px';
        formWrapper.style.padding = '0 1rem';
        container.appendChild(formWrapper);

        // State
        let isSignup = false;

        // Get random artifact photos for slideshow
        const getPhotos = () => {
            const artifacts = (typeof INITIAL_ARTIFACTS !== 'undefined') ? INITIAL_ARTIFACTS : [];
            return artifacts.filter(a => a.photos && a.photos.length).map(a => a.photos[0]);
        };
        const slideshowPhotos = getPhotos();

        const changeBackground = () => {
            if (slideshowPhotos.length === 0) return;
            const nextPhoto = slideshowPhotos[Math.floor(Math.random() * slideshowPhotos.length)];
            const img = new Image();
            img.src = nextPhoto;
            img.onload = () => {
                const newBg = document.createElement('div');
                newBg.style.position = 'absolute';
                newBg.style.inset = '0';
                newBg.style.backgroundImage = `url(${nextPhoto})`;
                newBg.style.backgroundSize = 'cover';
                newBg.style.backgroundPosition = 'center';
                newBg.style.opacity = '0';
                newBg.style.transition = 'opacity 2.5s ease-in-out';

                bgLayer.appendChild(newBg);

                // Trigger transition
                setTimeout(() => {
                    newBg.style.opacity = '1';
                }, 50);

                // Clean up old backgrounds
                if (bgLayer.children.length > 2) {
                    const oldBg = bgLayer.firstChild;
                    oldBg.style.opacity = '0';
                    setTimeout(() => {
                        if (oldBg.parentNode === bgLayer) bgLayer.removeChild(oldBg);
                    }, 2500);
                }
            };
        };

        // Initial background
        changeBackground();
        const bgInterval = setInterval(changeBackground, 8000);

        const renderForm = () => {
            const rememberedAccounts = getRememberedAccounts ? getRememberedAccounts() : [];
            const rememberedUser = rememberedAccounts.length > 0 ? rememberedAccounts[0].email : (localStorage.getItem('smart_label_remember_user') || 'karthi.nandakumar2015@gmail.com');
            const rememberedPass = rememberedAccounts.length > 0 ? rememberedAccounts[0].password : (localStorage.getItem('smart_label_remember_pass') || 'karthi1234#');

            formWrapper.innerHTML = `
                <div class="glass-panel animate-fade-in" style="background: rgba(255,255,255,0.92); box-shadow: 0 25px 50px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.4);">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <i class="fas fa-microchip fa-3x" style="color: var(--primary); margin-bottom: 1rem;"></i>
                        <h2 style="color: var(--primary-dark); font-weight: 800; font-size: 1.8rem;">${isSignup ? 'Innovator Enrollment' : 'Portal Access'}</h2>
                        <p style="color: #666; font-size: 0.9rem; font-weight: 500;">Smart Label Archaeological Inventory</p>
                    </div>
                    
                    ${isSignup ? `
                        <div class="input-group">
                            <label><i class="fas fa-user"></i> Full Name</label>
                            <input type="text" id="fullname" placeholder="Karthi N.">
                        </div>
                    ` : ''}

                    <div class="input-group">
                        <label><i class="fas fa-envelope"></i> Personnel Email</label>
                        <input type="email" id="email" list="savedEmails" placeholder="example@archaeo.site" value="${!isSignup ? rememberedUser : ''}">
                        <datalist id="savedEmails">
                            ${(getAllEmails ? getAllEmails() : []).map(email => `<option value="${email}">`).join('')}
                        </datalist>
                    </div>
                    
                    <div class="input-group">
                        <label><i class="fas fa-key"></i> Security Key</label>
                        <input type="password" id="password" placeholder="••••••••" value="${!isSignup ? rememberedPass : ''}">
                    </div>

                    ${isSignup ? `
                        <input type="hidden" id="role" value="viewer">
                    ` : ''}

                    <div style="margin-bottom: 1.5rem; text-align: right;">
                        <a href="#" id="forgotBtn" style="font-size: 0.85rem; color: var(--primary); text-decoration: none;">Forgot Key?</a>
                    </div>

                    <button id="actionBtn" class="btn btn-primary" style="width: 100%; padding: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 12px; font-size: 1rem;">
                        ${isSignup ? 'Create Account' : 'Login'}
                    </button>
                    
                    <div style="text-align: center; margin-top: 1.5rem; font-size: 0.95rem; color: #555;">
                        ${isSignup ? 'Already have credentials?' : 'Need official access?'} 
                        <a href="#" id="toggleMode" style="color: var(--primary); font-weight: 700; text-decoration: none; border-bottom: 2px solid transparent; transition: all 0.2s ease;">${isSignup ? 'Sign In' : 'New account'}</a>
                    </div>
                </div>
            `;

            // Auto-password fill logic
            const emailInput = formWrapper.querySelector('#email');
            const passwordInput = formWrapper.querySelector('#password');
            if (emailInput && passwordInput) {
                emailInput.oninput = (e) => {
                    const email = e.target.value;
                    const match = rememberedAccounts.find(a => a.email === email);
                    if (match) passwordInput.value = match.password;
                };
            }

            // Style the link hover
            const toggleLink = formWrapper.querySelector('#toggleMode');
            if (toggleLink) {
                toggleLink.onmouseover = () => toggleLink.style.borderBottomColor = 'var(--primary)';
                toggleLink.onmouseout = () => toggleLink.style.borderBottomColor = 'transparent';
                toggleLink.onclick = (e) => {
                    e.preventDefault();
                    isSignup = !isSignup;
                    renderForm();
                };
            }

            // Forgot Password Flow
            const forgotBtn = formWrapper.querySelector('#forgotBtn');
            if (forgotBtn) {
                forgotBtn.onclick = (e) => {
                    e.preventDefault();
                    const email = formWrapper.querySelector('#email').value;
                    if (!email) {
                        alert('Security Check: Enter your email first to reset your security key.');
                        return;
                    }
                    
                    // Step 1: Redirect to Gmail Compose
                    const subject = encodeURIComponent("Security Key Reset - Smart Label Inventory");
                    const body = encodeURIComponent(`Hello,\n\nWe received a request to reset your security key for the Smart Label Inventory system (Account: ${email}).\n\nIf you want to change your password, please return to the website (${window.location.href}) and click the "Authenticate new password" button to proceed.\n\nIf you did not request this, please ignore this email.`);
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${email}&su=${subject}&body=${body}`;
                    window.open(gmailUrl, '_blank');
                    
                    // Step 2: Show "Return from Email" overlay
                    const returnModal = document.createElement('div');
                    returnModal.style.position = 'fixed';
                    returnModal.style.inset = '0';
                    returnModal.style.background = 'rgba(0,0,0,0.85)';
                    returnModal.style.zIndex = '10000';
                    returnModal.style.display = 'flex';
                    returnModal.style.alignItems = 'center';
                    returnModal.style.justifyContent = 'center';
                    returnModal.style.backdropFilter = 'blur(10px)';
                    
                    returnModal.innerHTML = `
                        <div class="glass-panel" style="background: white; max-width: 500px; width: 90%; padding: 3rem; border-radius: 20px; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.5);">
                            <div style="color: var(--primary); font-size: 4rem; margin-bottom: 1.5rem;"><i class="fas fa-envelope-open-text"></i></div>
                            <h2 style="margin-bottom: 1rem; color: var(--primary-dark);">Check Your Gmail</h2>
                            <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">We've opened your email client to send the reset request. Once you've confirmed the reset in your email, click the button below to set your new security key.</p>
                            <button id="authNewPassBtn" class="btn btn-primary" style="width: 100%; padding: 1.2rem; font-weight: 700; border-radius: 12px; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px;">Authenticate new password</button>
                            <button id="cancelReset" style="background: none; border: none; color: #999; margin-top: 2rem; cursor: pointer; font-weight: 600;">Cancel & Return to Login</button>
                        </div>
                    `;
                    document.body.appendChild(returnModal);
                    
                    returnModal.querySelector('#cancelReset').onclick = () => document.body.removeChild(returnModal);
                    
                    returnModal.querySelector('#authNewPassBtn').onclick = () => {
                        document.body.removeChild(returnModal);
                        
                        // Step 3: New Password Modal
                        const passModal = document.createElement('div');
                        passModal.style.position = 'fixed';
                        passModal.style.inset = '0';
                        passModal.style.background = 'rgba(0,0,0,0.85)';
                        passModal.style.zIndex = '10000';
                        passModal.style.display = 'flex';
                        passModal.style.alignItems = 'center';
                        passModal.style.justifyContent = 'center';
                        passModal.style.backdropFilter = 'blur(10px)';
                        
                        passModal.innerHTML = `
                            <div class="glass-panel" style="background: white; max-width: 400px; width: 90%; padding: 3rem; border-radius: 20px; box-shadow: 0 25px 50px rgba(0,0,0,0.5);">
                                <h3 style="margin-bottom: 1.5rem; color: var(--primary-dark); font-weight: 800;">Set New Security Key</h3>
                                <p style="color: #666; margin-bottom: 1.5rem; font-size: 0.9rem;">Please enter your new security key for <b>${email}</b>.</p>
                                <div class="input-group">
                                    <label>New Key</label>
                                    <input type="password" id="newPassword" placeholder="••••••••" style="width: 100%; padding: 1rem; border: 2px solid #eee; border-radius: 12px; font-size: 1.1rem;">
                                </div>
                                <button id="saveNewPassBtn" class="btn btn-primary" style="width: 100%; margin-top: 2rem; padding: 1.2rem; border-radius: 12px; font-weight: 700; text-transform: uppercase;">Finalize Reset</button>
                                <button id="cancelPass" style="background: none; border: none; color: #999; width: 100%; margin-top: 1rem; cursor: pointer;">Cancel</button>
                            </div>
                        `;
                        document.body.appendChild(passModal);

                        passModal.querySelector('#cancelPass').onclick = () => document.body.removeChild(passModal);
                        
                        passModal.querySelector('#saveNewPassBtn').onclick = () => {
                            const newPass = passModal.querySelector('#newPassword').value;
                            if (newPass && onResetPassword(email, newPass)) {
                                alert('Verification Success: Your security key has been updated. Please login with your new credentials.');
                                document.body.removeChild(passModal);
                                renderForm();
                            } else {
                                alert('System Error: Could not reset password. This email may not be registered in our system.');
                            }
                        };
                    };
                };
            }

            formWrapper.querySelector('#actionBtn').onclick = () => {
                const email = formWrapper.querySelector('#email').value;
                const password = formWrapper.querySelector('#password').value;

                if (!email || (!password && email !== 'karthi.nandakumar2015@gmail.com')) {
                    alert('Security Check: All authorization fields required.');
                    return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('System Error: Invalid email signature.');
                    return;
                }

                if (isSignup) {
                    const name = formWrapper.querySelector('#fullname').value;
                    const role = formWrapper.querySelector('#role').value;
                    if (!name) {
                        alert('Identity Verification: Full name required.');
                        return;
                    }
                    try {
                        if (onSignup && onSignup({ email, password, name, role })) {
                            isSignup = false;
                            renderForm();
                        }
                    } catch (e) { }
                } else {
                    try {
                        onLogin({ email, password });
                    } catch (e) { }
                }
            };
        };

        renderForm();
        return container;
    },

    Dashboard: (artifacts, onNavigate, onDelete, userRole, store) => {
        const container = document.createElement('div');
        container.className = 'container animate-fade-in';
        container.style.paddingTop = '2rem';

        let currentView = 'inventory'; 

        if (localStorage.getItem('smart_label_open_feedback') === 'true') {
            currentView = 'feedback';
            localStorage.removeItem('smart_label_open_feedback');
        }

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '2rem';

        const addBtnHtml = userRole === 'admin' ? 
            `<button id="addBtn" class="btn btn-primary"><i class="fas fa-plus"></i> Add Artifact</button>` : '';

        header.innerHTML = `
            <h1 style="font-size: 2.5rem; letter-spacing: -1px; background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800;">Artifact Inventory</h1>
            <div style="display: flex; gap: 1rem;">
                <button id="dashboardDescBtn" class="btn btn-secondary"><i class="fas fa-layer-group"></i> Dashboard</button>
                <button id="aboutUsBtn" class="btn btn-secondary"><i class="fas fa-users"></i> About Us</button>
                <button id="feedbackBtn" class="btn btn-secondary" style="background: #2196F3; color: white; border: none; box-shadow: 0 4px 12px rgba(33,150,243,0.3);"><i class="fas fa-comment-dots"></i> Feedback</button>
                ${addBtnHtml}
            </div>
        `;

        const mainContent = document.createElement('div');

        const dashboardBtn = header.querySelector('#dashboardDescBtn');
        const aboutUsBtn = header.querySelector('#aboutUsBtn');
        const feedbackBtn = header.querySelector('#feedbackBtn');
        const addBtn = header.querySelector('#addBtn');

        if (dashboardBtn) dashboardBtn.onclick = () => { currentView = 'inventory'; render(); };
        if (aboutUsBtn) aboutUsBtn.onclick = () => { currentView = 'about'; render(); };
        if (feedbackBtn) feedbackBtn.onclick = () => { currentView = 'feedback'; render(); };
        if (addBtn) addBtn.onclick = () => onNavigate('add-artifact');

        const render = () => {
            mainContent.innerHTML = '';

            if (currentView === 'inventory') {
                // --- Inventory View ---
                const slideshowContainer = document.createElement('div');
                slideshowContainer.className = 'featured-slideshow';

                if (artifacts.length > 0) {
                    let currentIndex = 0;
                    const slideshowImages = artifacts.filter(a => a.photos && a.photos.length > 0).slice(0, 5).map((a, idx) => `
                        <div class="slideshow-img ${idx === 0 ? 'active' : ''}" style="background-image: url(${a.photos[0]});">
                            <div class="slideshow-content">
                                <h2 style="font-size: 3rem; margin-bottom: 0.5rem; color: white; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">${a.name}</h2>
                                <p style="font-size: 1.2rem; opacity: 0.9; color: white;"><i class="fas fa-map-marker-alt"></i> ${a.locationName || 'Unknown Site'}</p>
                            </div>
                        </div>
                    `).join('');
                    slideshowContainer.innerHTML = slideshowImages;

                    const interval = setInterval(() => {
                        const images = slideshowContainer.querySelectorAll('.slideshow-img');
                        if (images.length <= 1 || !mainContent.contains(slideshowContainer)) {
                            clearInterval(interval);
                            return;
                        }
                        images[currentIndex].classList.remove('active');
                        currentIndex = (currentIndex + 1) % images.length;
                        images[currentIndex].classList.add('active');
                    }, 5000);
                }

                // Search Backdrop
                let backdrop = document.getElementById('searchBackdrop');
                if (!backdrop) {
                    backdrop = document.createElement('div');
                    backdrop.id = 'searchBackdrop';
                    document.body.appendChild(backdrop);
                }

                const searchContainer = document.createElement('div');
                searchContainer.className = 'search-container';
                searchContainer.style.position = 'relative';
                searchContainer.style.zIndex = '1002';
                searchContainer.innerHTML = `
                    <div class="search-box">
                        <i class="fas fa-search" style="color: var(--primary);"></i>
                        <input type="text" id="artifactSearch" placeholder="Search the collection..." autocomplete="off">
                        <ul id="searchSuggestions" class="search-suggestions hidden"></ul>
                    </div>
                `;

                const grid = document.createElement('div');
                grid.style.display = 'grid';
                grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
                grid.style.gap = '2.5rem';
                grid.style.marginTop = '2rem';

                const searchInput = searchContainer.querySelector('#artifactSearch');
                const suggestionsList = searchContainer.querySelector('#searchSuggestions');

                const renderGrid = (items) => {
                    grid.innerHTML = '';
                    if (items.length === 0) {
                        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 6rem;">
                            <i class="fas fa-search-minus fa-3x" style="display: block; margin-bottom: 1.5rem; opacity: 0.3;"></i>
                            No artifacts match your search.
                        </p>`;
                        return;
                    }

                    items.forEach(artifact => {
                        const card = document.createElement('div');
                        card.className = 'glass-panel artifact-card pulse-hover animate-pop-in';
                        card.style.cursor = 'pointer';
                        card.onclick = (e) => {
                            if (!e.target.closest('.delete-btn')) onNavigate(`detail/${artifact.id}`);
                        };

                        const deleteBtn = userRole === 'admin' ? 
                            `<button class="btn delete-btn" style="background: rgba(255,59,48,0.1); color: #ff3b30; padding: 0.6rem; border-radius: 12px; float: right; border: none; transition: 0.2s;"><i class="fas fa-trash-alt"></i></button>` : '';

                        card.innerHTML = `
                            <div style="height: 240px; background: #f8f9fa; border-radius: 20px; margin-bottom: 1.5rem; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative; border: 1px solid rgba(0,0,0,0.05);">
                                <img src="${artifact.photos[0]}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://via.placeholder.com/400?text=Artifact'">
                            </div>
                            ${deleteBtn}
                            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--primary-dark); font-weight: 800; letter-spacing: -0.5px;">${artifact.name}</h3>
                            <p style="color: #666; font-size: 0.95rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;"><i class="fas fa-compass" style="color: var(--primary);"></i> ${artifact.locationName || 'Uncharted Site'}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 1.5rem;">
                                <span style="font-size: 0.8rem; background: rgba(0,0,0,0.05); padding: 0.5rem 1rem; border-radius: 100px; font-family: monospace; font-weight: 700;">${artifact.id}</span>
                                <span style="font-size: 0.9rem; font-weight: 800; color: ${artifact.battery < 20 ? '#ff3b30' : '#28a745'}; display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-battery-${artifact.battery < 20 ? 'quarter' : 'three-quarters'}"></i> ${artifact.battery}%
                                </span>
                            </div>
                        `;

                        if (userRole === 'admin') {
                            const dBtn = card.querySelector('.delete-btn');
                            if (dBtn) dBtn.onclick = (e) => { e.stopPropagation(); if (confirm('Remove artifact?')) onDelete(artifact.id); };
                        }
                        grid.appendChild(card);
                    });
                };

                const hideSuggestions = () => {
                    suggestionsList.classList.add('hidden');
                    backdrop.classList.remove('active');
                };

                searchInput.oninput = (e) => {
                    const query = e.target.value;
                    const results = store.getArtifacts(query);
                    renderGrid(results);

                    if (query.trim().length > 0) {
                        const suggestions = results.slice(0, 5);
                        if (suggestions.length > 0) {
                            suggestionsList.innerHTML = suggestions.map(a => `
                                <li data-id="${a.id}" class="animate-pop-in" style="display: flex; align-items: center; padding: 1.2rem; border-radius: 15px; cursor: pointer; background: white; margin-bottom: 0.6rem; border: 1px solid rgba(0,0,0,0.05);">
                                    <img src="${a.photos[0]}" style="width: 55px; height: 55px; border-radius: 12px; margin-right: 1.5rem; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                    <div style="display: flex; flex-direction: column; flex: 1;">
                                        <span style="font-weight: 800; font-size: 1.2rem; color: var(--primary-dark);">${a.name}</span>
                                        <span style="font-size: 0.85rem; opacity: 0.6; font-weight: 600;">${a.id} • ${a.locationName || 'Uncharted Site'}</span>
                                    </div>
                                    <div style="background: var(--primary); color: white; padding: 0.7rem 1.4rem; border-radius: 12px; font-size: 0.85rem; font-weight: 800; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(4,47,62,0.3);">PICK</div>
                                </li>
                            `).join('');
                            suggestionsList.classList.remove('hidden');
                            backdrop.classList.add('active');
                        } else { hideSuggestions(); }
                    } else { hideSuggestions(); }
                };

                backdrop.onclick = hideSuggestions;
                suggestionsList.onclick = (e) => {
                    const li = e.target.closest('li');
                    if (li) { onNavigate(`detail/${li.dataset.id}`); hideSuggestions(); }
                };

                mainContent.appendChild(slideshowContainer);
                mainContent.appendChild(searchContainer);
                mainContent.appendChild(grid);
                renderGrid(artifacts);

            } else if (currentView === 'about') {
                // --- About Us View ---
                const aboutContainer = document.createElement('div');
                aboutContainer.className = 'animate-fade-in';

                // Project Info at the top
                const projectInfo = document.createElement('div');
                projectInfo.className = 'glass-panel';
                projectInfo.style.padding = '3rem';
                projectInfo.style.marginBottom = '3rem';
                projectInfo.style.borderRadius = '32px';
                projectInfo.innerHTML = `
                    <h2 style="color: var(--primary-dark); margin-bottom: 1.5rem;"><i class="fas fa-info-circle"></i> Our Mission</h2>
                    <p style="font-size: 1.2rem; line-height: 1.6; color: #444;">
                        This is an inventory web app where we have put artifacts and their history into this web app, and we wish to store all the artifacts that have been found, and we can add new artifacts as well, so that is what we wish to accomplish in this web app. 
                        <strong>We also want to help you save artifacts that you think are cool and you want to learn more about them.</strong>
                    </p>
                `;

                // Team Section
                const teamSection = document.createElement('div');
                teamSection.id = 'dashboard-team-section';
                teamSection.style.background = 'white';
                teamSection.style.borderRadius = '32px';
                teamSection.style.boxShadow = '0 20px 50px rgba(0,0,0,0.1)';
                teamSection.style.padding = '4rem 2rem';

                teamSection.innerHTML = `
                    <div style="text-align: center; margin-bottom: 4rem;">
                        <h2 style="margin: 0; color: var(--primary-dark); font-size: 3.5rem; letter-spacing: -1px;">Meet the Team</h2>
                        <p style="color: #666; margin-top: 1rem; font-size: 1.4rem; max-width: 800px; margin-left: auto; margin-right: auto;">The visionaries and innovators behind the Smart Label archaeological ecosystem.</p>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 3rem;">
                        ${[
                        { id: 'karthi', name: 'Karthi' },
                        { id: 'kian', name: 'Kian' },
                        { id: 'rey', name: 'Rey' },
                        { id: 'alex', name: 'Alex' },
                        { id: 'atharv', name: 'Atharv' },
                        { id: 'shaurya', name: 'Shaurya' }
                    ].map(person => {
                        const savedPhoto = localStorage.getItem('smart_label_team_' + person.id);
                        const isEditable = person.id === 'kian';
                        return `
                            <div class="glass-panel" style="width: 300px; text-align: center; padding: 3rem; border-radius: 30px; background: #fcfcfc; border: 1px solid #eee;">
                                <div id="dashboard-team-photo-${person.id}" class="team-photo-frame" style="width: 180px; height: 180px; background: #fff; border-radius: 50%; margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 8px solid #f0f0f0; box-shadow: 0 10px 20px rgba(0,0,0,0.1); cursor: ${isEditable ? 'pointer' : 'default'}; position: relative;">
                                    ${savedPhoto
                                ? `<img src="${savedPhoto}" style="width: 100%; height: 100%; object-fit: cover; filter: contrast(1.1) brightness(1.1);">`
                                : `<div style="text-align: center; color: #ccc;">
                                            <i class="fas fa-${isEditable ? 'pencil-alt' : 'user'} fa-3x" style="margin-bottom: 0.5rem; display: block;"></i>
                                            ${isEditable ? '<div style="font-size: 0.8rem; color: var(--primary); font-weight: 600;">Update Photo</div>' : ''}
                                           </div>`
                            }
                                    ${isEditable ? `<input type="file" id="dashboardKianUpload" accept="image/*" style="display: none;">` : ''}
                                </div>
                                <h3 style="font-size: 1.8rem; margin-bottom: 0.5rem; color: var(--primary-dark); font-weight: 800;">${person.name}</h3>
                                <div style="display: inline-block; padding: 0.4rem 1.5rem; background: var(--primary-light); color: white; border-radius: 100px; font-size: 1rem; font-weight: 600; letter-spacing: 1px;">INNOVATOR</div>
                            </div>
                            `;
                    }).join('')}
                    </div>
                `;

                aboutContainer.appendChild(projectInfo);
                aboutContainer.appendChild(teamSection);
                mainContent.appendChild(aboutContainer);

                // Team Photo Logic (Kian only)
                const kianFrame = aboutContainer.querySelector('#dashboard-team-photo-kian');
                const kianInput = aboutContainer.querySelector('#dashboardKianUpload');
                if (kianFrame && kianInput) {
                    kianFrame.onclick = () => kianInput.click();
                    kianInput.onchange = (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                const dataUrl = event.target.result;
                                localStorage.setItem('smart_label_team_kian', dataUrl);
                                kianFrame.innerHTML = `<img src="${dataUrl}" style="width: 100%; height: 100%; object-fit: cover; filter: contrast(1.1) brightness(1.1);">`;
                            };
                            reader.readAsDataURL(file);
                        }
                    };
                }
            } else if (currentView === 'feedback') {
                // --- Feedback View ---
                const feedbackContainer = document.createElement('div');
                feedbackContainer.className = 'animate-fade-in';
                feedbackContainer.style.maxWidth = '800px';
                feedbackContainer.style.margin = '2rem auto';

                feedbackContainer.innerHTML = `
                    <div class="glass-panel" style="padding: 3rem; border-radius: 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); text-align: center;">
                        <h2 style="color: var(--primary-dark); margin-bottom: 1.5rem;"><i class="fas fa-comment-alt"></i> Share Your Feedback</h2>
                        <p style="color: #666; margin-bottom: 2rem;">We value your input! Tell us what you think about the Smart Label Inventory website.</p>
                        
                        <div class="search-box" style="margin-bottom: 2rem;">
                            <i class="fas fa-pen" style="color: #2196F3;"></i>
                            <input type="text" id="feedbackInput" placeholder="Type your feedback here..." style="border: 2px solid #2196F3; box-shadow: 0 10px 20px rgba(33, 150, 243, 0.1);">
                        </div>
                        
                        <button id="sendFeedbackBtn" class="btn btn-primary" style="padding: 1rem 3rem; border-radius: 50px; font-size: 1.1rem; width: 100%; max-width: 300px;">
                            <i class="fas fa-paper-plane"></i> send
                        </button>
                        
                        <div style="margin-top: 2rem;">
                            <button id="cancelFeedbackBtn" class="btn btn-secondary" style="border: none; background: transparent; color: #666; font-weight: 600;">Maybe Later</button>
                        </div>
                    </div>
                `;

                const sendBtn = feedbackContainer.querySelector('#sendFeedbackBtn');
                const feedbackInput = feedbackContainer.querySelector('#feedbackInput');
                const cancelBtn = feedbackContainer.querySelector('#cancelFeedbackBtn');

                sendBtn.onclick = () => {
                    const message = feedbackInput.value.trim();
                    if (!message) {
                        alert("Please type something before sending.");
                        return;
                    }
                    const subject = encodeURIComponent("Website Feedback - Smart Label Inventory");
                    const body = encodeURIComponent(message);
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=k7029656@gmail.com&su=${subject}&body=${body}`;
                    window.open(gmailUrl, '_blank');
                };

                cancelBtn.onclick = () => {
                    currentView = 'inventory';
                    render();
                };

                mainContent.appendChild(feedbackContainer);
            }
        };

        header.querySelector('#dashboardDescBtn').onclick = () => onNavigate('description');
        header.querySelector('#aboutUsBtn').onclick = () => {
            currentView = (currentView === 'inventory') ? 'about' : 'inventory';
            render();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        if (userRole === 'admin') {
            const addBtn = header.querySelector('#addBtn');
            if (addBtn) addBtn.onclick = () => onNavigate('add');
        }

        container.appendChild(header);
        container.appendChild(mainContent);
        render();

        return container;
    },


    SiteDescription: (onBack) => {
        const container = document.createElement('div');
        container.className = 'container animate-fade-in';
        container.style.padding = '4rem 2rem';
        container.style.maxWidth = '800px';
        container.style.marginTop = '4rem';

        container.innerHTML = `
            <div style="display: flex; justify-content: flex-end; padding: 1rem;">
                <button id="feedbackBtnTop" class="btn btn-secondary" style="background: #2196F3; color: white; border: none;"><i class="fas fa-comment"></i> Give Feedback</button>
            </div>
            <div class="glass-panel" style="padding: 4rem; text-align: center; border-radius: 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.1);">
                <div style="width: 100px; height: 100px; background: var(--primary-dark); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; font-size: 3rem;">
                    <i class="fas fa-landmark"></i>
                </div>
                <h1 style="font-size: 2.5rem; color: var(--primary-dark); margin-bottom: 2rem;">Project Dashboard</h1>
                <p style="font-size: 1.4rem; color: #444; line-height: 1.8; margin-bottom: 3rem; text-align: left;">
                    This is an inventory web app where we have put artifacts and their history into this web app, and we wish to store all the artifacts that have been found, and we can add new artifacts as well, so that is what we wish to accomplish in this web app. We also want to help you save artifacts that you think are cool and you want to learn more about them.
                </p>
                <button id="backBtn" class="btn btn-primary" style="padding: 1rem 3rem; border-radius: 50px;">
                    <i class="fas fa-arrow-left"></i> Back to Inventory
                </button>
            </div>
        `;

        container.querySelector('#feedbackBtnTop').onclick = () => {
            // Pass a special flag or handle via global state/routing
            localStorage.setItem('smart_label_open_feedback', 'true');
            onBack(); // Go back to inventory
        };


        container.querySelector('#backBtn').onclick = onBack;
        return container;
    },

    ArtifactForm: (onSubmit, onCancel) => {
        const container = document.createElement('div');
        container.className = 'container animate-fade-in';
        container.style.maxWidth = '600px';
        container.style.marginTop = '2rem';

        let photoDataUrl = '';

        container.innerHTML = `
            <div class="glass-panel">
                <h2 style="margin-bottom: 1.5rem;">Add New Artifact</h2>
                <form id="artifactForm">
                    <div class="input-group">
                        <label>Artifact Name</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="input-group">
                        <label>Description</label>
                        <textarea name="description" rows="3" required></textarea>
                    </div>
                    <div class="input-group">
                        <label>Location Name (City/Site)</label>
                        <input type="text" name="locationName" required>
                    </div>
                    <div class="input-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div>
                            <label>Latitude</label>
                            <input type="number" step="any" name="lat" placeholder="e.g. 30.0444" required>
                        </div>
                        <div>
                            <label>Longitude</label>
                            <input type="number" step="any" name="lng" placeholder="e.g. 31.2357" required>
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Artifact Photo</label>
                        <div style="display: flex; flex-direction: column; gap: 1rem;">
                            <input type="file" id="photoFile" accept="image/*" style="padding: 0.5rem; border: 1px dashed #ccc; border-radius: 4px; background: white;">
                            <div id="photoPreview" style="width: 100%; height: 200px; border: 1px solid #eee; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #f9f9f9; overflow: hidden;">
                                <span style="color: #999;">No image selected</span>
                            </div>
                        </div>
                    </div>
                    <div class="input-group">
                        <label>Tracker ID</label>
                        <input type="text" name="trackerId" value="TRK-${Math.floor(Math.random() * 10000)}" readonly>
                    </div>
                    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <button type="button" id="cancelBtn" class="btn btn-secondary" style="flex: 1">Cancel</button>
                        <button type="submit" class="btn btn-primary" style="flex: 1">Save Artifact</button>
                    </div>
                </form>
            </div>
        `;

        const fileInput = container.querySelector('#photoFile');
        const preview = container.querySelector('#photoPreview');

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    photoDataUrl = event.target.result;
                    preview.innerHTML = `<img src="${photoDataUrl}" style="width: 100%; height: 100%; object-fit: cover;">`;
                };
                reader.readAsDataURL(file);
            }
        };

        container.querySelector('#cancelBtn').onclick = onCancel;
        container.querySelector('#artifactForm').onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                description: formData.get('description'),
                locationName: formData.get('locationName'),
                lat: parseFloat(formData.get('lat')),
                lng: parseFloat(formData.get('lng')),
                photos: [photoDataUrl || 'https://via.placeholder.com/300'],
                trackerId: formData.get('trackerId'),
                battery: Math.floor(Math.random() * 100), // Random battery for simulation
                createdAt: new Date().toISOString()
            };
            onSubmit(data);
        };

        return container;
    },

    ArtifactDetail: (artifact, onBack, auditLog) => {
        const container = document.createElement('div');
        container.className = 'container animate-fade-in';
        container.style.marginTop = '2rem';

        container.innerHTML = `
            <button id="backBtn" class="btn btn-secondary" style="margin-bottom: 1rem;"><i class="fas fa-arrow-left"></i> Back</button>
            <div class="glass-panel" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div>
                    <div style="height: 400px; background: #eee; border-radius: 8px; margin-bottom: 1rem; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                        <img src="${artifact.photos[0]}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div style="width: 100%; height: 100%; display: none; align-items: center; justify-content: center; background: #f0f0f0; color: #ccc;">
                            <i class="fas fa-archive fa-6x"></i>
                        </div>
                    </div>
                    <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center;">
                        <div id="qrcode" style="display: flex; justify-content: center;"></div>
                        <p style="margin-top: 0.5rem; font-size: 0.8rem; color: #666;">Scan to view details</p>
                    </div>
                </div>
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <h1>${artifact.name}</h1>
                        <div style="text-align: right;">
                             <span style="font-size: 0.9rem; color: #666;">Tracker: ${artifact.trackerId}</span>
                             <div style="color: ${artifact.battery < 20 ? 'var(--accent)' : 'green'}; font-weight: bold;">
                                <i class="fas fa-battery-three-quarters"></i> ${artifact.battery}%
                             </div>
                        </div>
                    </div>
                    
                    <div style="margin: 1.5rem 0; padding: 2rem; background: #f5f5f7; border: 1px solid #e0e0e0; border-left: 6px solid #8d6e63; border-radius: 12px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
                        <h3 style="margin-bottom: 0.8rem; color: #5d4037; font-weight: 700; letter-spacing: 0.5px; border-bottom: 1px solid #d7ccc8; padding-bottom: 0.5rem; display: inline-block;">
                            <i class="fas fa-scroll"></i> HISTORICAL SUMMARY
                        </h3>
                        <p style="font-size: 1.15rem; color: #37474f; line-height: 1.8; font-family: 'Avenir', sans-serif; font-style: normal; margin-top: 0.5rem;">
                            ${artifact.description}
                        </p>
                        ${artifact.infoUrl ? `
                            <div style="margin-top: 1.5rem; border-top: 1px dashed #bdbdbd; padding-top: 1rem;">
                                <a href="${artifact.infoUrl}" target="_blank" class="btn btn-secondary" style="font-size: 0.85rem; background: #78909c; border: none;">
                                    <i class="fas fa-university"></i> ARCHIVAL RECORD
                                </a>
                            </div>
                        ` : ''}
                    </div>
                    
                    <h3><i class="fas fa-map-marker-alt"></i> Location Control</h3>
                    <p style="color: #666;">${artifact.locationName} (${artifact.lat}, ${artifact.lng})</p>
                    <div id="map" style="height: 300px; border-radius: 8px; margin-top: 0.5rem;"></div>

                    <div style="margin-top: 2rem;">
                        <h3><i class="fas fa-fingerprint"></i> Audit History</h3>
                        <div style="max-height: 200px; overflow-y: auto; background: rgba(255,255,255,0.5); padding: 1rem; border-radius: 8px; margin-top: 0.5rem;">
                            ${auditLog.map(log => `
                                <div style="font-size: 0.85rem; border-bottom: 1px solid #ddd; padding: 0.5rem 0;">
                                    <strong>${new Date(log.timestamp).toLocaleString()}</strong>: ${log.action} by ${log.user}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.querySelector('#backBtn').onclick = onBack;

        // Post-render actions (Map & QR) need to happen after element is in DOM, 
        // but since we are returning the element, the caller needs to append it first.
        // We can attach a method to the element or return a callback.
        // Simplified: The caller will handle mounting, we can use a setTimeout 0 or MutationObserver, 
        // but easier just to expose a 'mount' function.

        container.mount = () => {
            // QR Code with embedded data
            // Use external infoUrl if available, otherwise fallback to data URI
            let qrContent;

            if (artifact.infoUrl) {
                qrContent = artifact.infoUrl;
            } else {
                // Creating a simple HTML page as a data URI
                const infoHtml = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <title>${artifact.name} Info</title>
                        <style>
                            body { font-family: sans-serif; padding: 20px; text-align: center; color: #333; }
                            h1 { color: #51A1AC; }
                            .id-tag { background: #eee; padding: 5px 10px; border-radius: 4px; font-size: 0.9em; }
                            .desc { margin: 20px 0; line-height: 1.6; }
                        </style>
                    </head>
                    <body>
                        <h1>${artifact.name}</h1>
                        <span class="id-tag">${artifact.id}</span>
                        <p class="desc">${artifact.description}</p>
                        <p><strong>Location:</strong> ${artifact.locationName} (${artifact.lat}, ${artifact.lng})</p>
                        <p><strong>Tracker ID:</strong> ${artifact.trackerId}</p>
                        <p style="color: ${artifact.battery < 20 ? 'red' : 'green'}"><strong>Battery Health:</strong> ${artifact.battery}%</p>
                    </body>
                    </html>
                `;
                qrContent = 'data:text/html;charset=utf-8,' + encodeURIComponent(infoHtml);
            }

            new QRCode(container.querySelector("#qrcode"), {
                text: qrContent,
                width: 128,
                height: 128
            });

            // Make QR clickable to open the info page
            const qrContainer = container.querySelector("#qrcode");
            qrContainer.style.cursor = 'pointer';
            qrContainer.title = 'Click to view public info page';
            qrContainer.onclick = () => {
                // Open content in new tab
                if (artifact.infoUrl) {
                    window.open(artifact.infoUrl, '_blank');
                } else {
                    const win = window.open();
                    win.document.write(decodeURIComponent(qrContent.split(',')[1]));
                    win.document.close();
                }
            };

            // Map
            const map = L.map(container.querySelector('#map')).setView([artifact.lat, artifact.lng], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            L.marker([artifact.lat, artifact.lng]).addTo(map)
                .bindPopup(artifact.name)
                .openPopup();
        };

        return container;
    }
};
