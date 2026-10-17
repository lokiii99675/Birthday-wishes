export default async function run(page) {
  await page.waitForTimeout(3500);
  const b = await page.$(".swal2-confirm");
  if (b) await b.click();
  await page.waitForTimeout(1500);

  // Manually drive the gallery component with a fresh timeline and watch it.
  const info = await page.evaluate(() => {
    const el = document.querySelector(".section-gallery");
    const comp = window.Components && window.Components.gallery;
    if (!el || !comp) return { el: !!el, comp: !!comp };
    // Reset inline styles on slides
    el.querySelectorAll(".slide").forEach((s) => s.removeAttribute("style"));
    const before = [...el.querySelectorAll(".slide")].map((s) => getComputedStyle(s).opacity);
    return { before, hasGsap: typeof window.gsap };
  });

  return info;
}
