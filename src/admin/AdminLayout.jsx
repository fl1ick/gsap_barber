import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "▦", end: true },
  { to: "/admin/services", label: "Services", icon: "✂" },
  { to: "/admin/barbers", label: "Barbers", icon: "👤" },
  { to: "/admin/styles", label: "Hairstyles", icon: "◈" },
  { to: "/admin/hours", label: "Jam Buka", icon: "◷" },
  { to: "/admin/stores", label: "Cabang", icon: "🏪" },
];

export default function AdminLayout() {
  return (
    // Gunakan h-screen dan overflow-hidden agar tidak scroll satu halaman penuh
    <div className="flex h-screen w-full bg-neutral-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#0b0f0f] border-r border-white/10 flex flex-col">
        {/* Header - Beri padding yang konsisten dan cegah shrinking */}
        <div className="p-6 shrink-0 border-b border-white/10">
          <p className="text-[10px] font-bold tracking-[0.2em] text-teal-500 uppercase">
            Prime Cuts
          </p>
          <h1 className="text-xl font-bold mt-1 text-white">Admin Panel</h1>
        </div>

        {/* Navigation - Tambahkan flex-1 agar memenuhi sisa ruang */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-teal-400 bg-teal-500/10"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Indikator Aktif - Pastikan tidak 'absolute' menutupi teks */}
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-teal-400 rounded-r transition-opacity ${
                      isActive
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-40"
                    }`}
                  />

                  {/* Icon */}
                  <span className="flex-shrink-0 w-5 text-center text-lg">
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer - Taruh di paling bawah */}
        <div className="p-4 shrink-0 border-t border-white/10">
          <a
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-white/40 hover:text-teal-400 transition-colors"
          >
            <span>←</span> Lihat Website
          </a>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto bg-neutral-950">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
