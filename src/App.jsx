import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import styles from "./App.module.css";

// ─── Supabase Client ──────────────────────────────────────────────────────────
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = "https://gfegwelibazdfmujjilc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_yfscwg3bBQUdGKGT108DAw_BIZSYpze";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Static Menu Data (fallback / seed) ──────────────────────────────────────
const MENU_CATEGORIES = [
  { id: "biryani", label: "Biryani Specials", icon: "✦" },
  { id: "grilled", label: "Grilled Meats", icon: "🔥" },
  { id: "chettinad", label: "Chettinad Curries", icon: "🍲" },
  { id: "sides", label: "Sides & Starters", icon: "🍴" },
  { id: "beverages", label: "Beverages", icon: "🥤" },
];

const STATIC_ITEMS = [
  {
    id: 1,
    category: "biryani",
    name: "Special Mutton Biryani",
    price: 320,
    description: "Tender mutton pieces cooked with Seeraga Samba rice and secret Pandiyan spices.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAx_RDkUBIZ_akJ8pK-i-veb_cPGegCyWtI7SY36aWHPXtIYTjYf9U2TZyXcKJWgdVi7R0tJ7hnhNkawB8gRSYi7lKFFN-nSdFumNMHMnW97TzjZak8hjdzOk_xVYh-kRc0N-ZNcXv7YRRq-m4OTiuETw8xgPgc91wbnKKSZw1S2sM-zDDskTTq98kIzoVM-g5pWy98GP6TAOgQAsC0rwUz581L3bL_RRXVrHwCRs12BklvJ4JOmsf6BqhM88HvtBxRVApTQZO_mGDU",
  },
  {
    id: 2,
    category: "biryani",
    name: "Dindigul Chicken Biryani",
    price: 240,
    description: "Aromatic Dindigul style biryani served with spicy onion raita and brinjal curry.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGr7CtVY6I11ft83ld26Zn5paboXvdbA7nAsnMVvS2k9EGWsJBwLE4dm8c0___pE2isQrTYVtZxewuKKvLnJMqOnhA3AioiaHb5qNb_NUGpKnlMvWxQoNrSSG4lrVraL66XaVpdZz9XRv2JKy-J7Y8L7fWN-wzLt_z7rgF8e_gwAw6kSNm0W10FHyEEBv0xQ1aY23pqGaZTqsSubEAQ5XdK0MsD_dGjpst5Fx-0PVWLlv0NffccTQP2C6AK_fwmLmr2oiMn1TdlSbY",
  },
  {
    id: 3,
    category: "grilled",
    name: "Pandiyan Grilled Chicken",
    price: 180,
    description: "Charcoal grilled half chicken marinated in Madurai's finest country masalas.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCI7rBfH6dKiUETUaDV4K5KWIF2J7CfkM7_0yHQK0vKMXlt5RhcEGEJF2jFCZEZkPf_cYdc4XY_RMBFUw3Hguf4KtIUDNKC6nqZGV_wfY3x4s52Kz-NzHTC8WgMMPcIdE7Oe3iiHdyM9S91lUqcBj0dqS9DLcYEvxVkFdPHtl66tdmcYfuDd8uCAeh46N3Y_Dqz3jp6pn9Edg51koRUP8Y1ziZC1Cv12FdzEOdQQqdqiw1SFEJxiJiRJlM0tkMzrZvgYV0m1VNAofGm",
  },
  {
    id: 4,
    category: "chettinad",
    name: "Chettinad Kuzhambu",
    price: 200,
    description: "Rich, aromatic Chettinad curry with a bold blend of pepper and kalpasi.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAx_RDkUBIZ_akJ8pK-i-veb_cPGegCyWtI7SY36aWHPXtIYTjYf9U2TZyXcKJWgdVi7R0tJ7hnhNkawB8gRSYi7lKFFN-nSdFumNMHMnW97TzjZak8hjdzOk_xVYh-kRc0N-ZNcXv7YRRq-m4OTiuETw8xgPgc91wbnKKSZw1S2sM-zDDskTTq98kIzoVM-g5pWy98GP6TAOgQAsC0rwUz581L3bL_RRXVrHwCRs12BklvJ4JOmsf6BqhM88HvtBxRVApTQZO_mGDU",
  },
  {
    id: 5,
    category: "sides",
    name: "Kothu Parotta",
    price: 110,
    description: "Shredded flaky parotta wok-tossed with eggs, onions, and spicy masala.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGr7CtVY6I11ft83ld26Zn5paboXvdbA7nAsnMVvS2k9EGWsJBwLE4dm8c0___pE2isQrTYVtZxewuKKvLnJMqOnhA3AioiaHb5qNb_NUGpKnlMvWxQoNrSSG4lrVraL66XaVpdZz9XRv2JKy-J7Y8L7fWN-wzLt_z7rgF8e_gwAw6kSNm0W10FHyEEBv0xQ1aY23pqGaZTqsSubEAQ5XdK0MsD_dGjpst5Fx-0PVWLlv0NffccTQP2C6AK_fwmLmr2oiMn1TdlSbY",
  },
  {
    id: 6,
    category: "beverages",
    name: "Rose Milk",
    price: 60,
    description: "Chilled fresh milk infused with aromatic rose syrup and basil seeds.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCI7rBfH6dKiUETUaDV4K5KWIF2J7CfkM7_0yHQK0vKMXlt5RhcEGEJF2jFCZEZkPf_cYdc4XY_RMBFUw3Hguf4KtIUDNKC6nqZGV_wfY3x4s52Kz-NzHTC8WgMMPcIdE7Oe3iiHdyM9S91lUqcBj0dqS9DLcYEvxVkFdPHtl66tdmcYfuDd8uCAeh46N3Y_Dqz3jp6pn9Edg51koRUP8Y1ziZC1Cv12FdzEOdQQqdqiw1SFEJxiJiRJlM0tkMzrZvgYV0m1VNAofGm",
  },
];

