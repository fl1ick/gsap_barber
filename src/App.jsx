import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Art from "./components/Art.jsx";
import Contact from "./components/Contact.jsx";
import Services from "./components/Services.jsx";
import Styles from "./components/Styles.jsx";

gsap.registerPlugin(ScrollTrigger, SplitText);

const App = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Art />
      <Styles />
      <Contact />
    </main>
  );
};

export default App;
