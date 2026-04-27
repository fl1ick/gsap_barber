import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import { barberLists } from "../../constants/index.js";
import { useRef } from "react";

const Art = () => {
  const cursorRef = useRef();
  const cursorImgRef = useRef();

  useGSAP(() => {
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
        {
          opacity: 0,
          y: 50,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
        },
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
  });

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
      {/* Custom cursor */}
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: "-200px", // ← taruh di luar viewport awalnya
          left: "-200px", // ← taruh di luar viewport awalnya
          width: "150px", // ← perkecil dari 180px
          height: "150px", // ← perkecil dari 180px
          borderRadius: "50%",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 999,
          opacity: 0,
          border: "2px solid #e7d393",
          marginLeft: "-75px", // ← sesuaikan dengan ukuran baru (setengah dari 150)
          marginTop: "-75px", // ← sesuaikan dengan ukuran baru
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
        {/* Judul */}
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

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {barberLists.map((barber, index) => (
            <a
              key={index}
              href={barber.wa}
              target="_blank"
              rel="noopener noreferrer"
              className="barber-card"
              onMouseEnter={() => handleMouseEnter(barber.imgPath)}
              onMouseLeave={handleMouseLeave}
              style={{
                position: "relative",
                borderRadius: "1.5rem",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                border: "1px solid rgba(255,255,255,0.1)",
                minHeight: "450px",
                textDecoration: "none",
                transition: "border-color 0.3s, transform 0.3s",
              }}
            >
              {/* Foto */}
              <div
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
                  <div
                    style={{
                      marginTop: "0.5rem",
                      borderRadius: "999px",
                      padding: "0.375rem 1rem",
                      width: "fit-content",
                      background: "rgba(34,197,94,0.2)",
                      border: "1px solid rgba(34,197,94,0.4)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "rgb(74,222,128)",
                        margin: 0,
                      }}
                    >
                      Booking via WA
                    </p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Art;
