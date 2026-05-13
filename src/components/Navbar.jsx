import { useGSAP } from "@gsap/react";
import { useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";

const Navbar = ({ navLinks = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isBookingPage = location.pathname.startsWith("/booking");

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

  const handleNavClick = (link) => {
    if (link.id === "BookingPage") {
      // Booking → navigasi ke halaman /booking
      navigate("/booking");
    } else if (isBookingPage) {
      // Sedang di halaman booking, klik nav lain → kembali ke home lalu scroll
      navigate("/");
      setTimeout(() => {
        document
          .getElementById(link.id)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      // Di halaman utama → scroll langsung
      document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <navbar-front>
      <div>
        {/* Logo */}
        <a
          href="#home"
          className="flex items-center gap-2"
          onClick={(e) => {
            if (isBookingPage) {
              e.preventDefault();
              navigate("/");
            }
          }}
        >
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
              <button
                onClick={() => handleNavClick(link)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  // Highlight tombol Booking kalau sedang di halaman booking
                  color:
                    link.id === "BookingPage" && isBookingPage
                      ? "#e7d393"
                      : "inherit",
                  fontWeight: link.id === "BookingPage" ? 600 : "inherit",
                  padding: 0,
                  font: "inherit",
                }}
              >
                {link.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </navbar-front>
  );
};

export default Navbar;
