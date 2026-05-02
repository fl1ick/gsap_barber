import { useState } from "react";
import {
  AdminTable,
  Modal,
  Field,
  Input,
  ImageUpload,
  PageHeader,
  TableSkeleton,
} from "../components/AdminUI";
import { useTable } from "../../hooks/useTable";

const EMPTY_FORM = {
  name: "",
  address: "",
  phone: "",
  hours: "",
  image: "",
  wa: "",
};

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
  const [saving, setSaving] = useState(false);

  const setField = (key, value) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "phone" || key === "name") {
        updated.wa = generateWa(
          key === "phone" ? value : prev.phone,
          key === "name" ? value : prev.name,
        );
      }
      return updated;
    });
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };
  const openEdit = (store) => {
    setForm({
      name: store.name ?? "",
      address: store.address ?? "",
      phone: store.phone ?? "",
      hours: store.hours ?? "",
      image: store.image ?? "",
      wa: store.wa ?? "",
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
    setSaving(true);
    try {
      if (editingId) await update(editingId, form);
      else await insert(form);
      closeModal();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: "image",
      label: "Foto",
      render: (v) =>
        v ? (
          <img
            src={v}
            alt=""
            className="w-12 h-12 rounded-lg object-cover border border-white/10"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/20 text-xs">
            —
          </div>
        ),
    },
    {
      key: "name",
      label: "Nama Cabang",
      render: (v) => <span className="font-semibold text-white">{v}</span>,
    },
    {
      key: "address",
      label: "Alamat",
      render: (v) => <span className="text-white/60">{v || "—"}</span>,
    },
    {
      key: "phone",
      label: "Telepon",
      render: (v) => <span className="text-white/60">{v || "—"}</span>,
    },
    {
      key: "hours",
      label: "Jam Buka",
      render: (v) => <span className="text-white/60">{v || "—"}</span>,
    },
  ];

  return (
    <div className="p-8">
      <PageHeader
        title="Cabang"
        desc={`${stores.length} cabang terdaftar`}
        onAdd={openAdd}
      />

      {loading ? (
        <TableSkeleton />
      ) : (
        <AdminTable
          columns={columns}
          rows={stores}
          onEdit={openEdit}
          onDelete={remove}
        />
      )}

      {showModal && (
        <Modal
          title={editingId ? "Edit Cabang" : "Tambah Cabang"}
          onClose={closeModal}
        >
          <div className="space-y-4">
            <Field label="Nama Cabang">
              <Input
                value={form.name}
                placeholder="Prime Cuts — Sudirman"
                onChange={(e) => setField("name", e.target.value)}
              />
            </Field>

            <Field label="Alamat">
              <Input
                value={form.address}
                placeholder="Jl. Sudirman No. 123"
                onChange={(e) => setField("address", e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Telepon">
                <Input
                  value={form.phone}
                  placeholder="0812-3456-7890"
                  onChange={(e) => setField("phone", e.target.value)}
                />
              </Field>
              <Field label="Jam Buka">
                <Input
                  value={form.hours}
                  placeholder="10.00 – 21.00"
                  onChange={(e) => setField("hours", e.target.value)}
                />
              </Field>
            </div>

            <Field label="Link WhatsApp (Auto)">
              <Input
                value={form.wa}
                readOnly
                className="opacity-40 cursor-default"
              />
            </Field>

            <Field label="Foto">
              <ImageUpload
                value={form.image}
                folder="stores"
                onChange={(url) => setField("image", url)}
              />
            </Field>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-2 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 active:scale-[0.98] disabled:opacity-50 text-sm font-semibold text-white transition-all"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
