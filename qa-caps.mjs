export default async function run(page) {
  await page.waitForTimeout(3000);
  const b = await page.$(".swal2-confirm");
  if (b) await b.click();

  for (let i = 0; i < 60; i++) {
    await page.waitForTimeout(1000);
    const vis = await page.evaluate(() => {
      const g = document.querySelector(".section-gallery");
      if (!g) return false;
      const s = getComputedStyle(g);
      return s.visibility !== "hidden" && parseFloat(s.opacity) > 0.1;
    });
    if (vis) break;
  }

  const shots = [];
  for (let i = 0; i < 6; i++) {
    await page.waitForTimeout(1800);
    const info = await page.evaluate(() => {
      const slides = [...document.querySelectorAll(".slide")];
      const best = slides
        .map((s) => ({ s, o: parseFloat(getComputedStyle(s).opacity) }))
        .sort((a, b) => b.o - a.o)[0];
      const txt = best.s.querySelector(".slide-text");
      return {
        idx: best.s.dataset.index,
        opacity: best.o,
        caption: txt ? txt.innerText : null,
      };
    });
    shots.push(info);
    await page.screenshot({ path: `C:/Users/HP/happybirthday/shot-${i}.png` });
  }
  return { shots };
}
