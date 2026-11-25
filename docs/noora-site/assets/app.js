/* NOORA — shared behaviour (header, drawer, search, cart, effects) */
var toastT;
function toast(msg) {
  var t = $("#toast");
  if (!t) return;
  $("span", t).textContent = msg;
  t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(function () {
    t.classList.remove("show");
  }, 2200);
}

/* ---------- NAV / DRAWER ---------- */
(function () {
  var NAV = [
    {
      t: "Jacket",
      u: "shop.html?type=jacket",
      hot: 1,
      s: ["Padded", "Leather", "Quilted", "Windcheater"],
    },
    {
      t: "Hoodies",
      u: "shop.html?type=jacket",
      s: ["Hoodies", "Sweatshirts", "Zip-ups"],
    },
    { t: "Sneakers", u: "shop.html?type=sneaker", s: ["Casual", "Sport", "Premium"] },
    {
      t: "Panjabi",
      u: "shop.html?type=panjabi",
      s: ["Embroidered", "Jacquard", "Classic", "Eid Edit"],
    },
    { t: "Thobe", u: "shop.html?type=thobe", s: ["Ivory", "Sand", "Premium"] },
    { t: "Shirt", u: "shop.html?type=polo", s: ["Formal", "Casual"] },
    { t: "T-shirt", u: "shop.html?type=tshirt", s: ["Cotton", "Waffle", "Polo"] },
    { t: "Trouser", u: "shop.html?type=trouser", s: ["Chinos", "Angle", "Pajama"] },
    { t: "Combo Offers", u: "shop.html?type=combo" },
    { t: "Attar", u: "shop.html?type=attar", s: ["Attar", "Perfume", "Gift Sets"] },
    { t: "Gadgets", u: "shop.html?q=gadgets" },
    { t: "Waistcoat", u: "shop.html?q=waistcoat" },
    { t: "Tupi", u: "shop.html?q=tupi" },
    { t: "Flash Sale – 26 🔥", u: "shop.html?sale=1", sale: 1 },
  ];
  var nav = $("#nav"),
    scrim = $("#scrim"),
    tog = $("#navT"),
    MQ = 960;
  var chev = '<svg class="i"><use href="#i-chev"/></svg>';
  function li(n) {
    var dd = n.s
      ? '<div class="dd">' +
        n.s
          .map(function (x) {
            return '<a href="' + n.u + '">' + x + "</a>";
          })
          .join("") +
        "</div>"
      : "";
    var cls = n.sale ? "sale" : "it" + (n.s ? " has" : "") + (n.hot ? " hot" : "");
    return (
      '<li class="' +
      cls +
      '" data-t="' +
      n.t +
      '" data-u="' +
      n.u +
      '"><a href="' +
      n.u +
      '">' +
      n.t +
      (n.s ? chev : "") +
      "</a>" +
      dd +
      "</li>"
    );
  }
  var h =
    '<li class="dh"><a href="index.html" class="logo"><svg><use href="#logo"/></svg><div><b>NOORA</b></div></a><button class="nclose" id="navX" aria-label="Close menu"><svg class="i"><use href="#i-close"/></svg></button></li>';
  h += NAV.filter(function (n) {
    return !n.sale;
  })
    .map(li)
    .join("");
  h +=
    '<li class="more-li"><a href="#">More ' +
    chev +
    '</a><div class="dd" id="moreDD"></div></li>';
  h += NAV.filter(function (n) {
    return n.sale;
  })
    .map(li)
    .join("");
  h +=
    '<li class="df"><a href="account.html"><svg class="i"><use href="#i-user"/></svg>My Account</a><a href="track-order.html"><svg class="i"><use href="#i-truck"/></svg>Track My Order</a><a href="showrooms.html"><svg class="i"><use href="#i-pin"/></svg>Our Showrooms</a><a href="contact.html"><svg class="i"><use href="#i-phone"/></svg>Contact Us</a></li>';
  nav.innerHTML = h;

  function isM() {
    return window.innerWidth <= MQ;
  }
  function open() {
    nav.classList.add("open");
    scrim.classList.add("on");
    document.body.classList.add("lock");
    tog.setAttribute("aria-expanded", "true");
  }
  function close() {
    nav.classList.remove("open");
    scrim.classList.remove("on");
    document.body.classList.remove("lock");
    tog.setAttribute("aria-expanded", "false");
  }
  tog.onclick = function () {
    nav.classList.contains("open") ? close() : open();
  };
  scrim.onclick = close;
  var ts = $("#tabShop");
  if (ts) ts.onclick = open;
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("#navX")) {
      close();
      return;
    }
    var a = e.target.closest("a");
    if (!a || !isM()) return;
    var l = a.parentNode;
    if (l.classList.contains("has") && l.parentNode === nav) {
      e.preventDefault();
      var was = l.classList.contains("open");
      $$(".nav>li.open").forEach(function (x) {
        x.classList.remove("open");
      });
      if (!was) l.classList.add("open");
    } else {
      close();
    }
  });
  function fit() {
    var items = $$("#nav>li.it"),
      more = $("#nav>.more-li"),
      sale = $("#nav>li.sale"),
      dd = $("#moreDD");
    items.forEach(function (i) {
      i.style.display = "";
    });
    more.style.display = "none";
    if (isM()) return;
    var avail = nav.clientWidth - (sale ? sale.offsetWidth : 0) - 14,
      total = 0;
    items.forEach(function (i) {
      total += i.offsetWidth + 2;
    });
    if (total <= avail) return;
    more.style.display = "block";
    avail -= more.offsetWidth + 2;
    var hid = [];
    for (var k = items.length - 1; k >= 0 && total > avail; k--) {
      total -= items[k].offsetWidth + 2;
      items[k].style.display = "none";
      hid.unshift(items[k]);
    }
    dd.innerHTML = hid
      .map(function (l) {
        return '<a href="' + l.dataset.u + '">' + l.dataset.t + "</a>";
      })
      .join("");
  }
  var rz;
  window.addEventListener("resize", function () {
    if (!isM()) close();
    clearTimeout(rz);
    rz = setTimeout(fit, 80);
  });
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  window.addEventListener("load", fit);
})();

