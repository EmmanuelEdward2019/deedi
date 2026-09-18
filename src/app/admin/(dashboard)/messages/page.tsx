import Link from "next/link";
import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusBadge, cx } from "@/components/ui";
import { Mail, Phone, WhatsApp } from "@/components/icons";
import { deleteMessageAction, saveMessageNoteAction, updateMessageAction } from "@/lib/actions";
import { getMessages } from "@/lib/queries";
import { currentRole } from "@/lib/auth";
import { formatDate, formatRelative } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Enquiries" };
export const dynamic = "force-dynamic";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Read", value: "read" },
  { label: "Replied", value: "replied" },
  { label: "Archived", value: "archived" },
];

const ENQUIRY_LABELS: Record<string, string> = {
  property: "Property",
  management: "Management",
  investment: "Investment",
  art: "Art",
  interiors: "Interiors",
  general: "General",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const status = (Array.isArray(params.status) ? params.status[0] : params.status) ?? "all";

  const [messages, all, role] = await Promise.all([
    getMessages(status),
    getMessages("all"),
    currentRole(),
  ]);
  const canDelete = role === "owner";
  const unread = all.filter((message) => message.status === "new").length;

  return (
    <>
      <AdminHeader
        title="Enquiries"
        subtitle={
          unread > 0
            ? `${unread} unread of ${all.length} total`
            : `${all.length} total — nothing unread`
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-1 border-b border-sand-200">
        {FILTERS.map((filter) => {
          const count =
            filter.value === "all"
              ? all.length
              : all.filter((message) => message.status === filter.value).length;
          const active = status === filter.value;

          return (
            <Link
              key={filter.value}
              href={`/admin/messages?status=${filter.value}`}
              className={cx(
                "-mb-px border-b-2 px-4 py-2.5 text-[0.75rem] font-semibold tracking-[0.1em] uppercase transition-colors",
                active
                  ? "border-gold-500 text-navy-900"
                  : "border-transparent text-slate-500 hover:text-navy-900",
              )}
            >
              {filter.label}
              <span className={cx("ml-2", active ? "text-gold-600" : "text-slate-400")}>{count}</span>
            </Link>
          );
        })}
      </div>

      {messages.length === 0 ? (
        <div className="border border-dashed border-sand-200 bg-white px-6 py-20 text-center">
          <h2 className="font-display text-xl text-navy-900">
            {status === "all" ? "No enquiries yet" : `Nothing marked "${status}"`}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
            Messages sent through the contact form and listing enquiry forms arrive here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <article
              key={message.id}
              id={`message-${message.id}`}
              className={cx(
                "scroll-mt-24 border bg-white",
                message.status === "new" ? "border-gold-400" : "border-sand-200",
              )}
            >
              <header className="flex flex-wrap items-start justify-between gap-4 border-b border-sand-200 bg-sand-50 px-5 py-4">
                <div className="flex items-start gap-3.5">
                  <span className="flex size-10 shrink-0 items-center justify-center bg-royal-700 text-xs font-bold text-white">
                    {message.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>

                  <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h2 className="text-sm font-semibold text-navy-900">{message.name}</h2>
                      <StatusBadge status={message.status} />
                      <span className="border border-sand-200 bg-white px-2 py-0.5 text-[0.625rem] tracking-wide text-slate-500 uppercase">
                        {ENQUIRY_LABELS[message.enquiry_type] ?? message.enquiry_type}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(message.created_at)} · {formatRelative(message.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {FILTERS.filter((filter) => filter.value !== "all" && filter.value !== message.status).map(
                    (filter) => (
                      <form key={filter.value} action={updateMessageAction}>
                        <input type="hidden" name="id" value={message.id} />
                        <input type="hidden" name="status" value={filter.value} />
                        <button
                          type="submit"
                          className="border border-sand-200 bg-white px-3 py-1.5 text-[0.6875rem] font-semibold text-slate-600 transition-colors hover:border-gold-400 hover:text-gold-600"
                        >
                          Mark {filter.label.toLowerCase()}
                        </button>
                      </form>
                    ),
                  )}
                  {canDelete && (
                    <form action={deleteMessageAction}>
                      <input type="hidden" name="id" value={message.id} />
                      <DeleteButton label="" confirmLabel="Sure?" compact />
                    </form>
                  )}
                </div>
              </header>

              <div className="grid gap-6 p-5 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <p className="text-sm font-semibold text-navy-900">{message.subject}</p>
                  <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
                    {message.message}
                  </p>

                  {message.source_page ? (
                    <p className="mt-4 text-xs text-slate-400">
                      Sent from{" "}
                      <Link
                        href={message.source_page}
                        target="_blank"
                        className="text-royal-700 underline underline-offset-2"
                      >
                        {message.source_page}
                      </Link>
                    </p>
                  ) : null}

                  <form action={saveMessageNoteAction} className="mt-5">
                    <input type="hidden" name="id" value={message.id} />
                    <label
                      htmlFor={`note-${message.id}`}
                      className="mb-1.5 block text-[0.6875rem] font-semibold tracking-[0.14em] text-slate-500 uppercase"
                    >
                      Internal note
                    </label>
                    <div className="flex gap-2">
                      <input
                        id={`note-${message.id}`}
                        name="admin_note"
                        defaultValue={message.admin_note ?? ""}
                        placeholder="Called back 14:20, viewing booked Saturday…"
                        className="flex-1 border border-sand-200 px-3.5 py-2.5 text-sm text-navy-900 focus:border-gold-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="shrink-0 border border-sand-200 px-4 text-[0.8125rem] font-semibold text-navy-800 transition-colors hover:border-gold-400 hover:text-gold-600"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>

                {/* Contact actions */}
                <div className="space-y-2 border-sand-200 lg:border-l lg:pl-6">
                  <a
                    href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                    className="flex items-center gap-2.5 border border-sand-200 px-4 py-2.5 text-[0.8125rem] text-navy-800 transition-colors hover:border-gold-400 hover:text-gold-600"
                  >
                    <Mail className="size-4 shrink-0 text-gold-500" />
                    <span className="truncate">{message.email}</span>
                  </a>

                  {message.phone ? (
                    <>
                      <a
                        href={`tel:${message.phone.replace(/\s/g, "")}`}
                        className="flex items-center gap-2.5 border border-sand-200 px-4 py-2.5 text-[0.8125rem] text-navy-800 transition-colors hover:border-gold-400 hover:text-gold-600"
                      >
                        <Phone className="size-4 shrink-0 text-gold-500" />
                        {message.phone}
                      </a>
                      <a
                        href={`https://wa.me/${message.phone.replace(/\D/g, "").replace(/^0/, "44")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 border border-sand-200 px-4 py-2.5 text-[0.8125rem] text-navy-800 transition-colors hover:border-[#25D366] hover:text-[#1eb855]"
                      >
                        <WhatsApp className="size-4 shrink-0 text-[#25D366]" />
                        WhatsApp reply
                      </a>
                    </>
                  ) : null}

                  {message.related_ref ? (
                    <Link
                      href={
                        message.enquiry_type === "art"
                          ? `/art/${message.related_ref}`
                          : `/properties/${message.related_ref}`
                      }
                      target="_blank"
                      className="block border border-sand-200 px-4 py-2.5 text-[0.8125rem] text-navy-800 transition-colors hover:border-gold-400 hover:text-gold-600"
                    >
                      <span className="block text-[0.625rem] tracking-[0.12em] text-slate-400 uppercase">
                        About
                      </span>
                      <span className="truncate">{message.related_ref}</span>
                    </Link>
                  ) : null}

                  <p className="pt-2 text-[0.6875rem] leading-relaxed text-slate-400">
                    Replies go from your own mail client. Office line: {site.contact.phone}.
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
