"use client";

import { Bold, Italic, LinkIcon, List, Mail, MessageSquare, Send, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { AudiencePicker } from "./audience-picker";
import { ChannelSelector } from "./channel-selector";
import { PreviewPane } from "./preview-pane";
import { SchedulePicker } from "./schedule-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";
import type { Channel, ChannelMessage, ListRecord } from "@/lib/data/types";

const channelMeta: Record<Channel, { label: string; Icon: LucideIcon; limit?: number }> = {
  sms: { label: "SMS", Icon: Smartphone, limit: 320 },
  imessage: { label: "iMessage", Icon: MessageSquare, limit: 1000 },
  email: { label: "Email", Icon: Mail }
};

function emptyMessages(): Record<Channel, ChannelMessage> {
  return {
    sms: { text: "" },
    imessage: { text: "" },
    email: { subject: "", preview: "", text: "", html: "" }
  };
}

export function Composer({ lists: availableLists }: { lists: ListRecord[] }) {
  const router = useRouter();
  const toast = useToast();
  const [messages, setMessages] = useState<Record<Channel, ChannelMessage>>(emptyMessages);
  const [activeChannel, setActiveChannel] = useState<Channel>("sms");
  const [channels, setChannels] = useState<Channel[]>(["sms", "email"]);
  const [lists, setLists] = useState<string[]>(availableLists[0] ? [availableLists[0].id] : []);
  const [scheduleMode, setScheduleMode] = useState("now");
  const [scheduledFor, setScheduledFor] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [sending, setSending] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false }), Image],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor: instance }) => {
      const html = instance.getHTML();
      const text = instance.getText();
      setMessages((current) => ({
        ...current,
        email: { ...current.email, html, text }
      }));
    }
  });

  const selectedMessages = useMemo(() => {
    return channels.reduce<Partial<Record<Channel, ChannelMessage>>>((acc, channel) => {
      acc[channel] = messages[channel];
      return acc;
    }, {});
  }, [channels, messages]);

  const missingContent = channels.some((channel) => !messages[channel].text.trim());

  function setChannel(channel: Channel, patch: Partial<ChannelMessage>) {
    setMessages((current) => ({
      ...current,
      [channel]: { ...current[channel], ...patch }
    }));
  }

  function updateChannels(next: Channel[]) {
    setChannels(next);
    if (!next.includes(activeChannel)) setActiveChannel(next[0] ?? "sms");
  }

  function copySmsToImessage() {
    setChannel("imessage", { text: messages.sms.text });
    toast.push("iMessage copy updated");
  }

  function copySmsToEmail() {
    const text = messages.sms.text;
    setChannel("email", { text, html: `<p>${text}</p>` });
    editor?.commands.setContent(`<p>${text}</p>`);
    toast.push("Email body updated");
  }

  async function send() {
    setSending(true);
    const firstChannel = channels[0] ?? "sms";
    const response = await fetch("/api/internal/announcements", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: messages.email.subject || messages[firstChannel].text.slice(0, 60),
        contentText: messages[firstChannel].text,
        contentHtml: messages.email.html,
        channelMessages: selectedMessages,
        channels,
        listIds: lists,
        scheduledFor: scheduleMode === "later" && scheduledFor ? new Date(scheduledFor).toISOString() : null
      })
    });
    setSending(false);
    if (!response.ok) {
      toast.push("Announcement was not saved", "error");
      return;
    }
    const payload = await response.json() as { data: { announcement: { id: string } } };
    setConfirm(false);
    toast.push(scheduleMode === "now" ? "Announcement queued" : "Announcement scheduled");
    router.push(`/dashboard/announcements/${payload.data.announcement.id}`);
  }

  const activeMeta = channelMeta[activeChannel];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
      <div className="space-y-4">
        <Card>
          <div className="mb-5 flex flex-wrap gap-2 border-b border-white/10 pb-4">
            {channels.map((channel) => {
              const { Icon, label } = channelMeta[channel];
              const active = activeChannel === channel;
              return (
                <button
                  key={channel}
                  type="button"
                  onClick={() => setActiveChannel(channel)}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 border px-3 text-sm transition",
                    active ? "border-(--color-red) bg-(--color-red-soft) text-white" : "border-white/10 text-zinc-400 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </div>

          {activeChannel === "email" ? (
            <div className="space-y-4">
              <Input
                value={messages.email.subject ?? ""}
                onChange={(event) => setChannel("email", { subject: event.target.value })}
                placeholder="Email subject"
              />
              <Input
                value={messages.email.preview ?? ""}
                onChange={(event) => setChannel("email", { preview: event.target.value })}
                placeholder="Preview text"
              />
              <div className="flex gap-2 border-b border-white/10 pb-4">
                {[
                  { icon: Bold, label: "Bold", action: () => editor?.chain().focus().toggleBold().run() },
                  { icon: Italic, label: "Italic", action: () => editor?.chain().focus().toggleItalic().run() },
                  { icon: LinkIcon, label: "Link", action: () => editor?.chain().focus().setLink({ href: "https://announcementsapp.com" }).run() },
                  { icon: List, label: "List", action: () => editor?.chain().focus().toggleBulletList().run() }
                ].map(({ icon: Icon, label, action }) => (
                  <Tooltip key={label} label={label}>
                    <button className="grid h-9 w-9 place-items-center border border-white/10 text-zinc-400 hover:text-white" type="button" onClick={action}>
                      <Icon className="h-4 w-4" />
                    </button>
                  </Tooltip>
                ))}
                <Button type="button" variant="secondary" size="sm" className="ml-auto" onClick={copySmsToEmail}>
                  Use SMS body
                </Button>
              </div>
              <EditorContent editor={editor} className="min-h-[360px] text-lg leading-8 text-white outline-none [&_.ProseMirror]:min-h-[360px] [&_.ProseMirror]:outline-none [&_a]:text-blue-300 [&_ul]:list-disc [&_ul]:pl-6" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">{activeMeta.label} message</h2>
                  <p className="mt-1 text-sm text-zinc-500">{messages[activeChannel].text.length} characters</p>
                </div>
                {activeChannel === "imessage" ? (
                  <Button type="button" variant="secondary" size="sm" onClick={copySmsToImessage}>
                    Use SMS copy
                  </Button>
                ) : null}
              </div>
              <Textarea
                value={messages[activeChannel].text}
                onChange={(event) => setChannel(activeChannel, { text: event.target.value })}
                maxLength={activeMeta.limit}
                placeholder={activeChannel === "sms" ? "Short urgent text" : "Conversational message"}
                className="min-h-[360px] text-lg leading-8"
              />
            </div>
          )}
        </Card>
      </div>

      <aside className="space-y-4">
        <Card>
          <h2 className="mb-3 font-semibold text-white">Audience</h2>
          <AudiencePicker lists={availableLists} selected={lists} setSelected={setLists} />
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold text-white">Channels</h2>
          <ChannelSelector channels={channels} setChannels={updateChannels} />
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold text-white">Schedule</h2>
          <SchedulePicker mode={scheduleMode} setMode={setScheduleMode} scheduledFor={scheduledFor} setScheduledFor={setScheduledFor} />
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold text-white">Preview</h2>
          <PreviewPane messages={messages} channels={channels} />
        </Card>
        <Button className="w-full" onClick={() => setConfirm(true)} disabled={channels.length === 0 || lists.length === 0 || missingContent}>
          <Send className="h-4 w-4" />
          {scheduleMode === "now" ? "Send Announcement" : "Schedule"}
        </Button>
      </aside>

      <Modal open={confirm} title="Confirm announcement" onClose={() => setConfirm(false)}>
        <p className="text-sm leading-6 text-zinc-400">This will send {channels.length} channel versions to {lists.length} audience list.</p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirm(false)}>Cancel</Button>
          <Button onClick={send} disabled={sending || missingContent || lists.length === 0 || channels.length === 0}>{sending ? "Saving" : "Confirm"}</Button>
        </div>
      </Modal>
    </div>
  );
}
