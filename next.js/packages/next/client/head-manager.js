import trustedTypesPolicy from './trusted-types-policy'

const DOMAttributeNames = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv'
}

export default class HeadManager {
  constructor () {
    this.updatePromise = null
  }

  updateHead = head => {
    const promise = (this.updatePromise = Promise.resolve().then(() => {
      if (promise !== this.updatePromise) return

      this.updatePromise = null
      this.doUpdateHead(head)
    }))
  }

  doUpdateHead (head) {
    const tags = {}
    head.forEach(h => {
      const components = tags[h.type] || []
      components.push(h)
      tags[h.type] = components
    })

    this.updateTitle(tags.title ? tags.title[0] : null)

    const types = ['meta', 'base', 'link', 'style', 'script']
    types.forEach(type => {
      this.updateElements(type, tags[type] || [])
    })
  }

  updateTitle (component) {
    let title = ''
    if (component) {
      const { children } = component.props
      title = typeof children === 'string' ? children : children.join('')
    }
    if (title !== document.title) document.title = title
  }

  updateElements (type, components) {
    const headEl = document.getElementsByTagName('head')[0]
    const oldTags = Array.prototype.slice.call(
      headEl.querySelectorAll(type + '.next-head')
    )
    const newTags = components.map(reactElementToDOM).filter(newTag => {
      for (let i = 0, len = oldTags.length; i < len; i++) {
        const oldTag = oldTags[i]
        if (oldTag.isEqualNode(newTag)) {
          oldTags.splice(i, 1)
          return false
        }
      }
      return true
    })

    oldTags.forEach(t => t.parentNode.removeChild(t))
    newTags.forEach(t => headEl.appendChild(t))
  }
}

function reactElementToDOM ({ type, props }) {
  const el = document.createElement(type)
  for (const p in props) {
    if (!props.hasOwnProperty(p)) continue
    if (p === 'children' || p === 'dangerouslySetInnerHTML') continue

    const attr = DOMAttributeNames[p] || p.toLowerCase()
    console.log('TODO: sanitize setAttribute. Passed attribute: ', p)
    el.setAttribute(attr, props[p])
  }

  const { children, dangerouslySetInnerHTML } = props
  if (dangerouslySetInnerHTML) {
    // console.log('TT_TODO: Set to trusted', el, dangerouslySetInnerHTML.__html)
    el.innerHTML = trustedTypesPolicy.createHTML(dangerouslySetInnerHTML.__html || '')
  } else if (children) {
    // console.log("TT_TODO: set text content as TT")
    el.textContent = typeof children === 'string' ? children : children.join('')
  }
  return el
}
