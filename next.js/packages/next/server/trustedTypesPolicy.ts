import TrustedTypes from 'trusted-types'

const rules = {
  createHTML: (input) => input,
  createURL: (input) => input,
}

if (global.trustedTypesPolicy === undefined) {
  global.trustedTypesPolicy = rules
  if (typeof TrustedTypes !== 'undefined' && TrustedTypes.createPolicy) {
    global.trustedTypesPolicy = TrustedTypes.createPolicy('nextjs-server', rules)
  } else {
    console.warn('Trusted types are not available!')
  }
}

export default global.trustedTypesPolicy
