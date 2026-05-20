"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export function SubscribeLinkGenerator({ listId }: { listId: string }) {
  const toast = useToast();
  const link = `https://announcementsapp.com/subscribe/${listId}`;
  return (
    <div className="space-y-3">
      <Input readOnly value={link} />
      <Button variant="secondary" onClick={() => toast.push("Subscribe link copied")}>
        <Copy className="h-4 w-4" />
        Copy link
      </Button>
    </div>
  );
}
