
import React, { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";

export default function Cart({ cart, setCart }) {
  const [show, setShow] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const prevCartLength = useRef(cart.length);

  const totalItem = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalHarga = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, );

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQtyChange = (id, type) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const max = item.maxQty || 10;
          const newQty =
            type === "plus"
              ? Math.min(item.qty + 1, max)
              : Math.max(1, item.qty - 1);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const handleCheckout = () => {
    const msg = encodeURIComponent(
      `Halo, saya ingin memesan:\n\n${cart
        .map(
          (item) =>
            `➤ ${item.nama}\n   Jumlah: ${item.qty}\n   Harga: Rp ${item.harga.toLocaleString(
              "id-ID"
            )} x ${item.qty} = Rp ${(item.harga * item.qty).toLocaleString("id-ID")}`
        )
        .join("\n\n")}\n\nTOTAL: Rp ${totalHarga.toLocaleString("id-ID")}\n\nTerima kasih!`
    );

    window.open(`https://wa.me/6281299723970?text=${msg}`, "_blank");
  };

  useEffect(() => {
    const toggle = (e) => {
      if (e.key === "Escape") setShow(false);
    };
    window.addEventListener("keydown", toggle);
    return () => window.removeEventListener("keydown", toggle);
  }, []);

  useEffect(() => {
    if (cart.length > prevCartLength.current) {
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 2000);
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
              <p className="text-gray-500 text-center">Keranjang masih kosong</p>
            ) : (
              <>
                <ul className="space-y-5 mb-6 max-h-[350px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-4 bg-gray-50 rounded-xl p-4 shadow-sm"
                    >
                      {item.gambar && (
                        <img
                          src={item.gambar}
                          alt={item.nama}
                          className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-base font-semibold">{item.nama}</h3>
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
                          Rp {item.harga.toLocaleString("id-ID")} x {item.qty} ={" "}
                          <span className="font-semibold text-black">
                            Rp {(item.harga * item.qty).toLocaleString("id-ID")}
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
                  ))}
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