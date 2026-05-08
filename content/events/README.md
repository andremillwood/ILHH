# Event Content Workflow

Use this folder as the working area for event updates before they are pushed into Supabase.

## Folder Structure

- `content/events/events.csv` - spreadsheet-style event details.
- `content/events/events.example.csv` - example row showing the expected format.
- `public/flyers/` - event flyer images that the website can serve directly.
- `public/djs/` - DJ or promoter images that can be referenced from profiles or future event pages.
- `content/events/generated/` - SQL generated from the spreadsheet.

## Updating Events

1. Add flyer graphics to `public/flyers/`.
2. Add DJ images to `public/djs/`.
3. Edit `content/events/events.csv` in Excel, Numbers, Google Sheets, or any spreadsheet app.
4. Keep image paths as website paths, for example `/flyers/dipset_forever.jpg`.
5. Run:

```bash
npm run content:events
```

6. Apply `content/events/generated/events-import.sql` in Supabase SQL Editor.

## CSV Columns

- `id` - optional. Leave blank for a new event. Use an existing event id to update it.
- `title` - required.
- `description` - optional event copy.
- `event_date` - required, `YYYY-MM-DD`.
- `event_time` - optional, for example `9:00 PM - 2:00 AM`.
- `venue_name` - optional.
- `venue_address` - optional.
- `theme` - optional.
- `sub_theme` - optional.
- `flyer_url` - optional, for example `/flyers/my-flyer.jpg`.
- `is_featured` - `true` or `false`.
- `is_special` - `true` or `false`.
- `djs` - optional lineup separated by semicolons. Use `DJ Name|Description|resident` for resident DJs.

Example DJ lineup value:

```csv
DJ Mario|Suncity|resident; DJ Mindless||
```
