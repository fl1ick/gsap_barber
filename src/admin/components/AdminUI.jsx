// ── AdminUI.jsx — Komponen reusable untuk admin panel ──────────
import { useState } from "react";
import { uploadImage } from "../../lib/UploadImage.js";

/* ── Image Upload ───────────────────────────────────────────── */
export function ImageUpload({ value, onChange, folder = "general" }) {
  const [uploading, setUploading] = useState(false);

  const handle = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      alert("Upload gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Preview gambar jika sudah ada */}
      {value && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/10">
          <img
            src={value}
            alt="preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* Tombol upload */}
      <label
        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-dashed cursor-pointer transition-all text-sm
          ${
            uploading
              ? "border-white/10 text-white/20 cursor-not-allowed"
              : "border-white/20 text-white/40 hover:border-teal-500/50 hover:text-teal-400 hover:bg-teal-500/5"
          }`}
      >
        {uploading ? (
          <>
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Mengupload...
          </>
        ) : (
          <>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {value ? "Ganti foto" : "Upload foto"}
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={handle}
        />
      </label>
    </div>
  );
}

/* ── Table ─────────────────────────────────────────────────── */
export function AdminTable({ columns, rows, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (row) => {
    if (!window.confirm(`Hapus "${row.name || row.day}"?`)) return;
    setDeleting(row.id);
    await onDelete(row.id);
    setDeleting(null);
  };

  return (
    <div className="overflow-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            {columns.map((c) => (
              <th
                key={c.key}
                className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider"
              >
                {c.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center py-12 text-white/20 text-sm"
              >
                Belum ada data. Klik Tambah untuk mulai.
              </td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr
              key={row.id}
              className={`border-b border-white/5 hover:bg-white/[0.04] transition-colors ${i % 2 !== 0 ? "bg-white/[0.02]" : ""}`}
            >
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-white/75">
                  {c.render ? c.render(row[c.key], row) : (row[c.key] ?? "—")}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(row)}
                    className="px-3 py-1 rounded-md text-xs border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(row)}
                    disabled={deleting === row.id}
                    className="px-3 py-1 rounded-md text-xs border border-red-700/40 text-red-400 hover:bg-red-900/30 transition-all disabled:opacity-40"
                  >
                    {deleting === row.id ? "..." : "Hapus"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Modal ──────────────────────────────────────────────────── */
export function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-semibold text-sm text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ── Field, Input, Select, Textarea ─────────────────────────── */
export function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-white/40 uppercase tracking-wider font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-teal-500/60 focus:bg-white/8 transition-all";

export function Input(props) {
  return <input {...props} className={inputClass} />;
}

export function Textarea(props) {
  return (
    <textarea {...props} rows={3} className={`${inputClass} resize-none`} />
  );
}

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/60 transition-all"
    >
      {children}
    </select>
  );
}

/* ── Badge ──────────────────────────────────────────────────── */
export function Badge({ value, trueLabel = "Ya", falseLabel = "Tidak" }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${value ? "bg-teal-900/50 text-teal-300 border border-teal-700/40" : "bg-white/8 text-white/40 border border-white/10"}`}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}

/* ── Submit Button ──────────────────────────────────────────── */
export function SubmitBtn({ loading, label = "Simpan" }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full mt-2 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 active:scale-[0.98] disabled:opacity-50 text-sm font-semibold text-white transition-all"
    >
      {loading ? "Menyimpan..." : label}
    </button>
  );
}

/* ── Page Header ────────────────────────────────────────────── */
export function PageHeader({ title, desc, onAdd }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {desc && <p className="text-white/40 text-sm mt-1">{desc}</p>}
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 active:scale-[0.98] text-sm font-semibold text-white transition-all"
        >
          <span className="text-lg leading-none">+</span> Tambah
        </button>
      )}
    </div>
  );
}

/* ── Loading Skeleton ───────────────────────────────────────── */
export function TableSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}
