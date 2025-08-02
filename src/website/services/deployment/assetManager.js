// Asset Management for Website Deployment
// Handles images, fonts, and other static assets

import JSZip from 'jszip';

/**
 * Generate placeholder images for the website
 */
export const generatePlaceholderImages = (businessInfo) => {
  const images = {};
  
  // Hero background - generate SVG placeholder
  images['hero-bg.svg'] = generateSVGPlaceholder(1200, 600, '#f8f9fa', businessInfo.name || 'Business');
  
  // Service icons
  images['service-1.svg'] = generateServiceIcon('🏢', '#007bff');
  images['service-2.svg'] = generateServiceIcon('⚡', '#28a745');
  images['service-3.svg'] = generateServiceIcon('🎯', '#ffc107');
  images['service-4.svg'] = generateServiceIcon('🔧', '#dc3545');
  
  // Logo placeholder
  images['logo.svg'] = generateLogoPlaceholder(businessInfo.name || 'Business');
  
  // Team/About images
  images['about-image.svg'] = generateSVGPlaceholder(500, 400, '#e9ecef', 'About Us');
  
  // Testimonial avatars
  images['avatar-1.svg'] = generateAvatarPlaceholder('👨', '#007bff');
  images['avatar-2.svg'] = generateAvatarPlaceholder('👩', '#28a745');
  images['avatar-3.svg'] = generateAvatarPlaceholder('👨', '#ffc107');
  
  return images;
};

/**
 * Generate SVG placeholder
 */
function generateSVGPlaceholder(width, height, color, text) {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#6c757d" text-anchor="middle" dy=".3em">${text}</text>
  </svg>`;
}

/**
 * Generate service icon SVG
 */
function generateServiceIcon(icon, color) {
  return `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" fill="${color}" opacity="0.1"/>
    <circle cx="32" cy="32" r="25" fill="${color}" opacity="0.2"/>
    <text x="32" y="32" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" dy=".3em">${icon}</text>
  </svg>`;
}

/**
 * Generate logo placeholder
 */
function generateLogoPlaceholder(businessName) {
  const initials = businessName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  
  return `<svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#007bff"/>
    <text x="20" y="20" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">${initials}</text>
    <text x="50" y="20" font-family="Arial, sans-serif" font-size="14" font-weight="600" fill="#333" dy=".3em">${businessName}</text>
  </svg>`;
}

/**
 * Generate avatar placeholder
 */
function generateAvatarPlaceholder(emoji, color) {
  return `<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="40" fill="${color}" opacity="0.1"/>
    <circle cx="40" cy="40" r="35" fill="${color}" opacity="0.2"/>
    <text x="40" y="40" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" dy=".3em">${emoji}</text>
  </svg>`;
}

/**
 * Generate favicon set
 */
export const generateFavicons = (businessInfo) => {
  const initials = businessInfo.name ? 
    businessInfo.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) : 
    'BW';
  
  const favicons = {};
  
  // 16x16 favicon
  favicons['favicon-16x16.svg'] = `<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#007bff"/>
    <text x="8" y="8" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">${initials[0]}</text>
  </svg>`;
  
  // 32x32 favicon
  favicons['favicon-32x32.svg'] = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="4" fill="#007bff"/>
    <text x="16" y="16" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">${initials}</text>
  </svg>`;
  
  // Apple touch icon
  favicons['apple-touch-icon.svg'] = `<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
    <rect width="180" height="180" rx="20" fill="#007bff"/>
    <text x="90" y="90" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">${initials}</text>
  </svg>`;
  
  return favicons;
};

/**
 * Generate web app manifest
 */
export const generateManifest = (businessInfo) => {
  const name = businessInfo.name || 'Business Website';
  const shortName = name.length > 12 ? name.slice(0, 12) : name;
  
  return JSON.stringify({
    "name": name,
    "short_name": shortName,
    "description": businessInfo.description || "Professional business website",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#007bff",
    "orientation": "portrait-primary",
    "icons": [
      {
        "src": "/images/favicon-16x16.svg",
        "sizes": "16x16",
        "type": "image/svg+xml"
      },
      {
        "src": "/images/favicon-32x32.svg",
        "sizes": "32x32",
        "type": "image/svg+xml"
      },
      {
        "src": "/images/apple-touch-icon.svg",
        "sizes": "180x180",
        "type": "image/svg+xml"
      }
    ],
    "categories": ["business", "productivity"],
    "lang": "en-US",
    "dir": "ltr"
  }, null, 2);
};

