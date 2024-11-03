// Needs plugin plugins/viewport.client.ts to be interactive

export function useViewport() {
  const viewports = {
    mobile: 375,
    desktop: 1024,
  } as const

  type ViewportName = keyof typeof viewports

  const viewportName = useState<ViewportName>("viewport-name", () => "desktop")
  const viewportSize = useState<number>(
    "viewport-size",
    () => viewports["desktop"]
  )

  const isDesktop = computed(() => {
    return viewportName.value === "desktop"
  })
  const isMobile = computed(() => {
    return viewportName.value === "mobile"
  })

  function getViewportSizeByName(name: ViewportName) {
    return viewports[name]
  }

  return {
    viewports,
    name: viewportName,
    size: viewportSize,
    isDesktop,
    isMobile,
    getViewportSizeByName,
  }
}
