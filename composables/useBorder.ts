type BorderData = {
  key: string
  labelfun: () => string
  label: string
}

export const useBorder = () =>
  useState<BorderData | null>("selectedBorder", () => null)
