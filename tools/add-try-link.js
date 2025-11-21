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
