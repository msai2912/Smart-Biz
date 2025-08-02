// JavaScript Generator for Website Functionality
// Generates interactive JavaScript files

/**
 * Generate main JavaScript file
 */
export const generateMainJS = (businessInfo) => {
  return `
// Main Website JavaScript
(function() {
  'use strict';
  
  // DOM Elements
  const navbar = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Navbar scroll effect
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  
  // Mobile menu toggle
  function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }
  
  // Close mobile menu when clicking on a link
  function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.classList.remove('menu-open');
  }
  
  // Smooth scrolling for navigation links
  function handleSmoothScroll(e) {
    const href = this.getAttribute('href');
    
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const headerHeight = navbar.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        closeMobileMenu();
      }
    }
  }
  
  // Intersection Observer for animations
  function createObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
      '.service-card, .offering-card, .testimonial-card, .differentiator-card, .stat-item'
    );
    
    animateElements.forEach(el => {
      observer.observe(el);
    });
  }
  
  // Contact form handling (if present)
  function handleContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
          showNotification('Please fill in all required fields.', 'error');
          return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          showNotification('Please enter a valid email address.', 'error');
          return;
        }
        
        // Show success message (in real implementation, send to server)
        showNotification('Thank you for your message! We\\'ll get back to you soon.', 'success');
        this.reset();
      });
    }
  }
  
  // Notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = \`notification notification-\${type}\`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px 20px',
      borderRadius: '5px',
      color: 'white',
      fontWeight: '500',
      zIndex: '10000',
      opacity: '0',
      transform: 'translateX(100%)',
      transition: 'all 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
      success: '#28a745',
      error: '#dc3545',
      info: '#17a2b8',
      warning: '#ffc107'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }
  
  // Click to call functionality
  function initClickToCall() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
      link.addEventListener('click', function() {
        // Track phone clicks (analytics)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'phone_call', {
            'event_category': 'engagement',
            'event_label': '${businessInfo.name || 'Business'}'
          });
        }
      });
    });
  }
  
  // Email link tracking
  function initEmailTracking() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
      link.addEventListener('click', function() {
        // Track email clicks (analytics)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'email_click', {
            'event_category': 'engagement',
            'event_label': '${businessInfo.name || 'Business'}'
          });
        }
      });
    });
  }
  
  // CTA button tracking
  function initCTATracking() {
    const ctaButtons = document.querySelectorAll('.btn-primary');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Track CTA clicks (analytics)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'cta_click', {
            'event_category': 'engagement',
            'event_label': this.textContent.trim()
          });
        }
      });
    });
  }
  
  // Lazy loading for images
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }
  
  // Performance optimization
  function optimizePerformance() {
    // Preload critical resources
    const criticalResources = [
      '/css/main.css',
      '/css/responsive.css'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = 'style';
      document.head.appendChild(link);
    });
  }
  
  // Initialize everything when DOM is ready
  function init() {
    // Event listeners
    window.addEventListener('scroll', handleNavbarScroll);
    navToggle.addEventListener('click', toggleMobileMenu);
    
    navLinks.forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });
    
    // Initialize features
    createObserver();
    handleContactForm();
    initClickToCall();
    initEmailTracking();
    initCTATracking();
    initLazyLoading();
    optimizePerformance();
    
    // Add animation classes
    const style = document.createElement('style');
    style.textContent = \`
      .service-card, .offering-card, .testimonial-card, .differentiator-card, .stat-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
      }
      
      .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      
      .menu-open {
        overflow: hidden;
      }
    \`;
    document.head.appendChild(style);
  }
  
  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
`;
};

/**
 * Generate chatbot JavaScript
 */
