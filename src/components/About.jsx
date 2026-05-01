import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { featureLists, goodLists } from "../constants/index.js";

const About = () => {
  useGSAP(() => {
    const titleSplit = SplitText.create("#about h2", {
      type: "words",
    });

    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#about",
        start: "top center",
      },
    });

    scrollTimeline
      .from(titleSplit.words, {
        opacity: 0,
        duration: 1,
        yPercent: 100,
        ease: "expo.out",
        stagger: 0.02,
      })
      .from(
        ".about-fade",
        {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.06,
        },
        "-=0.5",
      )
      .from(
        ".top-grid div, .bottom-grid div",
        {
          opacity: 0,
          duration: 1,
          ease: "power1.inOut",
          stagger: 0.04,
        },
        "-=0.3",
      );
  });

  return (
    <div id="about" style={{ position: "relative" }}>

      {/* Gradient fade dari section atas */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "180px",
          background: "linear-gradient(to bottom, #000 0%, transparent 100%)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      <div className="mb-16 md:px-0 px-5">

        {/* Struktur .content asli dipertahankan agar CSS h2 tetap berlaku */}
        <div className="content">
          <div className="md:col-span-8">
            <p className="badge about-fade">Barbershop Terbaik</p>
            <h2>
              Di mana setiap detail diperhatikan{" "}
              <span className="text-white">—</span> dari gunting hingga
              finishing
            </h2>
          </div>

          {/* sub-content asli — fix: stat langsung di bawah paragraf */}
          <div className="sub-content">
            <p className="about-fade">
              Setiap potongan yang kami kerjakan mencerminkan dedikasi kami
              terhadap detail — dari teknik gunting hingga hasil akhir yang
              rapi. Itulah yang membuat pengalaman di sini terasa berbeda dan
              tak terlupakan.
            </p>

            {/* Stat — border atas sebagai pemisah, bintang di samping */}
            <div className="about-fade" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", flexWrap: "wrap" }}>
                <p className="md:text-3xl text-xl font-bold">
                  <span style={{ color: "#e7d393", fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>4.8</span>
                  <span className="text-white/40 font-medium text-xl">/5</span>
                </p>
                {/* Bintang */}
                <span style={{ color: "#e7d393", fontSize: "1.1rem", paddingBottom: "4px", letterSpacing: "2px" }}>
                  ★★★★★
                </span>
              </div>
              <p className="text-sm text-white/40 mt-1">
                Lebih dari +5.000 pelanggan puas
              </p>
            </div>
          </div>
        </div>

        {/* Feature & keunggulan */}
        <div className="mt-10 grid md:grid-cols-2 gap-6 md:px-0 px-5">
          <div className="about-fade">
            <h3 className="text-sm uppercase tracking-widest text-white/50 mb-3">
              Yang Kami Tawarkan
            </h3>
            <ul className="space-y-2">
              {featureLists.map((item) => (
                <li key={item} className="flex items-center gap-2 text-white/80">
                  <span className="text-yellow text-xs">✦</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="about-fade">
            <h3 className="text-sm uppercase tracking-widest text-white/50 mb-3">
              Kenapa Pilih Kami
            </h3>
            <ul className="space-y-2">
              {goodLists.map((item) => (
                <li key={item} className="flex items-center gap-2 text-white/80">
                  <span className="text-yellow text-xs">✦</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Grid foto atas */}
      <div className="top-grid">
        <div className="md:col-span-3">
          <div className="noisy" />
          <img src="/images/abt1.png" alt="barber bekerja" />
        </div>
        <div className="md:col-span-6">
          <div className="noisy" />
          <img src="/images/abt2.png" alt="interior barbershop" />
        </div>
        <div className="md:col-span-3">
          <div className="noisy" />
          <img src="/images/abt5.png" alt="hasil potongan" />
        </div>
      </div>

      {/* Grid foto bawah */}
      <div className="bottom-grid">
        <div className="md:col-span-8">
          <div className="noisy" />
          <img src="/images/abt3.png" alt="proses grooming" />
        </div>
        <div className="md:col-span-4">
          <div className="noisy" />
          <img src="/images/abt4.png" alt="alat barber" />
        </div>
      </div>
    </div>
  );
};

export default About;