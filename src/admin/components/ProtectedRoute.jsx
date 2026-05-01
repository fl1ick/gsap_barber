// src/admin/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const ProtectedRoute = () => {
  const [session,  setSession]  = useState(undefined); // undefined = masih cek
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    // Cek session saat mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen perubahan auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Masih loading — tampilkan blank agar tidak flash
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#444",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.85rem",
      }}>
        Memuat...
      </div>
    );
  }

  // Belum login → redirect ke /admin/login
  if (!session) return <Navigate to="/admin/login" replace />;

  // Sudah login → render children (AdminLayout + pages)
  return <Outlet />;
};

export default ProtectedRoute;
