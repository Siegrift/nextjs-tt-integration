const noop = (i) => i
const rules = {
  createHTML: noop,
  createURL: noop,
}

let appPolicy
let withTrustedTypes = true

export const getPolicy = () => {
  if (!process.browser) {
    if (global.APP_SSR_POLICY) appPolicy = global.APP_SSR_POLICY
    else {
      appPolicy = global.TrustedTypes.createPolicy('app-ssr-policy', rules)
      global.APP_SSR_POLICY = appPolicy
    }
  }

  if (withTrustedTypes && appPolicy === undefined) {
    appPolicy = window.TrustedTypes.createPolicy('app-policy', rules)
  }

  if (withTrustedTypes) return appPolicy
  else return rules
}
export const togglePolicy = (useTT) => {
  withTrustedTypes = useTT
}
