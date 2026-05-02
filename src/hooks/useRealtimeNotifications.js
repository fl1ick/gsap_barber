import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

/**
 * useRealtimeNotifications
 * Dipasang di App.jsx (frontend user).
 * Setiap kali admin INSERT notif baru di Supabase → callback onNotification dipanggil.
 *
 * @param {function} onNotification - (notif) => void
 */
export function useRealtimeNotifications(onNotification) {
  const callbackRef = useRef(onNotification);
  callbackRef.current = onNotification;

  useEffect(() => {
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          if (payload.new.is_active) {
            callbackRef.current(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}