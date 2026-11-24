import urllib.request
import urllib.parse
import json
import os

titles = [
    'File:Iron_Man_flying_render.webp',
    'File:The_Invincible_Iron_Man.png',
    'File:Iron_Man_Mark_III.jpg',
    "File:Iron_Man's_Armor_(2024_Exhibition).jpg",
    'File:Iron_Man_Armor_(13729296773).jpg',
    'File:Iron_Man_ComicCon_silver_armor.jpg',
    'File:Iron_Man_Comic_Con_1.jpg',
    'File:2015_Vermont_Comic_Con_Cosplay_of_Iron_Man_Hulkbuster_Armor.jpg',
    'File:Iron_man_at_NYCC_2023.jpg',
    'File:SDCC_2012_-_Iron_Man_(7573609494).jpg',
    'File:SDCC_2012_-_Iron_Man_(7573692958).jpg',
    'File:AVP_Iron_Man_3_Paris.jpg',
    'File:C2E2_2015_Contest_-_Iron_Man_(17141417199).jpg'
]

out_dir = r'C:\Users\PC\.gemini\antigravity\scratch\ironman-portfolio\assets\images'
os.makedirs(out_dir, exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SabhyamPortfolio/1.0 (sabhyamtrivedy@gmail.com)'}

for t in titles:
    api_url = f'https://commons.wikimedia.org/w/api.php?action=query&format=json&titles={urllib.parse.quote(t)}&prop=imageinfo&iiprop=url'
    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                ii = p.get('imageinfo', [{}])[0]
                img_url = ii.get('url')
                if img_url:
                    clean_name = t.replace('File:', '').replace(' ', '_').lower()
                    # Strip extra parens for clean file naming
                    clean_name = clean_name.replace("'", "").replace('(', '').replace(')', '')
                    save_path = os.path.join(out_dir, clean_name)
                    print(f'Downloading {t} -> {clean_name}')
                    img_req = urllib.request.Request(img_url, headers=headers)
                    with urllib.request.urlopen(img_req) as img_resp, open(save_path, 'wb') as out_f:
                        out_f.write(img_resp.read())
                    print(f'Saved {clean_name} ({os.path.getsize(save_path)} bytes)')
    except Exception as e:
        print(f'Error downloading {t}: {e}')