// ─── Utility ──────────────────────────────────────────────────────────────────
const GST_RATE = 0.05;

// ─── Components ──────────────────────────────────────────────────────────────

function Grain() {
  return (
    <div className={styles.grain} aria-hidden="true" />
  );
}

function Header({ cartCount, onCartClick, search, onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
      <div className={styles.headerInner}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>✦</span>
          <div>
            <h2 className={styles.brandName}>Madurai Pandiyan</h2>
            <p className={styles.brandTagline}>Legacy of Flavors</p>
          </div>
        </div>

        <nav className={styles.navLinks}>
          <a href="#menu">Menu</a>
          <a href="#about">Our Story</a>
          <a href="#location">Location</a>
        </nav>

        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              type="text"
              placeholder="Search dish..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <button className={styles.cartBtn} onClick={onCartClick}>
            <span>Tray</span>
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg}>
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBcEM3E_zMAV6mG4_uuW75qh4HpViRbdRIzkuyx5cEX4vzaKuN1HryscnA_iTRUnNOmI_6B75S10sUZx9dJ9vNwkBvbBC8YBr2U8iETCdUOHexVMeTDcQKyPTrGdZGXwL1pRYr-xhn4pZspbOVkO2qJxgkkvUfT8n7ggYb0I8MHbAlDz0fut8v8xLlZWHO7OKaugFLIdaS2Bmcm-L-AyelBzy8C_PtmNzIVWUTIncfDl0YVC49l2naah9i0ML5q7_Jj0l39t7_4uza"
          alt="Signature Biryani"
        />
        <div className={styles.heroOverlay} />
      </div>
      <div className={styles.heroContent}>
        <span className={styles.heroPill}>DLF IT Park &amp; SRM University Special</span>
        <h1 className={styles.heroHeading}>
          Authentic<br />
          <em>Madurai</em><br />
          Flavors
        </h1>
        <p className={styles.heroSub}>
          Experience the legendary taste of Pandiyan's signature Biryani and
          charcoal-grilled meats, crafted with heritage recipes.
        </p>
        <div className={styles.heroCtas}>
          <a href="#menu" className={styles.ctaPrimary}>View Menu ↓</a>
          <button className={styles.ctaSecondary}>Reserve Table</button>
        </div>
      </div>
      <div className={styles.heroScroll}>
        <span>SCROLL</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}

