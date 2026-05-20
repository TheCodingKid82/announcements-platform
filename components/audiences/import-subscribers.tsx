"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function ImportSubscribers() {
  const toast = useToast();
  return (
    <Button variant="secondary" onClick={() => toast.push("CSV import started")}>
      <Upload className="h-4 w-4" />
      Import CSV
    </Button>
  );
}
