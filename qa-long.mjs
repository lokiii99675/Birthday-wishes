export default async function run(page) {
  await page.waitForTimeout(3000);
  const b = await page.$(".swal2-confirm");
  if (b) await b.click();

  const seen = [];
  let firstVisibleAt = null;
  const t0 = Date.now();
  for (let i = 0; i < 200; i++) {
    await page.waitForTimeout(1000);
    const st = await page.evaluate(() => {
      const slides = [...document.querySelectorAll(".slide")];
      const vis = slides
        .map((s, idx) => ({ idx, o: parseFloat(getComputedStyle(s).opacity) }))
        .filter((s) => s.o > 0.5)
        .map((s) => s.idx);
      return { vis, styles: slides.some((s) => s.getAttribute("style")) };
    });
    if (st.styles && firstVisibleAt === null) firstVisibleAt = ((Date.now() - t0) / 1000).toFixed(1);
    st.vis.forEach((v) => { if (!seen.includes(v)) seen.push(v); });
    if (seen.length >= 4) break;
  }
  return { slidesSeenInOrder: seen, firstStyledAfterSec: firstVisibleAt, totalWaitedSec: ((Date.now() - t0) / 1000).toFixed(1) };
}
