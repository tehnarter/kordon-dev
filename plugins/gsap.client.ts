import { gsap } from "gsap"
import { ScrollTrigger, ScrollToPlugin, CustomEase } from "gsap/all"

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase)

  CustomEase.create("default-ease", "0.24, 1, 0.36, 1")
})
