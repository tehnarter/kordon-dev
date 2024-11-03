// Needs a composable composables/useViewport.ts

export default defineNuxtPlugin(() => {
  const { size: viewportSize, name: viewportName, viewports } = useViewport()

  function setSizes() {
    viewportSize.value = window.innerWidth
    viewportName.value =
      window.innerWidth >= viewports["desktop"] ? "desktop" : "mobile"
  }

  setSizes()

  window.addEventListener("resize", setSizes)
})
