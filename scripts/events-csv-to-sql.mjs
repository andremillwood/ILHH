import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const inputPath = resolve("content/events/events.csv");
const outputPath = resolve("content/events/generated/events-import.sql");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((items) => items.some((item) => item.trim() !== ""));
}

function sqlValue(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return "NULL";
  return `'${trimmed.replaceAll("'", "''")}'`;
}

function sqlBool(value) {
  return ["1", "true", "yes", "y"].includes(String(value ?? "").trim().toLowerCase())
    ? "TRUE"
    : "FALSE";
}

function parseDjs(value) {
  return String(value ?? "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [name = "", description = "", resident = ""] = entry.split("|").map((part) => part.trim());
      return {
        name,
        description,
        resident: ["1", "true", "yes", "y", "resident"].includes(resident.toLowerCase()),
      };
    })
    .filter((dj) => dj.name);
}

const csv = readFileSync(inputPath, "utf8");
const [headers, ...records] = parseCsv(csv);
const columns = headers.map((header) => header.trim());
const requiredColumns = ["title", "event_date"];
const missingColumns = requiredColumns.filter((column) => !columns.includes(column));

if (missingColumns.length > 0) {
  throw new Error(`Missing required CSV columns: ${missingColumns.join(", ")}`);
}

const statements = [
  "-- Generated from content/events/events.csv",
  "-- Apply this file in the Supabase SQL Editor.",
  "BEGIN;",
  "",
];

records.forEach((record, index) => {
  const row = Object.fromEntries(columns.map((column, columnIndex) => [column, record[columnIndex] ?? ""]));
  const rowNumber = index + 2;
  const title = row.title?.trim();
  const eventDate = row.event_date?.trim();

  if (!title || !eventDate) {
    throw new Error(`Row ${rowNumber} must include title and event_date.`);
  }

  const explicitId = row.id?.trim();
  const eventKey = explicitId ? explicitId : `new_event_${rowNumber}`;
  const djs = parseDjs(row.djs);

  statements.push(`-- Row ${rowNumber}: ${title}`);
  statements.push("DO $$");
  statements.push("DECLARE");
  statements.push("  v_event_id INTEGER;");
  statements.push("BEGIN");

  if (explicitId) {
    statements.push(
      `  INSERT INTO events (id, title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special, updated_at) VALUES (${Number(explicitId)}, ${sqlValue(row.title)}, ${sqlValue(row.description)}, ${sqlValue(row.event_date)}, ${sqlValue(row.event_time)}, ${sqlValue(row.venue_name)}, ${sqlValue(row.venue_address)}, ${sqlValue(row.theme)}, ${sqlValue(row.sub_theme)}, ${sqlValue(row.flyer_url)}, ${sqlBool(row.is_featured)}, ${sqlBool(row.is_special)}, NOW()) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time, venue_name = EXCLUDED.venue_name, venue_address = EXCLUDED.venue_address, theme = EXCLUDED.theme, sub_theme = EXCLUDED.sub_theme, flyer_url = EXCLUDED.flyer_url, is_featured = EXCLUDED.is_featured, is_special = EXCLUDED.is_special, updated_at = NOW() RETURNING id INTO v_event_id;`
    );
  } else {
    statements.push(
      `  INSERT INTO events (title, description, event_date, event_time, venue_name, venue_address, theme, sub_theme, flyer_url, is_featured, is_special) VALUES (${sqlValue(row.title)}, ${sqlValue(row.description)}, ${sqlValue(row.event_date)}, ${sqlValue(row.event_time)}, ${sqlValue(row.venue_name)}, ${sqlValue(row.venue_address)}, ${sqlValue(row.theme)}, ${sqlValue(row.sub_theme)}, ${sqlValue(row.flyer_url)}, ${sqlBool(row.is_featured)}, ${sqlBool(row.is_special)}) RETURNING id INTO v_event_id;`
    );
  }

  statements.push("  DELETE FROM event_djs WHERE event_id = v_event_id;");
  djs.forEach((dj) => {
    statements.push(
      `  INSERT INTO event_djs (event_id, dj_name, dj_description, is_resident) VALUES (v_event_id, ${sqlValue(dj.name)}, ${sqlValue(dj.description)}, ${dj.resident ? "TRUE" : "FALSE"});`
    );
  });
  statements.push("END $$;");
  statements.push("");
});

statements.push("COMMIT;");
statements.push("");

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, statements.join("\n"));

console.log(`Generated ${outputPath}`);
