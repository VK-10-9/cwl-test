"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { FormDefinition } from "@/lib/gfe/schema";
import { CalendarIcon, MapPin, Building2, HardHat, FileText, User } from "lucide-react";

interface DynamicFormRendererProps {
  formDef: FormDefinition;
  onSubmit: (data: any) => void;
}

export function DynamicFormRenderer({ formDef, onSubmit }: DynamicFormRendererProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: formDef.fields.reduce((acc, field) => {
      acc[field.key] = "";
      return acc;
    }, {} as Record<string, string>),
  });

  const getFieldIcon = (type: string) => {
    switch (type) {
      case "person_name": return <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />;
      case "address": return <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />;
      case "court_name": return <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />;
      case "date": return <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />;
      default: return <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3" />;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formDef.fields.map((field) => (
          <div key={field.key} className={`${field.type === "textarea" || field.type === "address" ? "col-span-full" : ""}`}>
            <label className="block text-sm font-semibold text-foreground/90 mb-2">
              {field.label} {field.required && <span className="text-emerald-500 ml-1">*</span>}
            </label>
            <div className="relative">
              {getFieldIcon(field.type)}

              {field.type === "textarea" || field.type === "address" ? (
                <textarea
                  {...register(field.key, { required: field.required })}
                  placeholder={field.placeholder}
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border/60 text-foreground placeholder:text-muted-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-sm min-h-[100px]"
                />
              ) : field.type === "date" ? (
                <input
                  type="date"
                  {...register(field.key, { required: field.required })}
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border/60 text-foreground placeholder:text-muted-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-sm"
                />
              ) : (
                <input
                  type="text"
                  {...register(field.key, { required: field.required })}
                  placeholder={field.placeholder}
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border/60 text-foreground placeholder:text-muted-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all shadow-sm"
                />
              )}
            </div>
            {errors[field.key] && (
              <p className="text-emerald-500/80 text-xs mt-2 font-medium flex items-center">
                <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5 flex-shrink-0"></span>
                Required statutory field
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-border/40 flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background border border-emerald-500/20 focus:ring-emerald-500 transition-all"
        >
          Generate Canonical Form
        </button>
      </div>
    </form >
  );
}
