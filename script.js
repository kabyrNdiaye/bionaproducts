document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons safely
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Sticky Header Logic
    const header = document.getElementById('main-header');

    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();


    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuIcon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');

        // Change icon based on state
        if (isActive) {
            menuIcon.setAttribute('data-lucide', 'x');
        } else {
            menuIcon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });

    // Search Overlay Toggle
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.querySelector('.search-close');

    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            setTimeout(() => {
                searchOverlay.querySelector('input').focus();
            }, 100);
        });

        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchOverlay.classList.remove('active');
            }
        });
    }

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('#nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuIcon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;

            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load

    // Smooth Scroll for anchor links (safari support & refinement)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Boutique Functionality ---
    // --- Boutique Functionality with Pagination ---
    const productGrid = document.getElementById('product-grid');
    const sortSelect = document.querySelector('.sort-select');
    const resultsCount = document.querySelector('.results-count');
    const viewButtons = document.querySelectorAll('.view-btn');

    if (productGrid && sortSelect) {
        // Core State
        const allProducts = Array.from(productGrid.querySelectorAll('.product-card'));
        let currentProducts = [...allProducts]; // Currently filtered/sorted list
        let currentPage = 1;
        const itemsPerPage = 10;

        // Container for pagination
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container';
        productGrid.parentNode.appendChild(paginationContainer);

        const renderProducts = () => {
            // 1. Calculate splice
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const visibleProducts = currentProducts.slice(start, end);

            // 2. Clear and Fill Grid
            productGrid.innerHTML = '';
            visibleProducts.forEach((p, index) => {
                p.style.display = 'block'; // Ensure visible
                p.style.transitionDelay = `${(index % 3) * 0.1}s`;
                productGrid.appendChild(p);
            });

            // 3. Update Counts
            resultsCount.textContent = `Affichage de ${visibleProducts.length} sur ${currentProducts.length} résultat(s)`;

            // 4. Render Pagination Controls
            renderPagination();

            // 5. Re-trigger animations
            if (typeof revealOnScroll === 'function') {
                setTimeout(revealOnScroll, 50);
            }
        };

        const renderPagination = () => {
            paginationContainer.innerHTML = '';
            const totalPages = Math.ceil(currentProducts.length / itemsPerPage);

            if (totalPages <= 1) return;

            // Prev Button
            const prevBtn = document.createElement('button');
            prevBtn.className = 'pagination-btn';
            prevBtn.innerHTML = '<i data-lucide="chevron-left"></i>';
            prevBtn.disabled = currentPage === 1;
            prevBtn.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderProducts();
                    window.scrollTo({ top: productGrid.offsetTop - 100, behavior: 'smooth' });
                }
            };
            paginationContainer.appendChild(prevBtn);

            // Page Numbers
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
                btn.textContent = i;
                btn.onclick = () => {
                    currentPage = i;
                    renderProducts();
                    window.scrollTo({ top: productGrid.offsetTop - 100, behavior: 'smooth' });
                };
                paginationContainer.appendChild(btn);
            }

            // Next Button
            const nextBtn = document.createElement('button');
            nextBtn.className = 'pagination-btn';
            nextBtn.innerHTML = '<i data-lucide="chevron-right"></i>';
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderProducts();
                    window.scrollTo({ top: productGrid.offsetTop - 100, behavior: 'smooth' });
                }
            };
            paginationContainer.appendChild(nextBtn);

            lucide.createIcons();
        };

        // Sorting Logic
        const applySort = (criteria) => {
            switch (criteria) {
                case 'price-asc':
                    currentProducts.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
                    break;
                case 'price-desc':
                    currentProducts.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
                    break;
                case 'popularity':
                    currentProducts.sort((a, b) => parseInt(b.dataset.popularity) - parseInt(a.dataset.popularity));
                    break;
                case 'newness':
                    currentProducts.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
                    break;
                default:
                    // Only if needed, we could reset to original order, 
                    // but usually sorting by default (index) is tricky once mixed.
                    // Let's just re-sort by popularity as default fallback if complex.
                    break;
            }
            currentPage = 1;
            renderProducts();
        };

        sortSelect.addEventListener('change', (e) => applySort(e.target.value));

        // Filtering Logic
        const categoryLinksTabs = document.querySelectorAll('.category-list-tabs a');
        categoryLinksTabs.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = link.dataset.filter;

                // Toggle active class
                categoryLinksTabs.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Filter the list
                if (filter === 'tous') {
                    currentProducts = [...allProducts];
                } else {
                    currentProducts = allProducts.filter(product =>
                        product.dataset.category.toLowerCase().trim() === filter
                    );
                }

                // Apply current sort again to keep consistency? 
                // For now just reset pagination.
                // Ideally we should maintain sort, but let's trust the current order is preserved or simple enough.
                const currentSort = sortSelect.value;
                if (currentSort !== 'default') applySort(currentSort); // Re-sort filtered list

                currentPage = 1;
                renderProducts();
            });
        });

        // View Toggle
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                if (btn.querySelector('[data-lucide="list"]')) {
                    productGrid.classList.remove('grid-3-cols');
                    productGrid.classList.add('list-view');
                } else {
                    productGrid.classList.add('grid-3-cols');
                    productGrid.classList.remove('list-view');
                }
            });
        });

        // Initial Render
        renderProducts();
    }

    // --- PRODUCT MODAL LOGIC ---
    const productModal = document.getElementById('product-modal');
    const modalClose = document.querySelector('.modal-close');
    const productCards = document.querySelectorAll('.product-card');

    if (productModal && productCards.length > 0) {
        productCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                const img = card.querySelector('img').src;
                const title = card.querySelector('h3').innerText;
                const desc = card.querySelector('p').innerText;
                const price = card.querySelector('.price').innerText;
                const tag = card.querySelector('.product-tag').innerText;

                document.getElementById('modal-img').src = img;
                document.getElementById('modal-title').innerText = title;
                document.getElementById('modal-desc').innerText = desc;
                document.getElementById('modal-price').innerText = price;
                document.getElementById('modal-tag').innerText = tag;

                // WhatsApp Link
                const phoneNumber = "221771693011";
                const cleanTitle = title.trim();
                const cleanPrice = price.trim();

                const waBtn = document.getElementById('modal-whatsapp');
                // Remove any previous onclick handlers to ensure the href works natively
                waBtn.onclick = null;

                const message = encodeURIComponent(`Bonjour, je souhaite commander le produit : ${cleanTitle} (${cleanPrice})`);
                // Standard link is most reliable. Using wa.me for broad compatibility.
                waBtn.href = `https://wa.me/${phoneNumber}?text=${message}`;

                productModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                productModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                productModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- WOW FACTOR: HERO PARALLAX ---
    const leftPanel = document.querySelector('.panel-left');
    const rightPanel = document.querySelector('.panel-right');

    if (leftPanel && rightPanel) {
        window.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 30;
            const y = (window.innerHeight / 2 - e.pageY) / 30;

            leftPanel.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
            rightPanel.style.transform = `scale(1.1) translate(${-x}px, ${-y}px)`;
        });
    }

    lucide.createIcons();
});
