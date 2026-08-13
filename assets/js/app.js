/* =========================================================================
   app.js — renders the page from config.js + data files. No dependencies.
   ========================================================================= */
(function () {
  "use strict";

  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (t, c, h) {
    var n = document.createElement(t);
    if (c) n.className = c;
    if (h != null) n.innerHTML = h;
    return n;
  };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  };

  /* ---------------------------------------------------------------- nav */
  var nav = $("#nav"), navToggle = $("#navToggle");
  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $("#navLinks").addEventListener("click", function (e) {
    if (e.target.tagName === "A") { nav.classList.remove("open"); navToggle.setAttribute("aria-expanded", "false"); }
  });
  var onScroll = function () { nav.classList.toggle("stuck", window.scrollY > 12); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ------------------------------------------------------------ reveals */
  var io = "IntersectionObserver" in window
    ? new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { rootMargin: "0px 0px -8% 0px", threshold: .04 })
    : null;
  var watchReveal = function (root) {
    (root || document).querySelectorAll(".reveal:not(.in)").forEach(function (n) {
      if (io) io.observe(n); else n.classList.add("in");
    });
  };

  /* -------------------------------------------------------------- icons */
  var I = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    dl:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 20h16"/></svg>',
    play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
  };

  /* ------------------------------------------------------- calendar .ics */
  function toUTC(isoDate, timeStr) {
    if (!isoDate || !timeStr) return null;
    var m = String(timeStr).toLowerCase().replace(/\s|\./g, "").match(/^(\d{1,2})(?::(\d{2}))?(am|pm)?/);
    if (!m) return null;
    var h = +m[1], min = +(m[2] || 0);
    if (m[3] === "pm" && h < 12) h += 12;
    if (m[3] === "am" && h === 12) h = 0;
    var p = isoDate.split("-");
    // venue time is Africa/Lagos (UTC+1)
    return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2], h - 1, min, 0));
  }
  function z(d) { return d.toISOString().replace(/[-:]|\.\d{3}/g, ""); }
  function icsFor(ev) {
    var start = toUTC(ev.isoDate, ev.time);
    if (!start) return null;
    var end = new Date(start.getTime() + 3 * 3600e3);
    var where = [ev.venue, ev.address].filter(Boolean).join(", ");
    var body = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Oroge//Celebration of Life//EN",
      "BEGIN:VEVENT", "UID:" + ev.id + "@oroge",
      "DTSTAMP:" + z(new Date()), "DTSTART:" + z(start), "DTEND:" + z(end),
      "SUMMARY:" + ev.title + " — Clement Ayodeji Oroge",
      where ? "LOCATION:" + where.replace(/,/g, "\\,") : "",
      ev.note ? "DESCRIPTION:" + ev.note.replace(/,/g, "\\,") : "",
      "END:VEVENT", "END:VCALENDAR"
    ].filter(Boolean).join("\r\n");
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(body);
  }

  /* ------------------------------------------------------------- events */
  (function renderEvents() {
    var host = $("#events"); if (!host) return;
    (S.events || []).forEach(function (ev) {
      var card = el("article", "event reveal");
      var h = "";
      h += '<p class="kicker">' + esc(ev.kicker) + "</p>";
      h += "<h3>" + esc(ev.title) + "</h3>";

      if (ev.date || ev.time) {
        h += '<p class="when">' + esc(ev.date || "") + (ev.time ? ' &nbsp;·&nbsp; <em>' + esc(ev.time) + "</em>" : "") + "</p>";
      } else {
        h += '<p class="tbc">Date to be confirmed</p>';
      }

      if (ev.venue || ev.address) {
        h += '<p class="where">' + (ev.venue ? "<b>" + esc(ev.venue) + "</b>" : "") + esc(ev.address || "") + "</p>";
      } else {
        h += '<p class="tbc">Venue to be confirmed</p>';
      }

      if (ev.note) h += '<p class="note">' + esc(ev.note) + "</p>";

      if (ev.mapQuery) {
        h += '<div class="map"><button type="button" data-map="' + esc(ev.mapQuery) + '">' + I.pin + " Show map</button></div>";
      }

      h += '<div class="acts">';
      if (ev.mapQuery) {
        h += '<a class="btn ghost sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' +
             encodeURIComponent(ev.mapQuery) + '">' + I.pin + " Directions</a>";
      }
      var ics = icsFor(ev);
      if (ics) h += '<a class="btn ghost sm" download="' + esc(ev.id) + '.ics" href="' + ics + '">' + I.cal + " Add to calendar</a>";
      if (ev.programme) h += '<a class="btn ghost sm" href="' + esc(ev.programme) + '" download>' + I.dl + " Programme</a>";
      if (ev.youtube) h += '<a class="btn sm" target="_blank" rel="noopener" href="' + esc(ev.youtube) + '">' + I.play + " Watch</a>";
      h += "</div>";

      card.innerHTML = h;
      host.appendChild(card);
    });

    host.addEventListener("click", function (e) {
      var b = e.target.closest("[data-map]"); if (!b) return;
      var q = b.getAttribute("data-map");
      var f = el("iframe");
      f.setAttribute("loading", "lazy");
      f.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      f.setAttribute("title", "Map of " + q);
      f.src = "https://maps.google.com/maps?q=" + encodeURIComponent(q) + "&z=15&output=embed";
      b.parentNode.replaceChild(f, b);
    });
  })();

  /* --------------------------------------------------------------- rsvp */
  (function renderRsvp() {
    var host = $("#rsvp"); if (!host) return;
    var list = S.rsvp || [];
    if (!list.length) { host.remove(); return; }
    host.innerHTML = "<h3><span>Coming along?</span>Let the family know</h3><ul>" +
      list.map(function (c) {
        return '<li><a href="tel:' + esc(c.phone.replace(/[^+\d]/g, "")) + '">' +
               "<b>" + esc(c.name) + '</b><span class="no">' + esc(c.phone) + "</span></a></li>";
      }).join("") + "</ul>";
  })();

  /* -------------------------------------------------------------- watch */
  (function renderWatch() {
    var host = $("#watchGrid"); if (!host) return;
    (S.events || []).forEach(function (ev) {
      if (!ev.youtube) return;
      var a = el("a", "vid reveal");
      a.href = ev.youtube; a.target = "_blank"; a.rel = "noopener";
      var img = ev.thumb
        ? '<img loading="lazy" alt="" src="' + esc(ev.thumb) + '" width="1280" height="720">'
        : (ev.youtubeId
            ? '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + esc(ev.youtubeId) +
              '/maxresdefault.jpg" onerror="this.onerror=null;this.src=\'https://i.ytimg.com/vi/' + esc(ev.youtubeId) +
              '/hqdefault.jpg\'">'
            : "");
      var thumb = img
        ? '<div class="thumb">' + img + '<span class="play">' + I.play + "</span></div>"
        : '<div class="thumb placeholder"><span>Recording to follow</span><span class="play">' + I.play + "</span></div>";
      a.innerHTML = thumb + '<div class="vid-body"><h3>' + esc(ev.title) + "</h3><p>" +
        esc(ev.watchLabel || "Watch") + "</p></div>";
      host.appendChild(a);
    });
    var cl = $("#channelLink");
    if (cl && S.youtube) { cl.href = S.youtube.channel; cl.textContent = S.youtube.channelHandle || "Visit the channel"; }
  })();

  /* ------------------------------------------------------------ gallery */
  var PH = window.PHOTOS || [];
  (function renderGallery() {
    var host = $("#gallery"); if (!host) return;
    PH.forEach(function (p, i) {
      var b = el("button", "ph");
      b.type = "button"; b.setAttribute("data-i", i);
      b.setAttribute("aria-label", "Open photograph " + (i + 1) + " of " + PH.length);
      b.innerHTML = '<img loading="lazy" decoding="async" src="' + esc(p.thumb || p.src) + '"' +
        (p.w ? ' width="' + p.w + '" height="' + p.h + '"' : "") +
        ' alt="' + esc(p.caption || "Clement Ayodeji Oroge") + '">' +
        (p.caption ? "<figcaption>" + esc(p.caption) + "</figcaption>" : "");
      host.appendChild(b);
    });
    host.addEventListener("click", function (e) {
      var b = e.target.closest(".ph"); if (b) openLB(+b.getAttribute("data-i"));
    });
  })();

  var lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), lbIdx = 0;
  function openLB(i) {
    lbIdx = (i + PH.length) % PH.length;
    var p = PH[lbIdx];
    lbImg.src = p.src; lbImg.alt = p.caption || "";
    lbCap.textContent = p.caption || "";
    lb.classList.add("on"); document.body.classList.add("locked");
  }
  function closeLB() { lb.classList.remove("on"); document.body.classList.remove("locked"); lbImg.src = ""; }
  $("#lbClose").addEventListener("click", closeLB);
  $("#lbPrev").addEventListener("click", function () { openLB(lbIdx - 1); });
  $("#lbNext").addEventListener("click", function () { openLB(lbIdx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLB(); });

  /* ----------------------------------------------------------- tributes */
  var TR = window.TRIBUTES || [];
  function excerptOf(t) {
    for (var i = 0; i < t.body.length; i++) { if (t.body[i].length > 90) return t.body[i]; }
    return t.body.join(" ");
  }
  (function renderTributes() {
    var feat = TR.filter(function (t) { return t.featured; })[0];
    var rest = TR.filter(function (t) { return t !== feat; });

    var count = $("#tributeCount");
    if (count) count.textContent = TR.length + " tributes so far — from children and grandchildren, brothers and sisters, " +
      "nieces and nephews, colleagues, classmates and church family. More are added as they arrive.";

    if (feat) {
      var host = $("#featured");
      var lead = feat.body.slice(0, 4).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
      var a = el("article", "featured reveal");
      a.innerHTML = "<h3>" + esc(feat.title || "Tribute") + "</h3>" +
        '<p class="by">' + esc(feat.author) + (feat.relation ? " &nbsp;·&nbsp; " + esc(feat.relation) : "") + "</p>" +
        '<div class="excerpt">' + lead + "</div>" +
        '<button class="btn" data-t="' + esc(feat.id) + '">Read the full tribute</button>';
      host.appendChild(a);
    }

    var grid = $("#tributeGrid");
    rest.forEach(function (t) {
      var b = el("button", "tcard reveal");
      b.type = "button"; b.setAttribute("data-t", t.id);
      b.innerHTML =
        (t.relation ? '<span class="rel">' + esc(t.relation) + "</span>" : "") +
        "<h4>" + esc(t.title || t.author) + "</h4>" +
        "<p>" + esc(excerptOf(t)) + "</p>" +
        '<span class="who">' + esc(t.author) + "<span>Read →</span></span>";
      grid.appendChild(b);
    });

    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-t]"); if (!b) return;
      var id = b.getAttribute("data-t");
      var t = TR.filter(function (x) { return x.id === id; })[0];
      if (t) openModal(t);
    });
  })();

  var modal = $("#modal"), modalCard = $("#modalCard");
  function openModal(t) {
    modalCard.innerHTML =
      '<button class="modal-close" data-close aria-label="Close">✕</button>' +
      "<h3>" + esc(t.title || "Tribute") + "</h3>" +
      '<p class="by">' + esc(t.author) + (t.relation ? " &nbsp;·&nbsp; " + esc(t.relation) : "") + "</p>" +
      t.body.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    modal.classList.add("on"); document.body.classList.add("locked");
    modalCard.scrollTop = 0;
  }
  function closeModal() { modal.classList.remove("on"); document.body.classList.remove("locked"); }
  modal.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeModal(); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeModal(); closeLB(); }
    if (lb.classList.contains("on")) {
      if (e.key === "ArrowRight") openLB(lbIdx + 1);
      if (e.key === "ArrowLeft") openLB(lbIdx - 1);
    }
  });

  /* ---------------------------------------------------------- downloads */
  (function renderDownloads() {
    var host = $("#dlGrid"); if (!host) return;
    var items = (S.events || []).filter(function (e) { return e.programme; });
    if (!items.length) { var sec = host.closest("section"); if (sec) sec.style.display = "none"; return; }
    items.forEach(function (ev) {
      var a = el("a", "reveal");
      a.href = ev.programme; a.setAttribute("download", "");
      a.innerHTML = '<span class="ico">PDF</span><span><h3>' + esc(ev.title) + "</h3>" +
        "<p>" + esc(ev.programmeLabel || "Programme") + "</p>" +
        '<span class="meta" data-size>Download</span></span>';
      host.appendChild(a);
      var meta = a.querySelector("[data-size]");
      if (window.fetch && location.protocol.indexOf("http") === 0) {
        fetch(ev.programme, { method: "HEAD" }).then(function (r) {
          var n = +r.headers.get("content-length");
          if (n) meta.textContent = "Download · " + (n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.round(n / 1024) + " KB");
        }).catch(function () {});
      }
    });
    (S.extraDownloads || []).forEach(function (d) {
      var ext = (d.file.split(".").pop() || "file").toUpperCase();
      var a = el("a", "reveal");
      a.href = d.file; a.setAttribute("download", "");
      a.innerHTML = '<span class="ico">' + esc(ext === "JPEG" ? "JPG" : ext) + "</span><span><h3>" +
        esc(d.title) + "</h3><p>" + esc(d.label || "") + '</p><span class="meta">Download</span></span>';
      host.appendChild(a);
    });
  })();

  /* --------------------------------------------------------- contribute */
  (function renderContribute() {
    var C = S.contribute || {};
    var cards = $("#contribCards"), area = $("#formArea");
    var url = (C.googleFormUrl || "").trim();
    var link = url ? url : "#formArea";
    var openAttr = url ? ' target="_blank" rel="noopener"' : "";

    cards.innerHTML =
      '<div class="ccard reveal"><h3>Write a tribute</h3>' +
      "<p>A paragraph or a page — whatever you want to say. Tributes are read by the family and added to this page and to the Book of Remembrance.</p>" +
      '<a class="btn gold" href="' + esc(link) + '"' + openAttr + ">Write a tribute</a></div>" +
      '<div class="ccard reveal"><h3>Send photographs &amp; video</h3>' +
      "<p>Anything you have — a wedding, a church service, a Sunday afternoon, a voice note. Old and blurry is welcome; so is anything from the services themselves.</p>" +
      '<a class="btn ghost" href="' + esc(link) + '"' + openAttr + ">Upload media</a></div>";

    if (url) {
      var src = url + (url.indexOf("?") > -1 ? "&" : "?") + "embedded=true";
      area.innerHTML = '<div class="form-shell reveal"><iframe src="' + esc(src) +
        '" height="' + (C.embedHeight || 1400) + '" loading="lazy" title="Send a tribute or a photograph">Loading…</iframe></div>';
    } else {
      var alts = "";
      if (C.fallbackEmail) {
        alts += '<a class="btn gold" href="mailto:' + esc(C.fallbackEmail) +
          "?subject=" + encodeURIComponent("Tribute for Great Uncle — Clement Ayodeji Oroge") + '">Email the family</a> ';
      }
      if (C.whatsapp) {
        alts += '<a class="btn ghost" target="_blank" rel="noopener" href="https://wa.me/' + esc(C.whatsapp) +
          "?text=" + encodeURIComponent("I would like to send a tribute / photographs for Great Uncle.") + '">WhatsApp</a>';
      }
      if (!alts) console.warn("[config.js] Add contribute.googleFormUrl (or fallbackEmail / whatsapp) so visitors can send tributes.");
      area.innerHTML = '<div class="no-form reveal"><h3>The submission form is being set up</h3>' +
        "<p>It will appear here shortly. In the meantime, please send tributes, photographs and video to the family directly — nothing will be lost.</p>" +
        alts +
        "</div>";
    }
  })();

  /* -------------------------------------------------------------- music */
  (function music() {
    var M = S.music || {}; if (!M.videoId) return;
    var bar = $("#music"), btn = $("#musicBtn");
    $("#musicTitle").textContent = M.title || "His favourite song";
    $("#musicSub").textContent = M.performer || "";
    bar.hidden = false;
    bar.title = M.note || "";

    var player = null, ready = false, wanted = false;

    function load() {
      if (window.YT && window.YT.Player) return make();
      if (!document.getElementById("ytapi")) {
        var s = document.createElement("script");
        s.id = "ytapi"; s.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
      window.onYouTubeIframeAPIReady = make;
    }
    function make() {
      if (player) return;
      var host = document.createElement("div");
      $("#ytHost").appendChild(host);
      player = new YT.Player(host, {
        videoId: M.videoId,
        playerVars: { autoplay: 0, controls: 0, playsinline: 1, loop: 1, playlist: M.videoId },
        events: {
          onReady: function () { ready = true; if (wanted) { player.setVolume(35); player.playVideo(); } },
          onStateChange: function (e) {
            bar.classList.toggle("playing", e.data === YT.PlayerState.PLAYING);
            btn.innerHTML = e.data === YT.PlayerState.PLAYING
              ? '<span class="eq"><i></i><i></i><i></i></span>'
              : '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
            btn.setAttribute("aria-label", e.data === YT.PlayerState.PLAYING ? "Pause his song" : "Play his song");
          }
        }
      });
    }

    btn.addEventListener("click", function () {
      if (!player) { wanted = true; load(); return; }
      if (!ready) { wanted = true; return; }
      var st = player.getPlayerState();
      if (st === YT.PlayerState.PLAYING) player.pauseVideo();
      else { player.setVolume(35); player.playVideo(); }
    });
  })();

  /* ------------------------------------------------------------- footer */
  (function footer() {
    var f = S.footer || {};
    var line = f.line || "";
    if (f.contact) line += " · " + f.contact;
    $("#footerLine").textContent = line;
  })();

  watchReveal();
})();
