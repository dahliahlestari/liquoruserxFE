import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Firestore
import { db } from "../lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Animations
import { motion, AnimatePresence } from "framer-motion";

// Assets
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import cognacImg from "../assets/cognac.png";
import ginImg from "../assets/Gin.png";
import rumImg from "../assets/Rum.png";
import tequilaImg from "../assets/Tequila.png";
import vodkaImg from "../assets/Vodka.png";
import whiskyImg from "../assets/whisky.png";
import wineImg from "../assets/wine.png";
import liqueurImg from "../assets/Liqueur.png";
import othersImg from "../assets/others.png";
import igpost1 from "../assets/ig1.jpg";
import igpost2 from "../assets/ig2.jpg";
import igpost3 from "../assets/ig3.jpg";
import igpost4 from "../assets/ig4.jpg";
import igpost5 from "../assets/ig5.jpg";
import igpost6 from "../assets/ig6.jpg";
import igpost7 from "../assets/ig7.jpg";
import igpost8 from "../assets/ig8.png";
import tokopedia from "../assets/tokopedia.png";
import blibli from "../assets/blibli.png";

// Local components
import Cart from "./Cart.jsx";

/** Utils **/
const chunkArray = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const kategoriMap = {
  Whisky: whiskyImg,
  Vodka: vodkaImg,
  Gin: ginImg,
  Rum: rumImg,
  Tequila: tequilaImg,
  Wine: wineImg,
  Cognac: cognacImg,
  Liqueur: liqueurImg,
  Others: othersImg,
};

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "Product", href: "#products" },
  { label: "About Us", href: "#about" },
  { label: "Official Stores", href: "#official-stores" },
];

const IG_IMAGES = [
  igpost1,
  igpost2,
  igpost3,
  igpost4,
  igpost5,
  igpost6,
  igpost7,
  igpost8,
];

