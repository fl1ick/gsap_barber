import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [stats, setStats] = useState({ services: 0, premium: 0, barbers: 0, online: 0, styles: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("services").select("id, is_premium"),
      supabase.from("barbers").select("id, is_online"),
      supabase.from("styles").select("id"),
    ]).then(([s, b, st]) => {
      setStats({
        services: s.data?.length ?? 0,
        premium: s.data?.filter((x) => x.is_premium).length ?? 0,
        barbers: b.data?.length ?? 0,
        online: b.data?.filter((x) => x.is_online).length ?? 0,
        styles: st.data?.length ?? 0,
      });
      setLoading(false);
    });
  }, []);

  const statCards = [
    { to: "/admin/services", label: "Total Services", value: stats.services, sub: `${stats.premium} premium`, color: "from-teal-900/50 border-teal-700/25" },
    { to: "/admin/barbers", label: "Total Barbers", value: stats.barbers, sub: `${stats.online} online sekarang`, color: "from-sky-900/50 border-sky-700/25" },
    { to: "/admin/styles", label: "Hairstyles", value: stats.styles, sub: "di halaman utama", color: "from-violet-900/50 border-violet-700/25" },
  ];

  const menuCards = [
    { to: "/admin/services", icon: "✂", title: "Kelola Services", desc: "Tambah, edit, hapus layanan & harga" },
    { to: "/admin/barbers", icon: "👤", title: "Kelola Barbers", desc: "Data barber, status online, link WhatsApp" },
    { to: "/admin/styles", icon: "◈", title: "Kelola Hairstyles", desc: "Showcase gaya rambut di halaman utama" },
    { to: "/admin/hours", icon: "◷", title: "Jam Operasional", desc: "Atur jam buka barbershop per hari" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Selamat datang di admin panel Prime Cuts</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {statCards.map((c) => (
          <Link key={c.to} to={c.to}
            className={`rounded-xl border bg-gradient-to-br ${c.color} to-transparent p-5 hover:scale-[1.02] transition-transform`}>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3">{c.label}</p>
            <p className="text-4xl font-bold text-white">
              {loading ? <span className="inline-block w-8 h-8 rounded bg-white/10 animate-pulse" /> : c.value}
            </p>
            <p className="text-white/30 text-xs mt-2">{c.sub}</p>
          </Link>
        ))}
      </div>

      {/* Menu cards */}
      <div className="grid grid-cols-2 gap-3">
        {menuCards.map((item) => (
          <Link key={item.to} to={item.to}
            className="flex items-start gap-4 rounded-xl border border-white/8 bg-white/[0.03] p-5 hover:bg-white/[0.07] transition-colors">
            <span className="text-2xl mt-0.5">{item.icon}</span>
            <div>
              <p className="font-semibold text-sm text-white">{item.title}</p>
              <p className="text-white/40 text-xs mt-1">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
