import { useState } from "react";
import { useTable } from "../../hooks/useTable";
import { AdminTable, Modal, Field, Input, Select, SubmitBtn, Badge, PageHeader, TableSkeleton } from "../components/AdminUI";

const EMPTY = { name: "", duration: "", detail: "", price: "", is_premium: false };

export default function ServicesPage() {
  const { data, loading, insert, update, remove } = useTable("services", { orderBy: "created_at" });
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (row) => {
    setForm({ name: row.name, duration: row.duration, detail: row.detail, price: row.price, is_premium: row.is_premium });
    setEditId(row.id);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      editId ? await update(editId, form) : await insert(form);
      setModal(false);
    } catch (err) { alert(err.message); }
    setSaving(false);
  };

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const columns = [
    { key: "name", label: "Nama Layanan" },
    { key: "duration", label: "Durasi" },
    { key: "detail", label: "Detail" },
    { key: "price", label: "Harga" },
    { key: "is_premium", label: "Kategori", render: (v) => <Badge value={v} trueLabel="Premium" falseLabel="Reguler" /> },
  ];

  return (
    <div className="p-8">
      <PageHeader
        title="Services"
        desc={`${data.filter(s => !s.is_premium).length} reguler · ${data.filter(s => s.is_premium).length} premium`}
        onAdd={openAdd}
      />
      {loading ? <TableSkeleton /> : <AdminTable columns={columns} rows={data} onEdit={openEdit} onDelete={remove} />}

      {modal && (
        <Modal title={editId ? "Edit Service" : "Tambah Service"} onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Nama Layanan">
              <Input required value={form.name} onChange={set("name")} placeholder="cth: Classic Haircut" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Durasi">
                <Input required value={form.duration} onChange={set("duration")} placeholder="30 menit" />
              </Field>
              <Field label="Harga">
                <Input required value={form.price} onChange={set("price")} placeholder="Rp 25.000" />
              </Field>
            </div>
            <Field label="Detail / Deskripsi Singkat">
              <Input required value={form.detail} onChange={set("detail")} placeholder="cth: Gunting & clipper" />
            </Field>
            <Field label="Kategori">
              <Select value={form.is_premium} onChange={(e) => setForm(p => ({ ...p, is_premium: e.target.value === "true" }))}>
                <option value="false">Reguler</option>
                <option value="true">Premium</option>
              </Select>
            </Field>
            <SubmitBtn loading={saving} />
          </form>
        </Modal>
      )}
    </div>
  );
}
