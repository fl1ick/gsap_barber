import { useState, useCallback } from "react";
import { useRealtimeNotifications } from "../hooks/useRealtimeNotifications";

/**
 * UserNotificationDisplay
 *
 * Pasang komponen ini SEKALI di App.jsx:
 *   <UserNotificationDisplay />
 *
 * Akan otomatis menerima notifikasi realtime dari admin dan menampilkannya.
 */
export default function UserNotificationDisplay() {
  const [toasts, setToasts] = useState([]);
  const [announcement, setAnnouncement] = useState(null);

  const handleNotification = useCallback((notif) => {
    if (notif.kind === "announcement") {
      setAnnouncement(notif);
    } else {
      const id = notif.id;
      setToasts((prev) => [...prev, { ...notif, _localId: id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t._localId !== id));
      }, 5000);
    }
  }, []);

  useRealtimeNotifications(handleNotification);

  return (
    <>
      {/* ── Toast area ── */}
      <div style={styles.toastContainer}>
        {toasts.map((t) => (
          <Toast
            key={t._localId}
            notif={t}
            onClose={() =>
              setToasts((prev) => prev.filter((x) => x._localId !== t._localId))
            }
          />
        ))}
      </div>

      {/* ── Announcement modal ── */}
      {announcement && (
        <AnnouncementModal
          notif={announcement}
          onClose={() => setAnnouncement(null)}
        />
      )}
    </>
  );
}

// ─── Warna per type ────────────────────────────────────────────────────────────
const C = {
  info: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    text: "#1D4ED8",
    bar: "#3B82F6",
    btn: "#3B82F6",
  },
  success: {
    bg: "#F0FDF4",
    border: "#BBF7D0",
    text: "#15803D",
    bar: "#22C55E",
    btn: "#22C55E",
  },
  warning: {
    bg: "#FFFBEB",
    border: "#FDE68A",
    text: "#92400E",
    bar: "#F59E0B",
    btn: "#F59E0B",
  },
  error: {
    bg: "#FEF2F2",
    border: "#FECACA",
    text: "#B91C1C",
    bar: "#EF4444",
    btn: "#EF4444",
  },
};

const ICONS = {
  info: (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
      <rect
        x="7.25"
        y="6.5"
        width="1.5"
        height="5"
        rx=".75"
        fill="currentColor"
      />
      <rect
        x="7.25"
        y="4"
        width="1.5"
        height="1.5"
        rx=".75"
        fill="currentColor"
      />
    </svg>
  ),
  success: (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
      <polyline
        points="4.5,8 7,10.5 11.5,5.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2L14.5 13H1.5L8 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <rect
        x="7.25"
        y="6"
        width="1.5"
        height="4"
        rx=".75"
        fill="currentColor"
      />
      <rect
        x="7.25"
        y="11"
        width="1.5"
        height="1.5"
        rx=".75"
        fill="currentColor"
      />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
      <line
        x1="5.5"
        y1="5.5"
        x2="10.5"
        y2="10.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="10.5"
        y1="5.5"
        x2="5.5"
        y2="10.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
};

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ notif, onClose }) {
  const c = C[notif.type] || C.info;
  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderLeft: `4px solid ${c.bar}`,
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        boxShadow: "0 4px 20px rgba(0,0,0,.1)",
        animation: "snIn .3s cubic-bezier(.34,1.56,.64,1)",
        maxWidth: 380,
      }}
    >
      <span style={{ color: c.text, flexShrink: 0, marginTop: 1 }}>
        {ICONS[notif.type]}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {notif.title && (
          <p
            style={{
              margin: "0 0 3px",
              fontWeight: 600,
              fontSize: 14,
              color: "#111",
            }}
          >
            {notif.title}
          </p>
        )}
        <p
          style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 }}
        >
          {notif.message}
        </p>

        {notif.image_url && (
          <img
            src={notif.image_url}
            alt=""
            style={{
              marginTop: 10,
              width: "100%",
              borderRadius: 8,
              objectFit: "cover",
              maxHeight: 140,
            }}
          />
        )}

        {notif.link_url && (
          <a
            href={notif.link_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: 10,
              fontSize: 13,
              fontWeight: 500,
              color: c.text,
              textDecoration: "none",
              borderBottom: `1px solid ${c.border}`,
              paddingBottom: 1,
            }}
          >
            {notif.link_label || "Lihat selengkapnya"} →
          </a>
        )}
      </div>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#9ca3af",
          fontSize: 18,
          lineHeight: 1,
          flexShrink: 0,
          padding: 0,
        }}
      >
        ×
      </button>

      <style>{`@keyframes snIn{from{opacity:0;transform:translateX(24px) scale(.95)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

// ─── Announcement Modal ────────────────────────────────────────────────────────
function AnnouncementModal({ notif, onClose }) {
  const c = C[notif.type] || C.info;
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "fadeIn .2s ease",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          width: "100%",
          maxWidth: 460,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,.22)",
          animation: "scaleIn .25s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        {/* accent bar */}
        <div style={{ height: 4, background: c.bar }} />

        {/* gambar jika ada */}
        {notif.image_url && (
          <img
            src={notif.image_url}
            alt=""
            style={{
              width: "100%",
              maxHeight: 200,
              objectFit: "cover",
              display: "block",
            }}
          />
        )}

        <div style={{ padding: "22px 24px 18px" }}>
          {/* icon + title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 11,
                background: c.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: c.text,
                flexShrink: 0,
              }}
            >
              {ICONS[notif.type]}
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 17,
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.3,
              }}
            >
              {notif.title || "Pengumuman"}
            </h2>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "#4b5563",
              lineHeight: 1.7,
            }}
          >
            {notif.message}
          </p>

          {/* link */}
          {notif.link_url && (
            <a
              href={notif.link_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: 14,
                padding: "8px 18px",
                background: c.bar,
                color: "#fff",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              {notif.link_label || "Lihat selengkapnya"} →
            </a>
          )}
        </div>

        {/* footer */}
        <div
          style={{
            padding: "0 24px 22px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: c.btn,
              color: "#fff",
              border: "none",
              borderRadius: 9,
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Mengerti
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes scaleIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
      `}</style>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  toastContainer: {
    position: "fixed",
    top: 20,
    right: 20,
    zIndex: 99998,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxWidth: 380,
    width: "calc(100% - 40px)",
    pointerEvents: "none",
  },
};
