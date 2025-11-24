const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../docs/index.html');
const specPath = path.join(__dirname, '../space-platform-api.yaml');
const docsSpecPath = path.join(__dirname, '../docs/space-platform-api.yaml');

// Copy spec file to docs
if (fs.existsSync(specPath)) {
    fs.copyFileSync(specPath, docsSpecPath);
    console.log('✅ Copied space-platform-api.yaml to docs/');
} else {
    console.warn('⚠️ space-platform-api.yaml not found in root');
}

// Copy logo file to docs/img
const logoSrcPath = path.join(__dirname, '../img/logo.svg');
const logoDestDir = path.join(__dirname, '../docs/img');
const logoDestPath = path.join(logoDestDir, 'logo.svg');

if (fs.existsSync(logoSrcPath)) {
    fs.mkdirSync(logoDestDir, { recursive: true }); // Ensure docs/img directory exists
    fs.copyFileSync(logoSrcPath, logoDestPath);
    console.log('✅ Copied img/logo.svg to docs/img/');
} else {
    console.warn('⚠️ img/logo.svg not found in root');
}

if (!fs.existsSync(indexPath)) {
    console.warn('⚠️ docs/index.html not found, skipping try-link addition');
    process.exit(0);
}

let html = fs.readFileSync(indexPath, 'utf8');

const navBar = `
<div style="position: fixed; top: 0; right: 20px; z-index: 10000; padding: 15px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
  <a href="index.html" style="color: white; text-decoration: none; margin-right: 15px; font-weight: bold;">📖 ReDoc</a>
  <a href="try.html" style="color: white; text-decoration: none; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 4px; font-weight: bold;">⚡ Try It Out</a>
</div>`;

if (!html.includes('Try It Out')) {
    html = html.replace('<body>', `<body>${navBar}`);
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('✅ Added "Try It Out" link to docs/index.html');
} else {
    console.log('ℹ️ "Try It Out" link already present');
}

// Add fonts.css reference
if (!html.includes('fonts.css')) {
    html = html.replace('</head>', '  <link href="fonts.css" rel="stylesheet">\n</head>');
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('✅ Added fonts.css to docs/index.html');
}

// Add favicon
if (!html.includes('favicon.png')) {
    html = html.replace('</head>', '  <link rel="icon" type="image/png" href="favicon.png">\n</head>');
    console.log('✅ Added favicon to docs/index.html');
}

// Inject Sidebar Title and Logo Script
if (!html.includes('custom-sidebar-title')) {
    const sidebarTitleScript = `
<script>
  window.addEventListener('load', function() {
    const checkLogo = setInterval(function() {
      // Try to find existing logo
      let logo = document.querySelector('img[alt="Reezonly Space"]');
      const sidebar = document.querySelector('.menu-content');

      if (sidebar) {
        // If logo doesn't exist, create it
        if (!logo) {
            logo = document.createElement('img');
            logo.alt = 'Reezonly Space';
            logo.src = 'img/logo.svg'; 
            logo.style.cssText = 'max-height: 40px; margin: 16px; display: block;';
            sidebar.insertBefore(logo, sidebar.firstChild);
            console.log('✅ Logo injected manually');
        }

        // Inject Title if not present
        if (logo && logo.parentNode && !logo.parentNode.querySelector('.custom-sidebar-title')) {
            const title = document.createElement('div');
            title.className = 'custom-sidebar-title';
            title.innerText = 'Space Platform';
            title.style.cssText = 'font-family: StyreneALC, sans-serif; font-weight: 700; font-size: 16px; color: #1f2430; margin: 0 0 0 16px; line-height: 1.2; letter-spacing: -0.02em; padding-bottom: 20px;';
            
            // Insert title after logo
            if (logo.nextSibling) {
                logo.parentNode.insertBefore(title, logo.nextSibling);
            } else {
                logo.parentNode.appendChild(title);
            }
            
            clearInterval(checkLogo);
        }
      }
    }, 100);
  });
</script>`;
    const lastBodyIndex = html.lastIndexOf('</body>');
    if (lastBodyIndex !== -1) {
        html = html.substring(0, lastBodyIndex) + `${sidebarTitleScript}\n` + html.substring(lastBodyIndex);
        console.log('✅ Added logo injection and sidebar title script to docs/index.html');
    } else {
        console.warn('⚠️ Could not find </body> tag to inject script');
    }
}

fs.writeFileSync(indexPath, html, 'utf8');
