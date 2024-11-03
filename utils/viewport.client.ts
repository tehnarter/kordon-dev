const breakpoints = {
  desktop: 1024,
  mobile: 375,
} as const

const designBreakpoints = {
  desktop: 1440,
  mobile: 375,
} as const

type ViewportName = keyof typeof breakpoints

const viewport = {
  design_breakpoints: designBreakpoints,
  breakpoints: breakpoints,
  isDesktop() {
    return window.innerWidth >= this.breakpoints.desktop
  },
  isMobile() {
    return window.innerWidth < this.breakpoints.desktop
  },
  getSize() {
    return window.innerWidth
  },
  getName() {
    return this.isDesktop() ? "desktop" : "mobile"
  },
  getBreakpointSizeByName(name: ViewportName) {
    return this.breakpoints[name]
  },
  getLayoutSize(px: number) {
    const vw = this.isDesktop()
      ? this.design_breakpoints.desktop
      : this.design_breakpoints.mobile

    return (px * this.getSize()) / vw
  },
}

export { viewport }
