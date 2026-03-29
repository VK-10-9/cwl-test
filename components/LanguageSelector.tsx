"use client";

import React from "react";

const SUPPORTED_LANGUAGES = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी (Hindi)" },
    { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
    { code: "ta", label: "தமிழ் (Tamil)" },
    { code: "te", label: "తెలుగు (Telugu)" },
    { code: "mr", label: "मराठी (Marathi)" },
    { code: "bn", label: "বাংলা (Bengali)" },
    { code: "gu", label: "ગુજરાતી (Gujarati)" },
];

interface LanguageSelectorProps {
    value: string;
    onChange: (val: string) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground mr-2">
                Document Language
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 rounded-md border border-border bg-transparent px-2.5 py-1 text-xs focus:ring-1 focus:ring-foreground outline-none text-foreground w-[130px]"
            >
                {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-background text-foreground">
                        {lang.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
