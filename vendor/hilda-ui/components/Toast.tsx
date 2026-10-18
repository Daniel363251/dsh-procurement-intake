"use client";

import { useEffect } from "react";
import { Button } from "./Button";

export interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: "success" | "info" | "warning" | "danger";
  duration?: number;
}

export function Toast({ open, onOpenChange, title, description, variant = "success", duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!open || duration <= 0) return;
    const timer = window.setTimeout(() => onOpenChange(false), duration);
    return () => window.clearTimeout(timer);
  }, [duration, onOpenChange, open]);
  if (!open) return null;
  return <div className="cn-toast" data-variant={variant} role={variant === "danger" ? "alert" : "status"} aria-live={variant === "danger" ? "assertive" : "polite"}>
    <span className="cn-toast-mark" aria-hidden="true">{variant === "success" ? "✓" : variant === "danger" ? "!" : "i"}</span>
    <div className="cn-toast-copy"><strong>{title}</strong>{description ? <p>{description}</p> : null}</div>
    <Button variant="ghost" size="icon" aria-label="关闭提示" onClick={() => onOpenChange(false)}>×</Button>
  </div>;
}
