// NAVIGATION
const navLinks = [
  { id: "services", title: "Services" },
  { id: "about", title: "About Us" },
  { id: "art", title: "Our Barbers" },
  { id: "contact", title: "Our Store" },
  { id: "BookingPage", title: "Booking" },
];

// SERVICES
const serviceLists = [
  {
    name: "Classic Haircut",
    duration: "30 menit",
    detail: "Gunting & clipper",
    price: "Rp 25.000",
  },
  {
    name: "Fade Cut",
    duration: "40 menit",
    detail: "Skin / taper fade",
    price: "Rp 35.000",
  },
  {
    name: "Beard Trim",
    duration: "20 menit",
    detail: "Shape & line up",
    price: "Rp 20.000",
  },
  {
    name: "Full Grooming",
    duration: "60 menit",
    detail: "Rambut + jenggot + styling",
    price: "Rp 55.000",
  },
];

// PREMIUM SERVICES
const premiumLists = [
  {
    name: "Hot Towel Shave",
    duration: "30 menit",
    detail: "Cukur pisau klasik",
    price: "Rp 30.000",
  },
  {
    name: "Hair Coloring",
    duration: "60 menit",
    detail: "Warna natural / fashion",
    price: "Rp 75.000",
  },
  {
    name: "Keratin Treatment",
    duration: "90 menit",
    detail: "Smoothing & repair",
    price: "Rp 120.000",
  },
  {
    name: "Head Massage",
    duration: "15 menit",
    detail: "Pijat relaksasi kepala",
    price: "Rp 20.000",
  },
];

// BARBERS

const barberLists = [
  {
    name: "Rizal Pratama",
    role: "Senior Barber",
    phone: "0812-3456-7890",
    store: "Prime Cuts — Sudirman",
    wa: "https://wa.me/6281234567890?text=Halo%20Kak%20Rizal%2C%20saya%20ingin%20booking%20",
    imgPath: "/images/barber1.png",
    isOnline: true,
  },
  {
    name: "Dimas Arya",
    role: "Fade Specialist",
    phone: "0813-9988-7766",
    store: "Prime Cuts — Pemuda",
    wa: "https://wa.me/6281399887766?text=Halo%20Kak%20Dimas%2C%20saya%20ingin%20booking%20",
    imgPath: "/images/barber2.png",
    isOnline: true,
  },
  {
    name: "Farhan Malik",
    role: "Classic Shave Expert",
    phone: "0857-1234-5678",
    store: "Prime Cuts — Merdeka",
    wa: "https://wa.me/6285712345678?text=Halo%20Kak%20Farhan%2C%20saya%20ingin%20booking%20",
    imgPath: "/images/barber3.png",
    isOnline: true,
  },
  {
    name: "Bagas Nugroho",
    role: "Color & Style",
    phone: "0821-5566-7788",
    store: "Prime Cuts — Sudirman",
    wa: "https://wa.me/6282155667788?text=Halo%20Kak%20Bagas%2C%20saya%20ingin%20booking%20",
    imgPath: "/images/barber4.png",
    isOnline: false,
  },
];

// FEATURES
const featureLists = [
  "Potongan presisi & rapi",
  "Gaya modern & klasik",
  "Alat bersih & higienis",
  "Barber berpengalaman",
];

// WHY CHOOSE US
const goodLists = [
  "Barber profesional terlatih",
  "Produk grooming premium",
  "Perhatian penuh pada detail",
  "Suasana nyaman & santai",
];

// STORE INFO
const storeInfo = {
  heading: "Kunjungi Barbershop Kami",
  address: "Jl. Sudirman No. 123, Temanggung, Jawa Tengah",
  contact: {
    phone: "0812-3456-7890",
    email: "barbershop@email.com",
  },
};


// OPENING HOURS
const openingHours = [
  { day: "Sen–Kam", time: "10.00 – 21.00" },
  { day: "Jumat", time: "10.00 – 22.00" },
  { day: "Sabtu", time: "09.00 – 22.00" },
  { day: "Minggu", time: "09.00 – 20.00" },
];

// SOCIALS
const socials = [
  { name: "Instagram", icon: "/images/insta.png", url: "#" },
  { name: "TikTok", icon: "/images/tiktok.png", url: "#" },
  { name: "Facebook", icon: "/images/fb.png", url: "#" },
];

// HAIRSTYLE SHOWCASE
const allStyles = [
  {
    id: 1,
    name: "Classic Cut",
    image: "/images/classiccut.png",
    title: "Timeless & Clean",
    description:
      "Potongan rapi dan klasik yang cocok untuk segala kesempatan, memberikan tampilan bersih dan profesional.",
  },
  {
    id: 2,
    name: "Fade Style",
    image: "/images/fadestyle.png",
    title: "Sharp & Modern",
    description:
      "Transisi fade yang halus dengan detail presisi untuk tampilan segar dan stylish.",
  },
  {
    id: 3,
    name: "Pompadour",
    image: "/images/pompadour.png",
    title: "Bold Volume",
    description:
      "Tampilan bervolume dengan sentuhan modern, sempurna untuk kepribadian yang percaya diri.",
  },
  {
    id: 4,
    name: "Undercut",
    image: "/images/undercut.png",
    title: "Clean Contrast",
    description:
      "Sisi bawah rapi dengan bagian atas lebih panjang untuk gaya potongan yang bold dan trendi.",
  },
];

// EXPORT
export {
  navLinks,
  serviceLists,
  premiumLists,
  barberLists,
  featureLists,
  goodLists,
  openingHours,
  storeInfo,
  socials,
  allStyles,
};