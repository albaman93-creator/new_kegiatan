"""
Script cepat untuk konversi SVG ke PNG
Jalankan: python svg_to_png.py
"""

try:
    import cairosvg
    import os
    
    # Path file
    svg_file = 'icon.svg'
    
    if not os.path.exists(svg_file):
        print(f"❌ File {svg_file} tidak ditemukan!")
        exit()
    
    print("🔄 Mengkonversi SVG ke PNG...")
    
    # Konversi ke 192x192
    cairosvg.svg2png(url=svg_file, write_to='icon-192.png', output_width=192, output_height=192)
    print("✓ icon-192.png berhasil dibuat")
    
    # Konversi ke 512x512
    cairosvg.svg2png(url=svg_file, write_to='icon-512.png', output_width=512, output_height=512)
    print("✓ icon-512.png berhasil dibuat")
    
    print("\n✅ Selesai! Icon PWA sudah siap.")
    
except ImportError:
    print("❌ Library cairosvg tidak ditemukan!")
    print("\nCara install:")
    print("  pip install cairosvg")
    print("\nAtau gunakan cara alternatif:")
    print("  1. Buka icon.svg di browser")
    print("  2. Screenshot atau save as PNG")
    print("  3. Resize ke 192x192 dan 512x512")
    print("\nATAU gunakan website online:")
    print("  https://cloudconvert.com/svg-to-png")
