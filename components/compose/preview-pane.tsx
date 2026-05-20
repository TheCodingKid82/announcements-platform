import type { Channel, ChannelMessage } from "@/lib/data/types";

function labelFor(channel: Channel) {
  if (channel === "sms") return "SMS";
  if (channel === "email") return "Email";
  return "iMessage";
}

export function PreviewPane({ messages, channels }: { messages: Record<Channel, ChannelMessage>; channels: Channel[] }) {
  return (
    <div className="space-y-3">
      {channels.map((channel) => (
        <div key={channel} className="border border-white/10 bg-black/30 p-3">
          <div className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{labelFor(channel)}</div>
          {channel === "email" ? (
            <div className="space-y-2">
              <div className="font-medium text-white">{messages.email.subject || "Subject"}</div>
              {messages.email.preview ? <div className="text-xs text-zinc-500">{messages.email.preview}</div> : null}
              <div className="prose prose-invert prose-sm max-w-none text-zinc-300" dangerouslySetInnerHTML={{ __html: messages.email.html || "<p>Email body appears here.</p>" }} />
            </div>
          ) : (
            <p className="text-sm leading-6 text-zinc-300">{messages[channel].text || `${labelFor(channel)} message appears here.`}</p>
          )}
        </div>
      ))}
    </div>
  );
}
