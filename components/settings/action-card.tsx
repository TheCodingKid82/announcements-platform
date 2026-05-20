"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function ToastActionButton({ children, message }: { children: React.ReactNode; message: string }) {
  const toast = useToast();
  return <Button onClick={() => toast.push(message)}>{children}</Button>;
}