const WA_NUMBER = "6281299723970";
const waOrderLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  "Halo, saya mau order minuman di W3LIQUOR!"
)}`;

const formatRupiah = (n) => `Rp${(Number(n) || 0).toLocaleString("id-ID")}`;

const useDebounced = (value, delay = 250) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
};

export default function LandingPageIndustryPro() {
  const [liquors, setLiquors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("");
  const [search, setSearch] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [qtyInputs, setQtyInputs] = useState({});

  const debouncedSearch = useDebounced(search, 300);

  // Fetch dari Firestore
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "products"), orderBy("createdAt", "desc"))
        );
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setLiquors(items);
      } catch (e) {
        console.error(e);
        setError("Gagal memuat produk. Coba muat ulang halaman.");
        setLiquors([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const kategoriList = useMemo(
    () => [...new Set(liquors.map((l) => l.kategori).filter(Boolean))],
    [liquors]
  );

  const produkFiltered = useMemo(() => {
    const s = debouncedSearch.trim().toLowerCase();
    return liquors.filter(
      (l) =>
        (!kategoriAktif || l.kategori === kategoriAktif) &&
        (!s ||
          l.nama?.toLowerCase().includes(s) ||
          l.kategori?.toLowerCase().includes(s))
    );
  }, [liquors, kategoriAktif, debouncedSearch]);

  const waLink = useCallback((nama) => {
    const msg = encodeURIComponent(`Halo, saya ingin pesan produk ${nama}.`);
    return `https://wa.me/${WA_NUMBER}?text=${msg}`;
  }, []);

  const addToCart = useCallback((product, qty = 1) => {
    const jumlah = parseInt(qty, 10) || 1;
    setCart((prev) => {
      const ex = prev.find((i) => i.id === product.id);
      if (ex)
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + jumlah } : i
        );
      return [...prev, { ...product, qty: jumlah }];
    });
    setQtyInputs((p) => ({ ...p, [product.id]: 1 }));
  }, []);

  /** Layout **/
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-yellow-200/70">
      {/* Floating CTA WhatsApp */}
      <a
        href={waOrderLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed z-[60] bottom-5 right-5 md:bottom-8 md:right-8 flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-tr from-green-500 to-green-600 text-white font-extrabold text-base shadow-2xl border-4 border-white/50 hover:scale-105 transition-all duration-200 active:scale-95"
        aria-label="Chat WhatsApp"
      >
        <svg viewBox="0 0 32 32" width={28} height={28} fill="none" aria-hidden>
          <circle cx="16" cy="16" r="16" fill="#25D366" />
          <path
            d="M22.3 18.4c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.7-.2-1 .2-.3.3-.8.9-1 1.1-.2.2-.4.2-.8 0-.4-.2-1.5-.6-2.9-1.9-1.1-1-1.9-2.2-2.1-2.5-.2-.4 0-.6.2-.8.2-.2.4-.5.5-.7.2-.3.2-.5.3-.7.1-.2 0-.5-.1-.7s-1-2.5-1.4-3.4c-.3-.8-.6-.7-.8-.7-.2 0-.5 0-.7 0-.2 0-.6.1-.9.4-.4.3-1.1 1.1-1.1 2.7 0 1.6 1.1 3.2 1.2 3.4.2.2 2.3 3.5 5.5 4.8.7.3 1.3.5 1.8.6.8.1 1.5.1 2.1 0 .7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.9z"
            fill="#fff"
          />
        </svg>
        <span className="hidden sm:inline">Order Cepat</span>
      </a>

      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-yellow-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <a href="#" className="flex items-center gap-3">
              <img
                src="/log.png"
                alt="W3LIQUOR Logo"
                className="w-16 h-auto object-contain"
              />
              <span className="font-black tracking-wider text-lg hidden sm:block">
                W3LIQUOR
              </span>
            </a>

            <nav
              className="hidden md:flex items-center gap-8"
              aria-label="Primary"
            >
              {NAV_LINKS.map((lnk) => (
                <a
                  key={lnk.label}
                  href={lnk.href}
                  className="text-gray-700 hover:text-yellow-700 font-semibold tracking-wide"
                >
                  {lnk.label}
                </a>
              ))}
            </nav>

            <button
              className="md:hidden inline-flex items-center px-3 py-2 rounded-xl ring-1 ring-gray-300 text-gray-700"
              onClick={() => setNavbarOpen((s) => !s)}
              aria-expanded={navbarOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              <svg width="28" height="28" fill="none" aria-hidden>
                <path
                  d="M5 8h18M5 16h18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {navbarOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="flex flex-col py-2 gap-1 px-5">
                {NAV_LINKS.map((lnk) => (
                  <a
                    key={lnk.label}
                    href={lnk.href}
                    className="py-3 text-gray-700 font-medium border-b"
                    onClick={() => setNavbarOpen(false)}
                  >
                    {lnk.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(253,224,71,0.35),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(30,64,175,0.15),transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-black tracking-tight text-gray-900"
            >
              Whisky, Wine & Whatever —
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-800">
                {" "}
                100% Original.
              </span>
            </motion.h1>
            <p className="mt-4 text-gray-700 text-lg leading-relaxed">
              Premium spirits terkurasi dari seluruh dunia. Dapatkan penawaran
              spesial & layanan cepat langsung ke pintu Anda.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#products"
                className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-bold shadow hover:from-yellow-600 hover:to-yellow-800"
              >
                Belanja Sekarang
              </a>
              <a
                href={waOrderLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-3 rounded-2xl ring-2 ring-yellow-600 text-yellow-800 font-bold hover:bg-yellow-50"
              >
                Chat Admin
              </a>
            </div>
          </div>

          {/* Hero Carousel */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-yellow-100">
            <Swiper
              modules={[Pagination, Autoplay, A11y]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4200, disableOnInteraction: false }}
              slidesPerView={1}
              loop
              a11y={{ enabled: true }}
              className="w-full h-full"
            >
              {[banner1, banner2].map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={img}
                    alt={`Banner ${i + 1}`}
                    className="w-full h-full object-cover aspect-[16/9]"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* KATEGORI */}
      <section id="categories" className="max-w-6xl mx-auto px-4 mt-4 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-stone-800 tracking-wide">
            Cari berdasarkan Kategori
          </h2>
          {kategoriAktif && (
            <button
              className="flex items-center gap-2 bg-stone-900 text-white font-semibold rounded-full px-3 py-1 hover:scale-105 transition-all duration-150"
              onClick={() => setKategoriAktif("")}
            >
              Reset
            </button>
          )}
        </div>

        <Swiper
          modules={[Navigation, A11y]}
          navigation
          slidesPerView={1}
          spaceBetween={8}
          loop={kategoriList.length > 5}
          allowTouchMove
          className="w-full"
        >
          {chunkArray(kategoriList, 6).map((group, idx) => (
            <SwiperSlide key={idx}>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {group.map((kat) => (
                  <button
                    key={kat}
                    className={`group relative overflow-hidden rounded-2xl border bg-white p-3 shadow-sm hover:shadow transition ${
                      kategoriAktif === kat
                        ? "ring-2 ring-yellow-600"
                        : "ring-1 ring-gray-200"
                    }`}
                    onClick={() =>
                      setKategoriAktif(kat === kategoriAktif ? "" : kat)
                    }
                    aria-pressed={kategoriAktif === kat}
                  >
                    <img
                      src={kategoriMap[kat] || othersImg}
                      alt={kat}
                      className="w-16 h-16 mx-auto object-cover rounded-full"
                    />
                    <span className="mt-2 block text-xs font-semibold text-center text-stone-800">
                      {kat}
                    </span>
                    <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/10 to-transparent transition" />
                  </button>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* SEARCH */}
      <section className="max-w-5xl mx-auto px-4 mb-8">
        <label htmlFor="search" className="sr-only">
          Cari produk
        </label>
        <div className="relative">
          <input
            id="search"
            className="w-full border-2 border-yellow-800/30 rounded-2xl px-5 py-3 focus:border-yellow-800 focus:outline-none text-lg bg-white/90 shadow-sm"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
            ⌘K
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-stone-800 tracking-wide">
            {kategoriAktif ? `Produk ${kategoriAktif}` : "All Products"}
          </h2>
          <div className="text-sm text-gray-500">
            {produkFiltered.length} item
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 text-red-700 p-3 ring-1 ring-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            aria-busy
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-gradient-to-br from-stone-100 to-stone-50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {produkFiltered.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-10">
                No Products Found
              </div>
            ) : (
              produkFiltered.map((liq) => {
                const harga = Number(liq.harga) || 0;
                const diskon = Number(liq.diskon) || 0;
                const finalHarga = harga - (harga * diskon) / 100;
                const isSoldOut = Number(liq.stok) === 0;
                return (
                  <motion.article
                    key={liq.id}
                    layout
                    className="group bg-white rounded-2xl ring-1 ring-gray-200 shadow-sm hover:shadow-md transition p-3 flex flex-col cursor-pointer"
                    onClick={() => setSelectedProduct(liq)}
                  >
                    <div className="relative">
                      {!!diskon && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white font-bold px-2 py-0.5 rounded-full text-[10px] shadow">
                          Special Offer
                        </span>
                      )}
                      {isSoldOut && (
                        <span className="absolute top-2 left-2 bg-gray-800 text-white font-bold px-2 py-0.5 rounded-full text-[10px] shadow">
                          Sold Out
                        </span>
                      )}
                      <img
                        src={liq.gambar || "/notfound.png"}
                        alt={liq.nama}
                        className="w-full aspect-square object-cover rounded-xl border"
                        loading="lazy"
                        onError={(e) => (e.currentTarget.src = "/notfound.png")}
                      />
                    </div>

                    <div className="mt-2 flex-1">
                      <h3
                        className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-1"
                        title={liq.nama}
                      >
                        {liq.nama}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm line-clamp-2">
                        {liq.deskripsi}
                      </p>
                    </div>

                    <div className="mt-2">
                      {diskon > 0 ? (
                        <div className="leading-tight">
                          <div className="line-through text-red-400 text-xs font-medium">
                            {formatRupiah(harga)}
                          </div>
                          <div className="text-stone-900 font-extrabold text-lg">
                            {formatRupiah(finalHarga)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-stone-900 font-bold text-lg">
                          {formatRupiah(harga)}
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center font-semibold">
                        ⭐ {Number(liq.rating ?? 5).toFixed(1)}
                      </span>
                      <span>{liq.sold || 0} sold</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSoldOut) return;
                        addToCart(liq, qtyInputs[liq.id]);
                      }}
                      className="mt-3 relative bg-gradient-to-tr from-yellow-600 to-yellow-700 text-white font-bold px-3 py-2 rounded-xl w-full shadow hover:from-yellow-700 hover:to-yellow-800 disabled:opacity-60"
                      disabled={isSoldOut}
                    >
                      Add to Cart
                    </button>
                  </motion.article>
                );
              })
            )}
          </div>
        )}
      </section>

      {/* MODAL DETAIL */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
            >
              <button
                className="absolute top-3 right-3 text-xl text-gray-400 hover:text-red-600"
                onClick={() => setSelectedProduct(null)}
                aria-label="Tutup"
              >
                ×
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <img
                  src={selectedProduct.gambar || "/notfound.png"}
                  alt={selectedProduct.nama}
                  className="w-full aspect-square object-cover rounded-xl border"
                  onError={(e) => (e.currentTarget.src = "/notfound.png")}
                />
                <div>
                  <h3 className="font-bold text-xl text-gray-900">
                    {selectedProduct.nama}
                  </h3>
                  <div className="mt-2">
                    {Number(selectedProduct.diskon) > 0 ? (
                      <div className="flex flex-col">
                        <span className="line-through text-red-400 text-sm font-medium mb-1">
                          {formatRupiah(Number(selectedProduct.harga || 0))}
                        </span>
                        <span className="text-gray-900 font-bold text-2xl">
                          {formatRupiah(
                            (Number(selectedProduct.harga || 0) *
                              (100 - Number(selectedProduct.diskon || 0))) /
                              100
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-900 font-bold text-2xl">
                        {formatRupiah(Number(selectedProduct.harga || 0))}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-gray-600 whitespace-pre-line">
                    {selectedProduct.deskripsi}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <span className="flex items-center font-semibold text-yellow-700">
                      ⭐ {Number(selectedProduct.rating || 5).toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      {selectedProduct.sold || 0} Sold
                    </span>
                  </div>

                  <a
                    href={waLink(selectedProduct.nama)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center bg-gradient-to-tr from-yellow-700 to-yellow-600 hover:from-yellow-800 hover:to-yellow-700 text-white font-bold px-6 py-3 rounded-2xl"
                  >
                    Order via WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CART */}
      <Cart cart={cart} setCart={setCart} />

      {/* INSTAGRAM */}
      <section id="instagram" className="w-full px-4 py-10 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Follow Us on Instagram
        </h2>
        <p className="text-center text-gray-600 mb-6">
          @w3liquor — promo, arrival baru, dan konten pairing seru.
        </p>
        <Swiper
          modules={[Autoplay, A11y]}
          slidesPerView={1}
          spaceBetween={12}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop={IG_IMAGES.length > 3}
          autoplay={{ delay: 1600, disableOnInteraction: false }}
          a11y={{ enabled: true }}
          className="w-full max-w-5xl mx-auto"
        >
          {IG_IMAGES.map((src, idx) => (
            <SwiperSlide key={idx}>
              <a
                href="https://www.instagram.com/w3liquor/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={src}
                  alt={`Instagram ${idx + 1}`}
                  className="w-full h-[220px] sm:h-[360px] md:h-[400px] object-cover object-center rounded-xl ring-1 ring-gray-200 hover:scale-[1.01] transition"
                  loading="lazy"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* OFFICIAL STORES */}
      <section
        id="official-stores"
        className="w-full px-4 sm:px-10 py-16 bg-gradient-to-b from-white to-yellow-50"
      >
        <h2 className="text-3xl font-bold text-center text-stone-900 mb-10">
          Shop at Our Official Stores!
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-6 max-w-2xl mx-auto">
          <a
            href="https://www.tokopedia.com/weliquor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-xl shadow-md transition duration-300 w-[260px] justify-center"
            title="Kunjungi toko Tokopedia W3LIQUOR"
          >
            <img src={tokopedia} alt="Tokopedia W3LIQUOR" className="w-7 h-7" />
            Tokopedia Store
          </a>

          <a
            href="https://www.blibli.com/merchant/w3liquor/W3R-70000?pickupPointCode=PP-3542947"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-5 rounded-xl shadow-md transition duration-300 w-[260px] justify-center"
            title="Kunjungi toko Blibli W3LIQUOR"
          >
            <img src={blibli} alt="Blibli W3LIQUOR" className="w-7 h-7" />
            Blibli Store
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="max-w-7xl mx-auto mt-10 mb-12 px-6 py-10 rounded-3xl bg-white shadow-xl ring-1 ring-yellow-100"
      >
        <div className="grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">W3liquor</h2>
            <p className="text-gray-700 leading-relaxed text-base">
              Whisky Wine And Whatever — 100% Original Liquor Store. Kami
              menghadirkan spirit otentik dan berkualitas premium dengan kurasi
              ketat. Dari whisky untuk kolektor hingga liqueur untuk mixologist,
              semua ada di sini.
              <br />
              <br />
              <b>Dapatkan promo eksklusif — chat kami sekarang!</b>
              <br />
              <span className="text-yellow-700 font-bold">
                Find Your Favorite Liquor Here!
              </span>
            </p>
          </div>
          <div className="bg-gradient-to-tr from-yellow-100 to-yellow-50 p-6 rounded-2xl ring-1 ring-yellow-200">
            <ul className="space-y-3 text-sm text-gray-800">
              <li>
                <b>Pengiriman Instan/Sameday:</b> Gojek
              </li>
              <li>
                <b>Lokasi:</b> Jakarta Barat
              </li>
              <li>
                <b>Jam Operasional:</b> Senin - Minggu | 11:00 - 22:00
              </li>
              <li>
                <b>Kontak:</b> WhatsApp 0812-9972-3970
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="contact"
        className="w-full mt-auto py-8 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-5">
          <div>
            <div className="font-black text-2xl tracking-widest">
              W3<span className="text-yellow-100">LIQUOR</span>
            </div>
            <div className="text-xs opacity-90">
              © {new Date().getFullYear()} W3LIQUOR
              <br />
              <span className="text-[10px]">Your One-Stop Liquor Store</span>
            </div>
          </div>

          <div className="text-sm">
            <div className="font-semibold mb-1">More Information</div>
            <div>Pengiriman Instan/Sameday: Gojek</div>
            <div>Location: Jakarta Barat</div>
            <div>Jam Operasional: Senin - Minggu | 11:00 - 22:00</div>
          </div>

          <div className="text-sm">
            <div className="font-semibold mb-1">Contact</div>
            <div>
              WhatsApp:{" "}
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                className="underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                0812-9972-3970
              </a>
            </div>
            <div>
              Email:{" "}
              <a
                href="mailto:drunkwliquor@gmail.com"
                className="underline font-medium"
              >
                wwwliquor@gmail.com
              </a>
            </div>
          </div>

          <div className="flex gap-6 text-base items-center">
            <a
              href="https://www.instagram.com/w3liquor"
              className="hover:text-yellow-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://tokopedia.link/aiKJUeadaVb"
              className="hover:text-yellow-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tokopedia
            </a>
            <a
              href="https://blibli.onelink.me/GNtk/ys8uoloo"
              className="hover:text-yellow-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blibli
            </a>
          </div>
        </div>
        <div className="text-xs text-yellow-100/90 text-center mt-4 md:hidden">
          © {new Date().getFullYear()} W3LIQUOR
        </div>
      </footer>
    </div>
  );
}
