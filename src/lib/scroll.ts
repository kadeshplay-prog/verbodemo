import type Lenis from "lenis";

let publicScroller: Lenis | null = null;

export function registerPublicScroller(scroller: Lenis) {
  publicScroller = scroller;
  return () => {
    if (publicScroller === scroller) publicScroller = null;
  };
}

// Las anclas y el teclado interrumpen la inercia del gesto anterior.
export function scrollToPublicDestination(target: HTMLElement | number) {
  if (publicScroller) {
    publicScroller.scrollTo(target, {
      immediate: true,
      force: true,
      // Lenis ya descuenta scroll-padding-top, definido en el documento.
      offset: 0,
    });
  } else if (typeof target === "number") {
    window.scrollTo(0, target);
  } else {
    target.scrollIntoView();
  }
}