/**
 * Generate CSS for custom fonts (Google Fonts)
 */
export const generateFontCSS = () => {
  return `/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');

/* Font Variables */
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-heading: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
}

/* Font Optimization */
* {
  font-display: swap;
}

/* Fallback font loading */
.font-loading {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Font face definitions for local fallbacks */
@font-face {
  font-family: 'InterFallback';
  src: local('system-ui'), local('-apple-system'), local('BlinkMacSystemFont');
  font-display: swap;
}

@font-face {
  font-family: 'PoppinsFallback';
  src: local('system-ui'), local('-apple-system'), local('BlinkMacSystemFont');
  font-display: swap;
  font-weight: 600;
}
`;
};

/**
 * Generate performance optimization assets
 */
export const generateOptimizationAssets = () => {
  const assets = {};
  
  // Service worker for caching
  assets['sw.js'] = `
// Service Worker for caching
const CACHE_NAME = 'business-website-v1';
const urlsToCache = [
  '/',
  '/css/main.css',
  '/css/responsive.css',
  '/js/main.js',
  '/js/chatbot.js',
  '/images/logo.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
`;

  // Critical CSS inliner
  assets['critical.css'] = `
/* Critical above-the-fold styles */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; }
.header { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: white; }
.hero { min-height: 100vh; display: flex; align-items: center; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
`;

  return assets;
};

/**
 * Create a complete asset bundle
 */
export const generateAssetBundle = async (businessInfo) => {
  const zip = new JSZip();
  
  // Add images
  const images = generatePlaceholderImages(businessInfo);
  const imagesFolder = zip.folder('images');
  
  Object.keys(images).forEach(filename => {
    imagesFolder.file(filename, images[filename]);
  });
  
  // Add favicons
  const favicons = generateFavicons(businessInfo);
  Object.keys(favicons).forEach(filename => {
    imagesFolder.file(filename, favicons[filename]);
  });
  
  // Add manifest
  zip.file('manifest.json', generateManifest(businessInfo));
  
  // Add font CSS
  const cssFolder = zip.folder('css');
  cssFolder.file('fonts.css', generateFontCSS());
  
  // Add optimization assets
  const optimizationAssets = generateOptimizationAssets();
  Object.keys(optimizationAssets).forEach(filename => {
    zip.file(filename, optimizationAssets[filename]);
  });
  
  return await zip.generateAsync({ type: 'blob' });
};

/**
 * Generate asset file structure for deployment
 */
export const generateAssetStructure = (businessInfo) => {
  const structure = {
    images: generatePlaceholderImages(businessInfo),
    favicons: generateFavicons(businessInfo),
    manifest: generateManifest(businessInfo),
    fonts: {
      'fonts.css': generateFontCSS()
    },
    optimization: generateOptimizationAssets()
  };
  
  return structure;
};

/**
 * Generate asset preload hints
 */
export const generatePreloadHints = () => {
  return [
    '<link rel="preload" href="/css/main.css" as="style">',
    '<link rel="preload" href="/css/responsive.css" as="style">',
    '<link rel="preload" href="/js/main.js" as="script">',
    '<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" as="style">',
    '<link rel="preload" href="/images/logo.svg" as="image">',
    '<link rel="preload" href="/images/hero-bg.svg" as="image">'
  ];
};

/**
 * Generate meta tags for assets
 */
export const generateAssetMetaTags = (businessInfo) => {
  return [
    '<link rel="manifest" href="/manifest.json">',
    '<link rel="icon" type="image/svg+xml" href="/images/favicon-32x32.svg">',
    '<link rel="icon" type="image/svg+xml" sizes="16x16" href="/images/favicon-16x16.svg">',
    '<link rel="apple-touch-icon" href="/images/apple-touch-icon.svg">',
    '<meta name="theme-color" content="#007bff">',
    '<meta name="msapplication-TileColor" content="#007bff">',
    '<meta name="apple-mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-status-bar-style" content="default">',
    `<meta name="apple-mobile-web-app-title" content="${businessInfo.name || 'Business'}">`,
    '<meta name="mobile-web-app-capable" content="yes">'
  ];
};
