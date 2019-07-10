const rules = {
  createHTML: (input) => input,
  createScriptURL: (input) => input,
}

let trustedTypesPolicy = rules
if (typeof TrustedTypes !== 'undefined' && TrustedTypes.createPolicy) {
  trustedTypesPolicy = TrustedTypes.createPolicy('nextjs-client', rules)
} else {
  console.warn('Trusted types are not available!')
}

console.log('TT called')
export default trustedTypesPolicy