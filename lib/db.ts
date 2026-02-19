import Database from "better-sqlite3";
import { OrganisationData } from "@/types";

// Initialize SQLite database
const db = new Database("dev.db");

// Enable WAL mode for better concurrency
db.pragma("journal_mode = WAL");

// Initialize schema if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS organisations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    jurisdiction TEXT,
    signatory_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    title TEXT,
    org_a_id INTEGER,
    org_b_id INTEGER,
    blueprint_json TEXT,
    full_text TEXT,
    version INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS iterations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id INTEGER,
    user_message TEXT,
    ai_response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Organisation operations
export function getOrganisations(searchQuery?: string): OrganisationData[] {
    if (searchQuery) {
        const stmt = db.prepare(
            "SELECT * FROM organisations WHERE name LIKE ? ORDER BY name LIMIT 20"
        );
        const rows = stmt.all(`%${searchQuery}%`) as Array<{
            id: number;
            name: string;
            address: string | null;
            jurisdiction: string | null;
            signatory_name: string | null;
        }>;
        return rows.map((row) => ({
            id: String(row.id),
            name: row.name,
            address: row.address || undefined,
            jurisdiction: row.jurisdiction || undefined,
            signatoryName: row.signatory_name || undefined,
        }));
    }

    const stmt = db.prepare("SELECT * FROM organisations ORDER BY name LIMIT 50");
    const rows = stmt.all() as Array<{
        id: number;
        name: string;
        address: string | null;
        jurisdiction: string | null;
        signatory_name: string | null;
    }>;
    return rows.map((row) => ({
        id: String(row.id),
        name: row.name,
        address: row.address || undefined,
        jurisdiction: row.jurisdiction || undefined,
        signatoryName: row.signatory_name || undefined,
    }));
}

export function getOrganisationById(id: string): OrganisationData | null {
    const stmt = db.prepare("SELECT * FROM organisations WHERE id = ?");
    const row = stmt.get(id) as
        | {
              id: number;
              name: string;
              address: string | null;
              jurisdiction: string | null;
              signatory_name: string | null;
          }
        | undefined;

    if (!row) return null;

    return {
        id: String(row.id),
        name: row.name,
        address: row.address || undefined,
        jurisdiction: row.jurisdiction || undefined,
        signatoryName: row.signatory_name || undefined,
    };
}

export function createOrganisation(org: OrganisationData): OrganisationData {
    const stmt = db.prepare(
        "INSERT INTO organisations (name, address, jurisdiction, signatory_name) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(
        org.name,
        org.address || null,
        org.jurisdiction || null,
        org.signatoryName || null
    );

    return {
        id: String(result.lastInsertRowid),
        name: org.name,
        address: org.address,
        jurisdiction: org.jurisdiction,
        signatoryName: org.signatoryName,
    };
}

export function updateOrganisation(
    id: string,
    org: Partial<OrganisationData>
): OrganisationData | null {
    const existing = getOrganisationById(id);
    if (!existing) return null;

    const updates: string[] = [];
    const values: (string | null)[] = [];

    if (org.name !== undefined) {
        updates.push("name = ?");
        values.push(org.name);
    }
    if (org.address !== undefined) {
        updates.push("address = ?");
        values.push(org.address || null);
    }
    if (org.jurisdiction !== undefined) {
        updates.push("jurisdiction = ?");
        values.push(org.jurisdiction || null);
    }
    if (org.signatoryName !== undefined) {
        updates.push("signatory_name = ?");
        values.push(org.signatoryName || null);
    }

    if (updates.length === 0) return existing;

    values.push(id);
    const stmt = db.prepare(
        `UPDATE organisations SET ${updates.join(", ")} WHERE id = ?`
    );
    stmt.run(...values);

    return getOrganisationById(id);
}

export function deleteOrganisation(id: string): boolean {
    const stmt = db.prepare("DELETE FROM organisations WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
}

export default db;
