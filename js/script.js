// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger
            const hamburger = mobileToggle.querySelector('.hamburger');
            hamburger.style.transform = navMenu.classList.contains('active') 
                ? 'rotate(45deg)' 
                : 'rotate(0deg)';
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const hamburger = mobileToggle.querySelector('.hamburger');
            hamburger.style.transform = 'rotate(0deg)';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || mobileToggle.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const hamburger = mobileToggle.querySelector('.hamburger');
            hamburger.style.transform = 'rotate(0deg)';
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 100; // Account for fixed header
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
function updateActiveNavLink() {
    // Skip automatic active link updates on non-index pages
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Only run automatic section detection on index.html
    if (currentPage === 'index.html' || currentPage === '') {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200 && scrollY < sectionTop + sectionHeight - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}` || 
                (current === '' && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    // For other pages, maintain the active state set in HTML
}

// Update active nav link on scroll
window.addEventListener('scroll', updateActiveNavLink);

// Enhanced Animation on scroll for projects page
function animateOnScroll() {
    const elements = document.querySelectorAll('.skill-card, .stat, .profile-card, .project-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in-up');
        }
    });
}

// Projects page specific animations
function initProjectAnimations() {
    const projectItems = document.querySelectorAll('.project-item');
    
    // Staggered animation for project items
    projectItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Tech icon hover effects with tooltips
    const techIcons = document.querySelectorAll('.tech-icon');
    techIcons.forEach(icon => {
        // Enhanced hover effect
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.3) translateY(-5px)';
            this.style.filter = 'brightness(1.3) drop-shadow(0 5px 15px rgba(16, 185, 129, 0.4))';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
            this.style.filter = 'brightness(1) drop-shadow(none)';
        });
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tech-tooltip';
        tooltip.textContent = icon.getAttribute('title');
        tooltip.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-bg-secondary);
            color: var(--color-text);
            padding: 0.5rem 0.75rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 500;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
            border: 1px solid var(--color-border);
            box-shadow: var(--shadow-md);
            z-index: 1000;
        `;
        
        // Position tooltip container
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.display = 'inline-block';
        
        icon.parentNode.insertBefore(container, icon);
        container.appendChild(icon);
        container.appendChild(tooltip);
        
        icon.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });
        
        icon.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
    
    // Project card tilt effect
    projectItems.forEach(item => {
        item.addEventListener('mousemove', function(e) {
            if (window.innerWidth > 768) { // Only on desktop
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
            }
        });
    });
}

// Intersection Observer for better performance
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    document.querySelectorAll('.project-item, .skill-card, .stat').forEach(el => {
        observer.observe(el);
    });
}

// Throttle function for scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply scroll animations with throttling
const throttledAnimateOnScroll = throttle(animateOnScroll, 100);
window.addEventListener('scroll', throttledAnimateOnScroll);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', function() {
    animateOnScroll();
    initProjectAnimations();
    initIntersectionObserver();
});

// Form handling (if forms are added later)
function handleFormSubmission() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateContactForm(data)) {
                // Show loading state
                const submitBtn = form.querySelector('.form-submit');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual submission logic)
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    showNotification('Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.', 'success');
                    
                    // Reset form after success
                    setTimeout(() => {
                        form.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        clearFormErrors();
                    }, 3000);
                }, 2000);
                
                console.log('Form submitted:', data);
            }
        });
    });
}

// Contact form validation
function validateContactForm(data) {
    clearFormErrors();
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        showFieldError('nameError', 'Please enter your full name (at least 2 characters)');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showFieldError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Subject validation
    if (!data.subject) {
        showFieldError('subjectError', 'Please select a subject');
        isValid = false;
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        showFieldError('messageError', 'Please provide a detailed message (at least 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : 'i'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-primary)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Skill bars animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        if (targetWidth) {
            bar.style.setProperty('--target-width', targetWidth + '%');
            
            // Trigger animation when element comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.width = targetWidth + '%';
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.5
            });
            
            observer.observe(bar);
        }
    });
}

// Initialize skill bars animation
document.addEventListener('DOMContentLoaded', animateSkillBars);

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-nav-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (mobileToggle) {
                const hamburger = mobileToggle.querySelector('.hamburger');
                hamburger.style.transform = 'rotate(0deg)';
            }
        }
    }
});

// Performance optimization and accessibility
document.addEventListener('DOMContentLoaded', function() {
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition', 'none');
        document.documentElement.style.setProperty('--transition-slow', 'none');
    }
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                const tempImg = new Image();
                tempImg.onload = function() {
                    img.style.opacity = '1';
                };
                tempImg.src = img.src;
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Initialize all components
    handleFormSubmission();
});