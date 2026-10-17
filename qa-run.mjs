export default async function run(page) {
  await page.waitForTimeout(3000);
  const b = await page.$(".swal2-confirm");
  if (b) await b.click();

  // Walk the timeline until the gallery section is the active one.
  let found = false;
  for (let i = 0; i < 60; i++) {
    await page.waitForTimeout(1000);
    const st = await page.evaluate(() => {
      const g = document.querySelector(".section-gallery");
      if (!g) return null;
      const s = getComputedStyle(g);
      return { visible: s.visibility !== "hidden" && parseFloat(s.opacity) > 0.1 };
    });
    if (st && st.visible) { found = true; break; }
  }
  return { reachedGallery: found };
}
