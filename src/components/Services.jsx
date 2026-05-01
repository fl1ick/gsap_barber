import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Services = ({ serviceLists = [], premiumLists = [] }) => {
  useGSAP(() => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#services",
          start: "top 70%",
          toggleActions: "play none none none",
        },
      })
      .from(".service-heading", {
        opacity: 0,
        yPercent: 100,
        duration: 1,
        ease: "expo.out",
      })
      .from(
        ".service-item",
        { opacity: 0, x: -30, stagger: 0.08, duration: 0.8, ease: "power2.out" },
        "-=0.5",
      )
      .from(
        ".premium-item",
        { opacity: 0, x: 30, stagger: 0.08, duration: 0.8, ease: "power2.out" },
        "<",
      );

    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#services",
          start: "top 30%",
          end: "bottom 80%",
          scrub: true,
        },
      })
      .from("#s-left-decor", { y: 80, rotation: -10 })
      .from("#s-right-decor", { y: -80, rotation: 10 }, "<");

    gsap.to(".services-bg-text", {
      scrollTrigger: {
        trigger: "#services",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
      y: -100,
      ease: "none",
    });
  });

  return (
    <section id="services" className="noisy relative min-h-dvh w-full overflow-hidden">

      {/* Video background */}
      <video
        autoPlay loop muted playsInline
        src="/videos/barberpole.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlay gelap agar teks lebih terbaca */}
      <div className="absolute inset-0 z-10 bg-black/60" />

      {/* Background text */}
      <div className="services-bg-text absolute z-10 select-none pointer-events-none">
        CUT AND SHOP
      </div>

      {/* Lines dekor */}
      <div className="services-lines absolute inset-0 z-10 pointer-events-none">
        <div className="line" />
        <div className="line" />
        <div className="line" />
      </div>

      {/* Konten utama */}
      <div className="relative z-20 container mx-auto pt-40 pb-32 2xl:px-0 px-8">
        <div className="flex md:flex-row flex-col md:gap-0 gap-16">

          {/* ── Kolom kiri: Our Services ── */}
          <div className="flex-1 space-y-8 md:pr-16">
            <h2 className="service-heading text-xl font-medium text-white/70 uppercase tracking-widest">
              Our Services
            </h2>
            <ul className="space-y-8">
              {serviceLists.map(({ name, duration, detail, price }) => (
                <li key={name} className="service-item flex justify-between items-start gap-8">
                  <div>
                    <h3 className="font-modern-negra 2xl:text-3xl text-2xl text-yellow leading-tight">
                      {name}
                    </h3>
                    <p className="text-sm text-white/50 mt-1">{duration} | {detail}</p>
                  </div>
                  <span className="text-xl font-medium text-white whitespace-nowrap pt-1">
                    {price}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Divider vertikal ── */}
          <div className="hidden md:block w-px bg-white/10 self-stretch mx-4" />

          {/* ── Kolom kanan: Premium Grooming ── */}
          <div className="flex-1 space-y-8 md:pl-16">
            <div className="flex items-center gap-3">
              <h2 className="service-heading text-xl font-medium text-white/70 uppercase tracking-widest">
                Premium Grooming
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-yellow/40 text-yellow/80 bg-yellow/10 whitespace-nowrap">
                ★ Premium
              </span>
            </div>
            <ul className="space-y-8">
              {premiumLists.map(({ name, duration, detail, price }) => (
                <li key={name} className="premium-item flex justify-between items-start gap-8">
                  <div>
                    <h3 className="font-modern-negra 2xl:text-3xl text-2xl text-yellow leading-tight">
                      {name}
                    </h3>
                    <p className="text-sm text-white/50 mt-1">{duration} | {detail}</p>
                  </div>
                  <span className="text-xl font-medium text-white whitespace-nowrap pt-1">
                    {price}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Gradient fade bawah */}
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "180px",
          background: "linear-gradient(to top, #000 0%, transparent 100%)",
          zIndex: 20,
          pointerEvents: "none",
        }}
      />
    </section>
  );
};

export default Services;