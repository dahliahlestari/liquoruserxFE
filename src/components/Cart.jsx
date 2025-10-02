import React, { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";

export default function Cart({ cart, setCart }) {
  const [show, setShow] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const prevCartLength = useRef(cart.length);

  // --- helper: harga setelah diskon per item ---
  const unitPrice = (item) => {
    const harga = Number(item.harga) || 0;
    const diskon = Number(item.diskon) || 0;
    return Math.round((harga * (100 - diskon)) / 100);
  };

  const totalItem = cart.reduce(
    (sum, item) => sum + (Number(item.qty) || 0),
    0
  );
  const totalHarga = cart.reduce(
    (sum, item) => sum + unitPrice(item) * (Number(item.qty) || 0),
    0
  );

  // Simpan ke localStorage saat cart berubah
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Ambil dari localStorage HANYA sekali saat mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart") || "[]");
      if (Array.isArray(stored)) setCart(stored);
    } catch {
      // ignore
    }
  }, [setCart]);

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQtyChange = (id, type) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const max = Number(item.stok ?? item.maxQty ?? 99);
        const next = type === "plus" ? item.qty + 1 : item.qty - 1;
        return { ...item, qty: Math.max(1, Math.min(next, max)) };
      })
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const msg = encodeURIComponent(
      `Halo, saya ingin memesan:\n\n${cart
        .map((item) => {
          const satuan = unitPrice(item);
          const subtotal = satuan * item.qty;
          return `➤ ${item.nama}
   Jumlah: ${item.qty}
   Harga: Rp ${satuan.toLocaleString("id-ID")} x ${
            item.qty
          } = Rp ${subtotal.toLocaleString("id-ID")}`;
        })
        .join("\n\n")}\n\nTOTAL: Rp ${totalHarga.toLocaleString(
        "id-ID"
      )}\n\nTerima kasih!`
    );

    window.open(`https://wa.me/6281299723970?text=${msg}`, "_blank");
  };

  // ESC tutup
  useEffect(() => {
    const toggle = (e) => {
      if (e.key === "Escape") setShow(false);
    };
    window.addEventListener("keydown", toggle);
    return () => window.removeEventListener("keydown", toggle);
  }, []);

  // Notif “Added!”
  useEffect(() => {
    if (cart.length > prevCartLength.current) {
      setShowNotif(true);
      const t = setTimeout(() => setShowNotif(false), 2000);
      return () => clearTimeout(t);
    }
    prevCartLength.current = cart.length;
  }, [cart]);

  return (
    <>
      {showNotif && (
        <div className="fixed bottom-24 left-6 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg z-[9999] animate-bounce">
          ✅ Added!
        </div>
      )}

      <button
        onClick={() => setShow(true)}
        className="fixed bottom-6 left-6 bg-neutral-900 hover:bg-yellow-800 text-white font-bold px-6 py-3 rounded-full shadow-lg z-[9999]"
      >
        🛒 Cart ({totalItem})
      </button>

      {show && (
        <div
          className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center px-4"
          onClick={() => setShow(false)}
        >
          <div
            className="bg-white max-w-lg w-full p-6 rounded-3xl shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-5 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setShow(false)}
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-center mb-6 text-yellow-700">
              🛒 Your Cart
            </h2>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center">
                Keranjang masih kosong
              </p>
            ) : (
              <>
                <ul className="space-y-5 mb-6 max-h-[350px] overflow-y-auto pr-1">
                  {cart.map((item) => {
                    const satuan = unitPrice(item);
                    return (
                      <li
                        key={item.id}
                        className="flex items-start gap-4 bg-gray-50 rounded-xl p-4 shadow-sm"
                      >
                        {item.gambar && (
                          <img
                            src={item.gambar}
                            alt={item.nama}
                            className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-base font-semibold">
                            {item.nama}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => handleQtyChange(item.id, "minus")}
                              className="bg-gray-200 px-3 rounded-full hover:bg-gray-300 font-bold"
                            >
                              -
                            </button>
                            <span className="min-w-[28px] text-center text-sm">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => handleQtyChange(item.id, "plus")}
                              className="bg-gray-200 px-3 rounded-full hover:bg-gray-300 font-bold"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Rp {satuan.toLocaleString("id-ID")} x {item.qty} ={" "}
                            <span className="font-semibold text-black">
                              Rp {(satuan * item.qty).toLocaleString("id-ID")}
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Hapus item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="border-t pt-4 mb-4 text-sm text-gray-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Total Item:</span>
                    <span className="font-semibold">{totalItem}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span>Total Price:</span>
                    <span className="font-bold text-yellow-700">
                      Rp {totalHarga.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </>
            )}

            <button
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-xl transition"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
