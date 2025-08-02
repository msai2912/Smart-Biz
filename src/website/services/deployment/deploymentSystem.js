// Complete Deployment System
// Integrates all generators to create a full website package

import { generateWebsiteFiles, generateIndexHTML } from './fileGenerator.js';
import { generateMainCSS, generateBaseCSS } from './cssGenerator.js';
import { generateResponsiveCSS } from './responsiveGenerator.js';
import { generateMainJS, generateChatbotJS } from './jsGenerator.js';
import { generateAllConfigFiles } from './configGenerator.js';
import { 
  generateAssetStructure, 
  generatePreloadHints, 
  generateAssetMetaTags 
} from './assetManager.js';

/**
 * Main deployment system that generates complete website
 */
export class WebsiteDeploymentSystem {
  constructor() {
    this.files = new Map();
  }

  /**
   * Generate complete website package
   */
  async generateCompleteWebsite(businessInfo, websiteContent) {
    try {
      console.log('Starting complete website generation...');
      
      // Clear previous files
      this.files.clear();
      
      // Generate core HTML file
      await this.generateHTMLFiles(businessInfo, websiteContent);
      
      // Generate CSS files
      await this.generateCSSFiles(businessInfo, websiteContent);
      
      // Generate JavaScript files
      await this.generateJSFiles(businessInfo);
      
      // Generate configuration files
      await this.generateConfigFiles(businessInfo);
      
      // Generate assets
      await this.generateAssets(businessInfo);
      
      console.log('Website generation completed successfully');
      return this.getFileStructure();
      
    } catch (error) {
      console.error('Error generating website:', error);
      throw new Error(`Website generation failed: ${error.message}`);
    }
  }

  /**
   * Generate HTML files
   */
  async generateHTMLFiles(businessInfo, websiteContent) {
    console.log('Generating HTML files...');
    
    // Generate main index.html
    const htmlContent = generateIndexHTML(businessInfo, websiteContent);
    this.addFile('index.html', htmlContent);
    
    // Generate 404 page
    const error404 = this.generate404Page(businessInfo);
    this.addFile('404.html', error404);
  }

  /**
   * Generate CSS files
   */
  async generateCSSFiles(businessInfo, websiteContent) {
    console.log('Generating CSS files...');
    
    // Main CSS
    const mainCSS = generateMainCSS(businessInfo, websiteContent);
    this.addFile('css/main.css', mainCSS);
    
    // Responsive CSS
    const responsiveCSS = generateResponsiveCSS();
    this.addFile('css/responsive.css', responsiveCSS);
    
    // Base CSS
    const baseCSS = generateBaseCSS();
    this.addFile('css/base.css', baseCSS);
    
    // Print styles
    const printCSS = this.generatePrintCSS();
    this.addFile('css/print.css', printCSS);
  }

  /**
   * Generate JavaScript files
   */
  async generateJSFiles(businessInfo) {
    console.log('Generating JavaScript files...');
    
    // Main JavaScript
    const mainJS = generateMainJS(businessInfo);
    this.addFile('js/main.js', mainJS);
    
    // Chatbot JavaScript
    const chatbotJS = generateChatbotJS(businessInfo);
    this.addFile('js/chatbot.js', chatbotJS);
    
    // Service Worker
    const serviceWorker = this.generateServiceWorker();
    this.addFile('sw.js', serviceWorker);
  }

  /**
   * Generate configuration files
   */
  async generateConfigFiles(businessInfo) {
    console.log('Generating configuration files...');
    
    const configFiles = generateAllConfigFiles(businessInfo);
    
    Object.keys(configFiles).forEach(filename => {
      this.addFile(filename, configFiles[filename]);
    });
  }

  /**
   * Generate assets
   */
  async generateAssets(businessInfo) {
    console.log('Generating assets...');
    
    const assetStructure = generateAssetStructure(businessInfo);
    
    // Add images
    Object.keys(assetStructure.images).forEach(filename => {
      this.addFile(`images/${filename}`, assetStructure.images[filename]);
    });
    
    // Add favicons
    Object.keys(assetStructure.favicons).forEach(filename => {
      this.addFile(`images/${filename}`, assetStructure.favicons[filename]);
    });
    
    // Add manifest
    this.addFile('manifest.json', assetStructure.manifest);
    
    // Add font CSS
    Object.keys(assetStructure.fonts).forEach(filename => {
      this.addFile(`css/${filename}`, assetStructure.fonts[filename]);
    });
    
    // Add optimization assets
    Object.keys(assetStructure.optimization).forEach(filename => {
      this.addFile(filename, assetStructure.optimization[filename]);
    });
  }

