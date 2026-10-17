export default async function run(page) {
  await page.waitForTimeout(3000);
  const b = await page.$(".swal2-confirm");
  if (b) await b.click();
  await page.evaluate(() => {
    document.querySelectorAll(".container > *").forEach((e) => { e.style.display = "none"; });
    const g = document.querySelector(".section-gallery");
    g.style.display = "flex"; g.style.opacity = "1"; g.style.visibility = "visible";
    g.querySelectorAll(".slide").forEach((s, i) => {
      s.style.opacity = i === 0 ? "1" : "0";
      const c = s.querySelector(".slide-caption"); if (c) c.style.opacity = "1";
    });
  });
  await page.waitForTimeout(1200);
  return await page.evaluate(() => {
    const g = document.querySelector(".section-gallery");
    const s = g.querySelector(".slide");
    const f = g.querySelector(".slide-frame");
    const im = g.querySelector(".slide-img");
    const cs = (e) => { const c = getComputedStyle(e); return { filter: c.filter, opacity: c.opacity, transform: c.transform, scale: c.scale, objectFit: c.objectFit, objectPos: c.objectPosition, w: c.width, h: c.height }; };
    return { slide: cs(s), frame: cs(f), img: cs(im), natural: { w: im.naturalWidth, h: im.naturalHeight }, inlineImg: im.getAttribute("style"), inlineFrame: f.getAttribute("style"), inlineSlide: s.getAttribute("style") };
  });
}
