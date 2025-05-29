document.addEventListener('DOMContentLoaded', function() {
    // Language Switcher
    class LanguageSwitcher {
        constructor() {
            // Initialize properties
            this.currentLang = localStorage.getItem('language') || 'en';
            this.toggleBtn = document.querySelector('.language-toggle');
            
            // Set initial language
            this.applyLanguage(this.currentLang, false);
            
            // Bind event listener
            if (this.toggleBtn) {
                this.toggleBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleLanguage();
                });
            }
        }

        applyLanguage(lang, animate = true) {
            // Update HTML attributes
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = lang;
            
            // Update body classes with animation
            if (animate) {
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s ease';
            }
            
            document.body.classList.remove('rtl', 'ltr');
            document.body.classList.add(lang === 'ar' ? 'rtl' : 'ltr');
            
            // Update all translatable elements
            this.updateTranslations(lang);
            
            // Update toggle button
            if (this.toggleBtn) {
                this.toggleBtn.textContent = lang === 'en' ? 'عربي' : 'English';
            }
            
            // Save preference
            localStorage.setItem('language', lang);
            
            // Fade back in if animated
            if (animate) {
                setTimeout(() => {
                    document.body.style.opacity = '1';
                }, 50);
            }
        }

        updateTranslations(lang) {
            // Update regular elements
            document.querySelectorAll('[data-translate]').forEach(element => {
                const key = element.dataset.translate;
                
                // Handle dot notation for accessing nested properties and array indices
                if (key.includes('.')) {
                    const [baseKey, index] = key.split('.');
                    if (translations[lang]?.[baseKey]?.[index]) {
                        if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea') {
                            element.placeholder = translations[lang][baseKey][index];
                        } else {
                            element.textContent = translations[lang][baseKey][index];
                        }
                    }
                } else if (translations[lang]?.[key]) {
                    if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea') {
                        element.placeholder = translations[lang][key];
                    } else {
                        element.textContent = translations[lang][key];
                    }
                }
            });

            // Update document title
            document.title = lang === 'en' 
                ? "Mohamed Issa - Karate Champion & Physical Education Professional"
                : "محمد عيسى - بطل كاراتيه ومتخصص في التربية البدنية";
                
            // Update carousel and UI directions
            this.updateDirectionalElements(lang);
        }

        updateDirectionalElements(lang) {
            // Update all carousel arrows (including testimonials)
            const allPrevBtns = document.querySelectorAll('.carousel-prev i, .testimonial-prev i');
            const allNextBtns = document.querySelectorAll('.carousel-next i, .testimonial-next i');
            
            if (allPrevBtns.length > 0 && allNextBtns.length > 0) {
                if (lang === 'ar') {
                    allPrevBtns.forEach(btn => {
                        btn.classList.remove('fa-chevron-left');
                        btn.classList.add('fa-chevron-right');
                    });
                    allNextBtns.forEach(btn => {
                        btn.classList.remove('fa-chevron-right');
                        btn.classList.add('fa-chevron-left');
                    });
                } else {
                    allPrevBtns.forEach(btn => {
                        btn.classList.remove('fa-chevron-right');
                        btn.classList.add('fa-chevron-left');
                    });
                    allNextBtns.forEach(btn => {
                        btn.classList.remove('fa-chevron-left');
                        btn.classList.add('fa-chevron-right');
                    });
                }
            }
        }

        toggleLanguage() {
            this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
            this.applyLanguage(this.currentLang, true);
        }
    }

    // Initialize language switcher
    const langSwitcher = new LanguageSwitcher();

    // Back to top button functionality
    const backToTopButton = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

  
    // Certificate category filtering
    const categoryBtns = document.querySelectorAll('.cert-category-btn');
    const certItems = document.querySelectorAll('.cert-item');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Show/hide certificate items based on category
            certItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Certificate modal
    const modal = document.getElementById('certModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalClose = document.querySelector('.modal-close');
    
    certItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').getAttribute('src');
            const title = this.querySelector('.cert-info h4').textContent;
            const description = this.querySelector('.cert-info p').textContent;
            
            modalImage.setAttribute('src', imgSrc);
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            
            modal.style.display = 'flex';
        });
    });
    
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Testimonial slider
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonialItems.forEach(item => item.classList.remove('active'));
        testimonialDots.forEach(dot => dot.classList.remove('active'));
        
        testimonialItems[index].classList.add('active');
        testimonialDots[index].classList.add('active');
        currentTestimonial = index;
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentTestimonial = (currentTestimonial - 1 + testimonialItems.length) % testimonialItems.length;
            showTestimonial(currentTestimonial);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
            showTestimonial(currentTestimonial);
        });
    }
    
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showTestimonial(index);
        });
    });
    
    // Auto-rotate testimonials
    setInterval(function() {
        if (document.hasFocus()) {
            currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
            showTestimonial(currentTestimonial);
        }
    }, 8000);
    
    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Form validation
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (name && email && subject && message) {
                // In a real application, you would send the form data to a server
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        }
    });

    // Language switching is now handled by the LanguageSwitcher class

    // No need for duplicate language initialization code - we already have updateTranslations function above

    // Show More Certificates functionality
    // Removed as there are no hidden certificates anymore
    // const viewMoreBtn = document.querySelector('.view-more-btn');
    // if (viewMoreBtn) {
    //     viewMoreBtn.addEventListener('click', function() {
    //         document.querySelectorAll('.cert-item.hidden').forEach(item => {
    //             item.classList.remove('hidden');
    //             item.style.display = 'block';
    //         });
    //         viewMoreBtn.style.display = 'none';
    //     });
    // }

    // Make gallery images clickable and open in modal
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            modalImage.setAttribute('src', img.getAttribute('src'));
            modalTitle.textContent = img.getAttribute('alt');
            modalDescription.textContent = '';
            modal.style.display = 'flex';
        });
    });
    
    // Gallery Carousel functionality
    const carouselItems = document.querySelectorAll('.carousel-item');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const carouselPrev = document.querySelector('.carousel-prev');
    const carouselNext = document.querySelector('.carousel-next');
    let currentSlide = 0;
    
    function showSlide(index) {
        carouselItems.forEach(item => item.classList.remove('active'));
        carouselDots.forEach(dot => dot.classList.remove('active'));
        
        carouselItems[index].classList.add('active');
        carouselDots[index].classList.add('active');
        currentSlide = index;
    }
    
    if (carouselPrev) {
        carouselPrev.addEventListener('click', function() {
            currentSlide = (currentSlide - 1 + carouselItems.length) % carouselItems.length;
            showSlide(currentSlide);
        });
    }
    
    if (carouselNext) {
        carouselNext.addEventListener('click', function() {
            currentSlide = (currentSlide + 1) % carouselItems.length;
            showSlide(currentSlide);
        });
    }
    
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
        });
    });
    
    // Auto-rotate carousel
    setInterval(function() {
        if (document.hasFocus() && document.querySelector('.bg-images-carousel:hover') === null) {
            currentSlide = (currentSlide + 1) % carouselItems.length;
            showSlide(currentSlide);
        }
    }, 5000);

    // Responsive navigation
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
});
