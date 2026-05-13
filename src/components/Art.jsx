import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "../hooks/useTable";

const Art = () => {
  const cursorRef = useRef();
  const cursorImgRef = useRef();
  const navigate = useNavigate();

  const { data: barbers, loading } = useTable("barbers", { orderBy: "name" });

  useGSAP(() => {
    if (loading) return;

    const titleSplit = SplitText.create("#art-title", { type: "words" });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#art",
          start: "top 70%",
          toggleActions: "play none none none",
        },
      })
      .from(titleSplit.words, {
        opacity: 0,
        yPercent: 100,
        stagger: 0.03,
        duration: 1,
        ease: "expo.out",
      })
      .from(
        ".barber-card",
        { opacity: 0, y: 50, stagger: 0.15, duration: 1, ease: "power3.out" },
        "-=0.5",
      );

    const moveCursor = (e) => {
      gsap.to(cursorRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.5,
        ease: "power3.out",
      });
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [loading]);

  const handleMouseEnter = (image) => {
    cursorImgRef.current.src = image;
    gsap.to(cursorRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cursorRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: "power3.in",
    });
  };

  const barberLists = barbers
    .map((b) => ({
      id: b.id,
      name: b.name,
      role: b.role,
      phone: b.phone,
      store: b.store,
      imgPath: b.img_path,
      isOnline: b.is_online,
    }))
    .sort((a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0));

  if (loading)
    return (
      <div style={{ color: "white", textAlign: "center", padding: "5rem" }}>
        Loading barbers...
      </div>
    );

  return (
    <div
      id="art"
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "5rem",
        paddingBottom: "5rem",
        background:
          "radial-gradient(circle at center, #434343 0%, #000 50%, transparent 100%)",
      }}
    >
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes ping {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .barber-card:hover .barber-card-photo img {
          transform: scale(1.05);
        }
      `}</style>

      {/* Custom cursor */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: "-200px",
          left: "-200px",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 999,
          opacity: 0,
          border: "2px solid #e7d393",
          marginLeft: "-75px",
          marginTop: "-75px",
          transform: "scale(0)",
        }}
      >
        <img
          ref={cursorImgRef}
          src=""
          alt="barber"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.25rem" }}
      >
        <h2
          id="art-title"
          style={{
            fontFamily: "'Modern Negra', sans-serif",
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            marginBottom: "1rem",
            color: "white",
          }}
        >
          Our Barbers
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "1.125rem",
            marginBottom: "4rem",
            maxWidth: "28rem",
          }}
        >
          Tim barber profesional kami siap memberikan pengalaman grooming
          terbaik untuk kamu.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {barberLists.map((barber, index) => (
            <div
              key={index}
              className="barber-card"
              onMouseEnter={() => handleMouseEnter(barber.imgPath)}
              onMouseLeave={handleMouseLeave}
              // ← Navigasi ke halaman booking dengan barber pre-selected
              onClick={() =>
                barber.isOnline && navigate(`/booking/${barber.id}`)
              }
              style={{
                position: "relative",
                borderRadius: "1.5rem",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                border: `1px solid ${barber.isOnline ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.1)"}`,
                minHeight: "450px",
                transition: "border-color 0.3s, transform 0.3s",
                cursor: barber.isOnline ? "pointer" : "default",
                opacity: barber.isOnline ? 1 : 0.75,
              }}
            >
              {/* Foto */}
              <div
                className="barber-card-photo"
                style={{
                  height: "280px",
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <img
                  src={barber.imgPath}
                  alt={barber.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "0",
                    display: "block",
                    transition: "transform 0.7s ease",
                    filter: barber.isOnline ? "none" : "grayscale(40%)",
                  }}
                />
                {/* Gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
                  }}
                />

                {/* Badge status */}
                <div
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "0.75rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    borderRadius: "999px",
                    padding: "0.3rem 0.7rem",
                    background: "rgba(0,0,0,0.55)",
                    border: `1px solid ${barber.isOnline ? "rgba(74,222,128,0.5)" : "rgba(255,255,255,0.2)"}`,
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <span
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {barber.isOnline && (
                      <span
                        style={{
                          position: "absolute",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "rgb(74,222,128)",
                          animation: "ping 1.4s ease-out infinite",
                        }}
                      />
                    )}
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: barber.isOnline
                          ? "rgb(74,222,128)"
                          : "#555",
                        display: "inline-block",
                        animation: barber.isOnline
                          ? "pulse-dot 1.5s ease-in-out infinite"
                          : "none",
                        boxShadow: barber.isOnline
                          ? "0 0 6px rgba(74,222,128,0.7)"
                          : "none",
                      }}
                    />
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: barber.isOnline
                        ? "rgb(74,222,128)"
                        : "rgba(255,255,255,0.4)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {barber.isOnline ? "Bertugas" : "Tidak Bertugas"}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "1rem",
                  padding: "1.25rem",
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "'Modern Negra', sans-serif",
                      fontSize: "1.5rem",
                      color: "#e7d393",
                      margin: 0,
                    }}
                  >
                    {barber.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255,255,255,0.5)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {barber.role}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>📍</span>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "rgba(255,255,255,0.7)",
                        margin: 0,
                      }}
                    >
                      {barber.store}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>📞</span>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "rgba(255,255,255,0.7)",
                        margin: 0,
                      }}
                    >
                      {barber.phone}
                    </p>
                  </div>

                  {/* Booking button — label berubah dari "via WA" jadi "Booking Sekarang" */}
                  <div
                    style={{
                      marginTop: "0.5rem",
                      borderRadius: "999px",
                      padding: "0.375rem 1rem",
                      width: "fit-content",
                      background: barber.isOnline
                        ? "rgba(34,197,94,0.2)"
                        : "rgba(255,255,255,0.05)",
                      border: `1px solid ${barber.isOnline ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: barber.isOnline
                          ? "rgb(74,222,128)"
                          : "rgba(255,255,255,0.25)",
                        margin: 0,
                      }}
                    >
                      {barber.isOnline
                        ? "✦ Booking Sekarang"
                        : "Sedang Tidak Tersedia"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Art;
