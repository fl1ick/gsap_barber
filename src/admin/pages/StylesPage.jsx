import { useState } from "react";
import { useTable } from "../../hooks/useTable";
import {
  AdminTable,
  Modal,
  Field,
  Input,
  Textarea,
  SubmitBtn,
  PageHeader,
  TableSkeleton,
  ImageUpload,
} from "../components/AdminUI";

const EMPTY = {
  name: "",
  image: "",
  title: "",
  description: "",
  sort_order: 1,
};

export default function StylesPage() {
  const { data, loading, insert, update, remove } = useTable("styles", {
    orderBy: "sort_order",
  });
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setForm({ ...EMPTY, sort_order: data.length + 1 });
    setEditId(null);
    setModal(true);
  };
  const openEdit = (row) => {
    setForm({
      name: row.name,
      image: row.image,
      title: row.title,
      description: row.description,
      sort_order: row.sort_order,
    });
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
    } catch (err) {
      alert(err.message);
    }
    setSaving(false);
  };

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const columns = [
    {
      key: "sort_order",
      label: "#",
      render: (v) => (
        <span className="text-white/30 font-mono text-xs">{v}</span>
      ),
    },
    { key: "name", label: "Nama Style" },
    { key: "title", label: "Tagline" },
    {
      key: "description",
      label: "Deskripsi",
      render: (v) => (
        <span className="line-clamp-1 max-w-xs block text-white/50 text-xs">
          {v}
        </span>
      ),
    },
    {
      key: "image",
      label: "Path Gambar",
      render: (v) => (
        <span className="text-xs text-white/30 font-mono">{v}</span>
      ),
    },
  ];

  return (
    <div className="p-8">
      <PageHeader
        title="Hairstyle Showcase"
        desc="Gaya rambut yang tampil di halaman utama"
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
          title={editId ? "Edit Hairstyle" : "Tambah Hairstyle"}
          onClose={() => setModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Field label="Nama Style">
                  <Input
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="cth: Classic Cut"
                  />
                </Field>
              </div>
              <Field label="Urutan">
                <Input
                  type="number"
                  min="1"
                  value={form.sort_order}
                  onChange={set("sort_order")}
                />
              </Field>
            </div>
            <Field label="Tagline">
              <Input
                required
                value={form.title}
                onChange={set("title")}
                placeholder="cth: Timeless & Clean"
              />
            </Field>
            <Field label="Foto">
              <ImageUpload
                value={form.img_path}
                folder="barbers"
                onChange={(url) => setForm((p) => ({ ...p, img_path: url }))}
              />
            </Field>
            <Field label="Foto">
              <ImageUpload
                value={form.image}
                folder="styles"
                onChange={(url) => setForm((p) => ({ ...p, image: url }))}
              />
            </Field>
            <Field label="Deskripsi">
              <Textarea
                required
                value={form.description}
                onChange={set("description")}
                placeholder="Deskripsi gaya rambut..."
              />
            </Field>
            <SubmitBtn loading={saving} />
          </form>
        </Modal>
      )}
    </div>
  );
}
