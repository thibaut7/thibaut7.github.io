/*
 * Visites du portfolio — enregistrement et carte.
 *
 * 1. Sur chaque page : une fois par session de navigation, on estime la ville
 *    du visiteur (service get.geojs.io, repli ipwho.is) et on enregistre
 *    seulement le pays, la ville et des coordonnées arrondies (≈ 10 km)
 *    dans Supabase. Aucune adresse IP n'est stockée.
 * 2. Sur la page Visitors : on lit les visites regroupées par ville et on les
 *    place sur la carte du monde (projection équirectangulaire).
 */
(function () {
  "use strict";
  var cfg = window.VISITES;
  if (!cfg || !cfg.url || !cfg.cle) return;

  var base = cfg.url.replace(/\/+$/, "");
  var entetes = { apikey: cfg.cle, "Content-Type": "application/json" };
  if (/^eyJ/.test(cfg.cle)) entetes.Authorization = "Bearer " + cfg.cle;

  function arrondi(x) { return Math.round(parseFloat(x) * 10) / 10; }

  function ipwho() {
    return fetch("https://ipwho.is/")
      .then(function (r) { return r.json(); })
      .then(function (g) {
        if (!g.success) throw new Error("geo");
        return { pays: g.country, code_pays: g.country_code, ville: g.city, lat: g.latitude, lon: g.longitude };
      });
  }

  function localiser() {
    return fetch("https://get.geojs.io/v1/ip/geo.json")
      .then(function (r) { if (!r.ok) throw r; return r.json(); })
      .then(function (g) {
        var res = { pays: g.country, code_pays: g.country_code, ville: g.city, lat: g.latitude, lon: g.longitude };
        if (res.ville) return res;
        /* pas de ville : on la demande au second service, si le pays concorde */
        return ipwho().then(function (h) {
          if (h.code_pays === res.code_pays && h.ville) { res.ville = h.ville; res.lat = h.lat; res.lon = h.lon; }
          return res;
        }).catch(function () { return res; });
      })
      .catch(ipwho);
  }

  function noter() {
    if (navigator.webdriver) return Promise.resolve();
    try {
      if (sessionStorage.getItem("visite-notee")) return Promise.resolve();
      sessionStorage.setItem("visite-notee", "1");
    } catch (e) { /* stockage indisponible : on note quand même */ }
    return localiser().then(function (g) {
      var lat = arrondi(g.lat), lon = arrondi(g.lon);
      if (!isFinite(lat) || !isFinite(lon)) return;
      return fetch(base + "/rest/v1/visites", {
        method: "POST",
        keepalive: true,
        headers: Object.assign({ Prefer: "return=minimal" }, entetes),
        body: JSON.stringify({
          pays: (g.pays || "").slice(0, 80) || null,
          code_pays: (g.code_pays || "").slice(0, 2).toUpperCase() || null,
          ville: (g.ville || "").slice(0, 80) || null,
          lat: lat, lon: lon,
          langue: document.documentElement.lang === "fr" ? "fr" : "en"
        })
      });
    }).catch(function () { /* pas de localisation : visite ignorée */ });
  }

  function nomPays(code, repli, langue) {
    try { if (code && window.Intl && Intl.DisplayNames) return new Intl.DisplayNames([langue], { type: "region" }).of(code); }
    catch (e) {}
    return repli || code || "?";
  }

  function carte(attente) {
    var boite = document.getElementById("carte-visites");
    if (!boite) return;
    /* on attend que la visite en cours soit enregistrée (3 s au plus) */
    var pret = Promise.race([attente.catch(function () {}), new Promise(function (r) { setTimeout(r, 3000); })]);
    var langue = document.documentElement.lang === "fr" ? "fr" : "en";
    var t = cfg.textes || {};
    var NS = "http://www.w3.org/2000/svg";

    var svg = null, latN = 84, k = 1;
    fetch(cfg.fond).then(function (r) { return r.text(); }).then(function (txt) {
      boite.innerHTML = txt;
      svg = boite.querySelector("svg");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", t.carte || "");
      latN = parseFloat(svg.getAttribute("data-lat-n"));
      k = svg.viewBox.baseVal.width / 360;
      return pret;
    }).then(function () {
      return fetch(base + "/rest/v1/rpc/carte_visites", { method: "POST", headers: entetes, body: "{}" });
    }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (lignes) {
      lignes = lignes || [];
      var max = 1, total = 0, parPays = {};
      lignes.forEach(function (l) {
        max = Math.max(max, l.visites); total += l.visites;
        var c = l.code_pays || l.pays || "?";
        parPays[c] = parPays[c] || { code: l.code_pays, nom: l.pays, n: 0 };
        parPays[c].n += l.visites;
      });
      var calque = document.createElementNS(NS, "g");
      calque.setAttribute("class", "points");
      lignes.slice().reverse().forEach(function (l) {
        var c = document.createElementNS(NS, "circle");
        c.setAttribute("cx", ((parseFloat(l.lon) + 180) * k).toFixed(1));
        c.setAttribute("cy", ((latN - parseFloat(l.lat)) * k).toFixed(1));
        c.setAttribute("r", (3 + 7 * Math.sqrt(l.visites / max)).toFixed(1));
        var titre = document.createElementNS(NS, "title");
        titre.textContent = (l.ville ? l.ville + ", " : "") + nomPays(l.code_pays, l.pays, langue) + " — " + l.visites;
        c.appendChild(titre);
        calque.appendChild(c);
      });
      svg.appendChild(calque);

      var pays = Object.keys(parPays).map(function (c) { return parPays[c]; }).sort(function (a, b) { return b.n - a.n; });
      var resume = document.getElementById("resume-visites");
      if (resume) {
        resume.textContent = total
          ? (t.total || "{n} · {p}").replace("{n}", total).replace("{p}", pays.length)
          : (t.vide || "");
      }
      var liste = document.getElementById("pays-visites");
      if (liste) {
        pays.slice(0, 12).forEach(function (p) {
          var li = document.createElement("li");
          var nom = document.createElement("span");
          nom.textContent = nomPays(p.code, p.nom, langue);
          var n = document.createElement("span");
          n.className = "pays-visites__n";
          n.textContent = p.n;
          li.appendChild(nom); li.appendChild(n);
          liste.appendChild(li);
        });
      }
    }).catch(function () {
      var resume = document.getElementById("resume-visites");
      if (resume) resume.textContent = t.erreur || "";
    });
  }

  var enregistrement = noter();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { carte(enregistrement); });
  else carte(enregistrement);
})();
