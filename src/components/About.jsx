import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { featureLists, goodLists } from "../../constants/index.js";

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
        ".top-grid div, .bottom-grid div",
        {
          opacity: 0,
          duration: 1,
          ease: "power1.inOut",
          stagger: 0.04,
        },
        "-=0.5",
      );
  });

  return (
    <div id="about">
      <div className="mb-16 md:px-0 px-5">
        <div className="content">
          <div className="md:col-span-8">
            <p className="badge">Barbershop Terbaik</p>
            <h2>
              Di mana setiap detail diperhatikan{" "}
              <span className="text-white">—</span> dari gunting hingga
              finishing
            </h2>
          </div>

          <div className="sub-content">
            <p>
              Setiap potongan yang kami kerjakan mencerminkan dedikasi kami
              terhadap detail — dari teknik gunting hingga hasil akhir yang
              rapi. Itulah yang membuat pengalaman di sini terasa berbeda dan
              tak terlupakan.
            </p>

            <div>
              <p className="md:text-3xl text-xl font-bold">
                <span>4.8</span>/5
              </p>
              <p className="text-sm text-white-100">
                Lebih dari +5.000 pelanggan puas
              </p>
            </div>
          </div>
        </div>

        {/* Feature & keunggulan */}
        <div className="mt-10 grid md:grid-cols-2 gap-6 md:px-0 px-5">
          <div>
            <h3 className="text-sm uppercase tracking-widest text-white/50 mb-3">
              Yang Kami Tawarkan
            </h3>
            <ul className="space-y-2">
              {featureLists.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-white/80"
                >
                  <span className="text-white">✦</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-widest text-white/50 mb-3">
              Kenapa Pilih Kami
            </h3>
            <ul className="space-y-2">
              {goodLists.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-white/80"
                >
                  <span className="text-white">✦</span> {item}
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
