/* NOORA — shared data, storage and helpers */
function $(s, r) {
  return (r || document).querySelector(s);
}
function $$(s, r) {
  return Array.prototype.slice.call((r || document).querySelectorAll(s));
}
function tk(n) {
  return "৳" + Number(n).toLocaleString("en-US");
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}

var Store = {
  get: function (k, d) {
    try {
      var v = JSON.parse(localStorage.getItem("noora_" + k));
      return v == null ? d : v;
    } catch (e) {
      return d;
    }
  },
  set: function (k, v) {
    try {
      localStorage.setItem("noora_" + k, JSON.stringify(v));
    } catch (e) {}
  },
};

var TOPS = ["M", "L", "XL", "XXL"];
var TYPES = {
  jacket: {
    n: "Jacket",
    sizes: TOPS,
    chart: "top",
    fabric: "Padded polyester shell, soft inner lining",
    fit: "Regular fit",
    desc: "Heat-locked warmth without the bulk. A clean silhouette that layers over a panjabi or a tee with equal ease.",
  },
  panjabi: {
    n: "Panjabi",
    sizes: TOPS,
    chart: "top",
    fabric: "Premium cotton blend, 160 GSM",
    fit: "Regular fit",
    desc: "Breathable fabric, refined detailing and a comfortable cut for Jumu'ah, Eid and everything between.",
  },
  thobe: {
    n: "Thobe",
    sizes: ["50", "52", "54", "56"],
    chart: "top",
    fabric: "Soft crease-resistant blend",
    fit: "Relaxed fit",
    desc: "A graceful full-length thobe with a clean collar and hand-finished seams, made for all-day comfort.",
  },
  tshirt: {
    n: "T-shirt",
    sizes: TOPS,
    chart: "top",
    fabric: "100% combed cotton, 180 GSM",
    fit: "Regular fit",
    desc: "Soft, breathable and built to last. A premium everyday tee with a smooth hand-feel and a sharp neckline.",
  },
  polo: {
    n: "Polo Shirt",
    sizes: TOPS,
    chart: "top",
    fabric: "Spandex-blend piqué, 220 GSM",
    fit: "Slim-regular fit",
    desc: "Active comfort in a polished shape. Stretch fabric that keeps its colour and its structure wash after wash.",
  },
  trouser: {
    n: "Trouser",
    sizes: ["30", "32", "34", "36"],
    chart: "bottom",
    fabric: "Stretch twill, 240 GSM",
    fit: "Straight fit",
    desc: "A clean-cut trouser with a comfortable waist and enough stretch to move with you from office to evening.",
  },
  sneaker: {
    n: "Sneakers",
    sizes: ["40", "41", "42", "43", "44"],
    chart: "",
    fabric: "Synthetic upper, cushioned EVA sole",
    fit: "True to size",
    desc: "All-day comfort sneakers with a cushioned sole, a grippy outsole and a design that goes with everything.",
  },
  attar: {
    n: "Attar & Perfume",
    sizes: ["6ml", "12ml", "24ml"],
    chart: "",
    vol: true,
    fabric: "Alcohol-free concentrated oil",
    fit: "Long-lasting",
    desc: "A rich, alcohol-free fragrance oil with a warm opening and a lingering base. A little goes a long way.",
  },
  combo: {
    n: "Combo Offer",
    sizes: TOPS,
    chart: "top",
    fabric: "Mixed premium fabrics",
    fit: "Regular fit",
    desc: "A curated set at a combined price. Every piece is quality checked and packed together.",
  },
};

