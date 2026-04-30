import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Art from "./components/Art.jsx";
import Contact from "./components/Contact.jsx";
import Services from "./components/Services.jsx";
import Styles from "./components/Styles.jsx";
import StoresAdmin from "./admin/pages/StroresAdmin.jsx";

// ── Data live dari Supabase (ganti constants.js) ──────────────
import {
  useServices,
  useBarbers,
  useStyles,
  useOpeningHours,
  useStores,
} from "./lib/data.js";

// ── Data statis tetap dari constants (tidak perlu CRUD) ───────
import {
  navLinks,
  featureLists,
  goodLists,
  storeInfo,
  socials,
  barberLists as fallbackBarbers,
} from "./constants/index.js";

gsap.registerPlugin(ScrollTrigger, SplitText);

const App = () => {
  const { serviceLists, premiumLists } = useServices();
  const { barberLists } = useBarbers();
  const { allStyles } = useStyles();
  const { openingHours } = useOpeningHours();
  const { stores } = useStores();

  return (
    <main>
      <Navbar navLinks={navLinks} />
      <Hero />
      <Services serviceLists={serviceLists} premiumLists={premiumLists} />
      <About featureLists={featureLists} goodLists={goodLists} />
      <Art />
      <Styles allStyles={allStyles} barberLists={barberLists} />
      <Contact
        storeInfo={storeInfo}
        openingHours={openingHours}
        socials={socials}
        stores={stores} // ← kirim data stores ke Contact
      />
    </main>
  );
};

export default App;
