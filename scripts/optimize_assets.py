import os
from PIL import Image

img_dir = r'C:\Users\PC\.gemini\antigravity\scratch\ironman-portfolio\assets\images'

for fname in os.listdir(img_dir):
    fpath = os.path.join(img_dir, fname)
    if not os.path.isfile(fpath) or fname.startswith('opt_'):
        continue
    try:
        with Image.open(fpath) as img:
            w, h = img.size
            print(f'{fname}: {w}x{h}, {os.path.getsize(fpath)} bytes')
            if w > 1920 or h > 1920:
                img.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
                opt_path = os.path.join(img_dir, f'opt_{fname}')
                # Save optimized version
                if fname.lower().endswith('.webp'):
                    img.save(opt_path, 'WEBP', quality=85)
                elif fname.lower().endswith('.png'):
                    img.save(opt_path, 'PNG', optimize=True)
                else:
                    img.convert('RGB').save(opt_path, 'JPEG', quality=85)
                print(f'  Created opt_{fname} -> {img.size}, {os.path.getsize(opt_path)} bytes')
    except Exception as e:
        print(f'Error processing {fname}: {e}')