/* name, type, colour(s), price, old price, section, (7th = optional image path) */
var P = [
  ["PU Padded Jacket – Mocha", "jacket", "#6d4c3a", 1680, 2400, "jacket"],
  ["PU Padded Jacket – Greige", "jacket", "#8a8a74", 1680, 2400, "jacket"],
  ["Quilted Jacket – Olive", "jacket", "#59603f", 1790, 2500, "jacket"],
  ["Leather Jacket – Dark Mocha", "jacket", "#4b3226", 2240, 3200, "jacket"],
  ["Windcheater – Midnight Navy", "jacket", "#1e2f55", 1490, 2100, "jacket"],
  ["Varsity Jacket – Charcoal", "jacket", "#3b3f48", 1890, 2700, "jacket"],
  ["Embroidered Panjabi – Slate", "panjabi", "#3d4658", 1290, 1990, "panjabi"],
  ["Jacquard Panjabi – Forest", "panjabi", "#34503f", 1290, 1990, "panjabi"],
  ["Classic Panjabi – Bordeaux", "panjabi", "#6a2a3a", 1190, 1790, "panjabi"],
  ["Superior Panjabi – Pearl", "panjabi", "#e6e1d4", 1390, 2100, "panjabi"],
  ["Signature Thobe – Ivory", "thobe", "#efe8d6", 2490, 3200, "panjabi"],
  ["Everyday Thobe – Sand", "thobe", "#cdb995", 2190, 2900, "panjabi"],
  ["Premium Cotton T-shirt – Mocha", "tshirt", "#6d4c3a", 550, 790, "ess"],
  ["Premium Cotton T-shirt – Ash", "tshirt", "#9a9a94", 550, 790, "ess"],
  ["China Spandex Polo – Lichen", "polo", "#7d8a6a", 1590, 2100, "ess"],
  ["China Spandex Polo – Charcoal", "polo", "#454a54", 1590, 2100, "ess"],
  ["Angle Trouser – Olive", "trouser", "#5a6140", 950, 1350, "ess"],
  ["Chinos Trouser – Black", "trouser", "#20232b", 850, 1200, "ess"],
  ["Micro Pajama – White", "trouser", "#ece8de", 790, 1100, "ess"],
  ["Branded Sneakers – Taupe", "sneaker", "#8a7560", 1995, 3990, "ess"],
  ["N-B 9060 Sneakers – Gray", "sneaker", "#6f737c", 3750, 6500, "ess"],
  ["Oud Royale Attar", "attar", "#7a5a1e", 2400, 0, "attar"],
  ["Musk Safa Attar", "attar", "#2a4a52", 3000, 0, "attar"],
  ["Amber Mukhallat Attar", "attar", "#5a2a1a", 2400, 0, "attar"],
  ["Best Seller Attar Combo – 60ml", "attar", "#8a6a2a", 1190, 1950, "attar"],
  [
    "Sports Jersey Combo – Identity",
    "combo",
    "#8a1f2b,#14564c,#2a2a30",
    795,
    1770,
    "combo",
  ],
  [
    "Waffle T-shirt Combo – Urban",
    "combo",
    "#6d4c3a,#1e2f55,#3a3f48",
    1290,
    2200,
    "combo",
  ],
  ["Corporate Elegance Combo", "combo", "#1e2f55,#cdb995,#14564c", 1190, 1950, "combo"],
];
var COMBO_SUB = {
  "Sports Jersey Combo – Identity": "3 PCS · Sublimation print",
  "Waffle T-shirt Combo – Urban": "4 PCS · Full sleeve",
  "Corporate Elegance Combo": "Shirt · Trouser · Attar",
};

var PRODUCTS = P.map(function (p, i) {
  return {
    id: i,
    name: p[0],
    type: p[1],
    color: p[2],
    price: p[3],
    old: p[4] || 0,
    cat: p[5],
    img: p[6] || "",
    rating: +(4.4 + ((i * 3) % 6) / 10).toFixed(1),
    reviews: 40 + ((i * 37) % 260),
  };
});
function prod(id) {
  return PRODUCTS[+id];
}
function offPct(p) {
  return p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
}
function pc(p) {
  return p.color.split(",")[0];
}

function garment(type, color) {
  if (type === "combo") {
    var c = color.split(",");
    return (
      '<svg class="g" viewBox="0 0 100 120" style="--c1:' +
      c[0] +
      ";--c2:" +
      (c[1] || c[0]) +
      ";--c3:" +
      (c[2] || c[0]) +
      '"><use href="#g-combo" width="100" height="120"/></svg>'
    );
  }
  return (
    '<svg class="g" viewBox="0 0 100 120" style="color:' +
    color +
    '"><use href="#g-' +
    type +
    '" width="100" height="120"/></svg>'
  );
}

function card(p) {
  var off = offPct(p),
    on = Wish.has(p.id);
  var media = p.img
    ? '<img src="' + p.img + '" alt="' + esc(p.name) + '" loading="lazy">'
    : garment(p.type, p.color);
  return (
    '<article class="card"><div class="media" style="--pc:' +
    pc(p) +
    '">' +
    '<a class="mlink" href="product.html?id=' +
    p.id +
    '" aria-label="' +
    esc(p.name) +
    '"></a>' +
    (off ? '<span class="tag">' + off + "% OFF</span>" : '<span class="tag">NEW</span>') +
    '<button class="wish' +
    (on ? " on" : "") +
    '" data-id="' +
    p.id +
    '" aria-label="Wishlist"><svg class="i"><use href="#i-heart"/></svg></button>' +
    media +
    '<button class="quick" data-add="' +
    p.id +
    '"><svg class="i" style="width:16px;height:16px"><use href="#i-bag"/></svg>Quick Add</button></div>' +
    '<div class="info"><div class="c">' +
    TYPES[p.type].n +
    '</div><h3><a href="product.html?id=' +
    p.id +
    '">' +
    esc(p.name) +
    "</a></h3>" +
    '<div class="rt"><span>★</span> ' +
    p.rating.toFixed(1) +
    " <em>(" +
    p.reviews +
    ")</em></div>" +
    '<div class="price"><b>' +
    tk(p.price) +
    "</b>" +
    (p.old ? "<s>" + tk(p.old) + "</s>" : "") +
    "</div></div></article>"
  );
}

