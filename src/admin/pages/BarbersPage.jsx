import { useState } from "react";
import { useTable } from "../../hooks/useTable";
import {
  AdminTable,
  Modal,
  Field,
  Input,
  Select,
  SubmitBtn,
  Badge,
  PageHeader,
  TableSkeleton,
  ImageUpload,
} from "../components/AdminUI";

const ROLES = [
  "Senior Barber",
  "Fade Specialist",
  "Classic Shave Expert",
  "Color & Style",
  "Junior Barber",
];

const EMPTY = {
  name: "",
  role: ROLES[0],
  phone: "",
  store: "",
  wa: "",
  img_path: "",
  is_online: true,
};

export default function BarbersPage() {
  const { data, loading, insert, update, remove } = useTable("barbers", {
    orderBy: "created_at",
  });
  const { data: storesData } = useTable("stores", { orderBy: "name" });
  const STORES = storesData.map((s) => s.name);

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setForm(EMPTY);
    setEditId(null);
    setModal(true);
  };
  const openEdit = (row) => {
    setForm({
      name: row.name,
      role: row.role,
      phone: row.phone,
      store: row.store,
      wa: row.wa,
      img_path: row.img_path,
      is_online: row.is_online,
    });
    setEditId(row.id);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      editId ? await update(editId, form) : await insert(form);
      setModal(false);
    } catch (err) {
      alert(err.message);
    }
    setSaving(false);
  };

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    const digits = phone.replace(/\D/g, "");
    const intl = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
    const waText = encodeURIComponent(
      `Halo Kak ${form.name}, saya ingin booking `,
    );
    setForm((p) => ({
      ...p,
      phone,
      wa: `https://wa.me/${intl}?text=${waText}`,
    }));
  };

  const columns = [
    {
      key: "img_path",
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
    { key: "name", label: "Nama" },
    { key: "role", label: "Posisi" },
    { key: "store", label: "Cabang" },
    { key: "phone", label: "Telepon" },
    {
      key: "is_online",
      label: "Status",
      render: (v) => (
        <Badge value={v} trueLabel="Online" falseLabel="Offline" />
      ),
    },
  ];

  return (
    <div className="p-8">
      <PageHeader
        title="Barbers"
        desc={`${data.filter((b) => b.is_online).length} online · ${data.filter((b) => !b.is_online).length} offline`}
        onAdd={openAdd}
      />
      {loading ? (
        <TableSkeleton />
      ) : (
        <AdminTable
          columns={columns}
          rows={data}
          onEdit={openEdit}
          onDelete={remove}
        />
      )}

      {modal && (
        <Modal
          title={editId ? "Edit Barber" : "Tambah Barber"}
          onClose={() => setModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Nama Lengkap">
              <Input
                required
                value={form.name}
                onChange={set("name")}
                placeholder="cth: Rizal Pratama"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Posisi / Role">
                <Select value={form.role} onChange={set("role")}>
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Cabang">
                <Select value={form.store} onChange={set("store")}>
                  {STORES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Nomor Telepon (WA auto-generate)">
              <Input
                required
                value={form.phone}
                onChange={handlePhoneChange}
                placeholder="0812-3456-7890"
              />
            </Field>
            <Field label="Link WhatsApp (auto)">
              <Input
                value={form.wa}
                readOnly
                className="opacity-40 cursor-default"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Foto">
                <ImageUpload
                  value={form.img_path}
                  folder="barbers"
                  onChange={(url) => setForm((p) => ({ ...p, img_path: url }))}
                />
              </Field>
              <Field label="Status">
                <Select
                  value={String(form.is_online)}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      is_online: e.target.value === "true",
                    }))
                  }
                >
                  <option value="true">Online</option>
                  <option value="false">Offline</option>
                </Select>
              </Field>
            </div>
            <SubmitBtn loading={saving} />
          </form>
        </Modal>
      )}
    </div>
  );
}
