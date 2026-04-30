import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useTable(tableName, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    let query = supabase.from(tableName).select("*");
    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? true });
    }
    const { data: rows, error: err } = await query;
    if (err) setError(err.message);
    else setData(rows || []);
    setLoading(false);
  }, [tableName]);

  useEffect(() => { fetch(); }, [fetch]);

  const insert = async (row) => {
  const { data: newRow, error: err } = await supabase
    .from(tableName)
    .insert(row)
    .select()
    .maybeSingle(); // ← ganti single() → maybeSingle()
  
  if (err) throw new Error(err.message);
  if (!newRow) throw new Error("Insert berhasil tapi data tidak dikembalikan");
  
  setData((prev) => [...prev, newRow]);
  return newRow;
};

const update = async (id, updates) => {
  const { data: updated, error: err } = await supabase
    .from(tableName)
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle(); // ← ganti single() → maybeSingle()
  
  if (err) throw new Error(err.message);
  if (!updated) throw new Error(`Tidak ada baris dengan id: ${id}`);
  
  setData((prev) => prev.map((r) => (r.id === id ? updated : r)));
  return updated;
};

  const remove = async (id) => {
    const { error: err } = await supabase.from(tableName).delete().eq("id", id);
    if (err) throw new Error(err.message);
    setData((prev) => prev.filter((r) => r.id !== id));
  };

  return { data, loading, error, refetch: fetch, insert, update, remove };
}
