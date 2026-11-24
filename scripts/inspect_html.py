with open(r'C:\Users\PC\.gemini\antigravity\scratch\ironman-portfolio\index.html', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('<header class="stark-nav">')
end = text.find('<section id="origin"')
print('=== BETWEEN NAV AND ORIGIN ===')
print(text[start:end])
