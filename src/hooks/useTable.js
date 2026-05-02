import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";

export function useTable(tableName, options = {}) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const orderBy    = options.orderBy;
  const ascending  = options.ascending ?? true;

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    let query = supabase.from(tableName).select("*");
    if (orderBy) query = query.order(orderBy, { ascending });
    const { data: rows, error: err } = await query;
    if (err) setError(err.message);
    else setData(rows || []);
    setLoading(false);
  }, [tableName, orderBy, ascending]);

  // ── Initial fetch ──────────────────────────────────────────────
  useEffect(() => { fetch(); }, [fetch]);

  // ── Realtime subscription ──────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${tableName}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setData((prev) => {
              // hindari duplikat jika optimistic update sudah menambahkan
              if (prev.find((r) => r.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
          }
          if (payload.eventType === "UPDATE") {
            setData((prev) =>
              prev.map((r) => (r.id === payload.new.id ? payload.new : r))
            );
          }
          if (payload.eventType === "DELETE") {
            setData((prev) => prev.filter((r) => r.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [tableName]);

  // ── Mutations ──────────────────────────────────────────────────
  const insert = async (row) => {
    const { data: newRow, error: err } = await supabase
      .from(tableName)
      .insert(row)
      .select()
      .maybeSingle();
    if (err) throw new Error(err.message);
    if (newRow) {
      // optimistic: tambah langsung jika realtime belum datang
      setData((prev) =>
        prev.find((r) => r.id === newRow.id) ? prev : [...prev, newRow]
      );
    }
    return newRow;
  };

  const update = async (id, updates) => {
    const { data: updated, error: err } = await supabase
      .from(tableName)
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (err) throw new Error(err.message);
    if (updated) {
      setData((prev) => prev.map((r) => (r.id === id ? updated : r)));
    }
    return updated;
  };

  const remove = async (id) => {
    const { error: err } = await supabase.from(tableName).delete().eq("id", id);
    if (err) throw new Error(err.message);
    setData((prev) => prev.filter((r) => r.id !== id));
  };

  return { data, loading, error, refetch: fetch, insert, update, remove };
}