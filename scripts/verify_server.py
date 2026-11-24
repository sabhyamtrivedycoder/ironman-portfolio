import urllib.request

url = 'http://localhost:8086/index.html'
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as resp:
    data = resp.read().decode('utf-8')
    print('Length:', len(data))
    idx = data.find('id="hero"')
    print('Found id="hero" at index:', idx)
    print('Snippet:')
    print(data[max(0, idx-50):idx+300])
