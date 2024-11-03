type Options = {
  min?: number
  max?: number
}
export function validateStringByLength(value: string, options: Options = {}) {
  const { min = 0, max = 20 } = options

  return value.length >= min && value.length <= max
}