/* ---------- CART / WISHLIST / SEARCH ---------- */
Cart.sync();
Wish.sync();
document.addEventListener("click", function (e) {
  var a = e.target.closest("[data-add]");
  if (a) {
    var p = prod(a.dataset.add),
      sz = TYPES[p.type].sizes[0];
    Cart.add(p.id, sz, 1);
    toast("Added to cart · " + sz);
  }
  var w = e.target.closest(".wish[data-id]");
  if (w) {
    e.preventDefault();
    var on = Wish.toggle(+w.dataset.id);
    toast(on ? "Saved to wishlist" : "Removed from wishlist");
    if (typeof window.onWishChange === "function") window.onWishChange();
  }
});
(function () {
  var sug = $("#sug"),
    q = $("#q");
  if (!sug) return;
  sug.addEventListener("mousedown", function (e) {
    e.preventDefault();
  });
  sug.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a) return;
    if (!a.dataset.q) {
      return;
    }
  });
})();

/* ---------- MARQUEE / NEWSLETTER ---------- */
(function () {
  var m = $("#mqT");
  if (m) {
    var t = [
      "Free delivery over ৳3,000",
      "Cash on delivery",
      "Easy exchange policy",
      "Premium modest fashion",
      "Quality checked, every order",
    ];
    var one = t
      .map(function (x) {
        return "<span>" + x + "</span>";
      })
      .join("");
    m.innerHTML = one + one;
  }
  var nf = $("#nf");
  if (nf)
    nf.addEventListener("submit", function (e) {
      e.preventDefault();
      $("#nmsg").textContent = "JazakAllah khair! Check your inbox for your 10% code.";
      this.reset();
    });
  var y = $("#yr");
  if (y) y.textContent = new Date().getFullYear();
})();

/* ---------- SCROLL EFFECTS ---------- */
(function () {
  var hdr = $("#hdr"),
    topBtn = $("#top");
  window.addEventListener(
    "scroll",
    function () {
      hdr.classList.toggle("stuck", scrollY > 40);
      topBtn.classList.toggle("show", scrollY > 700);
    },
    { passive: true },
  );
  topBtn.onclick = function () {
    scrollTo({ top: 0, behavior: "smooth" });
  };
  function countUp(root) {
    $$("[data-n]", root).forEach(function (el) {
      var to = +el.dataset.n,
        s = 0,
        step = Math.max(1, Math.round(to / 40));
      var iv = setInterval(function () {
        s += step;
        if (s >= to) {
          s = to;
          clearInterval(iv);
        }
        el.textContent = s;
      }, 30);
    });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
            countUp(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    window.observeReveal = function (root) {
      $$(".reveal:not(.in)", root).forEach(function (el) {
        io.observe(el);
      });
    };
  } else {
    window.observeReveal = function (root) {
      $$(".reveal", root).forEach(function (el) {
        el.classList.add("in");
      });
    };
  }
  window.observeReveal();
})();
