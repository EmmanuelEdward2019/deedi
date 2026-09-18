"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { useCallback, useEffect, useRef, useState } from "react";
import { ACCEPTED_IMAGE_TYPES, useUpload } from "@/components/admin/use-upload";
import { cx } from "@/components/ui";

/* ------------------------------------------------------------------ */
/* toolbar chrome                                                      */
/* ------------------------------------------------------------------ */

function ToolButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={cx(
        "flex size-8 items-center justify-center border text-[0.8125rem] transition-colors disabled:cursor-not-allowed disabled:opacity-35",
        active
          ? "border-royal-700 bg-royal-700 text-white"
          : "border-transparent text-navy-700 hover:border-sand-200 hover:bg-white",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-6 w-px bg-sand-200" />;
}

/* Small inline glyphs, so the toolbar reads like the classic WP one. */
const Glyph = {
  Bold: () => <span className="font-bold">B</span>,
  Italic: () => <span className="font-serif italic">I</span>,
  Underline: () => <span className="underline underline-offset-2">U</span>,
  Strike: () => <span className="line-through">S</span>,
  Bullet: () => (
    <svg viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden>
      <circle cx="3" cy="5" r="1.4" /><circle cx="3" cy="10" r="1.4" /><circle cx="3" cy="15" r="1.4" />
      <rect x="7" y="4.2" width="11" height="1.6" /><rect x="7" y="9.2" width="11" height="1.6" /><rect x="7" y="14.2" width="11" height="1.6" />
    </svg>
  ),
  Ordered: () => (
    <svg viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden>
      <text x="0" y="7" fontSize="6.5">1</text><text x="0" y="13" fontSize="6.5">2</text><text x="0" y="19" fontSize="6.5">3</text>
      <rect x="7" y="3.4" width="11" height="1.6" /><rect x="7" y="9.2" width="11" height="1.6" /><rect x="7" y="15" width="11" height="1.6" />
    </svg>
  ),
  Quote: () => <span className="font-serif text-lg leading-none">&ldquo;</span>,
  AlignLeft: () => (
    <svg viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden>
      <rect x="2" y="4" width="16" height="1.6" /><rect x="2" y="8" width="10" height="1.6" />
      <rect x="2" y="12" width="16" height="1.6" /><rect x="2" y="16" width="10" height="1.6" />
    </svg>
  ),
  AlignCenter: () => (
    <svg viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden>
      <rect x="2" y="4" width="16" height="1.6" /><rect x="5" y="8" width="10" height="1.6" />
      <rect x="2" y="12" width="16" height="1.6" /><rect x="5" y="16" width="10" height="1.6" />
    </svg>
  ),
  AlignRight: () => (
    <svg viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden>
      <rect x="2" y="4" width="16" height="1.6" /><rect x="8" y="8" width="10" height="1.6" />
      <rect x="2" y="12" width="16" height="1.6" /><rect x="8" y="16" width="10" height="1.6" />
    </svg>
  ),
  Link: () => (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
    </svg>
  ),
  Unlink: () => (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M17 7l3-3M7 17l-3 3M10 13a5 5 0 0 0 7.5.5M14 11a5 5 0 0 0-7.5-.5" /><path d="M3 3l18 18" />
    </svg>
  ),
  Image: () => (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="1.5" /><circle cx="8.5" cy="10" r="1.5" /><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" />
    </svg>
  ),
  Rule: () => (
    <svg viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden>
      <rect x="2" y="9.2" width="16" height="1.6" />
    </svg>
  ),
  Undo: () => (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M3 8h11a5 5 0 0 1 0 10h-4" /><path d="m7 4-4 4 4 4" />
    </svg>
  ),
  Redo: () => (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M21 8H10a5 5 0 0 0 0 10h4" /><path d="m17 4 4 4-4 4" />
    </svg>
  ),
  Clear: () => (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M7 7h11M10 7l-2 12M15 7l1 6M4 20h7" /><path d="m17 16 4 4M21 16l-4 4" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/* toolbar                                                             */
/* ------------------------------------------------------------------ */

function Toolbar({ editor, library }: { editor: Editor; library: string[] }) {
  const [imageOpen, setImageOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const insertUploaded = useCallback(
    (urls: string[]) => {
      for (const src of urls) editor.chain().focus().setImage({ src }).run();
      setImageOpen(false);
    },
    [editor],
  );

  const { busy, error, upload } = useUpload(insertUploaded);

  const setLink = useCallback(() => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Link URL (leave empty to remove):", previous ?? "https://");

    if (href === null) return;
    if (href === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }, [editor]);

  const blockValue = editor.isActive("heading", { level: 2 })
    ? "h2"
    : editor.isActive("heading", { level: 3 })
      ? "h3"
      : editor.isActive("heading", { level: 4 })
        ? "h4"
        : editor.isActive("codeBlock")
          ? "pre"
          : "p";

  function setBlock(value: string) {
    const chain = editor.chain().focus();
    if (value === "p") chain.setParagraph().run();
    else if (value === "pre") chain.toggleCodeBlock().run();
    else chain.toggleHeading({ level: Number(value.slice(1)) as 2 | 3 | 4 }).run();
  }

  return (
    <div className="sticky top-0 z-10 border-b border-sand-200 bg-sand-50">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
        <select
          value={blockValue}
          onChange={(event) => setBlock(event.target.value)}
          title="Paragraph format"
          aria-label="Paragraph format"
          className="mr-1 h-8 border border-sand-200 bg-white px-2 text-xs text-navy-900 focus:border-gold-500 focus:outline-none"
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="pre">Preformatted</option>
        </select>

        <Divider />

        <ToolButton title="Bold (⌘B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Glyph.Bold />
        </ToolButton>
        <ToolButton title="Italic (⌘I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Glyph.Italic />
        </ToolButton>
        <ToolButton title="Underline (⌘U)" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <Glyph.Underline />
        </ToolButton>
        <ToolButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Glyph.Strike />
        </ToolButton>

        <Divider />

        <ToolButton title="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <Glyph.Bullet />
        </ToolButton>
        <ToolButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <Glyph.Ordered />
        </ToolButton>
        <ToolButton title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Glyph.Quote />
        </ToolButton>

        <Divider />

        <ToolButton title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <Glyph.AlignLeft />
        </ToolButton>
        <ToolButton title="Align centre" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <Glyph.AlignCenter />
        </ToolButton>
        <ToolButton title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <Glyph.AlignRight />
        </ToolButton>

        <Divider />

        <ToolButton title="Insert link (⌘K)" active={editor.isActive("link")} onClick={setLink}>
          <Glyph.Link />
        </ToolButton>
        <ToolButton title="Remove link" disabled={!editor.isActive("link")} onClick={() => editor.chain().focus().unsetLink().run()}>
          <Glyph.Unlink />
        </ToolButton>
        <ToolButton title="Insert image" active={imageOpen} onClick={() => setImageOpen((open) => !open)}>
          <Glyph.Image />
        </ToolButton>
        <ToolButton title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Glyph.Rule />
        </ToolButton>

        <Divider />

        <ToolButton title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          <Glyph.Clear />
        </ToolButton>

        <div className="ml-auto flex items-center gap-0.5">
          <ToolButton title="Undo (⌘Z)" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            <Glyph.Undo />
          </ToolButton>
          <ToolButton title="Redo (⇧⌘Z)" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            <Glyph.Redo />
          </ToolButton>
        </div>
      </div>

      {imageOpen && (
        <div className="border-t border-sand-200 bg-white p-3">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <input
              ref={fileInput}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES}
              multiple
              className="sr-only"
              onChange={(event) => {
                if (event.target.files?.length) void upload(event.target.files);
                event.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-2 bg-royal-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-royal-800 disabled:opacity-60"
            >
              {busy ? "Uploading…" : "Upload from device"}
            </button>
            {error ? <span className="text-xs text-rose-600">{error}</span> : null}
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://… or /images/art/example.jpeg"
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;
                event.preventDefault();
                const value = event.currentTarget.value.trim();
                if (value) {
                  editor.chain().focus().setImage({ src: value }).run();
                  event.currentTarget.value = "";
                  setImageOpen(false);
                }
              }}
              className="flex-1 border border-sand-200 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
            />
            <span className="self-center text-xs text-slate-400">press ↵ to insert</span>
          </div>

          {library.length > 0 && (
            <div className="mt-3 max-h-40 overflow-y-auto">
              <ul className="grid grid-cols-6 gap-1.5 sm:grid-cols-8">
                {library.map((image) => (
                  <li key={image}>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().setImage({ src: image }).run();
                        setImageOpen(false);
                      }}
                      className="relative block aspect-square w-full overflow-hidden opacity-80 transition-opacity hover:opacity-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image} alt="" className="size-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* editor                                                              */
/* ------------------------------------------------------------------ */

export function RichEditor({
  name,
  initialContent = "",
  library = [],
  placeholder = "Start writing…",
}: {
  name: string;
  initialContent?: string;
  library?: string[];
  placeholder?: string;
}) {
  const [html, setHtml] = useState(initialContent);
  const [mode, setMode] = useState<"visual" | "html">("visual");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer" },
        },
      }),
      ImageExtension.configure({ inline: false, HTMLAttributes: { loading: "lazy" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose-deedi max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor: instance }) => setHtml(instance.getHTML()),
  });

  // Pull edits made in the HTML tab back into the visual editor.
  useEffect(() => {
    if (mode === "visual" && editor && editor.getHTML() !== html) {
      editor.commands.setContent(html, { emitUpdate: false });
    }
    // Only runs when the tab changes, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const words = editor?.storage.characterCount?.words?.() ?? 0;
  const characters = editor?.storage.characterCount?.characters?.() ?? 0;
  const minutes = Math.max(1, Math.round(words / 200));

  return (
    <div className="wp-editor border border-sand-200 bg-white">
      <input type="hidden" name={name} value={html} />

      {/* Visual / HTML tabs */}
      <div className="flex items-end justify-between border-b border-sand-200 bg-sand-100 px-2 pt-2">
        <div className="flex gap-1">
          {(["visual", "html"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMode(tab)}
              className={cx(
                "border border-b-0 px-4 py-2 text-xs font-semibold transition-colors",
                mode === tab
                  ? "border-sand-200 bg-white text-navy-900"
                  : "border-transparent text-slate-500 hover:text-navy-900",
              )}
            >
              {tab === "visual" ? "Visual" : "Text"}
            </button>
          ))}
        </div>
        <p className="pr-2 pb-2 text-[0.6875rem] text-slate-400">
          {mode === "visual" ? "WYSIWYG" : "Raw HTML"}
        </p>
      </div>

      {mode === "visual" ? (
        <>
          {editor ? <Toolbar editor={editor} library={library} /> : null}
          <EditorContent editor={editor} />
        </>
      ) : (
        <textarea
          value={html}
          onChange={(event) => setHtml(event.target.value)}
          spellCheck={false}
          className="min-h-[460px] w-full resize-y p-6 font-mono text-xs leading-relaxed text-navy-900 focus:outline-none"
        />
      )}

      {/* Status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 bg-sand-50 px-4 py-2 text-[0.6875rem] text-slate-500">
        <span>
          {words.toLocaleString("en-GB")} words · {characters.toLocaleString("en-GB")} characters
        </span>
        <span>≈ {minutes} min read</span>
      </div>
    </div>
  );
}
