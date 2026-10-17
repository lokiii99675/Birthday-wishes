export default async function run(page) {
  await page.waitForTimeout(3000);
  const b = await page.$(".swal2-confirm");
  if (b) await b.click();

  // Fast-forward: force the gallery visible and re-run its own animate block
  // by checking that the markup + CSS lay out correctly, then screenshot it.
  await page.evaluate(() => {
    document.querySelectorAll(".container > *").forEach((e) => { e.style.display = "none"; });
    const g = document.querySelector(".section-gallery");
    g.style.display = "flex"; g.style.opacity = "1"; g.style.visibility = "visible";
    // Reveal slides manually (mimicking the animation end state) to check layout
    g.querySelectorAll(".slide").forEach((s, i) => {
      s.style.opacity = i === 0 ? "1" : "0";
      const c = s.querySelector(".slide-caption");
      if (c) c.style.opacity = "1";
    });
  });
  await page.waitForTimeout(1500);

  const layout = await page.evaluate(() => {
    const g = document.querySelector(".section-gallery");
    const stage = g.querySelector(".slideshow-stage");
    const frame = g.querySelector(".slide-frame");
    const img = g.querySelector(".slide-img");
    const cap = g.querySelector(".slide-caption");
    const r = (e) => { const b = e.getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height) }; };
    return {
      gallery: r(g), stage: r(stage), frame: r(frame), img: r(img), caption: r(cap),
      imgLoaded: img.naturalWidth > 0,
      captionText: cap.innerText.trim(),
      visibleSlides: [...g.querySelectorAll(".slide")].filter((s) => parseFloat(getComputedStyle(s).opacity) > 0.5).length,
    };
  });

  await page.screenshot({ path: "C:/Users/HP/happybirthday/gal.png" });
  return layout;
}
