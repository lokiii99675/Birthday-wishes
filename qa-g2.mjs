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
    const get = (sel) => {
      const e = g.querySelector(sel);
      if (!e) return "MISSING";
      const cs = getComputedStyle(e);
      return { display: cs.display, pos: cs.position, w: cs.width, h: cs.height, maxW: cs.maxWidth, op: cs.opacity, z: cs.zIndex, bottom: cs.bottom };
    };
    return {
      galleryStyle: { d: getComputedStyle(g).display, fd: getComputedStyle(g).flexDirection, ai: getComputedStyle(g).alignItems, jc: getComputedStyle(g).justifyContent, w: getComputedStyle(g).width, h: getComputedStyle(g).height },
      stage: get(".slideshow-stage"),
      frame: get(".slide-frame"),
      img: get(".slide-img"),
      caption: get(".slide-caption"),
    };
  });
}
