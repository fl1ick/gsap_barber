import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { serviceLists, premiumLists } from "../../constants/index.js";

const Services = () => {
  useGSAP(() => {
    // Animasi teks masuk
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
        {
          opacity: 0,
          x: -30,
          stagger: 0.08,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5",
      )
      .from(
        ".premium-item",
        {
          opacity: 0,
          x: 30,
          stagger: 0.08,
          duration: 0.8,
          ease: "power2.out",
        },
        "<",
      );

    // Parallax dekor
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

    // Parallax teks besar background
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
    <section id="services" className="noisy">
      <img
        src="/images/download.png"
        alt="decor"
        id="s-left-decor"
        className="hidden md:block"
      />
      <img
        src="/images/download.png"
        alt="decor"
        id="s-right-decor"
        className="hidden md:block"
      />

      {/* Teks besar dekoratif di background */}
      <div className="services-bg-text">CUT AND COP</div>

      {/* Garis diagonal dekoratif */}
      <div className="services-lines">
        <div className="line" />
        <div className="line" />
        <div className="line" />
      </div>

      <div className="list">
        {/* SERVICES */}
        <div className="popular">
          <h2 className="service-heading">Our Services</h2>

          <ul>
            {serviceLists.map(({ name, duration, detail, price }) => (
              <li key={name} className="service-item">
                <div className="md:me-28">
                  <h3>{name}</h3>
                  <p>
                    {duration} | {detail}
                  </p>
                </div>
                <span>{price}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* PREMIUM */}
        <div className="loved">
          <h2 className="service-heading">Premium Grooming</h2>

          <ul>
            {premiumLists.map(({ name, duration, detail, price }) => (
              <li key={name} className="premium-item">
                <div className="me-28">
                  <h3>{name}</h3>
                  <p>
                    {duration} | {detail}
                  </p>
                </div>
                <span>{price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Services;
