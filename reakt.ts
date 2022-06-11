// type Component = ReturnType<typeof h>
document.body.style.fontFamily = '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"'
document.body.style.backgroundColor = '#0d1117'
document.body.style.color = '#c9d1d9'
document.body.style.padding = '10px'
document.body.innerHTML = `
<style>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40%, 1fr));
  grid-gap: 1rem;
}
.grid > div {
  min-height: 40vh;
}
</style>
<h1>Welcome to poor man's react</h1>
<div style="height: 90vh">
  <div class="grid">
    <div id="one" style="border: 5px solid red"></div><div id="two" style="border: 5px solid blue"></div>
    <div id="three" style="border: 5px solid green"></div><div id="four" style="border: 5px solid yellow"></div>
  </div>
</div>
`

var DEBUG = false

function Item({ text = null, ...props}) {
  return h('div', {
    children: text ? [text] : []
  })
}

function List({ items, ...props }) {
  return h('div', {
    children: items.map(item => h('Item', { text: item }))
  })
}

function App() {
  const items = ['hi', 'folks', 'sup']
  return h('List', { items })
}

function _getComponent(element) {
  if (typeof element === 'string') {
    return document.createTextNode(element)
  }
  
  const { name } = element
  const primitives = new Set(['div', 'span', 'p'])

  if (primitives.has(name)) {
    const el = document.createElement(name)
    return el
  }

  return window[name]
}

function h(name, props = {}) {
  return { name, props: { children: [], ...props }, __component: true }
}

function _generate(element) {
  DEBUG && console.log(element)
  try {
    const component = _getComponent(element)
    
    let rendered = component
    
    if (typeof component === 'function') {
      rendered = _generate(component(element.props))
    }
    
    // element doesn't have props if it's a text component
    // maybe model text as another component?
    const children = (element.props?.children || []).map(_generate)
    
    rendered.append?.(...children)
    
    return rendered
  
  } catch (e) {
    console.log('failed at', element)
    throw e
  }
}

function render(rootNode, rootComponent) {
  // TODO: enter render loop, rather than just render once
  rootNode.innerHTML = ''
  rootNode.append(_generate(rootComponent))
}

console.log(render(document.querySelector('#one'), h('Item')))
console.log(render(document.querySelector('#two'), h('Item', { text: 'suppppp ' })))
console.log(render(document.querySelector('#three'), App()))
console.log(render(document.querySelector('#four'), h('div', { children: ['hi'] })))

// document.body.innerHTML = "<div id='one'></div><div id='two'></div><div id='three'></div><div id='four'></div>"