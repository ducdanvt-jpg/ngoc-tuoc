/* Ngoc Tuoc Restaurant — interactions */
(function () {
  "use strict";

  var ZALO_PHONE = "0778166166"; // Số Zalo nhận đặt bàn

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
        "🍽️ ĐẶT BÀN — NHÀ HÀNG NGỌC TƯỚC",
        "• Họ tên: " + name,
        "• Điện thoại: " + phone,
        "• Ngày: " + date + "  |  Giờ: " + time,
        "• Số khách: " + guests,
        note ? ("• Ghi chú: " + note) : ""
      ].filter(Boolean).join("\n");

      var zaloUrl = "https://zalo.me/" + ZALO_PHONE;
      var msg = document.getElementById("form-msg");

      copyText(text).then(function () {
        if (msg) {
          msg.style.display = "block";
          msg.innerHTML =
            "✅ Cảm ơn <b>" + (name || "quý khách") + "</b>! Thông tin đặt bàn đã được <b>sao chép</b>. " +
            "Cửa sổ <b>Zalo</b> của nhà hàng đang mở — bạn chỉ cần <b>dán (Ctrl/⌘ + V)</b> và gửi để xác nhận.<br>" +
            "Nếu Zalo không tự mở: <a href=\"" + zaloUrl + "\" target=\"_blank\" rel=\"noopener\" style=\"color:#2f6b32;font-weight:700;text-decoration:underline\">bấm vào đây</a> " +
            "hoặc gọi <a href=\"tel:" + ZALO_PHONE + "\" style=\"color:#2f6b32;font-weight:700\">" + ZALO_PHONE + "</a>.";
        }
        // Open Zalo chat in a new tab so the customer can paste & send.
        window.open(zaloUrl, "_blank", "noopener");
      });
    });
  }

  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
