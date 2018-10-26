import { runEnter, runExit } from './run-transition'

/**
 * @typedef {Object} TransitionProps
 * @prop {string} [enter]
 * @prop {string} [enterActive]
 * @prop {string} [exit]
 * @prop {string} [exitActive]
 * @prop {(el: HTMLElement) => void} [onEntered]
 * @prop {() => { exit: string, exitActive?: string }} [getExitClasses]
 *
 * @param {TransitionProps} props
 * @param {JSX.Element} children
 */
function makeTransition (props, child) {
  if (!child.attributes) {
    return child
  }
  const { attributes, ...rest } = child

  return {
    ...rest,
    attributes: {
      ...attributes,
      oncreate: (el) => {
        transitionEnter(el, props, attributes)
      },
      onremove: (el, done) => {
        transitionExit(el, props, attributes, done)
      }
    }
  }
}

function transitionEnter (el, props, attributes) {
  if (props.enter) {
    runEnter(el, props.enterActive, props.enter, props.onEntered)
  }
  if (attributes.oncreate) {
    attributes.oncreate(el)
  }
}

function transitionExit (el, props, attributes, removeNode) {
  const { exit, exitActive } = (props.getExitClasses ? props.getExitClasses() : props)
  const notAnimated = !exit
  if (exit) {
    runExit(el, exitActive, exit, removeNode)
  }
  if (attributes.onremove) {
    attributes.onremove(el, () => { })
  }
  if (notAnimated) {
    removeNode()
  }
}

export default (props, children) => {
  return children.map(child => {
    if (typeof child === 'function') {
      return (state, actions) => {
        return makeTransition(props, child(state, actions))
      }
    } else {
      return makeTransition(props, child)
    }
  })
}
