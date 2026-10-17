export default async function run(page) {
  await page.waitForTimeout(3000);
  const b = await page.$(".swal2-confirm");
  if (b) await b.click();

  // Poll during real playback: record when each slide becomes visible.
  const seenOrder = [];
  const samples = [];
  for (let i = 0; i < 90; i++) {
    await page.waitForTimeout(700);
    const state = await page.evaluate(() => {
      const g = document.querySelector(".section-gallery");
      if (!g) return null;
      const gs = getComputedStyle(g);
      const galleryOn = gs.visibility !== "hidden" && parseFloat(gs.opacity) > 0.1;
      const slides = [...document.querySelectorAll(".slide")];
      const visible = slides
        .map((s, idx) => ({ idx, o: parseFloat(getComputedStyle(s).opacity) }))
        .filter((s) => s.o > 0.5)
        .map((s) => s.idx);
      return { galleryOn, visible, anyStyle: slides.some((s) => s.getAttribute("style")) };
    });
    if (state && state.galleryOn) {
      samples.push(state);
      state.visible.forEach((v) => {
        if (!seenOrder.includes(v)) seenOrder.push(v);
      });
    }
    if (seenOrder.length >= 3) break;
  }
  return { seenOrder, gallerySampleCount: samples.length, lastSample: samples[samples.length - 1] || null };
}
