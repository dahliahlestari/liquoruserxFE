import React, { useEffect, useState } from "react";
import axios from "axios";
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

// Emoji kategori
const kategoriMap = {
  Whiskey: "🥃",
  Vodka: "🍸",
  Gin: "🍸",
  Rum: "🍹",
  Tequila: "🧉",
  Wine: "🍷",
  Beer: "🍺",
  Liqueur: "🍶",
  Others: "🍾",
};

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "Produk", href: "#products" },
  { label: "Tentang Kami", href: "#about" },
  { label: "Kontak", href: "#contact" },
];

const waOrderLink =
  "https://wa.me/6281299723970?text=Halo%2C%20saya%20mau%20order%20minuman%20di%20W3LIQUOR%20!";

export default function LandingPage() {
  const [liquors, setLiquors] = useState([]);
  const [kategoriAktif, setKategoriAktif] = useState("");
  const [search, setSearch] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/liquors")
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
    const msg = encodeURIComponent(`Halo, saya ingin pesan produk: ${nama}`);
    return `https://wa.me/6281299723970?text=${msg}`;
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
        <span className="hidden sm:inline animate-bounceOrder">ORDER NOW!</span>
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
      <nav className="bg-white/90 shadow-lg backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <a href="#" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-10 h-10 object-contain rounded-xl shadow"
                onError={(e) => (e.target.style.display = "none")}
              />
              <span className="font-extrabold text-2xl text-blue-700 tracking-widest">
                W3<span className="text-yellow-500">LIQUOR</span>
              </span>
            </a>
            <div className="hidden md:flex gap-8 items-center">
              {NAV_LINKS.map((lnk) => (
                <a
                  key={lnk.label}
                  href={lnk.href}
                  className="text-gray-600 hover:text-blue-700 font-semibold transition tracking-wide"
                >
                  {lnk.label}
                </a>
              ))}
              <a
                href="https://wa.me/6281299723970"
                className="bg-gradient-to-tr from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-xl px-5 py-2 font-bold ml-2 shadow"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pesan WhatsApp
              </a>
            </div>
            {/* Hamburger */}
            <button
              className="md:hidden flex items-center px-3 py-2 rounded border border-blue-500 text-blue-700"
              onClick={() => setNavbarOpen((s) => !s)}
              aria-label="Open menu"
            >
              <svg width="28" height="28" fill="none">
                <path
                  d="M5 8h18M5 16h18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
        {navbarOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow">
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
              <a
                href="https://wa.me/6281299723970"
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 font-bold shadow my-2 text-center"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setNavbarOpen(false)}
              >
                Pesan WhatsApp
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Banner Carousel */}
      <section className="mb-8 mt-8 max-w-6xl mx-auto w-full px-2">
        <div className="rounded-3xl shadow-2xl overflow-hidden w-full aspect-video bg-gray-100">
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
          <h2 className="text-xl font-extrabold text-blue-900 tracking-wide">
            Temukan Kategori Favoritmu
          </h2>
          {kategoriAktif && (
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-blue-400 text-white font-semibold rounded-full px-4 py-1 shadow hover:scale-105 hover:from-yellow-500 hover:to-blue-500 hover:shadow-lg transition-all duration-150"
              onClick={() => setKategoriAktif("")}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
                <path
                  d="M10 3v14M3 10h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Semua Produk
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {kategoriList.length === 0 ? (
            <div className="col-span-full text-gray-400">
              Belum ada kategori.
            </div>
          ) : (
            kategoriList.map((kat) => (
              <button
                key={kat}
                className={`flex flex-col items-center justify-center bg-white border-2 rounded-full w-20 h-20 shadow-md transition hover:shadow-lg hover:border-yellow-400
                  ${
                    kategoriAktif === kat
                      ? "border-yellow-500 ring-2 ring-yellow-200 scale-110"
                      : "border-blue-100"
                  }
                `}
                onClick={() =>
                  setKategoriAktif(kat === kategoriAktif ? "" : kat)
                }
              >
                <span className="text-3xl mb-1">
                  {kategoriMap[kat] || "🍶"}
                </span>
                <span className="font-semibold text-gray-700 text-xs text-center">
                  {kat}
                </span>
              </button>
            ))
          )}
        </div>
      </section>

      {/* Search Bar */}
      <section className="mb-7 max-w-4xl mx-auto px-3">
        <input
          className="w-full border-2 border-yellow-100 rounded-2xl px-5 py-3 shadow focus:border-yellow-400 focus:outline-none text-lg bg-white/90"
          placeholder="Cari produk, kategori, dsb..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {/* Produk */}
      <section className="max-w-6xl mx-auto px-3 py-2" id="products">
        <h2 className="text-2xl font-bold text-blue-800 mb-5 tracking-wide">
          {kategoriAktif ? `Produk ${kategoriAktif}` : "Semua Produk"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-9">
          {produkFiltered.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-10">
              Tidak ada produk.
            </div>
          ) : (
            produkFiltered.map((liq) => (
              <div
                key={liq.id}
                className="bg-white rounded-3xl shadow-2xl flex flex-col items-center p-6 relative hover:scale-105 hover:shadow-yellow-200/80 transition-all border border-yellow-100 cursor-pointer"
                onClick={() => setSelectedProduct(liq)}
              >
                {/* Badge kategori */}
                <span className="absolute top-3 left-3 text-[10px] bg-blue-100 text-blue-600 font-semibold rounded-full px-3 py-1 shadow">
                  {kategoriMap[liq.kategori] || "🍶"} {liq.kategori}
                </span>
                {/* Badge diskon */}
                {liq.diskon > 0 && (
                  <span className="absolute top-3 right-3 bg-yellow-400 text-white font-bold px-2 py-1 rounded-full text-xs shadow-lg">
                    -{liq.diskon}%
                  </span>
                )}
                <img
                  src={liq.gambar}
                  alt={liq.nama}
                  className="w-28 h-28 object-cover rounded-xl mb-3 border shadow"
                  onError={(e) => (e.target.src = "/notfound.png")}
                />
                <div className="font-bold text-lg text-gray-900 mb-1 text-center tracking-wide">
                  {liq.nama}
                </div>
                <div className="text-gray-500 text-sm mb-1 line-clamp-2 text-center">
                  {liq.deskripsi}
                </div>
                <div className="mb-3 w-full flex justify-center gap-2">
                  <span className="bg-blue-100 text-blue-600 font-semibold px-3 py-1 rounded-full text-xs shadow select-none">
                    Stok: {liq.stok}
                  </span>
                </div>
                <div className="text-xl font-extrabold mb-2 text-center w-full">
                  {liq.diskon > 0 ? (
                    <>
                      <span className="line-through text-red-400 mr-2 font-medium text-base">
                        Rp{Number(liq.harga).toLocaleString()}
                      </span>
                      <span className="text-green-700 font-extrabold text-xl">
                        Rp
                        {Number(
                          liq.harga - (liq.harga * liq.diskon) / 100
                        ).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-blue-700">
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
                    {liq.sold || 0} terjual
                  </span>
                </div>
                <button
                  className="bg-gradient-to-tr from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-4 py-2 rounded-xl w-full text-center shadow mt-auto transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(waLink(liq.nama), "_blank");
                  }}
                >
                  Pesan via WhatsApp
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
            className="bg-white rounded-3xl max-w-md w-full p-7 relative shadow-2xl border-2 border-yellow-200 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol close */}
            <button
              className="absolute top-3 right-3 text-xl text-gray-400 hover:text-red-500 transition"
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
            <div className="font-bold text-2xl text-gray-800 text-center mb-1">
              {selectedProduct.nama}
            </div>
            <div className="flex justify-center gap-2 mb-2">
              <span className="text-blue-600 font-bold bg-blue-100 px-3 py-1 rounded-full text-xs">
                {kategoriMap[selectedProduct.kategori] || "🍶"}{" "}
                {selectedProduct.kategori}
              </span>
              {selectedProduct.diskon > 0 && (
                <span className="bg-yellow-400 text-white font-bold px-3 py-1 rounded-full text-xs shadow">
                  Diskon {selectedProduct.diskon}%
                </span>
              )}
            </div>
            <div className="text-center mb-3 text-lg font-semibold text-gray-700">
              {selectedProduct.diskon > 0 ? (
                <>
                  <span className="line-through text-red-400 mr-2 font-medium">
                    Rp{Number(selectedProduct.harga).toLocaleString()}
                  </span>
                  <span className="text-green-700 font-extrabold text-xl">
                    Rp
                    {Number(
                      selectedProduct.harga -
                        (selectedProduct.harga * selectedProduct.diskon) / 100
                    ).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-blue-700 font-bold">
                  Rp{Number(selectedProduct.harga).toLocaleString()}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 text-center mb-2">
              {selectedProduct.deskripsi}
            </div>
            <div className="flex items-center justify-center gap-5 mb-6">
              <span className="flex items-center text-yellow-500 font-bold">
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
                {selectedProduct.sold || 0} terjual
              </span>
            </div>
            <a
              href={waLink(selectedProduct.nama)}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-tr from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-3 rounded-2xl w-full text-center shadow transition"
            >
              Pesan via WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* About Section */}
      <section
        className="max-w-4xl mx-auto mt-16 mb-10 px-4 py-8 rounded-2xl bg-white/70 shadow-xl border border-yellow-100"
        id="about"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-4 tracking-wide">
          Tentang Kami
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          <b>W3LIQUOR</b> adalah katalog minuman online. Semua produk dikelola
          langsung oleh admin, update otomatis tanpa repot!
          <br />
          <span className="text-yellow-600 font-bold">
            Temukan minuman favorit, cek promo diskon, dan pesan mudah lewat
            WhatsApp!
          </span>
        </p>
      </section>

      {/* Footer */}
      <footer
        className="w-full mt-12 py-8 bg-gradient-to-r from-blue-800 to-yellow-500 text-white shadow-inner"
        id="contact"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5 px-5">
          <div>
            <div className="font-bold text-2xl mb-1 tracking-widest">
              W3<span className="text-yellow-300">LIQUOR</span>
            </div>
            <div className="text-xs">
              © {new Date().getFullYear()} W3LIQUOR. All Rights Reserved.
              <br />
              <span className="text-[10px] text-yellow-100/80">
                Designed with ❤️ by W3LIQUOR Team. Unauthorized duplication is a
                violation of applicable laws.
              </span>
            </div>
          </div>
          <div className="text-sm">
            <div className="font-semibold mb-1">Kontak Admin:</div>
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
                drunkwliquor@gmail.com
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
              <svg width="24" height="24" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="IG" x1="0.5" x2="0.5" y1="0" y2="1">
                    <stop offset="0%" stopColor="#f9ce34" />
                    <stop offset="45%" stopColor="#ee2a7b" />
                    <stop offset="75%" stopColor="#6228d7" />
                  </linearGradient>
                </defs>
                <rect width="24" height="24" rx="6" fill="url(#IG)" />
                <path
                  d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm4.5 4.4A5.6 5.6 0 1 0 17.6 12 5.6 5.6 0 0 0 12 6.4zm0 9.1A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5zm5.2-9.1a1.3 1.3 0 1 1-1.3-1.3 1.3 1.3 0 0 1 1.3 1.3z"
                  fill="#fff"
                />
              </svg>
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
              <svg width="24" height="24" viewBox="0 0 32 32">
                <ellipse cx="16" cy="21" rx="11" ry="7" fill="#1faa4c" />
                <ellipse cx="16" cy="16" rx="12" ry="9" fill="#40c24b" />
                <ellipse cx="16" cy="17" rx="8" ry="7" fill="#fff" />
                <ellipse cx="13.5" cy="18" rx="2.3" ry="2" fill="#323232" />
                <ellipse cx="18.5" cy="18" rx="2.3" ry="2" fill="#323232" />
                <ellipse
                  cx="13.5"
                  cy="18"
                  rx="1"
                  ry="1"
                  fill="#fff"
                  opacity="0.6"
                />
                <ellipse
                  cx="18.5"
                  cy="18"
                  rx="1"
                  ry="1"
                  fill="#fff"
                  opacity="0.6"
                />
                <rect
                  x="10"
                  y="12"
                  width="12"
                  height="4"
                  rx="2"
                  fill="#30a845"
                />
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
              <svg width="22" height="22" viewBox="0 0 32 32">
                <rect
                  x="7"
                  y="10"
                  width="18"
                  height="15"
                  rx="3"
                  fill="#0984e3"
                />
                <ellipse cx="16" cy="19" rx="5" ry="3" fill="#fff" />
                <ellipse cx="13.5" cy="16" rx="1" ry="1" fill="#fff" />
                <ellipse cx="18.5" cy="16" rx="1" ry="1" fill="#fff" />
                <rect x="13" y="7" width="6" height="4" rx="2" fill="#0984e3" />
                <polygon points="14.2,6.3 16,4 17.8,6.3" fill="#ffd700" />
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
