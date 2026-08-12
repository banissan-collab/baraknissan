from pathlib import Path
import re

path = Path('index.html')
text = path.read_text(encoding='utf-8')

pattern = re.compile(
    r'(<!-- GRID VIEW: 3-column card layout -->\s*<div class="listings-grid-view" id="gridView">).*?(</div>\s*\n\s*<!-- DETAIL VIEW: Full property information -->)',
    re.S,
)
replacement = r'''\1
      <!-- Listing cards are populated automatically from rentals.json -->
    \2'''

updated, count = pattern.subn(replacement, text, count=1)
if count != 1:
    raise SystemExit(f'Expected to replace one listings grid, replaced {count}')

script_tag = '<script src="rentals-loader.js"></script>'
if script_tag not in updated:
    if '</body>' not in updated:
        raise SystemExit('Could not find </body>')
    updated = updated.replace('</body>', f'  {script_tag}\n</body>', 1)

path.write_text(updated, encoding='utf-8')
print('index.html patched successfully')
