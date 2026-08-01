# Merch Mockup Drop Zone

Add one folder per product here. The folder name becomes the product slug unless `product.json` sets an `id`.

Example:

```text
public/merch/mockups/kingston-boombap-tee/
  front.png
  back.png
  product.json
```

Supported image names:

- `front.png`, `front.jpg`, `front.jpeg`, `front.webp`
- `back.png`, `back.jpg`, `back.jpeg`, `back.webp`

Optional `product.json`:

```json
{
  "id": "kingston-boombap-tee",
  "name": "Kingston Boom Bap Tee",
  "description": "Official I Luv Hip Hop tee.",
  "story": "Built for Kingston nights, sound system pressure, and hip hop culture.",
  "badge": "New Drop",
  "price": 35,
  "category": "tops",
  "categoryLabel": "T-Shirts",
  "colors": ["Black"],
  "sizes": ["S", "M", "L", "XL", "XXL"],
  "isActive": true
}
```

Then run:

```bash
npm run merch:mockups
```

This generates:

```text
content/merch/generated/mockup-products.sql
```

Apply that SQL in Supabase, or run:

```bash
npm run merch:mockups:apply
```

The default listing price is `$35`. You can change it later in Admin > Storefront.
