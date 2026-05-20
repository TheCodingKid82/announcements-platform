"use client";

import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function ScheduleSetup() {
  return (
    <div className="space-y-3">
      <Select defaultValue="morning">
        <option value="morning">Every morning at 9 AM</option>
        <option value="hour">Every hour</option>
        <option value="friday">Every Friday at 5 PM</option>
        <option value="custom">Custom cron</option>
      </Select>
      <Input placeholder="Cron expression" defaultValue="0 9 * * *" />
    </div>
  );
}
