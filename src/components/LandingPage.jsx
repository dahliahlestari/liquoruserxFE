import React, { useEffect, useState } from "react";
import axios from "axios";
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import cognacImg from "../assets/cognac.png";
import ginImg from "../assets/Gin.png";  
import rumImg from "../assets/rum.png";
import tequilaImg from "../assets/tequila.png";
import vodkaImg from "../assets/vodka.png";
import whiskyImg from "../assets/whisky.png";
import wineImg from "../assets/wine.png";
import liqueurImg from "../assets/liqueur.png";
import othersImg from "../assets/others.png";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import Cart from "./Cart.jsx";

// API URL dari ENV
const API_URL = import.meta.env.VITE_API_URL;

// Emoji kategori
const kategoriMap = {
  Whisky: whiskyImg,
  Vodka: vodkaImg,
  Gin: ginImg,
  Rum: rumImg,
  Tequila: tequilaImg,
  Wine: wineImg,
  cognac: cognacImg,
  Liqueur: liqueurImg,
  Others: othersImg,
};

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "Product", href: "#products" },
  { label: "About Us", href: "#about" },
];

const waOrderLink =
  "https://wa.me/6281299723970?text=Halo%2C%20saya%20mau%20order%20minuman%20di%20W3LIQUOR%20!";

