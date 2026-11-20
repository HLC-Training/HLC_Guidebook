# 2026-11-20: Campus map becomes a 3D model driven by data.json

Status: active

## Decision

The guidebook campus map is a Three.js 3D site model (`campus-map-3d.js`). All of its geometry lives in `data.json` under `guidebook.campusMap`:

- `geometry`: site boundary, Wallisville Rd, gates, parking lots, pond, roadway, smoking area, and the first-day drive and walk routes
- `buildings[]`: footprint (`fp`), height (`h`), entrance and exit points, training `zones`, and `bays`, alongside the existing floor and room lists
- `musterPoints[]`: position (`xy`) and the buildings each one `serves`

`campus-map-module.html` (the hand-drawn SVG) is retired. `app.js` loads `campus-map-3d.js` and hands it `campusMap`. Content changes, including map changes, stay data.json-only.

## Why

- The old SVG wasn't to scale, put parking in the wrong places, and its toggle script never ran, because it was injected with `innerHTML`.
- Keeping the geometry in data.json keeps the settled rule that content updates touch data.json only.
- Three.js r128 is vendored in `/vendor` (MIT, license file included) so the map works on networks that block CDNs.

## Where the geometry came from

The layout was traced from the "General Layout and Muster Points" map in Houston Learning Center Guidebook V6. The tracing ran on HEPH, and only coordinates left the machine. The scale is approximate because the source map has no scale bar. Jim corrected the muster point positions, gates, first-day route and parking. He drew the bays and training zones himself in the prototype's mark-up mode (artifact "HLC Campus 3D").

Coordinates are in metres: x runs east, y runs north, and the origin is the south-west of the site.

## Rules that came with it

- Public page, exterior only. There are no interior floor plans, and zones are block-level rectangles.
- Gates are one way: enter by the west gate, leave by the east gate.
- Evacuation: Building 1 goes to MP1, Building 2 to MP2, and Building 3 and the Warehouse to MP3.
- If WebGL isn't available, the map falls back to a text list of muster points and key facts.

## To change the map later

Edit the numbers in data.json. To redraw zones, use the artifact's mark-up mode, paste the JSON to Sam, and Sam updates data.json.