export const generateChatbotJS = (businessInfo) => {
  return `
// Chatbot Implementation
(function() {
  'use strict';
  
  const chatbotConfig = {
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    businessInfo: ${JSON.stringify(businessInfo, null, 2)},
    responses: {
      greeting: "Hello! I'm here to help you learn more about ${businessInfo.name}. How can I assist you today?",
      fallback: "I'm sorry, I didn't understand that. Could you please rephrase your question about our services?",
      closing: "Thank you for your interest in ${businessInfo.name}! Feel free to contact us directly for more information."
    }
  };
  
  // Create chatbot HTML
  function createChatbotHTML() {
    return \`
      <div id="chatbot-widget" class="chatbot-widget">
        <div id="chatbot-toggle" class="chatbot-toggle">
          <span class="chatbot-icon">💬</span>
        </div>
        
        <div id="chatbot-window" class="chatbot-window">
          <div class="chatbot-header">
            <h3>Chat with us</h3>
            <button id="chatbot-close" class="chatbot-close">&times;</button>
          </div>
          
          <div id="chatbot-messages" class="chatbot-messages">
            <div class="chatbot-message bot-message">
              <div class="message-avatar">🤖</div>
              <div class="message-content">
                <p>\${chatbotConfig.responses.greeting}</p>
              </div>
            </div>
          </div>
          
          <div class="chatbot-input">
            <input type="text" id="chatbot-input" placeholder="Type your message..." />
            <button id="chatbot-send">Send</button>
          </div>
        </div>
      </div>
    \`;
  }
  
  // Create chatbot styles
  function createChatbotStyles() {
    const style = document.createElement('style');
    style.textContent = \`
      .chatbot-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .chatbot-toggle {
        width: 60px;
        height: 60px;
        background: #007bff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,123,255,0.3);
        transition: all 0.3s ease;
      }
      
      .chatbot-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0,123,255,0.4);
      }
      
      .chatbot-icon {
        font-size: 24px;
        color: white;
      }
      
      .chatbot-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
      }
      
      .chatbot-header {
        background: #007bff;
        color: white;
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .chatbot-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      
      .chatbot-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .chatbot-messages {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      
      .chatbot-message {
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }
      
      .bot-message {
        align-self: flex-start;
      }
      
      .user-message {
        align-self: flex-end;
        flex-direction: row-reverse;
      }
      
      .message-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        flex-shrink: 0;
      }
      
      .bot-message .message-avatar {
        background: #f1f3f4;
      }
      
      .user-message .message-avatar {
        background: #007bff;
        color: white;
      }
      
      .message-content {
        background: #f1f3f4;
        padding: 10px 15px;
        border-radius: 18px;
        max-width: 80%;
        word-wrap: break-word;
      }
      
      .user-message .message-content {
        background: #007bff;
        color: white;
      }
      
      .message-content p {
        margin: 0;
        font-size: 14px;
        line-height: 1.4;
      }
      
      .chatbot-input {
        padding: 15px 20px;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 10px;
      }
      
      #chatbot-input {
        flex: 1;
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 20px;
        outline: none;
        font-size: 14px;
      }
      
      #chatbot-input:focus {
        border-color: #007bff;
      }
      
      #chatbot-send {
        background: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      }
      
      #chatbot-send:hover {
        background: #0056b3;
      }
      
      .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 10px 15px;
      }
      
      .typing-dot {
        width: 8px;
        height: 8px;
        background: #999;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out;
      }
      
      .typing-dot:nth-child(1) { animation-delay: -0.32s; }
      .typing-dot:nth-child(2) { animation-delay: -0.16s; }
      
      @keyframes typing {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
      
      @media (max-width: 480px) {
        .chatbot-window {
          width: calc(100vw - 40px);
          height: calc(100vh - 140px);
          bottom: 80px;
          right: 20px;
        }
      }
    \`;
    document.head.appendChild(style);
  }
  
  // Add message to chat
  function addMessage(content, isUser = false) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const message = document.createElement('div');
    message.className = \`chatbot-message \${isUser ? 'user-message' : 'bot-message'}\`;
    
    message.innerHTML = \`
      <div class="message-avatar">\${isUser ? '👤' : '🤖'}</div>
      <div class="message-content">
        <p>\${content}</p>
      </div>
    \`;
    
    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Show typing indicator
  function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot-message typing-message';
    typingDiv.innerHTML = \`
      <div class="message-avatar">🤖</div>
      <div class="message-content typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    \`;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return typingDiv;
  }
  
  // Process user message
  function processMessage(userMessage) {
    // Add user message
    addMessage(userMessage, true);
    
    // Show typing indicator
    const typingDiv = showTypingIndicator();
    
    // Simple response logic (replace with actual AI integration)
    setTimeout(() => {
      typingDiv.remove();
      
      const response = generateResponse(userMessage);
      addMessage(response);
    }, 1000 + Math.random() * 1000);
  }
  
  // Generate response based on message
  function generateResponse(message) {
    const msg = message.toLowerCase();
    
    // Business info responses
    if (msg.includes('hours') || msg.includes('open')) {
      return "We're here to help you! Please contact us for our current hours of operation.";
    }
    
    if (msg.includes('price') || msg.includes('cost') || msg.includes('fee')) {
      return "Our pricing varies based on your specific needs. Contact us for a personalized quote!";
    }
    
    if (msg.includes('location') || msg.includes('address') || msg.includes('where')) {
      return chatbotConfig.businessInfo.address || 
             "Please contact us for our location details and directions.";
    }
    
    if (msg.includes('phone') || msg.includes('call') || msg.includes('number')) {
      return chatbotConfig.businessInfo.phone ? 
             \`You can reach us at \${chatbotConfig.businessInfo.phone}\` :
             "Please use our contact form or email us directly.";
    }
    
    if (msg.includes('email') || msg.includes('contact')) {
      return chatbotConfig.businessInfo.email ? 
             \`You can email us at \${chatbotConfig.businessInfo.email}\` :
             "Please use our contact form to get in touch.";
    }
    
    if (msg.includes('service') || msg.includes('what do you do')) {
      return \`We specialize in \${chatbotConfig.businessInfo.type} services. \${chatbotConfig.businessInfo.description}\`;
    }
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hello! How can I help you learn more about our services today?";
    }
    
    if (msg.includes('thank') || msg.includes('bye')) {
      return chatbotConfig.responses.closing;
    }
    
    // Default response
    const responses = [
      "That's a great question! I'd recommend contacting us directly for detailed information.",
      "I'd be happy to help you with that. Please feel free to reach out to us for more details.",
      "For specific information about that, our team would be the best resource. Contact us anytime!",
      chatbotConfig.responses.fallback
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Initialize chatbot
  function initChatbot() {
    // Create styles
    createChatbotStyles();
    
    // Create chatbot HTML
    const chatbotContainer = document.getElementById('chatbot-container');
    if (chatbotContainer) {
      chatbotContainer.innerHTML = createChatbotHTML();
      
      // Event listeners
      const toggle = document.getElementById('chatbot-toggle');
      const window = document.getElementById('chatbot-window');
      const close = document.getElementById('chatbot-close');
      const input = document.getElementById('chatbot-input');
      const send = document.getElementById('chatbot-send');
      
      let isOpen = false;
      
      function toggleChatbot() {
        isOpen = !isOpen;
        window.style.display = isOpen ? 'flex' : 'none';
        if (isOpen) {
          input.focus();
        }
      }
      
      function sendMessage() {
        const message = input.value.trim();
        if (message) {
          processMessage(message);
          input.value = '';
        }
      }
      
      toggle.addEventListener('click', toggleChatbot);
      close.addEventListener('click', toggleChatbot);
      send.addEventListener('click', sendMessage);
      
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
  
})();
`;
};
