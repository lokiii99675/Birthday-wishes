export default async function run(page) {
  await page.waitForTimeout(3000);
  const b = await page.$(".swal2-confirm");
  if (b) await b.click();

  // Wait for the gallery section to be displayed (regardless of slide opacity)
  for (let i = 0; i < 80; i++) {
    await page.waitForTimeout(700);
    const on = await page.evaluate(() => {
      const g = document.querySelector(".section-gallery");
      if (!g) return false;
      const s = getComputedStyle(g);
      return s.visibility !== "hidden" && parseFloat(s.opacity) > 0.05;
    });
    if (on) break;
  }

  // Now watch ONLY the first slide's inline style for 15s
  const log = [];
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(800);
    const s = await page.evaluate(() => {
      const el = document.querySelector(".slide");
      return {
        inline: el.getAttribute("style") || "(none)",
        op: getComputedStyle(el).opacity,
      };
    });
    log.push(s.op + " || " + s.inline.slice(0, 60));
  }
  return { log };
}
