/**
 * LUX MEDIA - Main JavaScript Engine (v4.5 Fully Fixed & Enhanced)
 * Author: LUX MEDIA (Behruzbek)
 * Features:
 *  1. EmailJS Contact Us Form Integration (Service ID: service_zxfcl9c, Template ID: men7kuj, Public Key: cj10oulfCwWgURt_K)
 *  2. Dark / Light Mode Switcher (Desktop & Mobile Drawer) with LocalStorage Persistence
 *  3. Interactive Comments & Ratings System (User Reviews + LocalStorage)
 *  4. Testimonials & Portfolio Filtering
 *  5. Bank Card Clipboard Copy & Payment Modal
 *  6. Live Interactive Order Calculator (So'm / $)
 *  7. Mobile Navigation & Project Preview Modals
 *  8. Resilience & Fallback Error Handling
 */

// Initialize EmailJS with User's Public Key safely
(function() {
  try {
    if (typeof emailjs !== 'undefined') {
      emailjs.init({
        publicKey: "cj10oulfCwWgURt_K"
      });
    }
  } catch (e) {
    console.warn("EmailJS init exception:", e);
  }
})();

// Global clipboard copy helper
function copyCardText(text, label) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      showToast(label + " nusxalandi: " + text, "fa-copy");
    }).catch(function() {
      fallbackCopyText(text, label);
    });
  } else {
    fallbackCopyText(text, label);
  }
}

function fallbackCopyText(text, label) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy");
    showToast(label + " nusxalandi: " + text, "fa-copy");
  } catch (err) {
    showToast("Nusxalash imkoni bo'lmadi, iltimos qo'lda nusxa oling.", "fa-circle-exclamation");
  }
  document.body.removeChild(textArea);
}

