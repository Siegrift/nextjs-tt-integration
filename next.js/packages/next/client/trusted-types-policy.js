const rules = {
  createHTML: (input) => input,
  createScriptURL: (input) => input,
}

let trustedTypesPolicy = rules
if (typeof TrustedTypes !== 'undefined' && TrustedTypes.createPolicy) {
  trustedTypesPolicy = TrustedTypes.createPolicy('nextjs-client', rules)
}

console.log('TT called')
export default trustedTypesPolicy
