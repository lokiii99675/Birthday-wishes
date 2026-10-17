export default async function run(page, ui) {
  const results = {};
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  // Dismiss the SweetAlert music prompt so the timeline starts.
  await page.waitForTimeout(2500);
  const confirm = page.locator(".swal2-confirm");
  if (await confirm.count()) {
    await confirm.click({ timeout: 5000 }).catch(() => {});
  }

  // Wait until the gallery is on screen (without waiting out the whole intro).
  await page.waitForFunction(
    () => {
      const el = document.querySelector(".section-gallery");
      if (!el) return false;
      const s = getComputedStyle(el);
      return s.visibility !== "hidden" && parseFloat(s.opacity) > 0.05;
    },
    { timeout: 120000 }
  );
  results.galleryPresent = true;

  const snap = await page.evaluate(() => {
    const el = document.querySelector(".section-gallery");
    const slides = [...el.querySelectorAll(".slide")];
    return {
      title: (el.querySelector(".gallery-title") || {}).textContent || "",
      slideCount: slides.length,
      dots: el.querySelectorAll(".dot").length,
      captions: slides.map((s) => {
        const t = s.querySelector(".slide-text");
        return t ? t.textContent.trim() : "";
      }),
      images: slides.map((s) => {
        const img = s.querySelector("img");
        return img
          ? { src: img.getAttribute("src"), ok: img.complete && img.naturalWidth > 0, w: img.naturalWidth }
          : null;
      }),
    };
  });
  results.snapshot = snap;

  // --- Core requirement: exactly ONE photo visible at a time ---
  const sample = async () =>
    page.evaluate(() =>
      [...document.querySelectorAll(".section-gallery .slide")]
        .map((s, i) => ({ i, op: parseFloat(getComputedStyle(s).opacity) }))
        .filter((x) => x.op > 0.5)
        .map((x) => x.i)
    );

  const samples = [];
  for (let n = 0; n < 12; n++) {
    samples.push(await sample());
    await page.waitForTimeout(1100);
  }
  results.samples = samples;
  results.oneAtATime = samples.every((s) => s.length <= 1);
  const seen = [...new Set(samples.flat())];
  results.slidesSeen = seen.sort((a, b) => a - b);
  results.advanced = seen.length > 1;

  // --- Core requirement: a love note under each photo ---
  results.captionVisibleWithPhoto = await page.evaluate(() => {
    const slides = [...document.querySelectorAll(".section-gallery .slide")];
    const active = slides.find((s) => parseFloat(getComputedStyle(s).opacity) > 0.5);
    if (!active) return null;
    const cap = active.querySelector(".slide-caption");
    const frame = active.querySelector(".slide-frame");
    return {
      captionOpacity: parseFloat(getComputedStyle(cap).opacity),
      captionText: active.querySelector(".slide-text").textContent.trim(),
      hasHeart: !!active.querySelector(".slide-heart"),
      captionBelowPhoto: cap.getBoundingClientRect().top >= frame.getBoundingClientRect().top,
    };
  });

  results.pageErrors = errors;
  return results;
}
