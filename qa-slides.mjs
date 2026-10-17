export default async function run(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });

  await page.waitForTimeout(3000);
  const b = await page.$(".swal2-confirm");
  if (b) await b.click();
  await page.waitForTimeout(1000);

  // Jump straight to the gallery section
  await page.evaluate(() => {
    document.querySelectorAll(".container > *").forEach((e) => { e.style.display = "none"; });
    document.querySelectorAll(".section-gallery").forEach((e) => {
      e.style.display = "flex"; e.style.opacity = "1"; e.style.visibility = "visible";
    });
  });
  await page.waitForTimeout(2000);

  const structure = await page.evaluate(() => {
    const slides = [...document.querySelectorAll(".slide")];
    return {
      slideCount: slides.length,
      dotCount: document.querySelectorAll(".dot").length,
      title: document.querySelector(".gallery-title")?.innerText,
      captions: [...document.querySelectorAll(".slide-text")].map((e) => e.innerText),
      imagesLoaded: [...document.querySelectorAll(".slide-img")].filter((i) => i.naturalWidth > 0).length,
      brokenImages: [...document.querySelectorAll(".slide-img")].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute("src")),
    };
  });

  // Check only one slide is visible at a time at rest
  const restState = await page.evaluate(() => {
    return [...document.querySelectorAll(".slide")].map((s) => ({
      i: s.dataset.index,
      opacity: getComputedStyle(s).opacity,
    }));
  });

  return { structure, restState, errors };
}
