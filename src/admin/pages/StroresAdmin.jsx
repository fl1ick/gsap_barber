import { useState } from "react";
import { useTable } from "../../hooks/useTable";
import { uploadImage } from "../../lib/uploadImage";

const EMPTY_FORM = {
  name: "",
  address: "",
  phone: "",
  hours: "",
  image: "",
  wa: "",
};

const inputStyle = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  borderRadius: "0.5rem",
  background: "#1a1a1a",
  border: "1px solid #333",
  color: "white",
  fontSize: "0.875rem",
};
const labelStyle = {
  fontSize: "0.75rem",
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

// Auto-generate WA link dari nomor telepon
const generateWa = (phone, name) => {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
  const text = encodeURIComponent(`Halo ${name}, saya ingin booking `);
  return `https://wa.me/${intl}?text=${text}`;
};

export default function StoresAdmin() {
  const {
    data: stores,
    loading,
    insert,
    update,
    remove,
  } = useTable("stores", { orderBy: "name" });
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const setField = (key, value) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      // Auto-generate WA saat phone atau name berubah
      if (key === "phone" || key === "name") {
        updated.wa = generateWa(
          key === "phone" ? value : prev.phone,
          key === "name" ? value : prev.name,
        );
      }
      return updated;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "stores"); // ← pakai helper
      setField("image", url);
    } catch (err) {
      alert("Upload gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };
  const openEdit = (store) => {
    setForm({
      name: store.name,
      address: store.address,
      phone: store.phone,
      hours: store.hours,
      image: store.image,
      wa: store.wa,
    });
    setEditingId(store.id);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    try {
      if (editingId) await update(editingId, form);
      else await insert(form);
      closeModal();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus cabang ini?")) return;
    try {
      await remove(id);
    } catch (e) {
      alert(e.message);
    }
  };

  const field = (label, key, placeholder = "") => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={labelStyle}>{label}</label>
      <input
        style={inputStyle}
        value={form[key]}
        placeholder={placeholder}
        onChange={(e) => setField(key, e.target.value)}
      />
    </div>
  );

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Cabang</h1>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>
            {stores.length} cabang terdaftar
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            background: "#0d9488",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.5rem 1.25rem",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + Tambah
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: "#666" }}>Loading...</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.875rem",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #222" }}>
              {["Nama Cabang", "Alamat", "Telepon", "Jam Buka", "Aksi"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "0.75rem 1rem",
                      color: "#666",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} style={{ borderBottom: "1px solid #111" }}>
                <td style={{ padding: "1rem", fontWeight: 600 }}>
                  {store.name}
                </td>
                <td style={{ padding: "1rem", color: "#999" }}>
                  {store.address}
                </td>
                <td style={{ padding: "1rem", color: "#999" }}>
                  {store.phone}
                </td>
                <td style={{ padding: "1rem", color: "#999" }}>
                  {store.hours}
                </td>
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => openEdit(store)}
                      style={{
                        background: "transparent",
                        border: "1px solid #444",
                        color: "white",
                        borderRadius: "0.375rem",
                        padding: "0.25rem 0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(store.id)}
                      style={{
                        background: "transparent",
                        border: "1px solid #dc2626",
                        color: "#ef4444",
                        borderRadius: "0.375rem",
                        padding: "0.25rem 0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "#111",
              borderRadius: "1rem",
              padding: "2rem",
              width: "100%",
              maxWidth: "480px",
              border: "1px solid #222",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }}>
                {editingId ? "Edit Cabang" : "Tambah Cabang"}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  color: "#666",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            {field("Nama Cabang", "name", "Prime Cuts — Sudirman")}
            {field("Alamat", "address", "Jl. Sudirman No. 123")}
            {field("Telepon", "phone", "0812-3456-7890")}
            {field("Jam Buka", "hours", "10.00 – 21.00")}

            {/* WA Auto */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
              }}
            >
              <label style={labelStyle}>Link WhatsApp (Auto)</label>
              <input
                style={{ ...inputStyle, color: "#666" }}
                value={form.wa}
                readOnly
              />
            </div>

            {/* Upload Foto */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
              }}
            >
              <label style={labelStyle}>Foto</label>
              {form.image && (
                <img
                  src={form.image}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  ...inputStyle,
                  padding: "0.375rem",
                  cursor: "pointer",
                }}
              />
              {uploading && (
                <p style={{ color: "#0d9488", fontSize: "0.75rem" }}>
                  Mengupload...
                </p>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={uploading}
              style={{
                background: uploading ? "#333" : "#0d9488",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.625rem",
                fontWeight: 600,
                cursor: uploading ? "not-allowed" : "pointer",
                marginTop: "0.5rem",
              }}
            >
              {uploading ? "Mengupload foto..." : "Simpan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
