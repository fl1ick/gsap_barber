import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Styles = ({ allStyles = [] }) => {
  const contentRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  useGSAP(() => {
    gsap.fromTo("#style-title", { opacity: 0 }, { opacity: 1, duration: 1 });
    gsap.fromTo(
      ".style-showcase img",
      { opacity: 0, xPercent: -100 },
      { xPercent: 0, opacity: 1, duration: 1, ease: "power1.inOut" },
    );
    gsap.fromTo(
      ".details h2",
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, ease: "power1.inOut" },
    );
    gsap.fromTo(
      ".details p",
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, ease: "power1.inOut", delay: 0.1 },
    );
  }, [currentIndex]);

  // Jangan render kalau data belum ada
  if (!allStyles.length) return null;

  const totalStyles = allStyles.length;
  const goToSlide = (index) =>
    setCurrentIndex((index + totalStyles) % totalStyles);
  const getStyleAt = (offset) =>
    allStyles[(currentIndex + offset + totalStyles) % totalStyles];

  const currentStyle = getStyleAt(0);
  const prevStyle = getStyleAt(-1);
  const nextStyle = getStyleAt(1);

  return (
    <section id="showcase" aria-labelledby="showcase-heading">
      <img
        src="/images/download.png"
        alt="decor"
        id="sc-right-decor"
        className="hidden md:block"
      />

      <h2 id="showcase-heading" className="sr-only">
        Hairstyle Showcase
      </h2>

      <nav className="cocktail-tabs" aria-label="Style Navigation">
        {allStyles.map((style, index) => (
          <button
            key={style.id}
            className={
              index === currentIndex
                ? "text-white border-white"
                : "text-white/50 border-white/50"
            }
            onClick={() => goToSlide(index)}
          >
            {style.name}
          </button>
        ))}
      </nav>

      <div className="content">
        <div className="arrows">
          <button
            className="text-left"
            onClick={() => goToSlide(currentIndex - 1)}
          >
            <span>{prevStyle.name}</span>
            <img
              src="/images/right-arrow.png"
              alt="previous"
              aria-hidden="true"
            />
          </button>
          <button
            className="text-left"
            onClick={() => goToSlide(currentIndex + 1)}
          >
            <span>{nextStyle.name}</span>
            <img src="/images/left-arrow.png" alt="next" aria-hidden="true" />
          </button>
        </div>

        <div className="style-showcase">
          <img
            src={currentStyle.image}
            alt={currentStyle.name}
            className="object-contain"
          />
        </div>

        <div className="recipe">
          <div ref={contentRef} className="info">
            <p>Style pilihan:</p>
            <p id="style-title">{currentStyle.name}</p>
          </div>
          <div className="details">
            <h2>{currentStyle.title}</h2>
            <p>{currentStyle.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Styles;
