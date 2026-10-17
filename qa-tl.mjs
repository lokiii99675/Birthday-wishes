export default async function run(page) {
  await page.waitForTimeout(3000);
  const b = await page.$(".swal2-confirm");
  if (b) await b.click();
  await page.waitForTimeout(2000);

  // Inspect the GSAP timeline directly: how many slide tweens exist?
  const tlInfo = await page.evaluate(() => {
    // GSAP stores the last created timeline; find it via the global timeline children.
    const g = window.gsap;
    if (!g) return { err: "no gsap" };
    const kids = g.globalTimeline.getChildren(true, true, false);
    const all = [];
    kids.forEach((t) => {
      const targets = t.targets ? t.targets() : [];
      targets.forEach((el) => {
        if (el && el.classList) {
          const cls =
            (el.classList.contains("slide") && "slide") ||
            (el.classList.contains("slide-text") && "slide-text") ||
            (el.classList.contains("slide-caption") && "slide-caption") ||
            (el.classList.contains("gallery-title") && "gallery-title") ||
            (el.classList.contains("dot") && "dot") ||
            null;
          if (cls) all.push(cls);
        }
      });
    });
    const counts = {};
    all.forEach((c) => { counts[c] = (counts[c] || 0) + 1; });
    return { counts, timelineChildren: kids.length };
  });

  return tlInfo;
}
