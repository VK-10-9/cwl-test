"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

interface User {
  name: string;
  email: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const STORAGE_KEY = "cw_user";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gsiReady, setGsiReady] = useState(false);
  const tokenClientRef = useRef<{ requestAccessToken: () => void } | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch { /* ignore */ }
    setIsLoading(false);
  }, []);

  // Load Google Identity Services script
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    if (document.getElementById("gsi-script")) {
      setGsiReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGsiReady(true);
    document.head.appendChild(script);
  }, []);

  // Initialize OAuth2 token client once GIS script loads
  useEffect(() => {
    if (!gsiReady || !GOOGLE_CLIENT_ID) return;

    const google = (window as unknown as { google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: Record<string, unknown>) => { requestAccessToken: () => void };
        };
      };
    } }).google;

    if (!google?.accounts?.oauth2) return;

    tokenClientRef.current = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      callback: async (tokenResponse: { access_token?: string; error?: string }) => {
        if (tokenResponse.error || !tokenResponse.access_token) {
          console.error("Google OAuth error:", tokenResponse.error);
          return;
        }
        try {
          const res = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
          );
          const profile = await res.json();
          const userData: User = {
            name: profile.name || "",
            email: profile.email || "",
            picture: profile.picture || "",
          };
          setUser(userData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

          // Save email to backend (fire-and-forget)
          fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          }).catch(() => { /* non-blocking */ });
        } catch {
          console.error("Failed to fetch Google profile");
        }
      },
    });
  }, [gsiReady]);

  const login = useCallback(() => {
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken();
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
