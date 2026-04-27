import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

const Hero = () => {
  const videoRef = useRef();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useGSAP(() => {
    const heroSplit = new SplitText(".title", {
      type: "chars, words",
    });

    const paragraphSplit = new SplitText(".subtitle", {
      type: "lines",
    });

    heroSplit.chars.forEach((char) => char.classList.add("text-gradient"));

    gsap.from(heroSplit.chars, {
      yPercent: 100,
      duration: 1.6,
      ease: "expo.out",
      stagger: 0.05,
    });

    gsap.from(paragraphSplit.lines, {
      opacity: 0,
      yPercent: 100,
      duration: 1.6,
      ease: "expo.out",
      stagger: 0.05,
      delay: 0.8,
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      })
      .to(".right-decor", { y: 150 }, 0)
      .to(".left-decor", { y: -150 }, 0);

    const startValue = isMobile ? "top 50%" : "center 60%";
    const endValue = isMobile ? "120% top" : "bottom top";

    // Proxy approach — paling reliable untuk scroll video
    const proxy = { time: 0 };
    const duration = 6.989; // durasi video kamu

    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: startValue,
          end: endValue,
          scrub: true,
          pin: true,
        },
        onUpdate: function () {
          if (videoRef.current) {
            videoRef.current.currentTime = proxy.time;
          }
        },
      })
      .to(proxy, {
        time: duration,
        ease: "none",
      });
  }, []);

  return (
    <section id="hero" className="relative min-h-dvh w-full overflow-hidden">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        src="/videos/output_3.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 z-10 bg-black/40 bg-[url('/images/noise.png')]" />

      <div className="relative z-20 flex flex-col min-h-dvh">
        <h1
          className="title md:mt-32 mt-40 font-modern-negra leading-none text-center w-full px-4"
          style={{ fontSize: "clamp(3rem, 15vw, 18rem)" }}
        >
          BARBERSHOP
        </h1>

        <img
          src="/images/download.png"
          alt="decor"
          className="left-decor hidden md:block"
        />
        <img
          src="/images/download.png"
          alt="decor"
          className="right-decor hidden md:block"
        />

        <div className="body">
          <div className="content">
            <div className="space-y-5 hidden md:block">
              <p>Sharp. Clean. Confident.</p>
              <p className="subtitle">
                Precision Cuts <br /> Timeless Style
              </p>
            </div>

            <div className="view-services">
              <p className="subtitle">
                Experience premium grooming with expert barbers, modern
                techniques, and a classic touch — crafted to elevate your style.
              </p>
              <a href="#services">View Services</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
