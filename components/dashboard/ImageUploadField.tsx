"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, AlertCircle } from "lucide-react";

interface Props {
  files: File[];
  onChange: (files: File[]) => void;
  existingUrls?: string[];                    // ← now an array
  onRemoveExisting?: (url: string) => void;    // ← now takes the url being removed
  maxFiles?: number;
  maxSizeMB?: number;
}

export function ImageUploadField({
  files,
  onChange,
  existingUrls = [],
  onRemoveExisting,
  maxFiles = 5,
  maxSizeMB = 10,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const totalCount = existingUrls.length + files.length;
  const remaining = Math.max(0, maxFiles - totalCount);

  function validate(incoming: File[]): { valid: File[]; errs: string[] } {
    const errs: string[] = [];
    const valid: File[] = [];

    for (const file of incoming) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        errs.push(`${file.name}: only JPG, PNG, WEBP allowed.`);
        continue;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        errs.push(`${file.name}: exceeds ${maxSizeMB}MB limit.`);
        continue;
      }
      valid.push(file);
    }
    return { valid, errs };
  }

  function addFiles(incoming: File[]) {
    const { valid, errs } = validate(incoming);
    setErrors(errs);
    const room = maxFiles - existingUrls.length;
    const combined = [...files, ...valid].slice(0, Math.max(0, room));
    onChange(combined);
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  }

  const hasExisting = existingUrls.length > 0;
  const hasNewFiles = files.length > 0;

  return (
    <div className="space-y-3">
      {/* Existing saved images */}
      {hasExisting && (
        <div className="space-y-2">
          <p className="font-dm text-xs font-medium text-gray-500">
            Current {existingUrls.length > 1 ? "Images" : "Image"}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {existingUrls.map((url, i) => (
              <div key={url} className="relative group aspect-square">
                <img
                  src={url}
                  alt="Current venue"
                  className="w-full h-full object-cover rounded-xl"
                />
                {i === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 bg-black/50 text-white text-[10px] font-dm font-medium px-1.5 py-0.5 rounded-full">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveExisting?.(url)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload zone */}
      {remaining > 0 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`w-full flex flex-col items-center justify-center gap-2.5 border-2 border-dashed rounded-xl py-8 transition-colors ${
            dragOver
              ? "border-green-400 bg-green-500/5"
              : "border-gray-200 hover:border-green-400 hover:bg-green-500/5"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <ImagePlus size={18} className="text-green-600" />
          </div>
          <div className="text-center">
            <p className="font-dm text-sm font-medium text-gray-700">
              Click to upload{" "}
              <span className="text-green-600">or drag and drop</span>
            </p>
            <p className="font-dm text-xs text-gray-400 mt-0.5">
              JPG, PNG, WEBP · max {maxSizeMB}MB each · up to {maxFiles} photos
            </p>
          </div>
          {totalCount > 0 && (
            <p className="font-dm text-xs text-gray-400">
              {totalCount} selected · {remaining} slot
              {remaining !== 1 ? "s" : ""} remaining
            </p>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleChange}
      />

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((err, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2"
            >
              <AlertCircle size={14} className="text-red-500 shrink-0" />
              <p className="font-dm text-xs text-red-600">{err}</p>
            </div>
          ))}
        </div>
      )}

      {/* New file previews */}
      {hasNewFiles && (
        <div className="space-y-2">
          <p className="font-dm text-xs font-medium text-gray-500">
            New {files.length > 1 ? "Images" : "Image"}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {files.map((file, i) => (
              <div key={i} className="relative group aspect-square">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover rounded-xl"
                />
                {!hasExisting && i === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 bg-green-400 text-black text-[10px] font-dm font-bold px-1.5 py-0.5 rounded-full">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}