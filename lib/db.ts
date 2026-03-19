import { OrganisationData } from "@/types";

/**
 * In-memory organisation store.
 * Replaces better-sqlite3 for serverless compatibility (Vercel, etc.).
 * Data persists for the lifetime of the serverless function instance.
 */

let nextId = 1;
const store = new Map<string, OrganisationData>();

export function getOrganisations(searchQuery?: string): OrganisationData[] {
  const all = Array.from(store.values());
  if (!searchQuery) return all.slice(0, 50);

  const q = searchQuery.toLowerCase();
  return all
    .filter((org) => org.name.toLowerCase().includes(q))
    .slice(0, 20);
}

export function getOrganisationById(id: string): OrganisationData | null {
  return store.get(id) ?? null;
}

export function createOrganisation(org: OrganisationData): OrganisationData {
  const id = String(nextId++);
  const created: OrganisationData = {
    id,
    name: org.name,
    address: org.address,
    jurisdiction: org.jurisdiction,
    signatoryName: org.signatoryName,
  };
  store.set(id, created);
  return created;
}

export function updateOrganisation(
  id: string,
  org: Partial<OrganisationData>
): OrganisationData | null {
  const existing = store.get(id);
  if (!existing) return null;

  const updated: OrganisationData = {
    ...existing,
    ...(org.name !== undefined && { name: org.name }),
    ...(org.address !== undefined && { address: org.address }),
    ...(org.jurisdiction !== undefined && { jurisdiction: org.jurisdiction }),
    ...(org.signatoryName !== undefined && {
      signatoryName: org.signatoryName,
    }),
  };
  store.set(id, updated);
  return updated;
}

export function deleteOrganisation(id: string): boolean {
  return store.delete(id);
}
