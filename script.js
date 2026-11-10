/* =========================================================
   담결한 홈페이지 공통 스크립트
   - 홈페이지 공개 주소는 아래 SITE_URL 한 곳에서 바꿉니다.
     (배포 후 입력: HTML 파일 안의 "https://kubong007-dotco.github.io/homepage" 도
      VS Code '폴더에서 바꾸기'로 한 번에 바꿔 주세요. sitemap.xml, robots.txt 포함)
   ========================================================= */
var SITE_URL = "https://kubong007-dotco.github.io/homepage";

(function () {
  var doc = document.documentElement;
  doc.classList.remove("no-js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 공개 주소가 정해지면 canonical·og:url 을 자동으로 맞춤 */
  if (SITE_URL.indexOf("YOUR-DOMAIN") === -1) {
    var page = location.pathname.split("/").pop() || "";
    var url = SITE_URL.replace(/\/$/, "") + "/" + (page === "index.html" ? "" : page);
    var c = document.querySelector('link[rel="canonical"]'); if (c) c.href = url;
    var o = document.querySelector('meta[property="og:url"]'); if (o) o.content = url;
  }

  /* 첫 화면 등장 */
  requestAnimationFrame(function () { document.body.classList.add("is-loaded"); });

  /* 상단 메뉴: 스크롤하면 유리 배경 */
  var header = document.querySelector(".header");
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 12); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* 모바일 메뉴 */
  var btn = document.querySelector(".menu-btn");
  var mnav = document.querySelector(".mobile-nav");
  if (btn && mnav) {
    btn.addEventListener("click", function () {
      var open = mnav.classList.toggle("is-open");
      header.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mnav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { mnav.classList.remove("is-open"); header.classList.remove("is-open"); document.body.style.overflow = ""; });
    });
  }

  /* 로고 파일(images/logo.png)이 있으면 글자 로고 대신 표시 */
  document.querySelectorAll(".brand__logo").forEach(function (img) {
    function ok() { if (img.naturalWidth) img.closest(".brand").classList.add("has-logo"); }
    if (img.complete) ok(); else img.addEventListener("load", ok);
  });

  /* 첫 화면: images/hero.mp4 가 있으면 밝은 막을 씌운 배경 영상으로 재생 */
  var hero = document.querySelector(".hero");
  if (hero) {
    var hvid = hero.querySelector(".hero__video");
    if (hvid) {
      if (reduce) { hvid.removeAttribute("autoplay"); hvid.pause(); }
      var onVideo = function () { if (!reduce) hero.classList.add("hero--media", "hero--video"); };
      if (hvid.readyState >= 2) onVideo();
      hvid.addEventListener("loadeddata", onVideo);
      hvid.addEventListener("error", function () { hvid.remove(); });
    }
  }

  /* 소개 영상(intro.mp4)이 없으면 빈 자리 틀 */
  document.querySelectorAll(".media video").forEach(function (v) {
    v.addEventListener("error", function () { v.parentNode.classList.add("is-empty"); });
    var s = v.querySelector("source"); if (s) s.addEventListener("error", function () { v.parentNode.classList.add("is-empty"); });
  });

  /* 스크롤 등장 (카드는 0.08초 간격) */
  var targets = document.querySelectorAll("[data-reveal], .img-reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -4% 0px", threshold: 0.04 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add("is-in"); });
  }
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) { child.style.setProperty("--i", i); });
  });

  /* 대형 이미지 띠: 천천히 다르게 움직이는 패럴랙스 */
  var bands = document.querySelectorAll(".band .media img");
  if (bands.length && !reduce) {
    var ticking = false;
    var update = function () {
      var vh = window.innerHeight;
      bands.forEach(function (img) {
        var r = img.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = (r.top + r.height / 2 - vh / 2) / vh; // -1 ~ 1
        img.style.transform = "translate3d(0," + (p * -40).toFixed(1) + "px,0) scale(1.12)";
      });
      ticking = false;
    };
    window.addEventListener("scroll", function () { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();
  }

  /* 상세 페이지 목차: 지금 읽는 위치 표시 */
  var tocLinks = document.querySelectorAll(".toc a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove("is-active"); });
          var a = map[e.target.id]; if (a) a.classList.add("is-active");
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) tio.observe(el); });
  }

  /* 올해 연도 */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
