import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { uploadImage } from "../../lib/UploadImage";

const TYPE_OPTIONS = [
  { value: "info", label: "Info", color: "#3B82F6" },
  { value: "success", label: "Sukses", color: "#22C55E" },
  { value: "warning", label: "Peringatan", color: "#F59E0B" },
  { value: "error", label: "Error", color: "#EF4444" },
];

const KIND_OPTIONS = [
  {
    value: "toast",
    label: "Toast",
    desc: "Muncul sebentar lalu hilang sendiri",
  },
  {
    value: "announcement",
    label: "Announcement",
    desc: "Modal — user harus klik tutup",
  },
];

const EMPTY = {
  type: "info",
  kind: "toast",
  title: "",
  message: "",
  image_url: "",
  link_url: "",
  link_label: "",
};

export default function NotificationsAdmin() {
  const [form, setForm] = useState(EMPTY);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setHistory(data);
  }

  function set(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImgLoading(true);
    try {
      const url = await uploadImage(file, "notifications");
      set("image_url", url);
    } catch (err) {
      alert("Gagal upload gambar: " + err.message);
    } finally {
      setImgLoading(false);
    }
  }

  async function handleSend() {
    if (!form.message.trim()) return alert("Pesan wajib diisi.");
    if (form.kind === "announcement" && !form.title.trim())
      return alert("Judul wajib untuk announcement.");

    setLoading(true);
    const { error } = await supabase.from("notifications").insert([
      {
        type: form.type,
        kind: form.kind,
        title: form.title || null,
        message: form.message,
        image_url: form.image_url || null,
        link_url: form.link_url || null,
        link_label: form.link_label || null,
        is_active: true,
      },
    ]);

    setLoading(false);
    if (error) return alert("Gagal kirim: " + error.message);
    setSent(true);
    setTimeout(() => setSent(false), 2500);
    setForm(EMPTY);
    fetchHistory();
  }

  async function handleDeactivate(id) {
    await supabase
      .from("notifications")
      .update({ is_active: false })
      .eq("id", id);
    fetchHistory();
  }

  async function handleDelete(id) {
    if (!confirm("Hapus notifikasi ini?")) return;
    await supabase.from("notifications").delete().eq("id", id);
    fetchHistory();
  }

  const activeType = TYPE_OPTIONS.find((t) => t.value === form.type);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", fontFamily: "inherit" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            margin: "0 0 4px",
            color: "#fff",
          }}
        >
          Notifikasi User
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
          Kirim notifikasi realtime ke semua user yang sedang membuka website.
        </p>
      </div>

      {/* ── Form ── */}
      <div style={darkCard}>
        {/* Kind */}
        <label style={lbl}>Tipe tampilan</label>
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          {KIND_OPTIONS.map((k) => {
            const active = form.kind === k.value;
            return (
              <button
                key={k.value}
                onClick={() => set("kind", k.value)}
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderRadius: 10,
                  cursor: "pointer",
                  textAlign: "left",
                  border: `1.5px solid ${active ? "#2dd4bf" : "rgba(255,255,255,0.08)"}`,
                  background: active
                    ? "rgba(45,212,191,0.08)"
                    : "rgba(255,255,255,0.03)",
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    display: "block",
                    marginBottom: 2,
                    color: active ? "#2dd4bf" : "rgba(255,255,255,0.6)",
                  }}
                >
                  {k.label}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: active ? "#5eead4" : "rgba(255,255,255,0.25)",
                  }}
                >
                  {k.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Type */}
        <label style={lbl}>Level notifikasi</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          {TYPE_OPTIONS.map((t) => {
            const active = form.type === t.value;
            return (
              <button
                key={t.value}
                onClick={() => set("type", t.value)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 8,
                  fontSize: 13,
                  cursor: "pointer",
                  border: `1.5px solid ${active ? t.color : "rgba(255,255,255,0.08)"}`,
                  background: active
                    ? t.color + "22"
                    : "rgba(255,255,255,0.03)",
                  color: active ? t.color : "rgba(255,255,255,0.4)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Title */}
        <label style={lbl}>
          Judul{" "}
          {form.kind === "announcement" ? (
            <span style={{ color: "#ef4444" }}>*</span>
          ) : (
            <span
              style={{
                color: "rgba(255,255,255,0.2)",
                textTransform: "none",
                letterSpacing: 0,
              }}
            >
              (opsional)
            </span>
          )}
        </label>
        <input
          style={darkInput}
          placeholder="contoh: Promo Akhir Tahun"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />

        {/* Message */}
        <label style={lbl}>
          Pesan <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <textarea
          style={{ ...darkInput, height: 100, resize: "vertical" }}
          placeholder="Tulis pesan notifikasi..."
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
        />

        {/* Image */}
        <label style={lbl}>
          Gambar{" "}
          <span
            style={{
              color: "rgba(255,255,255,0.2)",
              textTransform: "none",
              letterSpacing: 0,
            }}
          >
            (opsional)
          </span>
        </label>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 8,
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {imgLoading ? "Mengupload..." : "📎 Pilih gambar"}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </label>
          {form.image_url && (
            <>
              <img
                src={form.image_url}
                alt=""
                style={{
                  height: 44,
                  width: 70,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <button
                onClick={() => set("image_url", "")}
                style={{
                  ...ghostDark,
                  color: "#ef4444",
                  borderColor: "rgba(239,68,68,0.3)",
                }}
              >
                Hapus
              </button>
            </>
          )}
        </div>

        {/* Link */}
        <label style={lbl}>
          URL Link{" "}
          <span
            style={{
              color: "rgba(255,255,255,0.2)",
              textTransform: "none",
              letterSpacing: 0,
            }}
          >
            (opsional)
          </span>
        </label>
        <input
          style={{ ...darkInput, marginBottom: form.link_url ? 12 : 20 }}
          placeholder="https://..."
          value={form.link_url}
          onChange={(e) => set("link_url", e.target.value)}
        />
        {form.link_url && (
          <>
            <label style={lbl}>Label tombol link</label>
            <input
              style={darkInput}
              placeholder="contoh: Lihat Promo"
              value={form.link_label}
              onChange={(e) => set("link_label", e.target.value)}
            />
          </>
        )}

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={loading || imgLoading}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 10,
            border: "none",
            background: sent ? "#22C55E" : activeType?.color || "#3B82F6",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "background .3s",
            letterSpacing: "0.01em",
          }}
        >
          {sent
            ? "✓ Terkirim!"
            : loading
              ? "Mengirim..."
              : `Kirim ${form.kind === "announcement" ? "Announcement" : "Notifikasi"}`}
        </button>
      </div>

      {/* ── Riwayat ── */}
      <h2
        style={{
          fontSize: 14,
          fontWeight: 600,
          margin: "28px 0 12px",
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Riwayat
      </h2>

      {history.length === 0 ? (
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.2)" }}>
          Belum ada notifikasi yang dikirim.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {history.map((n) => {
            const tc = TYPE_OPTIONS.find((t) => t.value === n.type);
            return (
              <div
                key={n.id}
                style={{
                  ...darkCard,
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  opacity: n.is_active ? 1 : 0.35,
                }}
              >
                {/* dot */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: tc?.color,
                    flexShrink: 0,
                    marginTop: 5,
                    boxShadow: `0 0 8px ${tc?.color}99`,
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 4,
                      flexWrap: "wrap",
                    }}
                  >
                    {n.title && (
                      <span
                        style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}
                      >
                        {n.title}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 10,
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.35)",
                        padding: "2px 8px",
                        borderRadius: 20,
                      }}
                    >
                      {n.kind}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        background: tc?.color + "22",
                        color: tc?.color,
                        padding: "2px 8px",
                        borderRadius: 20,
                      }}
                    >
                      {tc?.label}
                    </span>
                    {!n.is_active && (
                      <span
                        style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}
                      >
                        • nonaktif
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.5,
                    }}
                  >
                    {n.message}
                  </p>
                  <p
                    style={{
                      margin: "5px 0 0",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.2)",
                    }}
                  >
                    {new Date(n.created_at).toLocaleString("id-ID")}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  {n.is_active && (
                    <button
                      onClick={() => handleDeactivate(n.id)}
                      style={ghostDark}
                    >
                      Nonaktifkan
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    style={{
                      ...ghostDark,
                      color: "#ef4444",
                      borderColor: "rgba(239,68,68,0.25)",
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const darkCard = {
  background: "#0b0f0f",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 14,
  padding: 22,
  marginBottom: 4,
};

const lbl = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "rgba(255,255,255,0.4)",
  marginBottom: 8,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
};

const darkInput = {
  display: "block",
  width: "100%",
  marginBottom: 18,
  padding: "10px 13px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  fontSize: 14,
  color: "#fff",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const ghostDark = {
  background: "none",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 7,
  padding: "5px 10px",
  fontSize: 12,
  color: "rgba(255,255,255,0.4)",
  cursor: "pointer",
};
