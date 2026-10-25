"use client";

import { useId, useState } from "react";
import { cx } from "./cx";
import { Icon } from "./icon";

type FileUploadProps = {
  label: string;
  name: string;
  /** e.g. "application/pdf" or "image/*" */
  accept: string;
  /** Shown as the hint and enforced before the form is sent. */
  maxBytes: number;
  error?: string;
  disabled?: boolean;
};

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

// "application/pdf" → "PDF", "image/webp,image/png" → "WEBP, PNG", "image/*" → "Images".
export const formatAccept = (accept: string) =>
  accept
    .split(",")
    .map((t) => {
      const [type, sub] = t.trim().split("/");
      return sub === "*"
        ? `${type[0].toUpperCase()}${type.slice(1)}s`
        : sub.toUpperCase();
    })
    .join(", ");

// A real <input type="file"> under a large drop target: tap to choose on phones, drag and drop on desktop.
export function FileUpload({
  label,
  name,
  accept,
  maxBytes,
  error,
  disabled,
}: FileUploadProps) {
  const id = useId();
  const [picked, setPicked] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const tooBig = picked !== null && picked.size > maxBytes;
  const message =
    error ??
    (tooBig
      ? `This file is ${formatSize(picked.size)}; the limit is ${formatSize(maxBytes)}.`
      : null);

  return (
    <div className="ui-field">
      <span className="ui-label" id={`${id}-label`}>
        {label}
      </span>
      <label
        htmlFor={id}
        className={cx(
          "ui-file-upload",
          dragging && "ui-file-upload--over",
          message && "ui-file-upload--invalid",
        )}
        data-disabled={disabled || undefined}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDrop={() => setDragging(false)}
      >
        <input
          id={id}
          type="file"
          name={name}
          accept={accept}
          disabled={disabled}
          aria-labelledby={`${id}-label ${id}-cta`}
          aria-describedby={`${id}-hint${message ? ` ${id}-error` : ""}`}
          aria-invalid={message ? true : undefined}
          onChange={(e) => {
            const file = e.currentTarget.files?.[0] ?? null;
            setPicked(file);
            e.currentTarget.setCustomValidity(
              file && file.size > maxBytes ? "File too large" : "",
            );
          }}
        />
        <Icon name="upload" />
        <span id={`${id}-cta`} className="ui-file-upload__cta">
          {picked ? picked.name : "Choose a file or drop it here"}
        </span>
        {picked && (
          <span className="ui-file-upload__size figure">
            {formatSize(picked.size)}
          </span>
        )}
      </label>
      <p id={`${id}-hint`} className="ui-hint">
        {formatAccept(accept)}, up to {formatSize(maxBytes)}
      </p>
      {message && (
        <p id={`${id}-error`} className="ui-field-error">
          {message}
        </p>
      )}
    </div>
  );
}
