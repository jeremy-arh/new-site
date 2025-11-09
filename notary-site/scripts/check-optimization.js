/**
 * Script pour vérifier l'optimisation Cloudflare Pages
 * Usage: node scripts/check-optimization.js https://mynotary.io
 */

const url = process.argv[2] || 'https://mynotary.io';

console.log('🔍 Vérification de l\'optimisation Cloudflare Pages');
console.log('URL:', url);
console.log('');

// Vérifier les headers HTTP
async function checkHeaders() {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const headers = Object.fromEntries(response.headers);
    
    console.log('✅ Headers HTTP:');
    console.log('  - Content-Type:', headers['content-type'] || 'N/A');
    console.log('  - Cache-Control:', headers['cache-control'] || 'N/A');
    console.log('  - X-Content-Type-Options:', headers['x-content-type-options'] || '❌ Missing');
    console.log('  - X-Frame-Options:', headers['x-frame-options'] || '❌ Missing');
    console.log('  - X-XSS-Protection:', headers['x-xss-protection'] || '❌ Missing');
    console.log('  - Referrer-Policy:', headers['referrer-policy'] || '❌ Missing');
    console.log('  - Strict-Transport-Security:', headers['strict-transport-security'] || '⚠️ Consider adding');
    console.log('');
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des headers:', error.message);
  }
}

// Vérifier le sitemap
async function checkSitemap() {
  try {
    const sitemapUrl = `${url}/sitemap.xml`;
    const response = await fetch(sitemapUrl);
    
    if (response.ok) {
      const text = await response.text();
      const urlCount = (text.match(/<url>/g) || []).length;
      console.log('✅ Sitemap:');
      console.log('  - Accessible: Oui');
      console.log('  - URLs trouvées:', urlCount);
      console.log('  - Cache-Control:', response.headers.get('cache-control') || 'N/A');
      console.log('');
    } else {
      console.log('❌ Sitemap: Non accessible (', response.status, ')');
      console.log('');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du sitemap:', error.message);
  }
}

// Vérifier les assets
async function checkAssets() {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Compter les assets
    const scriptCount = (html.match(/<script/g) || []).length;
    const linkCount = (html.match(/<link/g) || []).length;
    const imgCount = (html.match(/<img/g) || []).length;
    
    console.log('✅ Assets:');
    console.log('  - Scripts:', scriptCount);
    console.log('  - Links:', linkCount);
    console.log('  - Images:', imgCount);
    console.log('');
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des assets:', error.message);
  }
}

// Vérifier les performances (simplifié)
async function checkPerformance() {
  try {
    const start = Date.now();
    const response = await fetch(url);
    const end = Date.now();
    const loadTime = end - start;
    
    console.log('✅ Performances:');
    console.log('  - Temps de chargement:', loadTime, 'ms');
    console.log('  - Status:', response.status);
    console.log('  - Taille (approx):', response.headers.get('content-length') || 'N/A');
    console.log('');
    
    if (loadTime > 3000) {
      console.log('⚠️  Temps de chargement élevé (> 3s)');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des performances:', error.message);
  }
}

// Exécuter les vérifications
async function runChecks() {
  await checkHeaders();
  await checkSitemap();
  await checkAssets();
  await checkPerformance();
  
  console.log('✅ Vérifications terminées');
  console.log('');
  console.log('💡 Pour des tests plus approfondis:');
  console.log('  - PageSpeed Insights: https://pagespeed.web.dev/');
  console.log('  - WebPageTest: https://www.webpagetest.org/');
  console.log('  - Lighthouse: Chrome DevTools > Lighthouse');
}

runChecks().catch(console.error);

