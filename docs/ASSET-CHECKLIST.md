# KHAIRAT photography checklist

For whoever arranges the company's photography. The site has no real KHAIRAT photographs yet. Every picture is contextual. Food-industry pictures carry a visible "Illustrative image" label, so none is taken for KHAIRAT's own facility or team.

## Shot list

Each row lists the real photograph needed and what it replaces. Files live in `public/images/`.

| Priority | Photograph needed | Replaces | Used on |
| --- | --- | --- | --- |
| 1 | Facility exterior, with signage if any | Nothing yet (Facility leads with type) | Facility, Home |
| 1 | Cold storage rooms, inside | Drawn illustration (`ColdRoomArt`) | Cold Storage, Services |
| 1 | Storage operations: pallets moving in and out | `warehouse.jpg` | Home, Facility, Storage for Companies |
| 1 | Sorting and preparation, real product on the real line | `sorting-fruit.jpg` | Produce Handling, Food Processing, Services |
| 1 | Packaging and labeling in progress | `packing-hands.jpg` | Food Processing, Quality, Services |
| 1 | Container preparation and loading at the facility | `cranes.jpg` | Container Loading, Services |
| 2 | Finished packs: KHAIRAT brand and a private label example (with permission) | `pomegranates.jpg` | Services |
| 2 | Team and management | Nothing yet | About |
| 2 | Farms and sourcing with real suppliers | `harvest.jpg`, `greens-harvest.jpg` | Product Sourcing, Facility |
| 2 | Fresh product inspection on arrival | `sorting-fruit.jpg` | Quality |
| 3 | Each product, ideally in its real packaging | `mango.jpg`, `strawberries.jpg`, `figs.jpg`, `pomegranates.jpg`, `greens-close.jpg`, `vegetables.jpg` | Products, Home, Export |
| 3 | Shipment leaving, or a real KHAIRAT container | `vessel.jpg`, `port.jpg` | Export, Home |
| 3 | The Beheira landscape | `greens-rows.jpg`, `wheat-sunset.jpg` | Home, About |

## Technical guidance

- Landscape at least 2400 px wide. Keep a portrait version of the key shots for phones.
- Consistent daylight and colour across the set. Natural scenes over posed ones.
- People in correct hygiene wear. Get written consent from anyone identifiable.
- Avoid visible third-party logos and anything that reveals confidential client work.

## How to swap one in

1. **Product photos without a code change:** upload to the Strapi product with the matching name (Mango, Strawberries, Figs, Pomegranates, Leafy Greens, Vegetables). The site uses it automatically.
2. **Any other photo:** add the file to `public/images/`, update its `src` in the `images` list in `lib/content.ts`, and set its `kind` to `"company"`. This removes the "Illustrative image" label.
3. **Cold storage:** replace `ColdRoomArt` with a `Photo` on the cold storage page, the Services page and the home page.
4. **When all contextual images are gone:** remove `footer.photoNote` from the footer, and update `public/images/CREDITS.md`.