  /**
   * Generate 404 error page
   */
  generate404Page(businessInfo) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - ${businessInfo.name || 'Business'}</title>
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/responsive.css">
    <style>
        .error-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem;
        }
        .error-content h1 {
            font-size: 8rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
            font-weight: 700;
        }
        .error-content h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: var(--text-color);
        }
        .error-content p {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            color: var(--text-light);
        }
        .btn-home {
            display: inline-block;
            padding: 12px 30px;
            background: var(--primary-color);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        .btn-home:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-content">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you're looking for doesn't exist or has been moved.</p>
            <a href="/" class="btn-home">Return Home</a>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Generate print styles
   */
  generatePrintCSS() {
    return `/* Print Styles */
@media print {
  * {
    background: transparent !important;
    color: black !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  body {
    font-size: 12pt;
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid;
    font-weight: bold;
  }

  p, blockquote {
    orphans: 3;
    widows: 3;
  }

  blockquote, pre {
    page-break-inside: avoid;
  }

  .header, .navbar, .nav-menu, .chatbot-widget, .btn, button {
    display: none !important;
  }

  .hero {
    min-height: auto !important;
    padding: 2rem 0 !important;
  }

  .container {
    max-width: none !important;
    padding: 0 !important;
  }

  a[href]:after {
    content: " (" attr(href) ")";
    font-size: 80%;
  }

  a[href^="#"]:after,
  a[href^="javascript:"]:after {
    content: "";
  }

  .section {
    page-break-inside: avoid;
    margin-bottom: 2rem;
  }

  .card {
    border: 1px solid #ddd;
    margin-bottom: 1rem;
    padding: 1rem;
  }
}`;
  }

  /**
   * Generate service worker
   */
  generateServiceWorker() {
    return `// Service Worker for Progressive Web App
const CACHE_NAME = 'business-website-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/css/main.css',
  '/css/responsive.css',
  '/css/base.css',
  '/js/main.js',
  '/js/chatbot.js',
  '/images/logo.svg',
  '/images/hero-bg.svg',
  '/manifest.json'
];

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - Cache strategy: Cache First for static assets, Network First for dynamic content
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // If found in cache, return it
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise, fetch from network
        return fetch(request)
          .then(networkResponse => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response
            const responseToCache = networkResponse.clone();
            
            // Add to cache
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch(() => {
            // If network fails, try to return cached version or offline page
            if (request.destination === 'document') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

// Push notifications
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/images/favicon-32x32.svg',
      badge: '/images/favicon-16x16.svg',
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'open',
          title: 'Open Website'
        },
        {
          action: 'close',
          title: 'Close'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function for syncing contact form
async function syncContactForm() {
  try {
    // Implementation for offline form submission sync
    console.log('Syncing contact form submissions...');
    // Add your form sync logic here
  } catch (error) {
    console.error('Failed to sync contact form:', error);
  }
}`;
  }

  /**
   * Add file to the collection
   */
  addFile(path, content) {
    this.files.set(path, content);
  }

  /**
   * Get the complete file structure
   */
  getFileStructure() {
    const structure = {};
    
    for (const [path, content] of this.files) {
      structure[path] = content;
    }
    
    return structure;
  }

  /**
   * Get files as a downloadable archive
   */
  async generateArchive() {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    for (const [path, content] of this.files) {
      zip.file(path, content);
    }
    
    return await zip.generateAsync({ type: 'blob' });
  }

  /**
   * Generate deployment statistics
   */
  getDeploymentStats() {
    const stats = {
      totalFiles: this.files.size,
      fileTypes: {},
      totalSize: 0
    };
    
    for (const [path, content] of this.files) {
      const extension = path.split('.').pop();
      stats.fileTypes[extension] = (stats.fileTypes[extension] || 0) + 1;
      stats.totalSize += new Blob([content]).size;
    }
    
    return stats;
  }
}

/**
 * Main function to generate complete website
 */
export const generateCompleteWebsiteForDeployment = async (businessInfo, websiteContent) => {
  const deploymentSystem = new WebsiteDeploymentSystem();
  return await deploymentSystem.generateCompleteWebsite(businessInfo, websiteContent);
};

/**
 * Export the deployment system class
 */
export default WebsiteDeploymentSystem;