function CategorySidebar({ active, onSelect }) {
  return (
    <aside className={styles.categorySidebar}>
      <p className={styles.sidebarLabel}>Categories</p>
      {MENU_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className={`${styles.catBtn} ${active === cat.id ? styles.catBtnActive : ""}`}
          onClick={() => onSelect(cat.id)}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </aside>
  );
}

function MenuItemCard({ item, onAdd }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className={styles.menuCard}>
      <div className={styles.menuCardImg}>
        <img src={item.image} alt={item.name} loading="lazy" />
        <span className={styles.menuCardPrice}>₹{item.price}</span>
      </div>
      <div className={styles.menuCardBody}>
        <h4 className={styles.menuCardName}>{item.name}</h4>
        <p className={styles.menuCardDesc}>{item.description}</p>
        <button
          className={`${styles.addBtn} ${added ? styles.addBtnDone : ""}`}
          onClick={handleAdd}
        >
          {added ? "✓ Added" : "+ Add to Tray"}
        </button>
      </div>
    </div>
  );
}

function OrderTray({ cart, onIncrement, onDecrement, onPlaceOrder, orderStatus }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const gst = +(subtotal * GST_RATE).toFixed(2);
  const total = subtotal + gst;

  return (
    <aside className={styles.orderTray}>
      <div className={styles.trayHeader}>
        <span className={styles.trayIcon}>◈</span>
        <h3>Order Tray</h3>
      </div>

      {cart.length === 0 ? (
        <div className={styles.trayEmpty}>
          <span>Your tray is empty</span>
        </div>
      ) : (
        <>
          <div className={styles.trayItems}>
            {cart.map((item) => (
              <div key={item.id} className={styles.trayItem}>
                <div className={styles.trayItemInfo}>
                  <p className={styles.trayItemName}>{item.name}</p>
                  <p className={styles.trayItemPrice}>₹{item.price} × {item.qty}</p>
                </div>
                <div className={styles.qtyControls}>
                  <button onClick={() => onDecrement(item.id)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => onIncrement(item.id)}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.traySummary}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>GST (5%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            className={styles.placeOrderBtn}
            onClick={() => onPlaceOrder(subtotal, gst, total)}
            disabled={orderStatus === "loading"}
          >
            {orderStatus === "loading"
              ? "Placing..."
              : orderStatus === "success"
              ? "✓ Order Placed!"
              : "Place Order ⚡"}
          </button>
        </>
      )}
    </aside>
  );
}

function AboutSection() {
  return (
    <section className={styles.aboutSection} id="about">
      <div className={styles.aboutGrid}>
        <div className={styles.aboutText}>
          <span className={styles.aboutPill}>Our Legacy</span>
          <h2 className={styles.aboutHeading}>
            Serving Heritage<br />Since 1995 at<br /><em>DLF IT Park</em>
          </h2>
          <p className={styles.aboutBody}>
            Madurai Pandiyan is not just a hotel; it's a destination for true spice lovers.
            Founded with a vision to bring authentic Pandyan-dynasty culinary secrets to the
            modern tech hubs of DLF IT Park and SRM University, we pride ourselves on our
            slow-cooked preparations and farm-fresh ingredients.
          </p>
          <div className={styles.aboutStats}>
            <div>
              <span className={styles.statNum}>28+</span>
              <span className={styles.statLabel}>Years of Taste</span>
            </div>
            <div>
              <span className={styles.statNum}>1M+</span>
              <span className={styles.statLabel}>Happy Foodies</span>
            </div>
          </div>
        </div>

        <div className={styles.aboutLocation} id="location">
          <div className={styles.locationCard}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhvMiT2FjfBgb8t9EAcNxIEvt0lC5joEOOZosJcI7LgOWfQRh5pSj9vrOEZGB4_Wy0NJ7Fb4N2R_UtPRoyz0OeeIb-KzRimuooGu0ntAaYZcwbFSbem4e6qYMcCGD4_fraTExBnxfSZanElZEN15qzvV1yKL9nbVRE1QjjsKXXk6rXsms_f3nEJT4OSczoZvgFZ7cKXNLSO7I5UARJS35MH_7r91ioGmdt4sABfexCsj0iRxoV_y6gndpMJpfN1b15ZSpnldfZuPUY"
              alt="Location Map"
              className={styles.locationMap}
            />
            <div className={styles.locationDetails}>
              <h4>Visit Us Today</h4>
              <p>📍 Phase 2, DLF IT Park, Ramapuram, Chennai – 600089</p>
              <p>📞 +91 98400 12345</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <span className={styles.footerMark}>✦</span>
          <div>
            <strong>Madurai Pandiyan</strong>
            <p>© 2025 All Rights Reserved</p>
          </div>
        </div>
        <div className={styles.footerLinks}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [menuItems, setMenuItems] = useState(STATIC_ITEMS);
  const [activeCategory, setActiveCategory] = useState("biryani");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [orderStatus, setOrderStatus] = useState("idle");
  const [showTray, setShowTray] = useState(false);
  const menuRef = useRef(null);

  // Fetch menu from Supabase on mount
  useEffect(() => {
    async function loadMenu() {
      const { data, error } = await supabase.from("menu_items").select("*");
      if (!error && data && data.length > 0) setMenuItems(data);
    }
    loadMenu();
  }, []);

  const filteredItems = menuItems.filter(
    (i) =>
      i.category === activeCategory &&
      i.name.toLowerCase().includes(search.toLowerCase())
  );

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    setShowTray(true);
  }

  function increment(id) {
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty: c.qty + 1 } : c));
  }

  function decrement(id) {
    setCart((prev) => {
      const updated = prev.map((c) => c.id === id ? { ...c, qty: c.qty - 1 } : c).filter((c) => c.qty > 0);
      return updated;
    });
  }

  async function placeOrder(subtotal, gst, total) {
    setOrderStatus("loading");
    const { error } = await supabase.from("orders").insert([
      {
        items: cart.map((c) => ({ id: c.id, name: c.name, qty: c.qty, price: c.price })),
        subtotal,
        gst,
        total,
        status: "pending",
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Order error:", error.message);
      setOrderStatus("idle");
      alert("Failed to place order. Check Supabase config.");
      return;
    }

    setOrderStatus("success");
    setTimeout(() => {
      setCart([]);
      setOrderStatus("idle");
      setShowTray(false);
    }, 2000);
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className={styles.app}>
      <Grain />
      <Header
        cartCount={cartCount}
        onCartClick={() => setShowTray((p) => !p)}
        search={search}
        onSearch={setSearch}
      />

      <main>
        <HeroSection />

        <section className={styles.menuSection} id="menu" ref={menuRef}>
          <div className={styles.menuLayout}>
            <CategorySidebar active={activeCategory} onSelect={setActiveCategory} />

            <div className={styles.menuContent}>
              <div className={styles.menuTopBar}>
                <h2 className={styles.menuHeading}>
                  {MENU_CATEGORIES.find((c) => c.id === activeCategory)?.label}
                </h2>
                <span className={styles.menuCount}>{filteredItems.length} Items</span>
              </div>
              <div className={styles.menuGrid}>
                {filteredItems.length === 0 ? (
                  <p className={styles.noItems}>No items found.</p>
                ) : (
                  filteredItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} onAdd={addToCart} />
                  ))
                )}
              </div>
            </div>

            <div className={`${styles.trayWrapper} ${showTray ? styles.trayVisible : ""}`}>
              <OrderTray
                cart={cart}
                onIncrement={increment}
                onDecrement={decrement}
                onPlaceOrder={placeOrder}
                orderStatus={orderStatus}
              />
            </div>
          </div>
        </section>

        <AboutSection />
      </main>

      <Footer />
    </div>
  );
}