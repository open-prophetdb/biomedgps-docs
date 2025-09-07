// Navigation functionality for BioMedGPS components
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initializeAnimations();
    
    // Add click handlers for component cards
    initializeComponentNavigation();
    
    // Add scroll effects
    initializeScrollEffects();
    
    // Add smooth scrolling for navigation
    initializeSmoothScrolling();
});

// Component navigation mapping
const componentRoutes = {
    'network-medicine-extension': './network-medicine-extension/',
    'biomedgps-data': './biomedgps-data/',
    'biomedgps-models': './biomedgps-models/',
    'biomedgps-explainer': './biomedgps-explainer/',
    'biomedgps': './biomedgps/'
};

// Navigate to component documentation
function navigateToComponent(componentName) {
    const route = componentRoutes[componentName];
    if (route) {
        // Add loading animation
        showLoadingState(componentName);
        
        // Navigate after short delay for UX
        setTimeout(() => {
            window.location.href = route;
        }, 300);
    } else {
        console.warn(`No route found for component: ${componentName}`);
        // Fallback: show coming soon message
        showComingSoonMessage(componentName);
    }
}

// Initialize component card navigation
function initializeComponentNavigation() {
    const componentCards = document.querySelectorAll('.component-card, .platform-card');
    
    componentCards.forEach(card => {
        const componentName = card.getAttribute('data-component');
        
        if (componentName) {
            card.addEventListener('click', function() {
                navigateToComponent(componentName);
            });
            
            // Add hover effects
            card.addEventListener('mouseenter', function() {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                card.style.transform = 'translateY(-4px)';
                card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
            });
        }
    });
}

// Show loading state
function showLoadingState(componentName) {
    const card = document.querySelector(`[data-component="${componentName}"]`);
    if (card) {
        const originalContent = card.innerHTML;
        card.style.opacity = '0.7';
        card.style.transform = 'scale(0.98)';
        
        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-overlay';
        loadingDiv.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading ${componentName}...</p>
            </div>
        `;
        card.appendChild(loadingDiv);
    }
}

// Show coming soon message for unavailable components
function showComingSoonMessage(componentName) {
    const modal = createModal(
        'Coming Soon',
        `The ${componentName} documentation is being prepared and will be available soon.`,
        'info'
    );
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.remove();
    }, 3000);
}

// Create modal for messages
function createModal(title, message, type = 'info') {
    const modal = document.createElement('div');
    modal.className = `modal modal-${type}`;
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
        </div>
        <div class="modal-backdrop"></div>
    `;
    
    // Add click handler for close
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.modal-backdrop').addEventListener('click', () => {
        modal.remove();
    });
    
    return modal;
}

// Initialize animations
function initializeAnimations() {
    // Add fade-in classes to elements as they become visible
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.component-card, .platform-card, .feature, .stat'
    );
    
    animatedElements.forEach((el, index) => {
        el.classList.add(`fade-in-delay-${(index % 3) + 1}`);
        observer.observe(el);
    });
}

// Initialize scroll effects
function initializeScrollEffects() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Move background particles
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.1;
            particle.style.transform = `translateY(${rate * speed}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Header background opacity on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const opacity = Math.min(scrolled / 100, 1);
        header.style.background = `rgba(255, 255, 255, ${0.95 + (opacity * 0.05)})`;
    });
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add CSS for loading and modal styles
const additionalStyles = `
<style>
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    z-index: 10;
}

.loading-spinner {
    text-align: center;
    color: var(--primary-color);
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(99, 102, 241, 0.3);
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    margin: 0 auto 1rem auto;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    animation: modalFadeIn 0.3s ease-out forwards;
}

.modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
}

.modal-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-width: 400px;
    width: 90%;
    position: relative;
    z-index: 1;
    overflow: hidden;
    transform: scale(0.9);
    animation: modalScaleIn 0.3s ease-out forwards;
}

.modal-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.modal-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.25rem;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-light);
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: var(--transition);
}

.modal-close:hover {
    background: var(--background-secondary);
    color: var(--text-primary);
}

.modal-body {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
}

.modal-body p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.6;
}

@keyframes modalFadeIn {
    to {
        opacity: 1;
    }
}

@keyframes modalScaleIn {
    to {
        transform: scale(1);
    }
}

/* Enhanced hover effects */
.component-card:hover .card-icon {
    transform: scale(1.1) rotate(5deg);
    transition: var(--transition);
}

.platform-card:hover .platform-icon {
    transform: scale(1.1);
    transition: var(--transition);
}

/* Improved button hover effects */
.btn-primary {
    position: relative;
    overflow: hidden;
}

.btn-primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: var(--transition);
}

.btn-primary:hover::before {
    left: 100%;
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Export functions for global access
window.navigateToComponent = navigateToComponent;