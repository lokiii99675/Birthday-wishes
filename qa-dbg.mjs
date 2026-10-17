export default async function run(page) {
  await page.waitForTimeout(3000);
  const b = await page.$(".swal2-confirm");
  if (b) await b.click();

  for (let i = 0; i < 60; i++) {
    await page.waitForTimeout(800);
    const on = await page.evaluate(() => {
      const g = document.querySelector(".section-gallery");
      if (!g) return false;
      const s = getComputedStyle(g);
      return s.visibility !== "hidden" && parseFloat(s.opacity) > 0.1;
    });
    if (on) break;
  }

  // Sample over ~12s: report raw opacity + inline style of every slide.
  const timeline = [];
  for (let i = 0; i < 14; i++) {
    await page.waitForTimeout(900);
    const snap = await page.evaluate(() => {
      return [...document.querySelectorAll(".slide")].map((s, idx) => {
        const cs = getComputedStyle(s);
        return {
          idx,
          computedOpacity: cs.opacity,
          computedDisplay: cs.display,
          inline: (s.getAttribute("style") || "").slice(0, 70),
        };
      });
    });
    timeline.push(snap.map((s) => s.idx + ":" + s.computedOpacity).join(" "));
  }
  return { timeline };
}
