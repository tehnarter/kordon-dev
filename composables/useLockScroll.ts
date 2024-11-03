// import Lenis from "@studio-freight/lenis"

export function useLockScroll() {
  const isLocked = useState("scroll-locked", () => false)
  // const lenis = useState<Lenis>("lenis")

  function lockScroll(value: boolean) {
    //isLocked.value = value
    document.body.style.overflow = value ? "hidden" : ""
    document.body.style.touchAction = value ? "none" : ""
  }

  return {
    lockScroll,
    isLocked,
  }
}

// !- If you installed Lenis - you need uncomment here some fields
