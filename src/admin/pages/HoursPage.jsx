import { useState } from "react";
import { useTable } from "../../hooks/useTable";
import { AdminTable, Modal, Field, Input, SubmitBtn, PageHeader, TableSkeleton } from "../components/AdminUI";

const EMPTY = { day: "", time: "", sort_order: 1 };

export default function HoursPage() {
  const { data, loading, insert, update, remove } = useTable("opening_hours", { orderBy: "sort_order" });
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setForm({ ...EMPTY, sort_order: data.length + 1 }); setEditId(null); setModal(true); };
  const openEdit = (row) => {
    setForm({ day: row.day, time: row.time, sort_order: row.sort_order });
    setEditId(row.id);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, sort_order: Number(form.sort_order) };
      editId ? await update(editId, payload) : await insert(payload);
      setModal(false);
    } catch (err) { alert(err.message); }
    setSaving(false);
  };

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const columns = [
    { key: "sort_order", label: "#", render: (v) => <span className="text-white/30 font-mono text-xs">{v}</span> },
    { key: "day", label: "Hari" },
    { key: "time", label: "Jam Operasional" },
  ];

  return (
    <div className="p-8">
      <PageHeader title="Jam Operasional" desc="Jam buka barbershop per hari" onAdd={openAdd} />
      {loading ? <TableSkeleton /> : <AdminTable columns={columns} rows={data} onEdit={openEdit} onDelete={remove} />}

      {modal && (
        <Modal title={editId ? "Edit Jadwal" : "Tambah Jadwal"} onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Field label="Hari">
                  <Input required value={form.day} onChange={set("day")} placeholder="cth: Sen–Kam atau Sabtu" />
                </Field>
              </div>
              <Field label="Urutan">
                <Input type="number" min="1" value={form.sort_order} onChange={set("sort_order")} />
              </Field>
            </div>
            <Field label="Jam Operasional">
              <Input required value={form.time} onChange={set("time")} placeholder="cth: 10.00 – 21.00" />
            </Field>
            <SubmitBtn loading={saving} />
          </form>
        </Modal>
      )}
    </div>
  );
}
