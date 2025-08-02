// Vercel Configuration Generator
// Creates necessary configuration files for Vercel deployment

/**
 * Generate vercel.json configuration
 */
export const generateVercelConfig = (businessInfo) => {
  return JSON.stringify({
    "version": 2,
    "name": businessInfo.name ? businessInfo.name.toLowerCase().replace(/\s+/g, '-') : "business-website",
    "builds": [
      {
        "src": "index.html",
        "use": "@vercel/static"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Strict-Transport-Security",
            "value": "max-age=31536000; includeSubDomains"
          }
        ]
      },
      {
        "source": "/css/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "/js/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "/images/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ],
    "cleanUrls": true,
    "trailingSlash": false
  }, null, 2);
};

/**
 * Generate package.json for deployment
 */
export const generatePackageJson = (businessInfo) => {
  const name = businessInfo.name ? businessInfo.name.toLowerCase().replace(/\s+/g, '-') : "business-website";
  
  return JSON.stringify({
    "name": name,
    "version": "1.0.0",
    "description": businessInfo.description || "Professional business website",
    "main": "index.html",
    "scripts": {
      "dev": "vercel dev",
      "build": "echo 'Static site - no build needed'",
      "start": "vercel dev",
      "deploy": "vercel --prod"
    },
    "keywords": [
      businessInfo.type || "business",
      "website",
      "professional",
      "service"
    ],
    "author": businessInfo.name || "Business Owner",
    "license": "MIT",
    "devDependencies": {
      "vercel": "^32.0.0"
    },
    "engines": {
      "node": ">=18.0.0"
    }
  }, null, 2);
};

/**
 * Generate README.md for the project
 */
export const generateReadme = (businessInfo) => {
  const name = businessInfo.name || "Business Website";
  
  return `# ${name}

${businessInfo.description || "A professional business website"}

## 🚀 Quick Start

This website is built as a static site optimized for Vercel deployment.

### Local Development

1. Install Vercel CLI globally:
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. Run locally:
   \`\`\`bash
   vercel dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deployment

Deploy to Vercel with one command:

\`\`\`bash
vercel --prod
\`\`\`

## 📁 Project Structure

\`\`\`
/
├── index.html          # Main HTML file
├── css/
│   ├── main.css        # Main styles
│   └── responsive.css  # Responsive styles
├── js/
│   ├── main.js         # Main functionality
│   └── chatbot.js      # Chatbot features
├── images/             # Image assets
├── vercel.json         # Vercel configuration
└── package.json        # Project configuration
\`\`\`

## ✨ Features

- 🎨 **Modern Design**: Clean, professional appearance
- 📱 **Fully Responsive**: Works on all devices
- ⚡ **Fast Loading**: Optimized for performance
- 🤖 **AI Chatbot**: Interactive customer support
- 🔍 **SEO Optimized**: Built for search engines
- ♿ **Accessible**: WCAG compliant design
- 🔒 **Secure**: Security headers and best practices

## 🛠️ Technologies

- HTML5 & CSS3
- JavaScript (ES6+)
- Vercel for hosting
- Responsive design
- Progressive enhancement

## 📞 Contact

${businessInfo.phone ? `📱 Phone: ${businessInfo.phone}` : ''}
${businessInfo.email ? `📧 Email: ${businessInfo.email}` : ''}
${businessInfo.address ? `📍 Address: ${businessInfo.address}` : ''}

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for ${name}
`;
};

/**
 * Generate .gitignore file
 */
export const generateGitignore = () => {
  return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Vercel
.vercel

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Temporary files
tmp/
temp/

# Build outputs
dist/
build/
`;
};

/**
 * Generate robots.txt for SEO
 */
export const generateRobotsTxt = (businessInfo) => {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://${businessInfo.name ? businessInfo.name.toLowerCase().replace(/\s+/g, '-') : 'business-website'}.vercel.app/sitemap.xml

# Crawl-delay
Crawl-delay: 1
`;
};

/**
 * Generate sitemap.xml for SEO
 */
export const generateSitemap = (businessInfo) => {
  const baseUrl = `https://${businessInfo.name ? businessInfo.name.toLowerCase().replace(/\s+/g, '-') : 'business-website'}.vercel.app`;
  const currentDate = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}#services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}#about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}#contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
};

/**
 * Generate deployment instructions
 */
export const generateDeploymentInstructions = (businessInfo) => {
  const projectName = businessInfo.name ? businessInfo.name.toLowerCase().replace(/\s+/g, '-') : 'business-website';
  
  return `# Deployment Instructions

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket
3. **Vercel CLI** (optional): Install with \`npm install -g vercel\`

## Method 1: Vercel Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Vercel will automatically detect it as a static site

2. **Configure Project**:
   - Project Name: \`${projectName}\`
   - Framework Preset: Other
   - Root Directory: \`./\` (leave as default)
   - Build Command: Leave empty (static site)
   - Output Directory: Leave empty

3. **Deploy**:
   - Click "Deploy"
   - Your site will be live in ~30 seconds
   - Custom domain can be added in project settings

## Method 2: Vercel CLI

1. **Install CLI**:
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. **Login**:
   \`\`\`bash
   vercel login
   \`\`\`

3. **Deploy**:
   \`\`\`bash
   vercel --prod
   \`\`\`

4. **Follow prompts**:
   - Set up and deploy: Y
   - Link to existing project: N
   - Project name: \`${projectName}\`
   - Directory: \`./\` (current)

## Method 3: GitHub Integration

1. **Push to GitHub**:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   \`\`\`

2. **Import to Vercel**:
   - Go to Vercel dashboard
   - Click "New Project"
   - Import from GitHub
   - Select your repository

## Custom Domain Setup

1. **In Vercel Dashboard**:
   - Go to Project Settings
   - Click "Domains"
   - Add your custom domain

2. **DNS Configuration**:
   - Add CNAME record: \`www\` → \`cname.vercel-dns.com\`
   - Add A record: \`@\` → \`76.76.19.61\`

## Environment Variables (if needed)

If you add dynamic features later:

1. **In Vercel Dashboard**:
   - Go to Project Settings
   - Click "Environment Variables"
   - Add your variables

## Performance Optimization

Your site is already optimized with:
- ✅ Minified CSS and JavaScript
- ✅ Optimized images
- ✅ Gzip compression (automatic on Vercel)
- ✅ CDN distribution (automatic on Vercel)
- ✅ Security headers
- ✅ SEO optimization

## Monitoring

- **Analytics**: Enable Vercel Analytics in project settings
- **Speed Insights**: Enable Vercel Speed Insights
- **Uptime**: Vercel provides 99.99% uptime SLA

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

Your website will be available at:
- Vercel URL: \`https://${projectName}.vercel.app\`
- Custom domain: Your domain once configured

Deployment typically takes 20-40 seconds and is automatically triggered on Git pushes.
`;
};

/**
 * Generate all configuration files
 */
export const generateAllConfigFiles = (businessInfo) => {
  return {
    'vercel.json': generateVercelConfig(businessInfo),
    'package.json': generatePackageJson(businessInfo),
    'README.md': generateReadme(businessInfo),
    '.gitignore': generateGitignore(),
    'robots.txt': generateRobotsTxt(businessInfo),
    'sitemap.xml': generateSitemap(businessInfo),
    'DEPLOYMENT.md': generateDeploymentInstructions(businessInfo)
  };
};
