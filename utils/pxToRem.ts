export function pxToRem(px: number, defaultRemSize = 16) {
  return px / defaultRemSize
}
export function pxToRem10(px: number) {
  return pxToRem(px, 10)
}
export function pxToRem12(px: number) {
  return pxToRem(px, 12)
}
export function pxToRem16(px: number) {
  return pxToRem(px, 16)
}
export function pxToRem24(px: number) {
  return pxToRem(px, 24)
}
