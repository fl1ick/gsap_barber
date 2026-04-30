import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { useTable } from "../hooks/useTable"; // ← tambah ini

// Generic hook untuk fetch data publik (read-only, untuk frontend)
function useFetch(tableName, orderBy = "created_at") {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from(tableName).select("*").order(orderBy)
      .then(({ data: rows }) => { setData(rows || []); setLoading(false); });
  }, [tableName]);

  return { data, loading };
}

// Services → split jadi regular & premium
export function useServices() {
  const { data, loading } = useFetch("services", "created_at");
  return {
    serviceLists: data.filter((s) => !s.is_premium),
    premiumLists: data.filter((s) => s.is_premium),
    loading,
  };
}

// Barbers → map snake_case ke camelCase sesuai format frontend lama
export function useBarbers() {
  const { data, loading } = useFetch("barbers", "created_at");
  return {
    barberLists: data.map((b) => ({
      ...b,
      imgPath: b.img_path,
      isOnline: b.is_online,
    })),
    loading,
  };
}

// Hairstyle showcase
export function useStyles() {
  const { data, loading } = useFetch("styles", "sort_order");
  return { allStyles: data, loading };
}

// Jam operasional
export function useOpeningHours() {
  const { data, loading } = useFetch("opening_hours", "sort_order");
  return { openingHours: data, loading };
}
export function useStores() {
  const { data: stores, loading } = useTable("stores", { orderBy: "name" });
  return { stores, loading };
}