var DISTRICTS = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barishal",
  "Bhola",
  "Bogura",
  "Brahmanbaria",
  "Chandpur",
  "Chapainawabganj",
  "Chattogram",
  "Chuadanga",
  "Cumilla",
  "Cox's Bazar",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokathi",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
];
var PROMOS = {
  NOORA10: { pct: 10, label: "10% off" },
  WELCOME: { flat: 100, label: "৳100 off" },
};
var FREE_OVER = 3000,
  SHIP_DHAKA = 70,
  SHIP_OUT = 110;

var Cart = {
  items: function () {
    return Store.get("cart", []);
  },
  save: function (a) {
    Store.set("cart", a);
    Cart.sync();
  },
  add: function (id, size, qty) {
    var a = Cart.items(),
      f = a.filter(function (x) {
        return x.id === id && x.size === size;
      })[0];
    if (f) f.qty = Math.min(20, f.qty + qty);
    else a.push({ id: id, size: size, qty: qty });
    Cart.save(a);
  },
  setQty: function (id, size, q) {
    var a = Cart.items();
    a.forEach(function (x) {
      if (x.id === id && x.size === size) x.qty = Math.max(1, Math.min(20, q));
    });
    Cart.save(a);
  },
  remove: function (id, size) {
    Cart.save(
      Cart.items().filter(function (x) {
        return !(x.id === id && x.size === size);
      }),
    );
  },
  clear: function () {
    Cart.save([]);
  },
  count: function () {
    return Cart.items().reduce(function (s, x) {
      return s + x.qty;
    }, 0);
  },
  sync: function () {
    var n = Cart.count();
    $$(".cc").forEach(function (el) {
      if (el.textContent !== String(n)) {
        el.textContent = n;
        el.classList.remove("pop");
        void el.offsetWidth;
        el.classList.add("pop");
      }
    });
  },
};
var Wish = {
  list: function () {
    return Store.get("wish", []);
  },
  has: function (id) {
    return Wish.list().indexOf(id) > -1;
  },
  toggle: function (id) {
    var a = Wish.list(),
      i = a.indexOf(id),
      on = i < 0;
    if (on) a.push(id);
    else a.splice(i, 1);
    Store.set("wish", a);
    Wish.sync();
    return on;
  },
  sync: function () {
    var a = Wish.list();
    $$(".wc").forEach(function (el) {
      el.textContent = a.length;
    });
    $$(".wish[data-id]").forEach(function (b) {
      b.classList.toggle("on", a.indexOf(+b.dataset.id) > -1);
    });
  },
};

function totals(items, district, promo) {
  var sub = 0;
  items.forEach(function (i) {
    sub += prod(i.id).price * i.qty;
  });
  var pr = PROMOS[promo],
    disc = pr ? (pr.pct ? Math.round((sub * pr.pct) / 100) : Math.min(pr.flat, sub)) : 0;
  var ship =
    !items.length || sub - disc >= FREE_OVER
      ? 0
      : district === "Dhaka"
        ? SHIP_DHAKA
        : SHIP_OUT;
  return { sub: sub, disc: disc, ship: ship, total: sub - disc + ship };
}

/* demo order so the Track Order page can be tried straight away */
var DEMO_ORDER = {
  id: "NR-100245",
  phone: "01700000000",
  name: "Demo Customer",
  date: Date.now() - 3 * 864e5,
  status: 3,
  items: [
    { id: 0, size: "L", qty: 1 },
    { id: 6, size: "M", qty: 1 },
  ],
  district: "Dhaka",
  address: "House 12, Road 4, Dhanmondi, Dhaka",
  pay: "cod",
  t: { sub: 2970, disc: 0, ship: 0, total: 2970 },
};
var Orders = {
  all: function () {
    return Store.get("orders", []);
  },
  find: function (id, phone) {
    id = String(id || "")
      .trim()
      .toUpperCase();
    phone = String(phone || "").replace(/\D/g, "");
    var all = Orders.all().concat([DEMO_ORDER]);
    return (
      all.filter(function (o) {
        return o.id === id && (!phone || o.phone === phone);
      })[0] || null
    );
  },
};
