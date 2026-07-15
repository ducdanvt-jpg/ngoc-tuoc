/* Ngoc Tuoc Restaurant — interactions */
(function () {
  "use strict";

  var HOTLINE = "0778166166";          // Hotline nhận đặt bàn qua tin nhắn (SMS)
  var HOTLINE_DISPLAY = "0778 166 166"; // dạng hiển thị cho người dùng

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  // Reveal-on-scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Copy text to clipboard (Promise). Falls back to a hidden textarea.
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }
  function legacyCopy(text) {
    return new Promise(function (resolve) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch (e) {}
      resolve();
    });
  }

  // Booking form -> copy details + open Zalo chat with the restaurant.
  var form = document.getElementById("booking-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var d = new FormData(form);
      var name = (d.get("name") || "").toString().trim();
      var phone = (d.get("phone") || "").toString().trim();
      var date = (d.get("date") || "").toString();
      var time = (d.get("time") || "").toString();
      var guests = (d.get("guests") || "").toString();
      var note = (d.get("note") || "").toString().trim();

      var text = [
        "ĐẶT BÀN - NHÀ HÀNG NGỌC TƯỚC",
        "- Họ tên: " + name,
        "- Điện thoại: " + phone,
        "- Ngày: " + date + " | Giờ: " + time,
        "- Số khách: " + guests,
        note ? ("- Ghi chú: " + note) : ""
      ].filter(Boolean).join("\n");

      // Mở sẵn ứng dụng nhắn tin với nội dung đặt bàn gửi tới hotline.
      var smsUrl = "sms:" + HOTLINE + "?body=" + encodeURIComponent(text);
      var msg = document.getElementById("form-msg");

      copyText(text).then(function () {
        if (msg) {
          msg.style.display = "block";
          msg.innerHTML =
            "✅ Cảm ơn <b>" + (name || "quý khách") + "</b>! Ứng dụng nhắn tin đang mở sẵn " +
            "<b>tin nhắn đặt bàn</b> gửi tới hotline <b>" + HOTLINE_DISPLAY + "</b> — bạn chỉ cần bấm <b>Gửi</b>.<br>" +
            "Nếu không tự mở (ví dụ trên máy tính): nội dung đã được <b>sao chép</b> — hãy nhắn tin " +
            "hoặc gọi <a href=\"tel:" + HOTLINE + "\" style=\"color:#2f6b32;font-weight:700\">" + HOTLINE_DISPLAY + "</a>.";
        }
        // Điều hướng tới sms: — trên điện thoại sẽ mở app tin nhắn với nội dung điền sẵn.
        window.location.href = smsUrl;
      });
    });
  }

  // Lightbox thư viện cho ảnh phòng VIP: khung tròn + nút qua/lại giữa các phòng.
  var roomLinks = document.querySelectorAll(".room-photo");
  if (roomLinks.length) {
    var rooms = Array.prototype.map.call(roomLinks, function (a) {
      var nameEl = a.querySelector(".room-cap b");
      return { src: a.getAttribute("href"), name: nameEl ? nameEl.textContent : "" };
    });
    var idx = 0;

    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="Đóng">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<button class="lightbox-nav lightbox-prev" type="button" aria-label="Phòng trước">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lightbox-nav lightbox-next" type="button" aria-label="Phòng sau">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector("figcaption");

    function render() {
      var r = rooms[idx];
      lbImg.src = r.src; lbImg.alt = r.name;
      lbCap.textContent = r.name;
      lbImg.classList.remove("swap"); void lbImg.offsetWidth; lbImg.classList.add("swap");
    }
    function openLb(i) {
      idx = i; render();
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeLb() {
      lb.classList.remove("open");
      document.body.style.overflow = "";
      lbImg.src = "";
    }
    function go(step) {
      idx = (idx + step + rooms.length) % rooms.length;
      render();
    }

    roomLinks.forEach(function (a, i) {
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        openLb(i);
      });
    });
    lb.addEventListener("click", function (ev) {
      if (ev.target === lb || ev.target.closest(".lightbox-close")) { closeLb(); return; }
      if (ev.target.closest(".lightbox-prev")) go(-1);
      else if (ev.target.closest(".lightbox-next")) go(1);
    });
    document.addEventListener("keydown", function (ev) {
      if (!lb.classList.contains("open")) return;
      if (ev.key === "Escape") closeLb();
      else if (ev.key === "ArrowLeft") go(-1);
      else if (ev.key === "ArrowRight") go(1);
    });
  }

  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
