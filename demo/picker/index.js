/* eslint-disable no-unused-vars */
import { h, app } from 'hyperapp'
import Page from '../../src/components/page'
import ContentBlock from '../../src/components/content-block'
import List from '../../src/components/list'
import InputItem from '../../src/components/input-item'
import PickerModal from '../../src/components/picker/picker-modal'
import PickerView from '../../src/components/picker/picker-view'

const pickerItem = (label, value) => {
  return { label, value }
}

const mocker = {
  range (start, end) {
    let ranges = []
    for (let i = start; i <= end; i++) {
      ranges.push(i)
    }
    return ranges
  },

  mons () {
    return mocker.range(1, 12).map(m => pickerItem(`${m}月`, m))
  },

  dates (mon) {
    const a = [4, 6, 9, 11]
    const b = 2
    const maper = (date) => {
      return pickerItem(`${date}日`, date)
    }

    if (a.indexOf(mon) > -1) {
      return mocker.range(1, 30).map(maper)
    } else if (mon === b) {
      return mocker.range(1, 28).map(maper)
    } else {
      return mocker.range(1, 31).map(maper)
    }
  },

  cascadeDate () {
    return mocker.mons().map(({ value, label }) => {
      return {
        label,
        value,
        children: mocker.dates(value)
      }
    })
  },

  data () {
    return mocker.range(1, 12).map(m => pickerItem(`${m} mon`, m))
  }
}

const singleColumn = mocker.data()
const cascadeColumn = mocker.cascadeDate()

app(
  {
    date: '5 18',
    picker: {
      show: false,
      data: cascadeColumn,
      values: [5, 18]
    }
  },
  {
    picker: {
      open: () => {
        return {
          show: true
        }
      },
      close: () => {
        return {
          show: false
        }
      },
      pickerValue: (values) => {
        return { values }
      }
    }
  },
  (state, actions) => {
    window.$picker = { state, actions }

    return (
      <Page>
        <ContentBlock title="Picker" />
        <List>
          <InputItem
            title="Picker-Item"
            value={state.picker.values.join(' - ')}
            onclick={actions.picker.open}
            readonly
            isLink
          />
        </List>
        <PickerModal
          show={state.picker.show}
          right={
            <a class="link" onclick={actions.picker.close}>Done</a>
          }
          close={actions.picker.close}
          pickerItems
        >
          <PickerView
            cascade={state.picker.data.length > 1}
            data={state.picker.data}
            values={state.picker.values}
            onChange={actions.picker.pickerValue}
          />
        </PickerModal>
      </Page>
    )
  },
  document.body
)
