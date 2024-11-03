export function vw(px: number) {
  const sizes = {
    desktop: 1440, // figma desktop breakpoint
    mobile: 375, // figma mobile breakpoint
  } as const
  const vw = window.innerWidth
  const layoutSize = vw >= sizes.desktop ? sizes.desktop : sizes.mobile

  return (px * vw) / layoutSize
}