// Global Toast utility
function showToast(message, iconClass) {
  if (!iconClass) iconClass = "fa-circle-check";
  var toast = document.getElementById("toastNotification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastNotification";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.innerHTML = '<i class="fa-solid ' + iconClass + ' toast-icon"></i><span>' + message + '</span>';
  toast.classList.add("show");

  setTimeout(function() {
    toast.classList.remove("show");
  }, 4500);
}

document.addEventListener("DOMContentLoaded", function() {
  // -------------------------------------------------------------------------
  // 1. THEME SWITCHER (DARK / LIGHT MODE - DESKTOP & MOBILE)
  // -------------------------------------------------------------------------
  var themeToggle = document.getElementById("themeToggle");
  var mobileThemeToggle = document.getElementById("mobileThemeToggle");
  var themeIcon = document.getElementById("themeIcon");
  var mobileThemeIcon = document.getElementById("mobileThemeIcon");
  var htmlRoot = document.documentElement;

  var savedTheme = localStorage.getItem("lux_media_theme") || "dark";
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener("click", toggleTheme);
  }

  function toggleTheme() {
    var currentTheme = htmlRoot.getAttribute("data-theme") || "dark";
    var newTheme = (currentTheme === "dark") ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("lux_media_theme", newTheme);
    showToast(newTheme === "dark" ? "Tungi rejim yoqildi 🌙" : "Yorug' rejim yoqildi ☀️", newTheme === "dark" ? "fa-moon" : "fa-sun");
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute("data-theme", theme);
    var iconClass = (theme === "light") ? "fa-moon" : "fa-sun";
    
    if (themeIcon) {
      themeIcon.className = "fa-solid " + iconClass;
    }
    if (mobileThemeIcon) {
      mobileThemeIcon.className = "fa-solid " + iconClass;
    }
  }

  // -------------------------------------------------------------------------
  // 2. STICKY NAVBAR ON SCROLL
  // -------------------------------------------------------------------------
  var header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", function() {
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // -------------------------------------------------------------------------
  // 3. MOBILE MENU TOGGLE & ACCESSIBILITY
  // -------------------------------------------------------------------------
  var mobileToggle = document.getElementById("mobileToggle");
  var navMenu = document.getElementById("navMenu");
  var navLinks = document.querySelectorAll(".nav-link");

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", function() {
      navMenu.classList.toggle("open");
      var icon = mobileToggle.querySelector("i");
      if (icon) {
        if (navMenu.classList.contains("open")) {
          icon.classList.remove("fa-bars");
          icon.classList.add("fa-xmark");
        } else {
          icon.classList.remove("fa-xmark");
          icon.classList.add("fa-bars");
        }
      }
    });

    navLinks.forEach(function(link) {
      link.addEventListener("click", function() {
        navMenu.classList.remove("open");
        var icon = mobileToggle ? mobileToggle.querySelector("i") : null;
        if (icon) {
          icon.classList.remove("fa-xmark");
          icon.classList.add("fa-bars");
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 4. PORTFOLIO FILTERING
  // -------------------------------------------------------------------------
  var filterBtns = document.querySelectorAll(".filter-btn");
  var projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
      filterBtns.forEach(function(b) { b.classList.remove("active"); });
      btn.classList.add("active");

      var filterValue = btn.getAttribute("data-filter");

      projectCards.forEach(function(card) {
        var cardCategory = card.getAttribute("data-category");
        if (filterValue === "all" || cardCategory === filterValue) {
          card.style.display = "flex";
          setTimeout(function() {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(function() {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 5. PRICING TABS SWITCHER
  // -------------------------------------------------------------------------
  var pricingTabs = document.querySelectorAll(".pricing-tab-btn");
  var devPricing = document.getElementById("devPricing");
  var videoPricing = document.getElementById("videoPricing");
  var brandingPricing = document.getElementById("brandingPricing");

  pricingTabs.forEach(function(tab) {
    tab.addEventListener("click", function() {
      pricingTabs.forEach(function(t) { t.classList.remove("active"); });
      tab.classList.add("active");

      var target = tab.getAttribute("data-tab");
      if (devPricing) devPricing.classList.remove("active");
      if (videoPricing) videoPricing.classList.remove("active");
      if (brandingPricing) brandingPricing.classList.remove("active");

      if (target === "dev" && devPricing) {
        devPricing.classList.add("active");
      } else if (target === "branding" && brandingPricing) {
        brandingPricing.classList.add("active");
      } else if (videoPricing) {
        videoPricing.classList.add("active");
      }
    });
  });

  // -------------------------------------------------------------------------
  // 6. AUTOFILL ORDER IN CONTACT FORM FROM PRICING CARDS
  // -------------------------------------------------------------------------
  var orderButtons = document.querySelectorAll(".btn-order-package");
  var serviceSelect = document.getElementById("service_type");
  var messageInput = document.getElementById("message");
  var contactSection = document.getElementById("contact");

  orderButtons.forEach(function(button) {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      var packageName = button.getAttribute("data-package") || "";

      if (serviceSelect) {
        if (packageName.indexOf("1 Kunlik") !== -1) {
          serviceSelect.value = "1 Kunlik Syomka (800 000 so'm)";
        } else if (packageName.indexOf("2 Kunlik") !== -1) {
          serviceSelect.value = "2 Kunlik Syomka (1 600 000 so'm)";
        } else if (packageName.indexOf("Logo") !== -1) {
          serviceSelect.value = "Logo Dizayn ($20+)";
        } else if (packageName.indexOf("Albom") !== -1) {
          serviceSelect.value = "Foto Albom";
        } else if (packageName.indexOf("Landing") !== -1) {
          serviceSelect.value = "Dasturlash (min $100)";
        } else if (packageName.indexOf("Reels") !== -1) {
          serviceSelect.value = "SMM Reels Montaj";
        }
      }

      if (messageInput) {
        messageInput.value = "Assalomu alaykum Behruzbek! Men LUX MEDIA ning \"" + packageName + "\" xizmati bo'yicha buyurtma bermoqchiman.";
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }

      showToast("Tanlangan paket: " + packageName, "fa-circle-check");
    });
  });

  // -------------------------------------------------------------------------
  // 7. PAYMENT MODAL HANDLERS
  // -------------------------------------------------------------------------
  var paymentModal = document.getElementById("paymentModal");
  var paymentModalCloseBtn = document.getElementById("paymentModalCloseBtn");
  var openPaymentBtns = document.querySelectorAll(".btn-open-payment");

  openPaymentBtns.forEach(function(btn) {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      if (paymentModal) {
        paymentModal.classList.add("active");
        document.body.classList.add("modal-open");
      }
    });
  });

  if (paymentModalCloseBtn && paymentModal) {
    paymentModalCloseBtn.addEventListener("click", function() {
      paymentModal.classList.remove("active");
      document.body.classList.remove("modal-open");
    });

    paymentModal.addEventListener("click", function(e) {
      if (e.target === paymentModal) {
        paymentModal.classList.remove("active");
        document.body.classList.remove("modal-open");
      }
    });
  }

  // -------------------------------------------------------------------------
  // 8. INTERACTIVE ORDER CALCULATOR
  // -------------------------------------------------------------------------
  var calcCheckboxes = document.querySelectorAll(".calc-checkbox");
  var calcTotalPrice = document.getElementById("calcTotalPrice");
  var calcEstimatedTime = document.getElementById("calcEstimatedTime");
  var btnBookCustomOrder = document.getElementById("btnBookCustomOrder");

  function updateCalculator() {
    var totalSom = 0;
    var maxDays = 0;
    var selectedCount = 0;
    var selectedNames = [];

    calcCheckboxes.forEach(function(cb) {
      var parentLabel = cb.closest(".calc-label");
      if (cb.checked) {
        if (parentLabel) parentLabel.classList.add("checked");
        var price = parseInt(cb.getAttribute("data-price") || "0", 10);
        totalSom += price;

        var days = parseInt(cb.getAttribute("data-days") || "0", 10);
        if (days > maxDays) maxDays = days;
        selectedCount++;
        selectedNames.push(cb.getAttribute("data-name"));
      } else {
        if (parentLabel) parentLabel.classList.remove("checked");
      }
    });

    if (calcTotalPrice) {
      if (selectedCount === 0) {
        calcTotalPrice.textContent = "0 so'm";
      } else {
        calcTotalPrice.textContent = totalSom.toLocaleString("ru-RU") + " so'm";
      }
    }

    if (calcEstimatedTime) {
      if (selectedCount === 0) {
        calcEstimatedTime.textContent = "Xizmatlarni tanlang";
      } else {
        calcEstimatedTime.textContent = "Taxminiy tayyor bo'lish: " + maxDays + " - " + (maxDays + 2) + " kun";
      }
    }

    return { totalSom: totalSom, maxDays: maxDays, selectedNames: selectedNames };
  }

  calcCheckboxes.forEach(function(cb) {
    cb.addEventListener("change", updateCalculator);
  });

  if (btnBookCustomOrder) {
    btnBookCustomOrder.addEventListener("click", function(e) {
      e.preventDefault();
      var calcData = updateCalculator();
      if (calcData.selectedNames.length === 0) {
        showToast("Iltimos, kamida bitta xizmatni tanlang!", "fa-circle-exclamation");
        return;
      }

      if (serviceSelect) {
        serviceSelect.value = "Maxsus Buyurtma";
      }

      if (messageInput) {
        messageInput.value = "Assalomu alaykum Behruzbek! Men quyidagi xizmatlar bo'yicha maxsus buyurtma bermoqchiman:\n- " +
          calcData.selectedNames.join("\n- ") +
          "\nHisoblangan umumiy qiymat: " + calcData.totalSom.toLocaleString("ru-RU") + " so'm";
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }

      showToast("Buyurtma hisoblandi: " + calcData.totalSom.toLocaleString("ru-RU") + " so'm", "fa-calculator");
    });
  }

  // -------------------------------------------------------------------------
  // 9. PROJECT PREVIEW MODAL
  // -------------------------------------------------------------------------
  var modalBackdrop = document.getElementById("projectModal");
  var modalCloseBtn = document.getElementById("modalCloseBtn");
  var modalTitle = document.getElementById("modalTitle");
  var modalCategory = document.getElementById("modalCategory");
  var modalDescription = document.getElementById("modalDescription");
  var modalTags = document.getElementById("modalTags");
  var modalPreviewMedia = document.getElementById("modalPreviewMedia");
  var projectPreviewBtns = document.querySelectorAll(".project-preview-trigger");

  var projectData = {
    1: {
      title: "Luxury E-Commerce Platformasi",
      category: "Dasturlash / Web App",
      desc: "Yuqori toifadagi mijozlar uchun zamonaviy dizayn, tezkor buyurtma tizimi, Stripe va Payme to'lov integratsiyasi va to'liq avtomatlashtirilgan admin paneli.",
      tags: ["React", "Node.js", "Tailwind CSS", "Payme API", "Min $100"],
      icon: "fa-cart-shopping",
      badge: "Full-Stack Web"
    },
    2: {
      title: "Fintech Dashboard & Analitika Platformasi",
      category: "Dasturlash / UI/UX",
      desc: "Real vaqt rejimidagi moliyaviy oqimlar analitikasi, grafiklar, shifrlangan ma'lumotlar xavfsizligi va qorong'u/yorug' rejimli interfeys.",
      tags: ["TypeScript", "Next.js", "Chart.js", "REST API", "256-bit SSL"],
      icon: "fa-chart-line",
      badge: "Fintech Platform"
    },
    3: {
      title: "Premium Brend Uchun Kinematik Promo Rolik",
      category: "Videografiya / Reklama",
      desc: "4K formatda suratga olingan, DaVinci Resolve dasturida rang berilgan va professional ovoz dizayni bilan boyitilgan 60 soniyalik promo video.",
      tags: ["DaVinci Resolve", "4K Cinema", "Color Grading", "Sound Design"],
      icon: "fa-film",
      badge: "4K Commercial"
    },
    4: {
      title: "Dinamik SMM Reels & TikTok Kontent To'plami",
      category: "Videografiya / SMM",
      desc: "Auditoriyani 300% ga oshirgan virusli formatdagi 15 ta dinamik Reels va Shorts roliklari to'plami. Motion grafika va subtitrlar bilan.",
      tags: ["Premiere Pro", "After Effects", "Reels/Shorts", "Viral Motion"],
      icon: "fa-mobile-screen",
      badge: "Social Media Pack"
    },
    5: {
      title: "Xalqaro Korporativ Biznes Portali",
      category: "Dasturlash / Web Development",
      desc: "Ko'p tilli (Uz, Ru, En) korporativ veb-sayt, xalqaro SEO qoidalari va Google PageSpeed 98+ ko'rsatkichi bilan to'liq optimallashtirilgan.",
      tags: ["HTML5 / SCSS", "JavaScript", "SEO Pro", "GitHub Pages Ready"],
      icon: "fa-globe",
      badge: "Corporate Portal"
    },
    6: {
      title: "Kinematik Sayohat & Drone Hujjatli Filmi",
      category: "Videografiya / Drone & Cinema",
      desc: "DJI 4K Drone va kino-kameralar yordamida olingan tabiat va me'moriy mo'jizalar aks etgan yuqori hissiyotli video asar.",
      tags: ["Drone 4K", "Cinematography", "HDR10+", "Audio Mixing"],
      icon: "fa-camera-retro",
      badge: "Drone & Film"
    },
    7: {
      title: "Tantanali Tug'ilgan Kun Videofilmi",
      category: "Tadbir & Bayram / Videografiya",
      desc: "Tug'ilgan kun tantanasining har bir yorqin lahzasi, mehmonlar tabassumlari va shirin xotiralari aks etgan 4K kinematik xotira filmi hamda 2 ta Reels roligi.",
      tags: ["1 Kunlik Syomka", "800 000 so'm", "4K Highlight", "Color Grading"],
      icon: "fa-cake-candles",
      badge: "1 Kunlik: 800K"
    },
    8: {
      title: "Xalqaro Biznes Forum & Katta Tadbir",
      category: "Tadbir & Forum / Videografiya",
      desc: "2 kunlik to'liq masshtabli tadbir videografiyasi, spikerlar nutqi, qatnashuvchilar intervyusi, drone tasvirlari va rasmiy bayram filmi.",
      tags: ["2 Kunlik Syomka", "1 600 000 so'm", "Drone 4K", "To'liq Montaj"],
      icon: "fa-champagne-glasses",
      badge: "2 Kunlik: 1.6M"
    },
    9: {
      title: "Premium Brend Uchun Vektor Logo Dizayn",
      category: "Logo & Brending",
      desc: "Kompaniyalar va brendlar uchun 3 xil unikal variant, vektor AI/SVG/PNG fayllar, 3D vizual mockup va qorong'u/yorug' mavzularga moslashuv.",
      tags: ["$20 dan boshlanadi", "Vektor AI/SVG", "3D Mockup", "Brending"],
      icon: "fa-wand-magic-sparkles",
      badge: "Logo: $20+"
    }
  };

  projectPreviewBtns.forEach(function(btn) {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      var id = btn.getAttribute("data-id");
      var data = projectData[id];

      if (data && modalBackdrop) {
        modalTitle.textContent = data.title;
        modalCategory.textContent = data.category;
        modalDescription.textContent = data.desc;

        modalTags.innerHTML = "";
        data.tags.forEach(function(t) {
          var span = document.createElement("span");
          span.className = "tech-tag";
          span.textContent = t;
          modalTags.appendChild(span);
        });

        modalPreviewMedia.innerHTML =
          '<div style="text-align: center; padding: 2.5rem; background: rgba(212,175,55,0.1); border-radius: 14px; border: 1px solid var(--border-gold);">' +
            '<i class="fa-solid ' + data.icon + '" style="font-size: 3.5rem; color: var(--gold-primary); margin-bottom: 1rem; display: block;"></i>' +
            '<span class="badge-gold">' + data.badge + '</span>' +
            '<p style="margin-top: 1rem; color: var(--text-muted); font-size: 0.9rem;">To\'liq 4K Ultra HD & Realizatsiya</p>' +
          '</div>';

        modalBackdrop.classList.add("active");
        document.body.classList.add("modal-open");
      }
    });
  });

  if (modalCloseBtn && modalBackdrop) {
    modalCloseBtn.addEventListener("click", function() {
      modalBackdrop.classList.remove("active");
      document.body.classList.remove("modal-open");
    });

    modalBackdrop.addEventListener("click", function(e) {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove("active");
        document.body.classList.remove("modal-open");
      }
    });
  }

  // -------------------------------------------------------------------------
  // 10. INTERACTIVE COMMENTS & REVIEWS ENGINE (IZOHLAR BO'LIMI)
  // -------------------------------------------------------------------------
  var commentForm = document.getElementById("commentForm");
  var commentsContainer = document.getElementById("customCommentsList");

  function getInitials(name) {
    if (!name) return "LM";
    var parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  function loadCustomComments() {
    if (!commentsContainer) return;
    var stored = localStorage.getItem("lux_media_comments");
    var comments = stored ? JSON.parse(stored) : [];

    commentsContainer.innerHTML = "";
    comments.forEach(function(c) {
      renderCommentCard(c, commentsContainer);
    });
  }

  function renderCommentCard(comment, container) {
    var card = document.createElement("div");
    card.className = "testimonial-card custom-comment-card";
    
    var stars = "";
    var ratingNum = parseInt(comment.rating || "5", 10);
    for (var i = 1; i <= 5; i++) {
      if (i <= ratingNum) {
        stars += '<i class="fa-solid fa-star"></i>';
      } else {
        stars += '<i class="fa-regular fa-star" style="opacity:0.4;"></i>';
      }
    }

    card.innerHTML =
      '<i class="fa-solid fa-quote-right testimonial-quote-icon"></i>' +
      '<div class="testimonial-rating">' + stars + '</div>' +
      '<p class="testimonial-text">"' + escapeHtml(comment.text) + '"</p>' +
      '<div class="testimonial-client">' +
        '<div class="testimonial-avatar">' + escapeHtml(getInitials(comment.name)) + '</div>' +
        '<div class="testimonial-client-info">' +
          '<h5>' + escapeHtml(comment.name) + '</h5>' +
          '<span>' + escapeHtml(comment.service || "Mijoz izohi") + ' &bull; ' + escapeHtml(comment.date || "Yangi izoh") + '</span>' +
        '</div>' +
      '</div>';

    container.prepend(card);
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  if (commentForm) {
    commentForm.addEventListener("submit", function(e) {
      e.preventDefault();
      var nameInput = document.getElementById("comment_author_name");
      var textInput = document.getElementById("comment_text_content");
      var serviceInput = document.getElementById("comment_service_tag");
      var ratingInput = document.getElementById("comment_star_rating");

      var name = nameInput ? nameInput.value.trim() : "";
      var text = textInput ? textInput.value.trim() : "";
      var service = serviceInput ? serviceInput.value.trim() : "Mijoz fikri";
      var rating = ratingInput ? ratingInput.value : "5";

      if (!name || !text) {
        showToast("Iltimos, ismingiz va izohingizni kiriting!", "fa-triangle-exclamation");
        return;
      }

      var now = new Date();
      var dateStr = now.toLocaleDateString("uz-UZ", { day: 'numeric', month: 'short', year: 'numeric' });

      var newComment = {
        name: name,
        text: text,
        service: service,
        rating: rating,
        date: dateStr
      };

      var stored = localStorage.getItem("lux_media_comments");
      var comments = stored ? JSON.parse(stored) : [];
      comments.push(newComment);
      localStorage.setItem("lux_media_comments", JSON.stringify(comments));

      if (commentsContainer) {
        renderCommentCard(newComment, commentsContainer);
      }

      commentForm.reset();
      showToast("Rahmat " + name + "! Izohingiz muvaffaqiyatli saqlandi hamda chop etildi.", "fa-comment-dots");
    });
  }

  loadCustomComments();

  // -------------------------------------------------------------------------
  // 11. EMAILJS CONTACT US FORM SUBMISSION & FALLBACK
  // -------------------------------------------------------------------------
  var contactForm = document.getElementById("contactForm");
  var contactSubmitBtn = document.getElementById("contactSubmitBtn");

  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();

      var userName = document.getElementById("user_name") ? document.getElementById("user_name").value.trim() : "";
      var userEmail = document.getElementById("user_email") ? document.getElementById("user_email").value.trim() : "";
      var message = document.getElementById("message") ? document.getElementById("message").value.trim() : "";

      if (!userName || !userEmail || !message) {
        showToast("Iltimos, ismingiz, pochtangiz va xabarni to'liq to'ldiring!", "fa-triangle-exclamation");
        return;
      }

      var originalBtnText = contactSubmitBtn ? contactSubmitBtn.innerHTML : "";
      if (contactSubmitBtn) {
        contactSubmitBtn.disabled = true;
        contactSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Xabar yuborilmoqda...';
      }

      if (typeof emailjs !== "undefined" && emailjs.sendForm) {
        emailjs.sendForm("service_zxfcl9c", "men7kuj", this)
          .then(function() {
            showToast("Rahmat " + userName + "! Xabaringiz muvaffaqiyatli yetkazildi. Tez orada javob beramiz.", "fa-circle-check");
            contactForm.reset();
          })
          .catch(function(error) {
            console.error("EmailJS error:", error);
            showToast("Email yuborishda xatolik yuz berdi. Telegram orqali bog'lanishingiz mumkin.", "fa-circle-exclamation");
            openTelegramFallback(userName, message);
          })
          .finally(function() {
            if (contactSubmitBtn) {
              contactSubmitBtn.disabled = false;
              contactSubmitBtn.innerHTML = originalBtnText;
            }
          });
      } else {
        showToast("EmailJS xizmati ulanmagan. Telegram orqali xabar tayyorlandi.", "fa-telegram");
        openTelegramFallback(userName, message);
        if (contactSubmitBtn) {
          contactSubmitBtn.disabled = false;
          contactSubmitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  function openTelegramFallback(name, text) {
    var textEncoded = encodeURIComponent("Assalomu alaykum Behruzbek! Ismim: " + name + ".\n" + text);
    window.open("https://t.me/Behruzbek_0875?text=" + textEncoded, "_blank");
  }

  // -------------------------------------------------------------------------
  // 12. NEWSLETTER FORM
  // -------------------------------------------------------------------------
  var newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function(e) {
      e.preventDefault();
      var input = newsletterForm.querySelector('input[type="email"]');
      var email = input ? input.value.trim() : "";
      if (email) {
        showToast("Rahmat! Emailingiz muvaffaqiyatli qabul qilindi.", "fa-envelope-circle-check");
        newsletterForm.reset();
      }
    });
  }

  // Initial calculation
  updateCalculator();
});
