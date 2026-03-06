# Favicon – full-cover circle

`favicon.svg` is a **full-bleed** version of the stack logo so it fills the circle in browser tabs and bookmarks.

## If the circle still looks padded (e.g. in “visit often”)

Some browsers use the PNG/ICO icons instead of the SVG. To get a full-cover circle everywhere:

1. Open your logo in an image editor (Figma, Canva, etc.).
2. Export **square** images with the logo **scaled to fill the canvas** (no extra padding):
   - **favicon.ico** – 32×32 (or multi-size 16, 32, 48)
   - **favicon-16x16.png** – 16×16
   - **favicon-32x32.png** – 32×32
   - **apple-touch-icon.png** – 180×180
   - **android-chrome-192x192.png** – 192×192
   - **android-chrome-512x512.png** – 512×512
3. Replace the files in `public/` with these new versions.

Or use a generator and set **padding** to **0** (e.g. [realfavicongenerator.net](https://realfavicongenerator.net/) – “Padding" → 0).
