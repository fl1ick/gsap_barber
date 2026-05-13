import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTable } from "../hooks/useTable";
import { useServices } from "../lib/data";
import { supabase } from "../lib/supabase";
// ─────────────── HELPERS ───────────────
const fmt = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n ?? 0);

// Tampilkan harga: number → format IDR, string "Rp 35.000" → tampil apa adanya
const displayPrice = (p) => (typeof p === "number" ? fmt(p) : (p ?? "—"));

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

const PAYMENT_LABEL = {
  cash: "Bayar di Tempat (Cash)",
  transfer: "Transfer Bank",
  qris: "QRIS",
};

// ─────────────── SHARED STYLES ───────────────
const headingStyle = {
  fontFamily: "'Georgia', serif",
  fontSize: "1.6rem",
  color: "#e7d393",
  marginBottom: "0.5rem",
  marginTop: 0,
};
const subStyle = {
  color: "rgba(255,255,255,0.45)",
  fontSize: "0.875rem",
  marginBottom: "1.75rem",
  marginTop: 0,
};
const sectionLabel = {
  fontSize: "0.7rem",
  letterSpacing: "0.1em",
  color: "rgba(255,255,255,0.3)",
  fontWeight: 600,
  textTransform: "uppercase",
  marginBottom: "0.75rem",
};
const labelWrap = {
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
  marginBottom: "1rem",
};
const labelTxt = {
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "rgba(255,255,255,0.5)",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};
const inputSt = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "0.625rem",
  padding: "0.65rem 0.875rem",
  color: "rgba(255,255,255,0.85)",
  fontSize: "0.9rem",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "inherit",
};
const btnPrimary = {
  background: "#e7d393",
  border: "none",
  borderRadius: 999,
  padding: "0.65rem 2rem",
  color: "#000",
  fontSize: "0.875rem",
  fontWeight: 700,
  cursor: "pointer",
  letterSpacing: "0.02em",
};
const btnSecondary = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 999,
  padding: "0.65rem 1.5rem",
  color: "rgba(255,255,255,0.6)",
  fontSize: "0.875rem",
  cursor: "pointer",
};
const btnDisabled = {
  background: "rgba(231,211,147,0.2)",
  border: "none",
  borderRadius: 999,
  padding: "0.65rem 2rem",
  color: "rgba(255,255,255,0.25)",
  fontSize: "0.875rem",
  fontWeight: 700,
  cursor: "not-allowed",
  letterSpacing: "0.02em",
};

