/**
 * https://github.com/dojo/widget-core/blob/master/src/animations/cssTransitions.ts
 */

let transitionEndName = ''
let animationEndName = ''

const requestAnimationFrame = window.requestAnimationFrame

function determineNames (element) {
  if ('WebkitTransition' in element.style) {
    transitionEndName = 'webkitTransitionEnd'
    animationEndName = 'webkitAnimationEnd'
  } else if ('transition' in element.style || 'MozTransition' in element.style) {
    transitionEndName = 'transitionend'
    animationEndName = 'animationend'
  } else {
    throw new Error('Your browser is not supported')
  }
}

function initialize (element) {
  if (animationEndName === '') {
    determineNames(element)
  }
}

function runAndCleanUp (element, startAnimation, finishAnimation) {
  initialize(element)

  let finished = false

  let transitionEnd = function () {
    if (!finished) {
      finished = true
      element.removeEventListener(transitionEndName, transitionEnd)
      element.removeEventListener(animationEndName, transitionEnd)

      finishAnimation()
    }
  }

  startAnimation()

  element.addEventListener(animationEndName, transitionEnd)
  element.addEventListener(transitionEndName, transitionEnd)
}

function exit (node, exitAnimationActive, exitAnimation, removeNode) {
  const activeClass = exitAnimationActive || `${exitAnimation}-active`

  runAndCleanUp(
    node,
    () => {
      node.classList.add(exitAnimation)

      requestAnimationFrame(function () {
        node.classList.add(activeClass)
      })
    },
    () => {
      removeNode()
    }
  )
}

function enter (node, enterAnimationActive, enterAnimation) {
  const activeClass = enterAnimationActive || `${enterAnimation}-active`

  runAndCleanUp(
    node,
    () => {
      node.classList.add(enterAnimation)
      // console.log('enter', { phase: 'enter', node, enterAnimation, time: Date.now() })

      requestAnimationFrame(function () {
        node.classList.add(activeClass)
        // console.log('enter', { phase: 'enter-active', node, activeClass, time: Date.now() })
      })
    },
    () => {
      node.classList.remove(enterAnimation)
      node.classList.remove(activeClass)
      // console.log('enter', { phase: 'enter-to', node, enterAnimation, time: Date.now() })
    }
  )
}

export default {
  enter,
  exit
}