export default function LandingPage() {
  const [liquors, setLiquors] = useState([]);
  const [kategoriAktif, setKategoriAktif] = useState("");
  const [search, setSearch] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [qtyInputs, setQtyInputs] = useState({});

  useEffect(() => {
    axios
      .get(`${API_URL}/api/liquors`)
      .then((res) => setLiquors(res.data))
      .catch(() => setLiquors([]));
  }, []);

  const kategoriList = [
    ...new Set(liquors.map((l) => l.kategori).filter(Boolean)),
  ];

  const produkFiltered = liquors.filter(
    (l) =>
      (!kategoriAktif || l.kategori === kategoriAktif) &&
      (!search ||
        l.nama.toLowerCase().includes(search.toLowerCase()) ||
        l.kategori?.toLowerCase().includes(search.toLowerCase()))
  );

  const waLink = (nama) => {
    const msg = encodeURIComponent(`Halo, saya ingin pesan produk ${nama}.`);
    return `https://wa.me/6281299723970?text=${msg}`;
  };

  const addToCart = (product, qty = 1) => {
    const jumlah = parseInt(qty) || 1;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + jumlah } : item
        );
      } else {
        return [...prevCart, { ...product, qty: jumlah }];
      }
    });
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 2000);
  };


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-yellow-50 via-blue-50 to-white font-sans">
      {/* Floating WhatsApp Order Now Button */}
      <a
        href={waOrderLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed z-[9999] bottom-6 right-6 md:bottom-8 md:right-8 flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-tr from-green-500 to-green-600 text-white font-extrabold text-lg shadow-2xl animate-pulseOrder border-4 border-white/50 hover:scale-105 hover:from-green-600 hover:to-green-700 transition-all duration-200 active:scale-95"
        style={{ boxShadow: "0 6px 32px 0 rgba(24,180,81,0.25)" }}
      >
        <svg
          viewBox="0 0 32 32"
          width={32}
          height={32}
          fill="none"
          className="drop-shadow-md"
        >
          <circle cx="16" cy="16" r="16" fill="#25D366" />
          <path
            d="M22.3 18.4c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.7-.2-1 .2-.3.3-.8.9-1 1.1-.2.2-.4.2-.8 0-.4-.2-1.5-.6-2.9-1.9-1.1-1-1.9-2.2-2.1-2.5-.2-.4 0-.6.2-.8.2-.2.4-.5.5-.7.2-.3.2-.5.3-.7.1-.2 0-.5-.1-.7s-1-2.5-1.4-3.4c-.3-.8-.6-.7-.8-.7-.2 0-.5 0-.7 0-.2 0-.6.1-.9.4-.4.3-1.1 1.1-1.1 2.7 0 1.6 1.1 3.2 1.2 3.4.2.2 2.3 3.5 5.5 4.8.7.3 1.3.5 1.8.6.8.1 1.5.1 2.1 0 .7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.9z"
            fill="#fff"
          />
        </svg>
        <span className="hidden sm:inline animate-bounceOrder">Chat!</span>
        <style>
          {`
            @keyframes pulseOrder {
              0% { box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.7); }
              70% { box-shadow: 0 0 0 16px rgba(39, 174, 96, 0); }
              100% { box-shadow: 0 0 0 0 rgba(39, 174, 96, 0); }
            }
            .animate-pulseOrder {
              animation: pulseOrder 2.5s infinite;
            }
            @keyframes bounceOrder {
              0%, 100% { transform: translateY(0);}
              50% { transform: translateY(-8px);}
            }
            .animate-bounceOrder {
              animation: bounceOrder 1.2s infinite;
            }
          `}
        </style>
      </a>

      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <a href="#" className="flex items-center gap-3">
              <a href="#" className="flex items-center gap-3">
                <img
                  src="/log.png"
                  alt="W3LIQUOR Logo"
                  className="w-32 h-auto object-contain"
                />
              </a>
            </a>
            <div className="hidden md:flex gap-8 items-center">
              {NAV_LINKS.map((lnk) => (
                <a
                  key={lnk.label}
                  href={lnk.href}
                  className="text-gray-600 hover:text-yellow-700 font-semibold transition tracking-wide"
                >
                  {lnk.label}
                </a>
              ))}
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden flex items-center px-3 py-2 rounded border border-black-500 text-yellow-700"
              onClick={() => setNavbarOpen((s) => !s)}
              aria-label="Open menu"
            >
              <svg width="28" height="28" fill="none">
                <path
                  d="M5 8h18M5 16h18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
              </svg>
            </button>
          </div>
        </div>
        {navbarOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="flex flex-col py-2 gap-1 px-5">
              {NAV_LINKS.map((lnk) => (
                <a
                  key={lnk.label}
                  href={lnk.href}
                  className="py-2 text-gray-700 font-medium border-b"
                  onClick={() => setNavbarOpen(false)}
                >
                  {lnk.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
      
      {/* Cart */}
      <Cart cart={cart} setCart={setCart} />

      {/* Banner Carousel */}
      <section className="mb-8 mt-8 w-full px-2 sm:px-4 lg:px-0 max-w-6xl mx-auto">
        <div className="rounded-xl overflow-hidden w-full bg-gray-100 relative" style={{ aspectRatio: "16/9" }}>
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4200, disableOnInteraction: false }}
            slidesPerView={1}
            loop
            className="w-full h-full"
          >
            {[banner1, banner2].map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={img}
                  alt={`Banner ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Kategori */}
      <section className="mt-2 mb-10 max-w-5xl mx-auto px-3" id="categories">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-stone-800 tracking-wide">
            Whisky Wine And Whatever
          </h2>
          {kategoriAktif && (
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-stone-700 to-stone-800 text-white font-semibold rounded-full px-4 py-1 hover:scale-105 hover:from-Stone-500 hover:to-stone-600 transition-all duration-150"
              onClick={() => setKategoriAktif("")}
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 20 20">
                <path
                  d="M10 3v14M3 10h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              All Products
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {kategoriList.length === 0 ? (
            <div className="col-span-full text-gray-400">not Available.</div>
          ) : (
            kategoriList.map((kat) => (
              <button
                key={kat}
                className={`overflow-hidden rounded-xl transition transform hover:scale-105 focus:outline-none
                  ${kategoriAktif === kat ? "ring-4 ring-yellow-600 scale-105" : ""}
                `}
                onClick={() => setKategoriAktif(kat === kategoriAktif ? "" : kat)}
              >
                <img
                  src={kategoriMap[kat] || othersImg}
                  alt={kat}
                  className="w-24 h-24 object-cover sm:w-28 sm:h-28"
                />
              </button>
            ))
          )}
        </div>
      </section>



      {/* Search Bar */}
      <section className="mb-7 max-w-4xl mx-auto px-3">
        <input
          className="w-full border-2 border-grey-900 rounded-2xl px-5 py-3 focus:border-yellow-800 focus:outline-none text-lg bg-white/90"
          placeholder=" Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {/* Produk */}
      <section className="max-w-6xl mx-auto px-3 py-2" id="products">
        <h2 className="text-2xl font-bold text-stone-800 mb-5 tracking-wide">
          {kategoriAktif ? `Produk ${kategoriAktif}` : "All Products"}
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {produkFiltered.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-10">
              No Products Found
            </div>
          ) : (
            produkFiltered.map((liq) => (
              <div
                key={liq.id}
                className="bg-white rounded-3xl shadow-1xl flex flex-col items-center p-6 relative hover:scale-105 hover:shadow-grey-700/80 transition-all border border-grey-700 cursor-pointer"
                onClick={() => setSelectedProduct(liq)}
              >
                {/* Badge diskon */}
                {liq.diskon > 0 && (
                  <span className="absolute top-3 right-3 bg-red-600 text-white font-bold px-2 py-1 rounded-full text-xs">
                    Special Offer
                  </span>
                )}
                <img
                  src={liq.gambar}
                  alt={liq.nama}
                  className="w-55 h-55 object-cover rounded-xl mb-3 border"
                  onError={(e) => (e.target.src = "/notfound.png")}
                />
                <div className="font-bold text-lg text-gray-900 mb-1 text-center tracking-wide">
                  {liq.nama}
                </div>
                <div className="text-gray-500 text-sm mb-1 line-clamp-2 text-center">
                  {liq.deskripsi}
                </div>
                <div className="text-xl font-extrabold mb-2 text-center w-full">
                  {liq.diskon > 0 ? (
                    <>
                      <span className="line-through text-red-400 mr-2 font-medium text-base">
                        Rp{Number(liq.harga).toLocaleString()}
                      </span>
                      <span className="text-grey-700 font-extrabold text-xl">
                        Rp
                        {Number(
                          liq.harga - (liq.harga * liq.diskon) / 100
                        ).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-grey-700">
                      Rp{Number(liq.harga).toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center gap-3 mb-4 w-full">
                  {/* Rating & Sold */}
                  <span className="flex items-center text-yellow-500 font-bold text-base">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 2l2.39 4.86 5.36.78-3.87 3.77.92 5.36L10 14.27l-4.8 2.5.92-5.36-3.87-3.77 5.36-.78L10 2z" />
                    </svg>
                    {Number(liq.rating || 5).toFixed(1)}
                  </span>
                  <span className="flex items-center text-gray-500 font-medium text-sm">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 11V5a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v6m8 0a4 4 0 1 1-8 0"></path>
                    </svg>
                    {liq.sold || 0} sold
                  </span>
                </div>
                <button
                  className="bg-gradient-to-tr from-stone-700 to-stone-800 hover:from-zinc-800 hover:to-zinc-700 text-white font-bold px-4 py-2 rounded-xl w-full text-center shadow mt-auto transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(liq, qtyInputs[liq.id]);
                    setQtyInputs((prev) => ({ ...prev, [liq.id]: 1 }));
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MODAL PRODUK DETAIL */}
      {selectedProduct && (
        <div
          className="fixed z-[999] inset-0 bg-black/50 flex items-center justify-center"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-1xl max-w-md w-full p-7 relative shadow-0.5xl border-1 border-yellow-200 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol close */}
            <button
              className="absolute top-5 right-5 text-xl text-gray-400 hover:text-red-600 transition"
              onClick={() => setSelectedProduct(null)}
              aria-label="Tutup"
            >
              ×
            </button>
            <img
              src={selectedProduct.gambar}
              alt={selectedProduct.nama}
              className="w-36 h-36 object-cover rounded-xl mx-auto mb-4 border shadow"
              onError={(e) => (e.target.src = "/notfound.png")}
            />
            <div className="font-bold text-2xl text-gray-800 text-left mb-1">
              {selectedProduct.nama}
            </div>
            <div className="flex justify-left gap-2 mb-2">
              <span className="text-grey-600 font-bold bg-grey-100 px-3 py-1 rounded-full text-xs">
              </span>
            </div>
            <div className="text-left mb-4 text-lg font-semibold text-gray-700">
              {selectedProduct.diskon > 0 ? (
                <>
                  <span className="line-through text-red-400 mr-2 font-italic text-base">
                    Rp{Number(selectedProduct.harga).toLocaleString()}
                  </span>
                  <span className="text-grey-800 font-bold text-s">
                    Rp. 
                    {Number(
                      selectedProduct.harga -
                        (selectedProduct.harga * selectedProduct.diskon) / 100
                    ).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-grey-700 font-bold">
                  Rp{Number(selectedProduct.harga).toLocaleString()}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 text-left mb-2 whitespace-pre-line">
              {selectedProduct.deskripsi} 
            </div>
            <div className="flex items-center justify-left gap-5 mb-6">
              <span className="flex items-center text-yellow-600 font-bold">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mr-1"
                >
                  <path d="M10 2l2.39 4.86 5.36.78-3.87 3.77.92 5.36L10 14.27l-4.8 2.5.92-5.36-3.87-3.77 5.36-.78L10 2z" />
                </svg>
                {Number(selectedProduct.rating || 5).toFixed(1)}
              </span>
              <span className="flex items-center text-gray-500 font-medium text-sm">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  viewBox="0 0 24 24"
                  className="mr-1"
                >
                  <path d="M16 11V5a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v6m8 0a4 4 0 1 1-8 0"></path>
                </svg>
                {selectedProduct.sold || 0} Sold
              </span>
            </div>
            <a
              href={waLink(selectedProduct.nama)}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-tr from-stone-700 to-stone-900 hover:from-stone-800 hover:to-stone-700 text-white font-bold px-6 py-3 rounded-2xl w-full text-center transition"
            >
              Order Now
            </a>
          </div>
        </div>
      )}

      {/* About Section */}
      <section
        className="max-w-4xl mx-auto mt-16 mb-10 px-6 py-8 rounded-2xl bg-white/70 shadow-xl border border-stone-100"
        id="about"
      >
        <h2 className="text-2xl font-bold text-center text-black-700 mb-4 tracking-wide">
          W3liquor
        </h2>
        <p className="text-gray-700 text-center leading-relaxed text-lg">
           Whisky Wine And Whatever 100% Original Liquor Store
          <br />
          <b>Get more Special offer! chat us now</b>
          <br />
          <span className="text-yellow-700 text-center font-bold">
            Find Your Favorite Liquor Here!
          </span>
        </p>
      </section>

      {/* Footer */}
      <footer
        className="w-full mt-12 py-8 bg-gradient-to-r from-stone-800 to-stone-700 text-white shadow-inner"
        id="contact"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5 px-5">
          <div>
            <div className="font-bold text-2xl mb-1 tracking-widest">
              W3<span className="text-grey-800">LIQUOR</span>
            </div>
            <div className="text-xs">
              © {new Date().getFullYear()} W3LIQUOR
              <br />
              <span className="text-[10px] text-yellow-100/80">
                W3Liquor Your One Stop Shop liquor Store
              </span>
            </div>
          </div>
          <div className="text-sm">
            <div className="font-semibold mb-1">More Information:</div>
            <div>
              Pengiriman Instan/Sameday:{" "}
              <a>
               Gojek
              </a>
            </div>
            <div>
              Location:{" "}
              <a>
                Jakarta Barat
              </a>
            </div>
            <div>
              Jam Operational:{" "}
              <a>
                Senin - Minggu | 11:00 - 22:00
              </a>
            </div>
          </div>
          <div className="text-sm">
            <div className="font-semibold mb-1">Contact:</div>
            <div>
              WhatsApp:{" "}
              <a
                href="https://wa.me/6281299723970"
                className="underline font-medium"
              >
                0812-9972-3970
              </a>
            </div>
            <div>
              Email:{" "}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=drunkwliquor@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                wwwliquor@gmail.com
              </a>
            </div>
          </div>
          <div className="flex gap-6 text-xl items-center">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/w3liquor"
              className="hover:text-yellow-300 flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <span className="hidden md:inline">Instagram</span>
            </a>
            {/* Tokopedia */}
            <a
              href="https://tokopedia.link/aiKJUeadaVb"
              className="hover:text-yellow-300 flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tokopedia"
              title="Tokopedia"
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                  fill="#fff"
              </svg>
              <span className="hidden md:inline">Tokopedia</span>
            </a>
            {/* Blibli */}
            <a
              href="https://blibli.onelink.me/GNtk/ys8uoloo"
              className="hover:text-yellow-300 flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Blibli"
              title="Blibli"
            >
              <svg width="22" height="22" viewBox="0 0 24 24">
              </svg>
              <span className="hidden md:inline">Blibli</span>
            </a>
          </div>
        </div>
        <div className="text-xs text-yellow-100/80 text-center mt-4 md:hidden">
          © {new Date().getFullYear()} W3LIQUOR
        </div>
      </footer>
    </div>
  );
}
