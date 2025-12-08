# PWA Icons Setup

Untuk menyelesaikan setup PWA, Anda perlu membuat ikon dalam ukuran berikut dan menempatkannya di folder `public/`:

## Icons yang Diperlukan

1. **pwa-192x192.png** - Ikon 192x192 pixels (untuk Android)
2. **pwa-512x512.png** - Ikon 512x512 pixels (untuk Android dan splash screen)

## Cara Membuat Icons

### Opsi 1: Menggunakan Online Tool
1. Kunjungi https://realfavicongenerator.net/ atau https://www.pwabuilder.com/imageGenerator
2. Upload `company_logo.png` atau `favicon.ico` yang ada di folder `public/`
3. Generate icons dan download
4. Simpan sebagai `pwa-192x192.png` dan `pwa-512x512.png` di folder `public/`

### Opsi 2: Menggunakan Image Editor
1. Buka `company_logo.png` atau logo aplikasi Anda
2. Resize ke 192x192 pixels, simpan sebagai `pwa-192x192.png`
3. Resize ke 512x512 pixels, simpan sebagai `pwa-512x512.png`
4. Pastikan background transparan atau sesuai dengan theme aplikasi

### Opsi 3: Menggunakan Command Line (jika ada ImageMagick)
```bash
# Install ImageMagick terlebih dahulu
# Kemudian jalankan:
convert public/company_logo.png -resize 192x192 public/pwa-192x192.png
convert public/company_logo.png -resize 512x512 public/pwa-512x512.png
```

## Catatan

- Icons harus dalam format PNG
- Background bisa transparan atau solid color
- Pastikan icon terlihat jelas di berbagai ukuran
- Setelah icons dibuat, restart dev server untuk melihat perubahan

## Testing

Setelah icons dibuat, test PWA dengan:
1. Buka aplikasi di browser (Chrome/Edge)
2. Buka DevTools > Application > Manifest
3. Pastikan icons muncul dengan benar
4. Cek install prompt di address bar

