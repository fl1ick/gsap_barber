import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import gsap from "gsap";
import { useRef } from "react";

const Contact = ({
  storeInfo = {},
  openingHours = [],
  socials = [],
  stores = [],
}) => {
  const cursorRef = useRef();
  const cursorImgRef = useRef();
  const footerRef = useRef();

  useGSAP(() => {
    const titleSplit = SplitText.create("#contact h2", { type: "words" });
    gsap
      .timeline({ scrollTrigger: { trigger: "#contact", start: "top center" } })
      .from(titleSplit.words, { opacity: 0, yPercent: 100, stagger: 0.02 })
      .from("#contact h3, #contact p", {
        opacity: 0,
        yPercent: 100,
        stagger: 0.02,
      })
      .to("#f-right-decor", { y: -50, duration: 1, ease: "power1.inOut" })
      .to("#f-left-decor", { y: -50, duration: 1, ease: "power1.inOut" }, "<");

    const section = footerRef.current;
    const moveCursor = (e) =>
      gsap.to(cursorRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.5,
        ease: "power3.out",
      });
    const hideCursor = () =>
      gsap.to(cursorRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
      });

    section.addEventListener("mousemove", moveCursor);
    section.addEventListener("mouseleave", hideCursor);
    return () => {
      section.removeEventListener("mousemove", moveCursor);
      section.removeEventListener("mouseleave", hideCursor);
    };
  }, []);

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
    <footer id="contact" ref={footerRef}>
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
          alt="store"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <img
        src="/images/download.png"
        alt="decor"
        id="f-right-decor"
        className="hidden lg:block"
      />

      <div className="content">
        <h2>{storeInfo.heading}</h2>

        {/* Store cards */}
        <div className="store-grid">
          {stores.map((store, index) => (
            <a
              key={store.id}
              href={store.wa}
              target="_blank"
              rel="noopener noreferrer"
              className="store-card"
              onMouseEnter={() => handleMouseEnter(store.image)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="store-card-img">
                <img src={store.image} alt={store.name} />
              </div>
              <div className="store-card-overlay">
                <span className="store-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{store.name}</h3>
                  <p>{store.address}</p>
                  <p>{store.phone}</p>
                  <p className="store-hours">{store.hours}</p>
                  <div className="wa-badge">
                    <span>Chat & Booking</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer bottom */}
        <div className="footer-bottom">
          <div>
            <h3>Jam Buka</h3>
            {openingHours.map((time) => (
              <p key={time.day}>
                {time.day} : {time.time}
              </p>
            ))}
          </div>

          <div>
            <h3>Ikuti Kami</h3>
            <div className="flex gap-5 mt-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <img
                    src={social.icon}
                    alt={social.name}
                    style={{
                      width: "24px",
                      height: "24px",
                      objectFit: "contain",
                    }}
                  />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3>Hubungi Kami</h3>
            <p>{storeInfo.contact?.phone}</p>
            <p>{storeInfo.contact?.email}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
