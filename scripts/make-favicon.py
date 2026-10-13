"""Favicon and logo (RECETTE §19.1): Union flag bands (civil flag colours, no emblem) and a passport
pictogram, the subject of the site. Writes public/favicon.svg and public/logo.svg; then run
`node scripts/gen-icons.mjs` for the PNG and ICO files."""
import importlib.util, os
here = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('gfi', os.path.join(here, 'gen-flag-icon.py')); g = importlib.util.module_from_spec(spec); spec.loader.exec_module(g)
PASSPORT = ('<rect x="9" y="6" width="14" height="20" rx="2.2" fill="#fff" stroke="#0B1F33" stroke-width="1.6"/>'
            '<circle cx="16" cy="14" r="3.6" fill="none" stroke="#012169" stroke-width="1.4"/>'
            '<path d="M12.4 14h7.2M16 10.4c-1.4 1.6-1.4 5.6 0 7.2M16 10.4c1.4 1.6 1.4 5.6 0 7.2" fill="none" stroke="#012169" stroke-width="1"/>'
            '<rect x="12" y="20.5" width="8" height="1.6" rx=".8" fill="#C8102E"/>')
svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
       '<defs><clipPath id="r"><rect width="32" height="32" rx="7"/></clipPath></defs>'
       f'<g clip-path="url(#r)">{g.bands("gb")}</g>'
       '<rect x="0.5" y="0.5" width="31" height="31" rx="6.5" fill="none" stroke="#0B1F33" stroke-opacity=".25"/>'
       f'{PASSPORT}</svg>')
for f in ('favicon.svg', 'logo.svg'):
    open(os.path.join(here, '..', 'public', f), 'w').write(svg)
print('ok')
