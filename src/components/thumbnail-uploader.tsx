"use client";

import * as React from "react";
import Image from "next/image";
import { useUploadThing } from "@/app/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload, X, RefreshCw } from "lucide-react";

type Props = {
  value?: string | null;
  onChange: (url: string | null) => void;
  maxSizeMB?: number;
  accept?: string;
  helperText?: string;
  endpoint?: "thumbnail" | "profileImage";
};

export default function ThumbnailUploader({
  value,
  onChange,
  maxSizeMB = 4,
  accept = "image/png,image/jpeg,image/webp,image/gif,image/*",
  helperText = "Recommended: 16:9 image, up to 4 MB (PNG/JPG/WebP).",
  endpoint = "thumbnail",
}: Props) {
  const [preview, setPreview] = React.useState<string | null>(value ?? null);
  const [error, setError] = React.useState<string | null>(null);
  const { startUpload, isUploading } = useUploadThing(endpoint);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Debounce guard to avoid double .click() in some browsers
  const lastOpenRef = React.useRef(0);
  const openFilePicker = React.useCallback(() => {
    const now = Date.now();
    if (now - lastOpenRef.current < 350) return; // ~1/3s guard
    lastOpenRef.current = now;
    fileInputRef.current?.click();
  }, []);

  // Keep any blob: preview alive until replaced
  const objectUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    setPreview(value ?? null);
  }, [value]);

  React.useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const validateFile = (file: File) => {
    setError(null);
    const allowed = accept.split(",").map((t) => t.trim());
    const okType = allowed.some((t) => (t === "image/*" ? file.type.startsWith("image/") : file.type === t));
    if (!okType) return setError("Unsupported file type. Please choose an image."), false;
    if (file.size > maxSizeMB * 1024 * 1024) return setError(`File too large. Max ${maxSizeMB} MB.`), false;
    return true;
  };

  const handleSelect = async (file: File) => {
    if (!validateFile(file)) return;
    const localUrl = URL.createObjectURL(file);
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = localUrl;
    setPreview(localUrl);

    try {
      const res = await startUpload([file]);
      const uploadedUrl = res?.[0]?.serverData?.url ?? res?.[0]?.url;
      if (!uploadedUrl) throw new Error("Upload failed");
      setPreview(uploadedUrl);
      onChange(uploadedUrl);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      setPreview(value ?? null);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    }
  };

  const onFileInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (f) void handleSelect(f);
    e.currentTarget.value = ""; // allow selecting same file again later
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUploading) return;
    const f = e.dataTransfer.files?.[0];
    if (f) void handleSelect(f);
  };

  const clear = () => {
    setPreview(null);
    onChange(null);
    setError(null);
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={onFileInput}
        className="hidden"
        disabled={isUploading}
      />

      {!preview ? (
        // DROPZONE (click anywhere)
        <div
          role="button"
          tabIndex={0}
          onClick={() => !isUploading && openFilePicker()}              // parent opens picker
          onKeyDown={(e) => {
            if (isUploading) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openFilePicker();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
          }}
          onDrop={onDrop}
          className="group relative w-full cursor-pointer rounded-xl border border-dashed border-white/30 bg-white/50 backdrop-blur-sm dark:bg-neutral-900/40 hover:border-primary/50 transition-colors flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8"
        >
          <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-medium">Drag & drop an image here</p>
              <p className="text-xs text-muted-foreground">or click to browse files</p>
            </div>

            {/* BUTTON: stop propagation so parent onClick doesn't fire too */}
            <Button
              type="button"
              variant="secondary"
              className="mt-1"
              disabled={isUploading}
              onClick={(e) => {
                e.stopPropagation();
                openFilePicker();
              }}
              onKeyDown={(e) => {
                // prevent parent key handler
                e.stopPropagation();
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openFilePicker();
                }
              }}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload image
            </Button>
          </div>

          {isUploading && (
            <div className="absolute inset-0 grid place-items-center rounded-xl bg-white/60 dark:bg-black/40">
              <div className="flex items-center gap-2 text-sm">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Uploading…
              </div>
            </div>
          )}
        </div>
      ) : (
        // PREVIEW CARD
        <div className="relative w-full overflow-hidden rounded-xl border border-white/20 bg-white/60 backdrop-blur-sm dark:bg-neutral-900/50">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={preview}
              alt="Thumbnail preview"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 640px"
            />
          </div>

          <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-4">
            <p className="truncate text-xs text-muted-foreground">{helperText}</p>
            <div className="flex gap-2">
              {/* ACTIONS: stop propagation to avoid triggering parent click (if wrapped) */}
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  openFilePicker();
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openFilePicker();
                  }
                }}
                disabled={isUploading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Change
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  clear();
                }}
                onKeyDown={(e) => e.stopPropagation()}
                disabled={isUploading}
              >
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>

          {isUploading && (
            <div className="absolute inset-0 grid place-items-center bg-white/60 dark:bg-black/40">
              <div className="flex items-center gap-2 text-sm">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Uploading…
              </div>
            </div>
          )}
        </div>
      )}

      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        isUploading && <p className="text-sm text-muted-foreground">Uploading…</p>
      )}
    </div>
  );
}
