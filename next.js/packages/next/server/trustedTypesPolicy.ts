import TrustedTypes from 'trusted-types'

const rules = {
  createHTML: (input) => input,
  createURL: (input) => input,
}

let trustedTypesPolicy = rules
if (typeof TrustedTypes !== 'undefined' && TrustedTypes.createPolicy) {
  trustedTypesPolicy = TrustedTypes.createPolicy('nextjs-server', rules)
} else {
  console.warn('Trusted types are not available!')
}

export default trustedTypesPolicy