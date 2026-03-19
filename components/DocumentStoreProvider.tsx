"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { DocumentType, Blueprint } from "@/types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SavedDocument {
  id: string;
  type: DocumentType;
  title: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "completed" | "exported";
  formData: Record<string, string | number | boolean>;
  blueprint: Blueprint | null;
  fullText: string | null;
}

interface DocumentStoreContextType {
  documents: SavedDocument[];
  saveDocument: (doc: Omit<SavedDocument, "id" | "createdAt" | "updatedAt">) => string;
  updateDocument: (id: string, updates: Partial<SavedDocument>) => void;
  deleteDocument: (id: string) => void;
  getDocument: (id: string) => SavedDocument | undefined;
}

const DocumentStoreContext = createContext<DocumentStoreContextType>({
  documents: [],
  saveDocument: () => "",
  updateDocument: () => {},
  deleteDocument: () => {},
  getDocument: () => undefined,
});

export function useDocumentStore() {
  return useContext(DocumentStoreContext);
}

const STORAGE_KEY = "cw_documents";

function generateId(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function DocumentStoreProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDocuments(JSON.parse(stored));
      }
    } catch { /* ignore */ }
  }, []);

  // Persist to localStorage
  const persist = useCallback((docs: SavedDocument[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  }, []);

  const saveDocument = useCallback((doc: Omit<SavedDocument, "id" | "createdAt" | "updatedAt">): string => {
    const id = generateId();
    const now = new Date().toISOString();
    const newDoc: SavedDocument = { ...doc, id, createdAt: now, updatedAt: now };
    setDocuments((prev) => {
      const updated = [newDoc, ...prev];
      persist(updated);
      return updated;
    });
    return id;
  }, [persist]);

  const updateDocument = useCallback((id: string, updates: Partial<SavedDocument>) => {
    setDocuments((prev) => {
      const updated = prev.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
      );
      persist(updated);
      return updated;
    });
  }, [persist]);

  const deleteDocument = useCallback((id: string) => {
    setDocuments((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      persist(updated);
      return updated;
    });
  }, [persist]);

  const getDocument = useCallback((id: string) => {
    return documents.find((d) => d.id === id);
  }, [documents]);

  return (
    <DocumentStoreContext.Provider value={{ documents, saveDocument, updateDocument, deleteDocument, getDocument }}>
      {children}
    </DocumentStoreContext.Provider>
  );
}
