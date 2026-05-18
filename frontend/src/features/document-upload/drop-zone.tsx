"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileImage, AlertCircle } from "lucide-react";
import { cn, ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_BYTES, formatFileSize } from "@/lib/utils";

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
}

export function DropZone({ onFileSelected, selectedFile }: DropZoneProps) {
  const [dropError, setDropError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setDropError(null);
      if (rejected.length > 0) {
        const err = rejected[0]?.errors[0]?.message || "File not supported";
        setDropError(err);
        return;
      }
      if (accepted.length > 0) {
        onFileSelected(accepted[0]);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE_BYTES,
    maxFiles: 1,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "upload-zone cursor-pointer p-12 text-center transition-all duration-200",
          isDragActive && !isDragReject && "active",
          isDragReject && "border-destructive bg-red-50",
          selectedFile && "border-primary bg-accent/20"
        )}
      >
        <input {...getInputProps()} />
        <AnimatePresence mode="wait">
          {isDragActive ? (
            <motion.div
              key="drag"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-3"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary border-2 border-black shadow-brutal">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <p className="text-xl font-black text-primary">Drop it here!</p>
            </motion.div>
          ) : selectedFile ? (
            <motion.div
              key="selected"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-3"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary border-2 border-black shadow-brutal">
                <FileImage className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-lg font-black text-primary">File ready!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click or drop to replace
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/50">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1.5">
                <p className="text-lg font-black">
                  Drop your document here
                </p>
                <p className="text-sm text-muted-foreground">
                  or <span className="font-semibold text-primary underline">browse to upload</span>
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-muted px-2.5 py-1 font-medium">PDF</span>
                <span className="rounded-full bg-muted px-2.5 py-1 font-medium">JPG</span>
                <span className="rounded-full bg-muted px-2.5 py-1 font-medium">PNG</span>
                <span className="rounded-full bg-muted px-2.5 py-1 font-medium">WEBP</span>
                <span className="rounded-full bg-muted px-2.5 py-1 font-medium">TIFF</span>
                <span className="rounded-full bg-muted px-2.5 py-1 font-medium">
                  up to {formatFileSize(MAX_FILE_SIZE_BYTES)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {dropError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {dropError}
        </div>
      )}
    </div>
  );
}
