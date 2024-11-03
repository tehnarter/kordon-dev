export function isVideo(src: string = "") {
  return /\.(mp4|avi|mov|mpeg|webm)/.test(src)
}
