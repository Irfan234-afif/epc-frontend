// Script sederhana untuk generate PWA icons
// Menggunakan company_logo.png sebagai source

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Note: Script ini memerlukan package 'sharp' untuk resize gambar
// Install dengan: npm install sharp --save-dev

async function generatePWAIcons() {
  try {
    const sharp = await import('sharp');
    const publicDir = join(process.cwd(), 'public');
    const sourceLogo = join(publicDir, 'logo.png');
    const output192 = join(publicDir, 'pwa-192x192.png');
    const output512 = join(publicDir, 'pwa-512x512.png');

    // Check if source exists
    try {
      readFileSync(sourceLogo);
    } catch (e) {
      console.error('Error: company_logo.png tidak ditemukan di folder public/');
      console.log('Gunakan favicon.ico sebagai alternatif atau buat icons manual');
      return;
    }

    // Generate 192x192 icon
    await sharp.default(sourceLogo)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(output192);

    console.log('✓ Generated pwa-192x192.png');

    // Generate 512x512 icon
    await sharp.default(sourceLogo)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(output512);

    console.log('✓ Generated pwa-512x512.png');
    console.log('\nIcons berhasil dibuat! Restart dev server untuk melihat perubahan.');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('\n⚠ Package "sharp" belum terinstall.');
      console.log('Install dengan: npm install sharp --save-dev');
      console.log('Kemudian jalankan: node generate-pwa-icons.js\n');
      console.log('ATAU gunakan cara alternatif:');
      console.log('1. Buka https://realfavicongenerator.net/');
      console.log('2. Upload company_logo.png');
      console.log('3. Download dan simpan sebagai pwa-192x192.png dan pwa-512x512.png di folder public/');
    } else {
      console.error('Error:', error.message);
    }
  }
}

generatePWAIcons();

