"use client";

import { createContext, useContext, useMemo, useState } from "react";

type Toast = { id: number; message: string; kind: "success" | "error" };
const ToastContext = createContext<{ push: (message: string, kind?: Toast["kind"]) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const value = useMemo(() => ({
    push: (message: string, kind: Toast["kind"] = "success") => {
      const id = Date.now();
      setToasts((items) => [...items, { id, message, kind }]);
      setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3000);
    }
  }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div key={toast.id} className={toast.kind === "error" ? "rounded-md border border-red-500/30 bg-red-950 px-4 py-3 text-sm text-red-100" : "rounded-md border border-blue-400/30 bg-blue-950 px-4 py-3 text-sm text-blue-100"}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
