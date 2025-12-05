"use client";

import * as React from "react";
import Image from "next/image";
import { useUploadThing } from "@/app/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload, X, RefreshCw } from "lucide-react";

type Props = {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxSizeMB?: number;
  maxFiles?: number;
  accept?: string;
  helperText?: string;
};

export default function GalleryUploader({
  value = [],
  onChange,
  maxSizeMB = 4,
  maxFiles = 10,
  accept = "image/png,image/jpeg,image/webp,image/gif,image/*",
  helperText = "Upload up to 10 images, 4MB each (PNG/JPG/WebP).",
}: Props) {
  const [previews, setPreviews] = React.useState<Array<{ url: string; isLocal: boolean; id: string }>>(
    value.map((url, idx) => ({ url, isLocal: false, id: `existing-${idx}-${url}` }))
  );
  const [error, setError] = React.useState<string | null>(null);
  const { startUpload, isUploading } = useUploadThing("gallery");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const objectUrlsRef = React.useRef<Set<string>>(new Set());
  const isUploadingRef = React.useRef(false);
  const lastSyncedValueRef = React.useRef<string | null>(null);

  // Only sync with value prop when not uploading and value actually changes externally
  React.useEffect(() => {
    if (isUploadingRef.current) return; // Don't sync during upload
    
    const currentValueStr = JSON.stringify(value);
    // On initial mount or when value actually changed externally
    if (lastSyncedValueRef.current === null || currentValueStr !== lastSyncedValueRef.current) {
      lastSyncedValueRef.current = currentValueStr;
      setPreviews(value.map((url, idx) => ({ url, isLocal: false, id: `existing-${idx}-${url}` })));
    }
  }, [value]);

  React.useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      objectUrlsRef.current.clear();
    };
  }, []);

  const validateFile = (file: File) => {
    setError(null);
    const allowed = accept.split(",").map((t) => t.trim());
    const okType = allowed.some((t) => (t === "image/*" ? file.type.startsWith("image/") : file.type === t));
    if (!okType) {
      setError("Unsupported file type. Please choose an image.");
      return false;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max ${maxSizeMB} MB.`);
      return false;
    }
    if (previews.length >= maxFiles) {
      setError(`Maximum ${maxFiles} images allowed.`);
      return false;
    }
    return true;
  };

  const handleSelect = async (files: FileList | File[]) => {
    setError(null);
    const fileArray = Array.from(files);
    const validFiles: File[] = [];

    for (const file of fileArray) {
      if (validateFile(file) && previews.length + validFiles.length < maxFiles) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    isUploadingRef.current = true;

    // Add local previews immediately
    const newPreviews: Array<{ url: string; isLocal: boolean; id: string }> = [];
    validFiles.forEach((file, idx) => {
      const localUrl = URL.createObjectURL(file);
      objectUrlsRef.current.add(localUrl);
      newPreviews.push({ url: localUrl, isLocal: true, id: `uploading-${Date.now()}-${idx}` });
    });

    setPreviews((prev) => [...prev, ...newPreviews]);

    try {
      const res = await startUpload(validFiles);
      
      // Extract URLs from uploadthing response - matching thumbnail uploader pattern
      const uploadedUrls = res
        .map((r: any) => {
          // Match the pattern used in thumbnail uploader: serverData.url or url
          return r?.serverData?.url ?? r?.url ?? null;
        })
        .filter((url): url is string => !!url && typeof url === 'string');
      
      console.log("Gallery upload response:", res);
      console.log("Extracted URLs:", uploadedUrls);

      if (uploadedUrls.length === 0) {
        console.error("Upload response:", res);
        throw new Error("Upload failed - no URLs returned");
      }

      // Replace local previews with uploaded URLs and update parent
      setPreviews((prev) => {
        const updated = [...prev];
        newPreviews.forEach((preview, idx) => {
          const uploadedUrl = uploadedUrls[idx];
          if (uploadedUrl) {
            const localIdx = updated.findIndex((p) => p.id === preview.id);
            if (localIdx >= 0) {
              // Clean up local URL
              if (objectUrlsRef.current.has(updated[localIdx].url)) {
                URL.revokeObjectURL(updated[localIdx].url);
                objectUrlsRef.current.delete(updated[localIdx].url);
              }
              // Replace with uploaded URL
              updated[localIdx] = { 
                url: uploadedUrl, 
                isLocal: false, 
                id: `uploaded-${Date.now()}-${idx}-${uploadedUrl}` 
              };
            }
          }
        });
        
        // Update parent with all non-local URLs
        const finalUrls = updated.filter((p) => !p.isLocal).map((p) => p.url);
        lastSyncedValueRef.current = JSON.stringify(finalUrls); // Mark as synced
        onChange(finalUrls);
        
        return updated;
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Upload failed";
      setError(errorMessage);
      console.error("Gallery upload error:", e);
      
      // Remove failed previews
      setPreviews((prev) => {
        const updated = prev.filter((p) => !newPreviews.some((np) => np.id === p.id));
        newPreviews.forEach((preview) => {
          if (objectUrlsRef.current.has(preview.url)) {
            URL.revokeObjectURL(preview.url);
            objectUrlsRef.current.delete(preview.url);
          }
        });
        return updated;
      });
    } finally {
      isUploadingRef.current = false;
    }
  };

  const onFileInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      void handleSelect(files);
    }
    e.currentTarget.value = "";
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUploading) return;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      void handleSelect(files);
    }
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => {
      const preview = prev[index];
      if (preview.isLocal && objectUrlsRef.current.has(preview.url)) {
        URL.revokeObjectURL(preview.url);
        objectUrlsRef.current.delete(preview.url);
      }
      const updated = prev.filter((_, i) => i !== index);
      const finalUrls = updated.filter((p) => !p.isLocal).map((p) => p.url);
      lastSyncedValueRef.current = JSON.stringify(finalUrls); // Mark as synced
      onChange(finalUrls);
      return updated;
    });
  };

  const openFilePicker = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={onFileInput}
        className="hidden"
        disabled={isUploading || previews.length >= maxFiles}
      />

      {previews.length === 0 ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => !isUploading && openFilePicker()}
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
              <p className="text-sm sm:text-base font-medium">Drag & drop images here</p>
              <p className="text-xs text-muted-foreground">or click to browse files</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="mt-1"
              disabled={isUploading}
              onClick={(e) => {
                e.stopPropagation();
                openFilePicker();
              }}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload images
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
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {previews.map((preview, index) => (
              <div
                key={preview.id || `preview-${index}-${preview.url}`}
                className="group relative aspect-square overflow-hidden rounded-lg border border-white/20 bg-white/60 backdrop-blur-sm dark:bg-neutral-900/50"
              >
                <Image
                  src={preview.url}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="h-8 w-8 rounded-full p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {preview.isLocal && (
                  <div className="absolute inset-0 grid place-items-center bg-black/20">
                    <RefreshCw className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
          {previews.length < maxFiles && (
            <Button
              type="button"
              variant="outline"
              onClick={openFilePicker}
              disabled={isUploading}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Add more images ({previews.length}/{maxFiles})
            </Button>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  );
}

