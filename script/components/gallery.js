(function () {
  window.Components = window.Components || {};

  /**
   * Romantic slideshow — each photo appears alone, slowly zooms (Ken Burns),
   * and a loving message springs in underneath before moving on.
   *
   * config.js:
   *   {
   *     type: "gallery",
   *     title: "My Whole World 💖",
   *     photos:   ["./img/a.jpg", "./img/b.jpg"],
   *     captions: ["my love", "love u forever and ever"],
   *     duration: 4.5,   // seconds each slide is on screen (optional)
   *   }
   */
  window.Components.gallery = {
    overlay: true,

    render(container, section, config) {
      const div = document.createElement("div");
      div.className = "section section-gallery";
      const photos = section.photos || [];
      const captions = section.captions || [];
      const title = section.title || "Our Moments 💖";

      div.innerHTML = `
        <h2 class="gallery-title">${title}</h2>
        <div class="slideshow">
          <div class="slideshow-stage">
            ${photos
              .map(
                (photo, i) => `
              <div class="slide" data-index="${i}">
                <div class="slide-frame">
                  <img src="${photo}" alt="Memory ${i + 1}" class="slide-img" />
                </div>
                <div class="slide-caption">
                  <span class="slide-heart">💖</span>
                  <span class="slide-text">${captions[i] || "You 💕"}</span>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="slideshow-dots">
            ${photos
              .map((_, i) => `<span class="dot" data-index="${i}"></span>`)
              .join("")}
          </div>
        </div>
      `;
      container.appendChild(div);
      return div;
    },

    animate(tl, el, config) {
      const perSlide = Number((config && config.galleryDuration) || 3.4);

      // Only the title is part of the master timeline. The slideshow itself
      // runs on its OWN timeline, started the moment this section is shown,
      // so the photos always play no matter how long the overall story is.
      tl.fromTo(
        el.querySelector(".gallery-title"),
        { opacity: 0, y: -40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.6)" }
      );

      this._startWhenVisible(el, perSlide);
    },

    /**
     * Watches the section and kicks off the one-by-one slideshow as soon as
     * the gallery becomes the visible element on screen.
     */
    _startWhenVisible(el, perSlide) {
      const slides = [...el.querySelectorAll(".slide")];
      const dots = [...el.querySelectorAll(".dot")];
      if (!slides.length) return;

      // Every slide starts hidden so nothing flashes before its turn.
      gsap.set(slides, { opacity: 0 });
      gsap.set(el.querySelectorAll(".slide-caption"), { opacity: 0 });

      let started = false;
      const begin = () => {
        if (started) return;
        started = true;
        this._buildShow(el, slides, dots, perSlide);
      };

      const isVisible = () => {
        const s = getComputedStyle(el);
        return (
          s.visibility !== "hidden" &&
          s.display !== "none" &&
          parseFloat(s.opacity) > 0.05
        );
      };

      if (isVisible()) return begin();

      // Poll briefly; the master timeline reveals this section in turn.
      let ticks = 0;
      const watch = setInterval(() => {
        ticks += 1;
        if (isVisible() || ticks > 1200) {
          clearInterval(watch);
          if (isVisible()) begin();
        }
      }, 250);
    },

    /** The romantic one-photo-at-a-time sequence. */
    _buildShow(el, slides, dots, perSlide) {
      const show = gsap.timeline();

      slides.forEach((slide, i) => {
        const img = slide.querySelector(".slide-img");
        const caption = slide.querySelector(".slide-caption");
        const heart = slide.querySelector(".slide-heart");
        const text = slide.querySelector(".slide-text");
        const dot = dots[i];
        const isLast = i === slides.length - 1;

        // Make sure this slide always starts from a hidden, sharp state.
        show.set(slide, { opacity: 0, scale: 0.82, y: 40, filter: "blur(14px)" });
        show.set(caption, { opacity: 0, y: 24 });
        show.set(heart, { scale: 0, rotate: -30, opacity: 0 });
        show.set(text, { opacity: 0 });
        if (dot) show.set(dot, { backgroundColor: "rgba(255,255,255,0.25)", scale: 1 });

        // ── Enter: the photo lifts in from a soft blur ──
        show.to(slide, {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        });

        // Ken Burns — gentle continuous zoom while it is on screen
        show.fromTo(
          img,
          { scale: 1.04 },
          { scale: 1.18, duration: perSlide + 0.8, ease: "none" },
          "<"
        );

        // Light up this slide's dot
        if (dot) {
          show.to(dot, { duration: 0.3, backgroundColor: "var(--primary)", scale: 1.4 }, "<");
        }

        // The love note: heart pops, then the message springs in
        show.to(caption, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.35");
        show.to(heart, { scale: 1, rotate: 0, opacity: 1, duration: 0.6, ease: "back.out(2.2)" }, "-=0.5");
        show.fromTo(
          text,
          { opacity: 0, letterSpacing: "0.28em" },
          { opacity: 1, letterSpacing: "0em", duration: 0.7, ease: "power2.out" },
          "-=0.45"
        );

        // ── Hold, then make way for the next photo (last one lingers) ──
        if (!isLast) {
          show.to(caption, { duration: 0.4, opacity: 0, y: -14 }, "+=" + perSlide);
          show.to(
            slide,
            { duration: 0.7, opacity: 0, scale: 1.05, filter: "blur(10px)", ease: "power2.in" },
            "-=0.15"
          );
          if (dot) {
            show.to(dot, { duration: 0.3, backgroundColor: "rgba(255,255,255,0.25)", scale: 1 }, "<");
          }
        } else {
          // Final message glows, then gently fades so the story can continue.
          show.to(
            text,
            {
              duration: 0.9,
              color: "var(--primary)",
              textShadow: "0 0 26px rgba(255,107,157,0.65)",
              ease: "power2.out",
            },
            "+=" + perSlide
          );
          show.to(caption, { duration: 0.6, opacity: 0.85 });
        }
      });

        return show;
      },

      exit(tl, el) {
      tl.to(el, { duration: 0.7, opacity: 0, y: -20, ease: "power2.in" });
    },
  };
})();