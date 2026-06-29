"""
Script untuk generate icon PWA sederhana
Jalankan: python generate_icons.py
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
    
    def create_icon(size, filename):
        """Membuat icon sederhana dengan warna hijau dan ikon kalender"""
        img = Image.new('RGBA', (size, size), (76, 175, 80, 255))  # Warna hijau #4CAF50
        draw = ImageDraw.Draw(img)
        
        # Gambar ikon kalender sederhana
        margin = int(size * 0.2)
        
        # Kotak kalender (putih)
        cal_left = margin
        cal_top = int(size * 0.25)
        cal_right = size - margin
        cal_bottom = size - margin
        draw.rectangle([cal_left, cal_top, cal_right, cal_bottom], fill='white')
        
        # Garis atas kalender (hijau tua)
        draw.rectangle([cal_left, cal_top, cal_right, int(cal_top + size * 0.15)], fill=(56, 142, 60, 255))
        
        # Garis-garis kalender
        line_y1 = int(cal_top + size * 0.35)
        line_y2 = int(cal_top + size * 0.55)
        line_y3 = int(cal_top + size * 0.75)
        
        draw.line([cal_left + 10, line_y1, cal_right - 10, line_y1], fill=(200, 200, 200), width=max(2, size // 50))
        draw.line([cal_left + 10, line_y2, cal_right - 10, line_y2], fill=(200, 200, 200), width=max(2, size // 50))
        draw.line([cal_left + 10, line_y3, cal_right - 10, line_y3], fill=(200, 200, 200), width=max(2, size // 50))
        
        # Checkmark di tengah
        check_x = int(size * 0.4)
        check_y = int(size * 0.5)
        check_size = int(size * 0.2)
        
        draw.line([check_x, check_y, check_x + check_size // 2, check_y + check_size], 
                 fill=(76, 175, 80, 255), width=max(3, size // 30))
        draw.line([check_x + check_size // 2, check_y + check_size, check_x + check_size, check_y - check_size // 2], 
                 fill=(76, 175, 80, 255), width=max(3, size // 30))
        
        img.save(filename, 'PNG')
        print(f"✓ Icon {filename} berhasil dibuat ({size}x{size} px)")
    
    # Buat icon 192x192 dan 512x512
    create_icon(192, 'icon-192.png')
    create_icon(512, 'icon-512.png')
    
    print("\n✅ Semua icon berhasil dibuat!")
    print("Anda sekarang bisa menjalankan aplikasi sebagai PWA.")
    
except ImportError:
    print("❌ Error: Library Pillow tidak ditemukan!")
    print("\nCara install:")
    print("  pip install Pillow")
    print("\nAtau buat icon manual dengan cara:")
    print("  1. Buka https://favicon.io/")
    print("  2. Upload gambar atau buat icon")
    print("  3. Download dan rename menjadi icon-192.png dan icon-512.png")
    print("  4. Letakkan di folder yang sama dengan index.html")
