#!/usr/bin/env python3
"""
Script untuk generate icon PWA yang VALID dan PASTI BERHASIL
Jalankan: python generate_valid_icons.py
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """Buat icon PWA dengan desain modern"""
    # Buat image dengan background hijau gradient
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background circle dengan gradient effect
    margin = int(size * 0.05)
    draw.ellipse([margin, margin, size-margin, size-margin], fill='#4CAF50')
    
    # Inner circle (lebih terang)
    inner_margin = int(size * 0.15)
    draw.ellipse([inner_margin, inner_margin, size-inner_margin, size-inner_margin], fill='#66BB6A')
    
    # Draw checkmark icon
    check_color = '#FFFFFF'
    check_width = max(2, int(size * 0.08))
    
    # Checkmark points (relative to size)
    if size == 192:
        points = [(60, 100), (85, 125), (130, 70)]
    else:  # 512
        points = [(160, 270), (225, 335), (350, 190)]
    
    # Draw checkmark
    draw.line([points[0], points[1]], fill=check_color, width=check_width)
    draw.line([points[1], points[2]], fill=check_color, width=check_width)
    
    # Draw calendar lines (decorative)
    line_width = max(1, int(size * 0.03))
    line_color = '#FFFFFF'
    
    # Top line
    y_pos = int(size * 0.3)
    x_start = int(size * 0.25)
    x_end = int(size * 0.75)
    draw.line([(x_start, y_pos), (x_end, y_pos)], fill=line_color, width=line_width)
    
    # Save
    img.save(filename, 'PNG')
    print(f"✅ Created: {filename} ({size}x{size})")

def main():
    print("🎨 Generating PWA Icons...")
    print("=" * 50)
    
    # Check if PIL is installed
    try:
        import PIL
    except ImportError:
        print("❌ Pillow not installed!")
        print("📦 Install with: pip install Pillow")
        return
    
    # Create icons
    create_icon(192, 'icon-192.png')
    create_icon(512, 'icon-512.png')
    
    print("=" * 50)
    print("✅ DONE! Icons created successfully!")
    print("\n📱 Next steps:")
    print("1. Clear browser cache (F12 → Application → Clear storage)")
    print("2. Hard refresh (Ctrl+Shift+R)")
    print("3. Check for install prompt in address bar")
    print("\n💡 If still not working, try deploying to Netlify:")
    print("   https://app.netlify.com/drop")

if __name__ == '__main__':
    main()
