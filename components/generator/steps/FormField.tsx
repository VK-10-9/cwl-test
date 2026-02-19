import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Info, CalendarIcon } from "lucide-react";
import { FormFieldDefinition } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormValues = Record<string, any>;

interface FormFieldProps {
    field: FormFieldDefinition;
    register: UseFormRegister<FormValues>;
    control: Control<FormValues>;
    errors: FieldErrors;
    prefix?: string;
}

export function FormField({ field, register, control, errors, prefix = "" }: FormFieldProps) {
    const fieldName = prefix ? `${prefix}_${field.name}` : field.name;
    const isRequired = field.required !== false;
    const error = errors[fieldName];

    return (
        <div className="space-y-2 group">
            <Label htmlFor={fieldName} className={cn("flex items-center gap-2 text-sm font-medium transition-colors", error ? "text-destructive" : "text-foreground/90")}>
                {field.label}
                {isRequired && <span className="text-destructive text-lg leading-none">*</span>}
                {field.description && !['checkbox'].includes(field.type) && (
                    <Info className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                )}
            </Label>

            {field.description && !['checkbox'].includes(field.type) && (
                <div className="text-xs text-muted-foreground/80 bg-muted/30 p-2.5 rounded-md border border-border/40 flex gap-2">
                    {field.description}
                </div>
            )}

            {field.type === 'select' ? (
                <Controller
                    control={control}
                    name={fieldName}
                    rules={{ required: isRequired }}
                    render={({ field: { onChange, value } }) => (
                        <Select onValueChange={onChange} value={value || ""}>
                            <SelectTrigger className={cn("w-full bg-background/50", error && "border-destructive ring-destructive")}>
                                <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            ) : field.type === 'textarea' ? (
                <textarea
                    id={fieldName}
                    {...register(fieldName, { required: isRequired })}
                    placeholder={field.placeholder}
                    className={cn(
                        "flex min-h-[80px] w-full rounded-md border bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        error ? "border-destructive focus-visible:ring-destructive" : "border-input"
                    )}
                />
            ) : field.type === 'checkbox' ? (
                <Controller
                    control={control}
                    name={fieldName}
                    defaultValue={false}
                    render={({ field: { onChange, value } }) => (
                        <div className={cn(
                            "flex flex-row items-start space-x-3 space-y-0 rounded-md border bg-background/50 p-4 shadow-sm transition-all hover:bg-background/80 hover:border-primary/30",
                            error ? "border-destructive" : "border-input"
                        )}>
                            <input
                                id={fieldName}
                                type="checkbox"
                                checked={!!value}
                                onChange={onChange}
                                className="h-4 w-4 mt-1 rounded border-primary text-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                            <div className="space-y-1 leading-none">
                                <Label htmlFor={fieldName} className="font-medium cursor-pointer">
                                    {field.label}
                                </Label>
                                {field.description && (
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        {field.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                />

            ) : field.type === 'date' ? (
                <Controller
                    control={control}
                    name={fieldName}
                    rules={{ required: isRequired }}
                    render={({ field: { value, onChange } }) => (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal bg-background/50",
                                        !value && "text-muted-foreground",
                                        error && "border-destructive"
                                    )}
                                >
                                    {value ? (
                                        // Handle both Date objects and string dates if pre-filled
                                        format(new Date(value), "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={value ? new Date(value) : undefined}
                                    onSelect={(date) => onChange(date ? date.toISOString().split('T')[0] : '')}
                                    disabled={(date) =>
                                        date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                />
            ) : (
                <Input
                    id={fieldName}
                    {...register(fieldName, { required: isRequired })}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    className={cn("bg-background/50", error && "border-destructive focus-visible:ring-destructive")}
                />
            )}
            {error && <span className="text-destructive text-xs block mt-1">{String(error.message || "Required")}</span>}
        </div>
    );
}
