/* NOORA — home page */
var CATS = [
  ["Jacket", "jacket", "#6d4c3a", "shop.html?type=jacket"],
  ["Hoodie", "jacket", "#3b3f48", "shop.html?type=jacket"],
  ["Sneakers", "sneaker", "#8a7560", "shop.html?type=sneaker"],
  ["Panjabi", "panjabi", "#34503f", "shop.html?type=panjabi"],
  ["Thobe", "thobe", "#cdb995", "shop.html?type=thobe"],
  ["T-shirt", "tshirt", "#6d4c3a", "shop.html?type=tshirt"],
  ["Polo", "polo", "#7d8a6a", "shop.html?type=polo"],
  ["Trouser", "trouser", "#5a6140", "shop.html?type=trouser"],
  ["Attar", "attar", "#8a6a2a", "shop.html?type=attar"],
  ["Combo", "combo", "#8a1f2b,#14564c,#cdb995", "shop.html?type=combo"],
];
$("#catRow").innerHTML = CATS.map(function (c) {
  return (
    '<a href="' +
    c[3] +
    '" class="cat"><div class="a" style="--pc:' +
    c[2].split(",")[0] +
    '">' +
    garment(c[1], c[2]) +
    "</div><span>" +
    c[0] +
    "</span></a>"
  );
}).join("");

/* featured tabs */
var feat = PRODUCTS.filter(function (p) {
  return p.cat !== "attar" && p.type !== "combo";
});
function renderFeat(t) {
  var list = feat
    .filter(function (p, i) {
      return i % 3 === t;
    })
    .slice(0, 8);
  if (t === 2)
    list = feat
      .filter(function (p) {
        return p.old && 1 - p.price / p.old > 0.3;
      })
      .slice(0, 8);
  $("#featGrid").innerHTML = list.map(card).join("");
}
renderFeat(0);
$("#tabs").addEventListener("click", function (e) {
  var b = e.target.closest("button");
  if (!b) return;
  $$("#tabs button").forEach(function (x) {
    x.classList.remove("on");
  });
  b.classList.add("on");
  var g = $("#featGrid");
  g.style.opacity = 0;
  g.style.transform = "translateY(10px)";
  setTimeout(function () {
    renderFeat(+b.dataset.t);
    Wish.sync();
    g.style.transition = ".45s";
    g.style.opacity = 1;
    g.style.transform = "none";
  }, 180);
});

/* category grids */
$$("[data-cat]").forEach(function (el) {
  var c = el.dataset.cat,
    n = c === "attar" ? 4 : 6;
  el.innerHTML = PRODUCTS.filter(function (p) {
    return p.cat === c;
  })
    .slice(0, n)
    .map(card)
    .join("");
});
$("#essGrid").innerHTML = PRODUCTS.filter(function (p) {
  return p.cat === "ess";
})
  .slice(0, 8)
  .map(card)
  .join("");

/* combos */
$("#comboGrid").innerHTML = PRODUCTS.filter(function (p) {
  return p.type === "combo";
})
  .map(function (p) {
    return (
      '<article class="cmb"><span class="ribbon">SAVE ' +
      offPct(p) +
      "%</span>" +
      '<a class="media" href="product.html?id=' +
      p.id +
      '" style="--pc:' +
      pc(p) +
      '">' +
      garment(p.type, p.color) +
      "</a>" +
      '<div class="body"><div><h3>' +
      esc(p.name) +
      "</h3><small>" +
      (COMBO_SUB[p.name] || "") +
      '</small><div class="price" style="margin-top:10px"><b>' +
      tk(p.price) +
      "</b><s>" +
      tk(p.old) +
      "</s></div></div>" +
      '<button class="go" data-add="' +
      p.id +
      '" aria-label="Add combo to cart"><svg class="i"><use href="#i-bag"/></svg></button></div></article>'
    );
  })
  .join("");
Wish.sync();
if (window.observeReveal) window.observeReveal();

/* hero slider */
(function () {
  var slides = $$(".slide"),
    dots = $("#dots"),
    cur = 0,
    timer;
  slides.forEach(function (_, i) {
    var b = document.createElement("button");
    b.setAttribute("aria-label", "Slide " + (i + 1));
    b.onclick = function () {
      go(i);
    };
    dots.appendChild(b);
  });
  function go(n) {
    cur = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) {
      s.classList.toggle("on", i === cur);
    });
    $$("button", dots).forEach(function (b, i) {
      b.classList.remove("on");
      if (i === cur) {
        void b.offsetWidth;
        b.classList.add("on");
      }
    });
    clearInterval(timer);
    timer = setInterval(function () {
      go(cur + 1);
    }, 6000);
  }
  $("#next").onclick = function () {
    go(cur + 1);
  };
  $("#prev").onclick = function () {
    go(cur - 1);
  };
  var hero = $("#hero"),
    x0 = null;
  hero.addEventListener(
    "touchstart",
    function (e) {
      x0 = e.touches[0].clientX;
    },
    { passive: true },
  );
  hero.addEventListener(
    "touchend",
    function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1));
      x0 = null;
    },
    { passive: true },
  );
  go(0);
})();

/* countdown */
(function () {
  var end = Date.now() + (2 * 86400 + 6 * 3600 + 30 * 60) * 1000;
  function pad(n) {
    return String(n).padStart(2, "0");
  }
  function tick() {
    var t = Math.max(0, end - Date.now()) / 1000;
    $("#d").textContent = pad(Math.floor(t / 86400));
    $("#h").textContent = pad(Math.floor((t % 86400) / 3600));
    $("#m").textContent = pad(Math.floor((t % 3600) / 60));
    $("#s").textContent = pad(Math.floor(t % 60));
  }
  tick();
  setInterval(tick, 1000);
})();
