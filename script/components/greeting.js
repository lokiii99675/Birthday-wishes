(function () {
  window.Components = window.Components || {};

  window.Components.greeting = {
    render(container, section, config) {
      const div = document.createElement("div");
      div.className = "section section-greeting";
      div.innerHTML = `
        <p class="greeting-prefix">${section.title || "Hi"}</p>
        <h1 class="greeting-title">
          <span class="greeting-name">${config.name}</span>
        </h1>
        <p class="greeting-from">from <span class="greeting-sender">${config.fromName || ""}</span> 💖</p>
        <p class="greeting-subtitle">${section.subtitle || ""}</p>
      `;
      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      // Prefix fades in
      tl.from(el.querySelector(".greeting-prefix"), {
        duration: 0.6,
        opacity: 0,
        y: 20,
        ease: "power2.out",
      });

      // Name with dramatic entrance
      tl.from(
        el.querySelector(".greeting-name"),
        {
          duration: 1,
          opacity: 0,
          y: 30,
          scale: 0.9,
          ease: "back.out(1.4)",
        },
        "-=0.3"
      );

      // From line
      tl.from(
        el.querySelector(".greeting-from"),
        {
          duration: 0.6,
          opacity: 0,
          y: 15,
          ease: "power2.out",
        },
        "-=0.5"
      );

      // Subtitle
      tl.from(
        el.querySelector(".greeting-subtitle"),
        {
          duration: 0.6,
          opacity: 0,
          y: 15,
          ease: "power2.out",
        },
        "-=0.4"
      );

      // Exit
      tl.to(el.querySelectorAll(".greeting-prefix, .greeting-name, .greeting-from, .greeting-subtitle"), {
        duration: 0.7,
        opacity: 0,
        y: -20,
        stagger: 0.05,
        ease: "power2.in",
      }, "+=3");
    },
  };
})();