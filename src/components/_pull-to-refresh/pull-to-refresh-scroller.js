import BaseScroller from '../_utils/scroller'
import { css, on } from '../_utils'
import { runAndCleanUp } from '../../animation/run-transition'
import { enumRefreshStatus, transitionCls } from './constant'

export class PullToRefreshScroller extends BaseScroller {
  constructor () {
    super()
    this.initializeState(0)
    this.setSize(0, 0)
  }

  bindEvents (containerEl, contentEl) {
    let inScrolling = false
    on(containerEl, 'scroll', (e) => {
      inScrolling = e.target.scrollTop !== 0
    })

    const touchstart = (e) => {
      if (!inScrolling) {
        this.onTouchStart(e.touches, Date.now())
        contentEl.classList.remove(transitionCls)
      }
    }
    const touchmove = (e) => {
      !inScrolling && this.onTouchMove(e.touches, Date.now())
    }
    const touchend = (e) => {
      if (!inScrolling) {
        this.onTouchEnd(e.touches, Date.now())
        contentEl.classList.add(transitionCls)
      }
    }
    const events = {
      touchstart,
      touchmove,
      touchend,
      touchcancel: touchend
    }

    for (let eventName in events) {
      on(contentEl, eventName, events[eventName])
    }

    return this
  }

  /**
   * @typedef {Object} Props
   * @prop {number} distance
   * @prop {string} refreshStatus
   * @prop {(status: string) => any} updateRefreshStatus
   * @prop {(finish: () => void) => void} onRefresh
   *
   * @param {HTMLElement} contentEl
   * @param {Props} props
   * @param {{distance: number, refreshStatus: string}} oldProps
   */
  update (contentEl, props, oldProps) {
    if (props.distance !== oldProps.distance ||
      props.refreshStatus !== oldProps.refreshStatus
    ) {
      this.setCallback((translate, isMove) => {
        const isActivate = translate > props.distance
        const newRefresh = this._getNewRefresh(isMove, isActivate)
        const newTranslate = isMove
          ? translate
          : this._getNewTranslate(isActivate, props.distance)

        if (newTranslate !== translate) {
          this.updateTranslate(newTranslate)
        }

        render(contentEl, newTranslate)

        if (newRefresh !== props.refreshStatus) {
          props.updateRefreshStatus(newRefresh)
          if (newRefresh === enumRefreshStatus.release) {
            const finish = this._getFinish(contentEl, props)
            props.onRefresh(finish)
          }
        }
      })
    }
  }

  _getNewTranslate (isActivate, distance) {
    return isActivate ? distance : 0
  }

  _getNewRefresh (isMove, isActivate) {
    return isActivate
      ? isMove ? enumRefreshStatus.activate : enumRefreshStatus.release
      : enumRefreshStatus.deactivate
  }

  _getFinish (contentEl, props) {
    return () => {
      runAndCleanUp(
        contentEl,
        () => {
          props.updateRefreshStatus(enumRefreshStatus.finish)
          window.requestAnimationFrame(() => {
            render(contentEl, 0)
            this.updateTranslate(0)
          })
        },
        () => {
          props.updateRefreshStatus(enumRefreshStatus.deactivate)
        }
      )
    }
  }
}

function render (content, translate) {
  const value = `translate3d(0, ${translate}px, 0)`
  css(content, {
    transform: value,
    webkitTransform: value,
    MozTransform: value
  })
}