// ─────────────── STEP INDICATOR ───────────────
const Steps = ({ current }) => {
  const steps = ["Barber", "Layanan", "Jadwal", "Pembayaran"];
  return (
    <div
      style={{ display: "flex", alignItems: "center", marginBottom: "2.5rem" }}
    >
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = current > idx;
        const active = current === idx;
        return (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              flex: i < steps.length - 1 ? 1 : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: done
                    ? "#e7d393"
                    : active
                      ? "rgba(231,211,147,0.15)"
                      : "rgba(255,255,255,0.05)",
                  border: `2px solid ${done || active ? "#e7d393" : "rgba(255,255,255,0.12)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s",
                }}
              >
                {done ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8l3.5 3.5L13 4.5"
                      stroke="#000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: active ? "#e7d393" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {idx}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  color: active
                    ? "#e7d393"
                    : done
                      ? "rgba(231,211,147,0.6)"
                      : "rgba(255,255,255,0.3)",
                  whiteSpace: "nowrap",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: done ? "#e7d393" : "rgba(255,255,255,0.1)",
                  margin: "0 0.75rem",
                  marginBottom: "1.4rem",
                  transition: "background 0.3s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─────────────── STEP 1: PILIH BARBER ───────────────
const StepBarber = ({ selected, onSelect, barbers, loading }) => {
  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        Memuat data barber...
      </div>
    );

  const list = barbers
    .map((b) => ({
      id: b.id,
      name: b.name,
      role: b.role,
      store: b.store,
      imgPath: b.img_path,
      isOnline: b.is_online,
    }))
    .sort((a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0));

  return (
    <div>
      <h3 style={headingStyle}>Pilih Barber</h3>
      <p style={subStyle}>
        Barber yang sedang bertugas ditampilkan terlebih dahulu.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {list.map((b) => (
          <button
            key={b.id}
            onClick={() => b.isOnline && onSelect(b)}
            disabled={!b.isOnline}
            style={{
              border:
                selected?.id === b.id
                  ? "2px solid #e7d393"
                  : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "1rem",
              overflow: "hidden",
              background: "transparent",
              cursor: b.isOnline ? "pointer" : "not-allowed",
              opacity: b.isOnline ? 1 : 0.45,
              textAlign: "left",
              transition: "border-color 0.2s, transform 0.2s",
              transform: selected?.id === b.id ? "scale(1.02)" : "scale(1)",
              padding: 0,
            }}
          >
            <div
              style={{ height: 180, overflow: "hidden", position: "relative" }}
            >
              <img
                src={b.imgPath}
                alt={b.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: b.isOnline ? "none" : "grayscale(60%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "0.6rem",
                  right: "0.6rem",
                  background: "rgba(0,0,0,0.6)",
                  border: `1px solid ${b.isOnline ? "rgba(74,222,128,0.5)" : "rgba(255,255,255,0.2)"}`,
                  borderRadius: 999,
                  padding: "0.2rem 0.55rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: b.isOnline ? "rgb(74,222,128)" : "#555",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: b.isOnline
                      ? "rgb(74,222,128)"
                      : "rgba(255,255,255,0.4)",
                    fontWeight: 600,
                  }}
                >
                  {b.isOnline ? "Bertugas" : "Off"}
                </span>
              </div>
            </div>
            <div
              style={{
                padding: "0.875rem 1rem",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <p
                style={{
                  color: "#e7d393",
                  fontWeight: 600,
                  margin: 0,
                  fontSize: "0.95rem",
                }}
              >
                {b.name}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "0.75rem",
                  margin: "0.2rem 0 0",
                }}
              >
                {b.role}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "0.7rem",
                  margin: "0.15rem 0 0",
                }}
              >
                📍 {b.store}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─────────────── STEP 2: PILIH LAYANAN ───────────────
const StepService = ({
  selected,
  onSelect,
  serviceLists,
  premiumLists,
  loading,
}) => {
  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        Memuat layanan...
      </div>
    );

  const Card = ({ s, category }) => (
    <button
      onClick={() => onSelect({ ...s, category })}
      style={{
        border:
          selected?.name === s.name
            ? "2px solid #e7d393"
            : "1px solid rgba(255,255,255,0.1)",
        borderRadius: "0.875rem",
        background:
          selected?.name === s.name
            ? "rgba(231,211,147,0.07)"
            : "rgba(255,255,255,0.03)",
        padding: "1rem 1.25rem",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        transition: "all 0.2s",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <p
          style={{
            color:
              selected?.name === s.name ? "#e7d393" : "rgba(255,255,255,0.85)",
            fontWeight: 600,
            margin: 0,
            fontSize: "0.95rem",
          }}
        >
          {s.name}
        </p>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.78rem",
            margin: "0.25rem 0 0",
          }}
        >
          ⏱ {s.duration}
          {s.detail ? ` · ${s.detail}` : ""}
        </p>
      </div>
      <span
        style={{
          color: "#e7d393",
          fontWeight: 700,
          fontSize: "1rem",
          whiteSpace: "nowrap",
          marginLeft: "1rem",
        }}
      >
        {displayPrice(s.price)}
      </span>
    </button>
  );

  return (
    <div>
      <h3 style={headingStyle}>Pilih Layanan</h3>
      <p style={subStyle}>Pilih satu layanan utama untuk kunjunganmu.</p>
      <p style={sectionLabel}>Layanan Reguler</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.65rem",
          marginBottom: "1.5rem",
        }}
      >
        {serviceLists.map((s) => (
          <Card key={s.name} s={s} category="regular" />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "0.75rem",
        }}
      >
        <p style={{ ...sectionLabel, margin: 0 }}>Premium Grooming</p>
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            padding: "0.15rem 0.5rem",
            borderRadius: 999,
            border: "1px solid rgba(231,211,147,0.4)",
            color: "rgba(231,211,147,0.8)",
            background: "rgba(231,211,147,0.08)",
          }}
        >
          ★ Premium
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        {premiumLists.map((s) => (
          <Card key={s.name} s={s} category="premium" />
        ))}
      </div>
    </div>
  );
};

// ─────────────── STEP 3: JADWAL ───────────────
const StepSchedule = ({ form, setForm }) => {
  const today = new Date().toISOString().split("T")[0];
  return (
    <div>
      <h3 style={headingStyle}>Jadwal & Info</h3>
      <p style={subStyle}>Isi data diri dan pilih waktu kunjungan.</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <label style={labelWrap}>
          <span style={labelTxt}>Nama Lengkap *</span>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nama kamu"
            style={inputSt}
          />
        </label>
        <label style={labelWrap}>
          <span style={labelTxt}>No. WhatsApp *</span>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="08xxxxxxxxxx"
            style={inputSt}
          />
        </label>
      </div>
      <label style={{ ...labelWrap, marginBottom: "1.25rem" }}>
        <span style={labelTxt}>Tanggal Kunjungan *</span>
        <input
          type="date"
          min={today}
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          style={inputSt}
        />
      </label>
      <p style={{ ...labelTxt, marginBottom: "0.75rem" }}>Pilih Jam *</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "0.5rem",
          marginBottom: "1.25rem",
        }}
      >
        {TIME_SLOTS.map((t) => (
          <button
            key={t}
            onClick={() => setForm({ ...form, time: t })}
            style={{
              padding: "0.5rem",
              borderRadius: "0.5rem",
              fontSize: "0.85rem",
              fontWeight: 500,
              border:
                form.time === t
                  ? "2px solid #e7d393"
                  : "1px solid rgba(255,255,255,0.12)",
              background:
                form.time === t
                  ? "rgba(231,211,147,0.12)"
                  : "rgba(255,255,255,0.03)",
              color: form.time === t ? "#e7d393" : "rgba(255,255,255,0.65)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <label style={labelWrap}>
        <span style={labelTxt}>Catatan (opsional)</span>
        <textarea
          rows={3}
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Model rambut, warna, atau permintaan khusus..."
          style={{
            ...inputSt,
            resize: "vertical",
            minHeight: 80,
            lineHeight: 1.5,
          }}
        />
      </label>
    </div>
  );
};

// ─────────────── STEP 4: PEMBAYARAN ───────────────
// ⚠️ id HARUS cocok dengan CHECK constraint Supabase:
// CHECK (payment = ANY (ARRAY['cash'::text, 'transfer'::text, 'qris'::text]))
const PAYMENT_METHODS = [
  {
    id: "cash",
    label: "Bayar di Tempat (Cash)",
    icon: "💵",
    desc: "Bayar langsung saat datang ke barbershop.",
  },
  {
    id: "transfer",
    label: "Transfer Bank",
    icon: "🏦",
    desc: "Transfer ke rekening BCA atau Mandiri kami.",
    info: "BCA 1234567890  ·  Mandiri 0987654321  —  a.n. Cut & Shop Indonesia",
  },
  {
    id: "qris",
    label: "QRIS",
    icon: "📱",
    desc: "Scan QR via e-wallet apapun (GoPay, OVO, Dana, dll).",
  },
];

const StepPayment = ({ barber, service, form, setForm }) => (
  <div>
    <h3 style={headingStyle}>Metode Pembayaran</h3>
    <p style={subStyle}>Pilih cara pembayaran yang paling mudah untukmu.</p>
    <div
      style={{
        border: "1px solid rgba(231,211,147,0.2)",
        borderRadius: "0.875rem",
        padding: "1rem 1.25rem",
        marginBottom: "1.75rem",
        background: "rgba(231,211,147,0.04)",
      }}
    >
      <p
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          color: "rgba(231,211,147,0.6)",
          fontWeight: 700,
          textTransform: "uppercase",
          margin: "0 0 0.75rem",
        }}
      >
        Ringkasan Booking
      </p>
      {[
        ["Barber", barber?.name],
        ["Layanan", service?.name],
        ["Tanggal", form.date],
        ["Jam", form.time],
        ["Pelanggan", form.name],
      ].map(([k, v]) => (
        <div
          key={k}
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.85rem",
            padding: "0.2rem 0",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.4)" }}>{k}</span>
          <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
            {v || "—"}
          </span>
        </div>
      ))}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          marginTop: "0.5rem",
          paddingTop: "0.5rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: "#e7d393", fontWeight: 700 }}>Total</span>
        <span style={{ color: "#e7d393", fontWeight: 700, fontSize: "1.1rem" }}>
          {displayPrice(service?.price)}
        </span>
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {PAYMENT_METHODS.map((m) => (
        <button
          key={m.id}
          onClick={() => setForm({ ...form, payment: m.id })}
          style={{
            border:
              form.payment === m.id
                ? "2px solid #e7d393"
                : "1px solid rgba(255,255,255,0.1)",
            borderRadius: "0.875rem",
            padding: "1rem 1.25rem",
            background:
              form.payment === m.id
                ? "rgba(231,211,147,0.07)"
                : "rgba(255,255,255,0.03)",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span style={{ fontSize: "1.4rem" }}>{m.icon}</span>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  color:
                    form.payment === m.id
                      ? "#e7d393"
                      : "rgba(255,255,255,0.85)",
                  fontWeight: 600,
                  margin: 0,
                  fontSize: "0.9rem",
                }}
              >
                {m.label}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.78rem",
                  margin: "0.2rem 0 0",
                }}
              >
                {m.desc}
              </p>
              {form.payment === m.id && m.info && (
                <p
                  style={{
                    color: "rgba(231,211,147,0.8)",
                    fontSize: "0.8rem",
                    margin: "0.5rem 0 0",
                    fontWeight: 600,
                    background: "rgba(231,211,147,0.1)",
                    padding: "0.4rem 0.65rem",
                    borderRadius: "0.4rem",
                    display: "inline-block",
                  }}
                >
                  🔑 {m.info}
                </p>
              )}
            </div>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: `2px solid ${form.payment === m.id ? "#e7d393" : "rgba(255,255,255,0.25)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {form.payment === m.id && (
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#e7d393",
                  }}
                />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

// ─────────────── SUCCESS ───────────────
const SuccessScreen = ({ barber, service, form, onReset, onHome }) => (
  <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: "rgba(74,222,128,0.15)",
        border: "2px solid rgba(74,222,128,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 1.5rem",
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M7 16l6 6L25 10"
          stroke="rgb(74,222,128)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <h3 style={{ ...headingStyle, textAlign: "center" }}>Booking Berhasil!</h3>
    <p
      style={{
        color: "rgba(255,255,255,0.5)",
        fontSize: "0.9rem",
        marginBottom: "2rem",
      }}
    >
      Konfirmasi akan dikirim via WhatsApp segera.
    </p>
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "1rem",
        padding: "1.25rem",
        maxWidth: 360,
        margin: "0 auto 2rem",
        textAlign: "left",
      }}
    >
      {[
        ["Barber", barber?.name],
        ["Layanan", service?.name],
        ["Tanggal", form.date],
        ["Jam", form.time],
        ["Pembayaran", PAYMENT_LABEL[form.payment] ?? form.payment],
        ["Total", displayPrice(service?.price)],
      ].map(([k, v]) => (
        <div
          key={k}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.35rem 0",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            fontSize: "0.875rem",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.4)" }}>{k}</span>
          <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
            {v}
          </span>
        </div>
      ))}
    </div>
    {/* Dua tombol: booking baru & kembali ke beranda */}
    <div
      style={{
        display: "flex",
        gap: "0.75rem",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <button onClick={onReset} style={btnPrimary}>
        Buat Booking Baru
      </button>
      <button onClick={onHome} style={btnSecondary}>
        ← Kembali ke Beranda
      </button>
    </div>
  </div>
);

// ─────────────── MAIN ───────────────
const BookingPage = () => {
  const { barberId } = useParams();
  const navigate = useNavigate();

  const { data: rawBarbers, loading: loadingBarbers } = useTable("barbers", {
    orderBy: "name",
  });
  const {
    serviceLists,
    premiumLists,
    loading: loadingServices,
  } = useServices();

  const [step, setStep] = useState(1);
  const [barber, setBarber] = useState(null);
  const [service, setService] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    note: "",
    payment: "",
  });

  useEffect(() => {
    if (!barberId || loadingBarbers || rawBarbers.length === 0) return;
    const found = rawBarbers.find((b) => String(b.id) === String(barberId));
    if (found?.is_online) {
      setBarber({
        id: found.id,
        name: found.name,
        role: found.role,
        store: found.store,
        imgPath: found.img_path,
        isOnline: found.is_online,
      });
      setStep(2);
    }
  }, [barberId, loadingBarbers, rawBarbers]);

  const canNext = () => {
    if (step === 1) return !!barber;
    if (step === 2) return !!service;
    if (step === 3)
      return !!(form.name && form.phone && form.date && form.time);
    if (step === 4) return !!form.payment;
    return false;
  };

  const handleSubmit = async () => {
    // price bisa number (Supabase) atau string "Rp 35.000" (constants) → parse ke integer
    const parsedPrice =
      typeof service.price === "number"
        ? service.price
        : parseInt(String(service.price ?? "").replace(/\D/g, ""), 10) || null;

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          barber_id: barber.id,
          service_name: service.name,
          service_price: parsedPrice,
          customer_name: form.name,
          customer_phone: form.phone,
          date: form.date,
          time: form.time,
          note: form.note,
          payment: form.payment, // 'cash' | 'transfer' | 'qris'
          status: "pending",
        })
        .select();

      if (error) {
        alert(error.message);
        return;
      }

      console.log("Booking submitted:", data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setStep(1);
    setBarber(null);
    setService(null);
    setSubmitted(false);
    setForm({ name: "", phone: "", date: "", time: "", note: "", payment: "" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 50% 0%, #2a2a2a 0%, #000 55%)",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Header custom — tidak fixed, tidak tertimpa Navbar */}
      <header
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "1rem 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 999,
              padding: "0.4rem 0.9rem",
              cursor: "pointer",
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.82rem",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#e7d393";
              e.currentTarget.style.color = "#e7d393";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8l4-4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Beranda
          </button>
          <span
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "1.3rem",
              color: "#e7d393",
              letterSpacing: "0.05em",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Cut &amp; Shop
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Booking Online
          </span>
        </div>
      </header>

      <main
        style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.5rem 5rem" }}
      >
        {submitted ? (
          <SuccessScreen
            barber={barber}
            service={service}
            form={form}
            onReset={handleReset}
            onHome={() => navigate("/")}
          />
        ) : (
          <>
            <Steps current={step} />
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1.25rem",
                padding: "2rem",
                marginBottom: "1.5rem",
              }}
            >
              {step === 1 && (
                <StepBarber
                  selected={barber}
                  onSelect={setBarber}
                  barbers={rawBarbers}
                  loading={loadingBarbers}
                />
              )}
              {step === 2 && (
                <StepService
                  selected={service}
                  onSelect={setService}
                  serviceLists={serviceLists}
                  premiumLists={premiumLists}
                  loading={loadingServices}
                />
              )}
              {step === 3 && <StepSchedule form={form} setForm={setForm} />}
              {step === 4 && (
                <StepPayment
                  barber={barber}
                  service={service}
                  form={form}
                  setForm={setForm}
                />
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)} style={btnSecondary}>
                  ← KembalI
                </button>
              ) : (
                <button onClick={() => navigate("/")} style={btnSecondary}>
                  ← Beranda
                </button>
              )}
              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canNext()}
                  style={canNext() ? btnPrimary : btnDisabled}
                >
                  Lanjut →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canNext()}
                  style={canNext() ? btnPrimary : btnDisabled}
                >
                  ✓ Konfirmasi Booking
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default BookingPage;
