"""Reproduce Draft 0.3 from the preserved published Draft 0.2 and current data.

Requires PyMuPDF. Keeps original page layout and source links; revised text uses standard PDF fonts.
"""
import json
import subprocess
from pathlib import Path
import pymupdf as fitz

root = Path(__file__).resolve().parents[2]
data = json.loads((root / 'site/newyork/data.json').read_text())
source = subprocess.check_output(['git', 'show', '6e9611b:site/newyork/atlas.pdf'], cwd=root)
doc = fitz.open(stream=source, filetype='pdf')
paper = (247/255, 243/255, 235/255)

def color(value):
    return ((value >> 16)/255, ((value >> 8) & 255)/255, (value & 255)/255)

def replace(page, rect, text, size=9.4, font='DejaVuSans', ink=3157289):
    rect = fitz.Rect(rect)
    page.add_redact_annot(rect, fill=paper)
    page.apply_redactions(images=0, graphics=0)
    name = {'DejaVuSans':'helv', 'DejaVuSans-Bold':'hebo', 'DejaVuSerif':'tiro'}[font]
    spare = page.insert_textbox(rect, text, fontname=name, fontsize=size,
                                color=color(ink), lineheight=1.42)
    assert spare >= 0, (page.number + 1, text, spare)

replace(doc[0], (43,650,569,697),
        'Addresses checked against public sources. This revised draft supplies routes and linked directions. '
        'The web edition has 40 address/building pins; these are not surveyed entrances. '
        'Appointment-only makers and branch uncertainties remain identified.', 9, ink=7630437)

# Keep the three destination cards synchronized with the web edition.
for page_index, stop_id in [(11,20),(12,23),(13,26)]:
    stop = next(s for s in data['stops'] if s['id'] == stop_id)
    replace(doc[page_index], (43,383,569,426), 'Focus: ' + stop['focus'] + '. ' + stop['note'])
carmina = next(s for s in data['stops'] if s['id'] == 23)
replace(doc[12], (43,366,569,382), carmina['address'] + " | Benchmade & Buyer's", 8.2,
        'DejaVuSans-Bold', 7630437)
# Expand the visit block into the unused space below its original link line.
replace(doc[12], (43,431,569,477), 'Visit: ' + carmina['visit'], 8.2, ink=7630437)
doc[12].insert_link({'kind':fitz.LINK_URI, 'from':fitz.Rect(43,471,569,484),
                    'uri':carmina['sources'][0]})
doc[12].insert_text((43,481), 'Official store details and hours', fontsize=7.6,
                   fontname='helv', color=color(7617600))

# Replace the removed watchlist with the retained address lead.
replace(doc[19], (43,76,569,92), 'ADDITIONAL CARE LEAD', 8, 'DejaVuSans-Bold', 7617600)
replace(doc[19], (43,100,569,151), 'Beyond the circuits.', 29, 'DejaVuSerif')
replace(doc[19], (43,155,569,183), 'One additional care lead, separate from the numbered destinations and map pins.', 10, ink=7630437)
replace(doc[19], (43,184,569,550), "Jim's Shoe Repair / 60 East 59th Street\n\n" + data['watchlist'][0]['note'], 11)
doc[19].insert_text((43,293), 'Official website', fontsize=9, fontname='helv', color=color(7617600))
doc[19].insert_link({'kind':fitz.LINK_URI, 'from':fitz.Rect(43,281,160,299), 'uri':data['watchlist'][0]['url']})

replace(doc[21], (43,148,569,183), 'Research: 12 October 2026; address and editorial corrections: 13 October 2026. No calls, bookings or visits were made.', 10, ink=7630437)
replace(doc[21], (43,311,569,374), "Atelier's branch allocation; Blundstone seasonal operation; current appointment access at workshops; and location-specific stock remain provisional. DSM and Nepenthes have conflicting or retained hours notices. Carmina's official page lists Monday-Saturday hours but does not publish Sunday hours.", 10)
replace(doc[21], (43,518,569,565), "This is the researched, portable draft of a second city edition. It retains the Shanghai guide's four-register logic, warm-paper palette and collector's perspective. Four NYC circuits include Brooklyn's separate craft clusters.", 10)
replace(doc[21], (43,614,569,668), 'The web edition has 41 destinations and 40 address/building pins, matched to NYC Planning records. No surveyed entrances or route distances are claimed. STIEFELwerk has no public street pin. The PDF supplies linked address searches; use the web atlas for its interactive map.', 10)

# American spelling in the portable edition, retaining official names and source URLs.
replace(doc[2], (43,100,569,148), 'The discoveries to prioritize.', 28, 'DejaVuSerif')
for page_index, stop_id, top in [(7,7,216),(7,9,550),(9,14,383),(10,17,383),(16,35,383)]:
    stop = next(s for s in data['stops'] if s['id'] == stop_id)
    replace(doc[page_index], (43,top,569,top+44), 'Focus: ' + stop['focus'] + '. ' + stop['note'])

# Revision labels and dates, preserving each original span's position.
for page in doc:
    spans = [s for b in page.get_text('dict')['blocks'] if 'lines' in b
             for line in b['lines'] for s in line['spans']]
    for span in spans:
        text = span['text'].replace('DRAFT 0.2', 'DRAFT 0.3').replace('12 OCT', '13 OCT')
        if text != span['text']:
            rect = fitz.Rect(span['bbox']); rect.y0 -= 1; rect.y1 += 7
            replace(page, rect, text, span['size'], span['font'], span['color'])

# Paint revision furniture last so later content redactions cannot mask it.
for page in doc:
    page.draw_rect(fitz.Rect(305,23,570,42), color=None, fill=paper)
    page.insert_text((330,34), 'FIELD GUIDE 02 / NEW YORK / DRAFT 0.3', fontname='helv', fontsize=7, color=color(7630437))
    page.draw_rect(fitz.Rect(470,761,570,781), color=None, fill=paper)
    page.insert_text((478,771), f'13 OCT 2026   /   {page.number+1:02d}', fontname='helv', fontsize=7, color=color(7630437))

output = root / 'site/newyork/atlas.pdf'
doc.set_metadata({**doc.metadata, 'title':'Study in Shell - NYC Shoe Atlas - Draft 0.3', 'subject':'Revised 13 October 2026'})
doc.save(output, garbage=4, deflate=True)
check = fitz.open(output)
text = '\n'.join(p.get_text() for p in check)
assert all(term.lower() not in text.lower() for term in ['Barneys','FitzPatrick','FEIT','DRAFT 0.2'])
assert '60 East 59th Street' in text and '+1 212-687-0222' in text
assert len(check) == 22
print('Verified Draft 0.3: 22 pages; corrected addresses; removed names absent.')
