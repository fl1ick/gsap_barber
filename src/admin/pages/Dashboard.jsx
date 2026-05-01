import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [stats, setStats] = useState({
    services: 0, premium: 0,
    barbers: 0, online: 0,
    styles: 0,
    totalCuts: 0, totalRevenue: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [txLoading, setTxLoading]       = useState(true);

  useEffect(() => {
    // Stat cards
    Promise.all([
      supabase.from("services").select("id, is_premium"),
      supabase.from("barbers").select("id, is_online"),
      supabase.from("styles").select("id"),
      supabase.from("barber_stats_this_month").select("total_cuts, total_revenue"),
    ]).then(([s, b, st, bs]) => {
      const totalCuts    = bs.data?.reduce((a, x) => a + Number(x.total_cuts), 0) ?? 0;
      const totalRevenue = bs.data?.reduce((a, x) => a + Number(x.total_revenue), 0) ?? 0;
      setStats({
        services:      s.data?.length ?? 0,
        premium:       s.data?.filter((x) => x.is_premium).length ?? 0,
        barbers:       b.data?.length ?? 0,
        online:        b.data?.filter((x) => x.is_online).length ?? 0,
        styles:        st.data?.length ?? 0,
        totalCuts,
        totalRevenue,
      });
      setLoading(false);
    });

    // Transaksi terbaru
    supabase
      .from("transactions_detail")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => {
        setTransactions(data ?? []);
        setTxLoading(false);
      });
  }, []);

  const formatRupiah = (num) =>
    "Rp " + Number(num).toLocaleString("id-ID");

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }) +
      " · " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  const statCards = [
    {
      to: "/admin/services", label: "Total Services",
      value: stats.services, sub: `${stats.premium} premium`,
      color: "from-teal-900/50 border-teal-700/25",
    },
    {
      to: "/admin/barbers", label: "Total Barbers",
      value: stats.barbers, sub: `${stats.online} online sekarang`,
      color: "from-sky-900/50 border-sky-700/25",
    },
    {
      to: "/admin/styles", label: "Hairstyles",
      value: stats.styles, sub: "di halaman utama",
      color: "from-violet-900/50 border-violet-700/25",
    },
    {
      to: "/admin/barbers", label: "Potongan Bulan Ini",
      value: stats.totalCuts, sub: "total semua barber",
      color: "from-amber-900/50 border-amber-700/25",
    },
    {
      to: "/admin/barbers", label: "Pendapatan Bulan Ini",
      value: formatRupiah(stats.totalRevenue), sub: "dari semua transaksi",
      color: "from-emerald-900/50 border-emerald-700/25",
      wide: true,
    },
  ];

  const menuCards = [
    { to: "/admin/services", icon: "✂",  title: "Kelola Services",    desc: "Tambah, edit, hapus layanan & harga" },
    { to: "/admin/barbers",  icon: "👤", title: "Kelola Barbers",     desc: "Data barber, status online, link WhatsApp" },
    { to: "/admin/styles",   icon: "◈",  title: "Kelola Hairstyles",  desc: "Showcase gaya rambut di halaman utama" },
    { to: "/admin/hours",    icon: "◷",  title: "Jam Operasional",    desc: "Atur jam buka barbershop per hari" },
  ];

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Selamat datang di admin panel Prime Cuts</p>
      </div>

      {/* Stat cards — baris 1 (3 kolom) */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {statCards.slice(0, 3).map((c) => (
          <Link key={c.label} to={c.to}
            className={`rounded-xl border bg-gradient-to-br ${c.color} to-transparent p-5 hover:scale-[1.02] transition-transform`}>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3">{c.label}</p>
            <p className="text-4xl font-bold text-white">
              {loading
                ? <span className="inline-block w-8 h-8 rounded bg-white/10 animate-pulse" />
                : c.value}
            </p>
            <p className="text-white/30 text-xs mt-2">{c.sub}</p>
          </Link>
        ))}
      </div>

      {/* Stat cards — baris 2 (potongan + pendapatan) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {statCards.slice(3).map((c) => (
          <Link key={c.label} to={c.to}
            className={`rounded-xl border bg-gradient-to-br ${c.color} to-transparent p-5 hover:scale-[1.02] transition-transform`}>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3">{c.label}</p>
            <p className="text-3xl font-bold text-white">
              {loading
                ? <span className="inline-block w-24 h-8 rounded bg-white/10 animate-pulse" />
                : c.value}
            </p>
            <p className="text-white/30 text-xs mt-2">{c.sub}</p>
          </Link>
        ))}
      </div>

      {/* Transaksi terbaru */}
      <div className="rounded-xl border border-white/8 bg-white/[0.03] overflow-hidden mb-8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <p className="text-sm font-semibold text-white">Transaksi Terbaru</p>
          <Link to="/admin/barbers" className="text-xs text-white/40 hover:text-white/70 transition-colors">
            Lihat semua →
          </Link>
        </div>

        {txLoading ? (
          <div className="p-8 text-center text-white/30 text-sm">Memuat transaksi...</div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-white/30 text-sm">Belum ada transaksi.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/30 text-xs uppercase tracking-widest">
                <th className="text-left px-5 py-3 font-medium">Pelanggan</th>
                <th className="text-left px-5 py-3 font-medium">Barber</th>
                <th className="text-left px-5 py-3 font-medium">Layanan</th>
                <th className="text-left px-5 py-3 font-medium">Cabang</th>
                <th className="text-right px-5 py-3 font-medium">Harga</th>
                <th className="text-right px-5 py-3 font-medium">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={tx.id}
                  className={`border-t border-white/5 hover:bg-white/[0.03] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.015]"}`}>
                  <td className="px-5 py-3 text-white font-medium">{tx.customer_name}</td>
                  <td className="px-5 py-3 text-white/60">{tx.barber_name}</td>
                  <td className="px-5 py-3 text-white/60">{tx.service_name}</td>
                  <td className="px-5 py-3 text-white/40 text-xs">{tx.store ?? "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-amber-400 font-semibold">{tx.price}</span>
                  </td>
                  <td className="px-5 py-3 text-right text-white/30 text-xs whitespace-nowrap">
                    {formatDate(tx.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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