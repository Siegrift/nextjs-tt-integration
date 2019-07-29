import 'trusted-types'

const rules = {
  createHTML: (input) => input,
  createURL: (input) => input,
}

console.log('Na serveri', process.browser)

// TT_TODO this is also called on client (when navigating to non-existent page)
if (global.trustedTypesPolicy === undefined) {
  global.trustedTypesPolicy = rules
  if (typeof global.TrustedTypes !== 'undefined' && global.TrustedTypes.createPolicy) {
    console.log('VYKONAM SA NA SERVERI', global)
    global.trustedTypesPolicy = global.TrustedTypes.createPolicy('nextjs-server', rules)
  } else {
    console.warn('Trusted types are not available!')
  }
}

export default global.trustedTypesPolicy
