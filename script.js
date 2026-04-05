document.addEventListener("DOMContentLoaded", () => {
  // Mobile sidebar toggle functionality
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const sidebar = document.getElementById("sidebar");

  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  // Active state for sidebar navigation based on scroll position
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  const updateActiveLink = () => {
    let current = "";
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", updateActiveLink);
  // Initial check in case user loads page midway down
  updateActiveLink();

  // Smooth scrolling for anchor links to handle visual offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      
      // Close mobile sidebar if open
      if (sidebar && sidebar.classList.contains("active")) {
        sidebar.classList.remove("active");
      }

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 60, // offset for fixed headers / breathing room
          behavior: "smooth"
        });
      }
    });
  });

  // Intersection Observer for scroll animations (Slide in from left)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // Mouse Glow Movement logic
  const mouseGlow = document.getElementById('mouse-glow');
  if (mouseGlow) {
    document.addEventListener('mousemove', (e) => {
      // Use requestAnimationFrame for smoother performance
      requestAnimationFrame(() => {
        mouseGlow.style.left = e.clientX + 'px';
        mouseGlow.style.top = e.clientY + 'px';
      });
    });
  }
});
