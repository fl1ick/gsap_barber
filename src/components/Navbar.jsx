import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Navbar = ({ navLinks = [] }) => {
  useGSAP(() => {
    const navTween = gsap.timeline({
      scrollTrigger: { trigger: "navbar-front", start: "bottom top" },
    });

    navTween.fromTo(
      "navbar-front",
      { backgroundColor: "transparent" },
      {
        backgroundColor: "#00000080",
        backdropFilter: "blur(10px)",
        duration: 0.8,
        ease: "power1.inOut",
      },
    );
  });

  return (
    <navbar-front>
      <div>
        <a href="#home" className="flex items-center gap-2">
          <img
            src="/images/logo.png"
            alt="logo"
            className="w-10 h-10 object-contain"
          />
          <p>Prime Cuts</p>
        </a>

        <ul>
          {navLinks.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`}>{link.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </navbar-front>
  );
};

export default Navbar;
