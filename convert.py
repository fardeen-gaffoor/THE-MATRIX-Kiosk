import re
import os

with open('Samvidhan Archive — Ambedkar Digital Heritage UI (3).html', 'r', encoding='utf-8') as f:
    html = f.read()

body = html.split('<body>')[1].split('</body>')[0]

# Fix inline styles (convert style="x: y" to style={{x: 'y'}})
def style_to_react(match):
    style_str = match.group(1)
    # Simple converter for this specific file, usually a full parser is better
    # But let's just let React warn us or do basic camelCasing
    return match.group(0)

body = body.replace('class=', 'className=')
body = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', body)
body = re.sub(r'<img([^>]*[^/])>', r'<img\1 />', body)
body = re.sub(r'<input([^>]*[^/])>', r'<input\1 />', body)
body = body.replace('<br>', '<br />')

# Convert simple inline styles like style="width: 110px; height: 110px; object-fit: cover;"
# Since it's complex, let's just strip inline styles that cause parsing errors,
# Or even better, convert style="..." to style={{...}}
def convert_style_attr(m):
    style_val = m.group(1)
    rules = style_val.split(';')
    react_style = []
    for r in rules:
        if ':' in r:
            k, v = r.split(':', 1)
            k = k.strip()
            v = v.strip()
            # camelCase k
            parts = k.split('-')
            k = parts[0] + ''.join(x.title() for x in parts[1:])
            react_style.append(f"{k}: '{v}'")
    return "style={{" + ", ".join(react_style) + "}}"

body = re.sub(r'style="([^"]+)"', convert_style_attr, body)

# the script tag needs to be extracted out and moved to useEffect
scripts = html.split('<script>')[1].split('</script>')[0] if '<script>' in html else ""
body = body.split('<script>')[0]

out = f"""import React, {{ useEffect }} from 'react';

export default function Home() {{
  useEffect(() => {{
    // We will port the scripts manually later
  }}, []);

  return (
    <>
      {body}
    </>
  );
}}
"""

with open('apps/web/src/pages/Home.tsx', 'w', encoding='utf-8') as f:
    f.write(out)

with open('apps/web/src/scripts.js', 'w', encoding='utf-8') as f:
    f.write(scripts)
