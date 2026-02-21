"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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

/** Decode a JWT payload without a library */
function decodeJwtPayload(token: string): Record<string, string> {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gsiReady, setGsiReady] = useState(false);

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

  // Initialize Google Sign-In once the script loads
  useEffect(() => {
    if (!gsiReady || !GOOGLE_CLIENT_ID) return;

    const google = (window as unknown as { google: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: () => void;
        };
      };
    } }).google;

    if (!google?.accounts?.id) return;

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: { credential: string }) => {
        try {
          const payload = decodeJwtPayload(response.credential);
          const userData: User = {
            name: payload.name || "",
            email: payload.email || "",
            picture: payload.picture || "",
          };
          setUser(userData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        } catch {
          console.error("Failed to decode Google credential");
        }
      },
      auto_select: false,
      itp_support: true,
    });
  }, [gsiReady]);

  const login = useCallback(() => {
    if (!gsiReady || !GOOGLE_CLIENT_ID) return;

    const google = (window as unknown as { google: {
      accounts: {
        id: { prompt: (cb?: (notification: { isNotDisplayed: () => boolean }) => void) => void };
        oauth2: {
          initTokenClient: (config: Record<string, unknown>) => { requestAccessToken: () => void };
        };
      };
    } }).google;

    if (!google?.accounts) return;

    // Try One Tap first; if it can't show, fall back to OAuth popup
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        // Fallback: use OAuth token client (popup)
        const client = google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "openid email profile",
          callback: async (tokenResponse: { access_token: string }) => {
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
            } catch {
              console.error("Failed to fetch Google profile");
            }
          },
        });
        client.requestAccessToken();
      }
    });
  }, [gsiReady]);

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
