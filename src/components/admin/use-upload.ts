"use client";

import { useCallback, useRef, useState } from "react";

export interface UploadState {
  busy: boolean;
  error: string | null;
  progress: { done: number; total: number } | null;
}

/**
 * Uploads image files to /api/admin/upload and hands back their public URLs.
 * Files are sent one at a time so a single rejection doesn't lose the batch.
 */
export function useUpload(onUploaded: (urls: string[]) => void) {
  const [state, setState] = useState<UploadState>({
    busy: false,
    error: null,
    progress: null,
  });
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (list.length === 0) {
        setState({ busy: false, error: "Only image files can be uploaded.", progress: null });
        return;
      }

      setState({ busy: true, error: null, progress: { done: 0, total: list.length } });

      const urls: string[] = [];
      let failure: string | null = null;

      for (const [index, file] of list.entries()) {
        const body = new FormData();
        body.set("file", file);

        try {
          const response = await fetch("/api/admin/upload", { method: "POST", body });
          const payload = await response.json().catch(() => ({}));

          if (!response.ok) {
            failure = payload.error ?? `${file.name} could not be uploaded.`;
            break;
          }
          urls.push(payload.url);
        } catch {
          failure = "Upload failed — check your connection and try again.";
          break;
        }

        setState({
          busy: true,
          error: null,
          progress: { done: index + 1, total: list.length },
        });
      }

      if (urls.length > 0) onUploaded(urls);
      setState({ busy: false, error: failure, progress: null });
    },
    [onUploaded],
  );

  /** Drag-and-drop handlers, tracking depth so nested children don't flicker. */
  const dropZone = {
    onDragEnter: (event: React.DragEvent) => {
      event.preventDefault();
      dragDepth.current += 1;
      setDragging(true);
    },
    onDragLeave: (event: React.DragEvent) => {
      event.preventDefault();
      dragDepth.current -= 1;
      if (dragDepth.current <= 0) {
        dragDepth.current = 0;
        setDragging(false);
      }
    },
    onDragOver: (event: React.DragEvent) => event.preventDefault(),
    onDrop: (event: React.DragEvent) => {
      event.preventDefault();
      dragDepth.current = 0;
      setDragging(false);
      if (event.dataTransfer.files?.length) void upload(event.dataTransfer.files);
    },
  };

  return { ...state, dragging, upload, dropZone, clearError: () => setState((s) => ({ ...s, error: null })) };
}

export const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp,image/avif,image/gif";
