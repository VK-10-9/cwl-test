"use client";

import { useAuth } from "@/components/AuthProvider";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { LogOut, User, LayoutDashboard } from "lucide-react";

export default function UserMenu() {
  const { user, isLoading, login, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!user) {
    return (
      <button
        onClick={() => login()}
        className="px-4 py-2 rounded-full bg-foreground text-background font-medium text-[13px] hover:bg-foreground/85 transition-all duration-200 shadow-sm cursor-pointer"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 backdrop-blur-xl px-1.5 py-1 hover:border-foreground/15 transition-all duration-200 cursor-pointer shadow-sm"
      >
        {user.picture ? (
          <Image
            src={user.picture}
            alt={user.name || "User"}
            width={28}
            height={28}
            className="rounded-full"
            unoptimized
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-foreground/60" />
          </div>
        )}
        <span className="text-[13px] font-medium text-foreground pr-2 hidden sm:block max-w-[120px] truncate">
          {user.name?.split(" ")[0] || "Account"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-background shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[13px] font-medium text-foreground truncate">
              {user.name}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          <div className="p-1.5">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
