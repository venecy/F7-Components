/* eslint-disable no-unused-vars */
import { h, app } from 'hyperapp'
import Button from '../../src/components/button'
import Page from '../../src/components/page'
import ContentBlock from '../../src/components/content-block'

const demo = {
  state: {},

  actions: {},

  view: (state, actions) => {
    return (
      <Page>
        <ContentBlock title="USUAL BUTTONS">
          <p><Button>Usual Button 1</Button></p>
          <p><Button>Usual Button 2</Button></p>
          <p><Button disabled>Usual Button Disabled</Button></p>
        </ContentBlock>

        <ContentBlock title="ROUND BUTTONS">
          <p><Button round>Round Button 1</Button></p>
          <p><Button round>Round Button 2</Button></p>
          <p><Button round fill>Round Fill Button</Button></p>
        </ContentBlock>

        <ContentBlock title="FILL BUTTONS">
          <p><Button fill>Fill Button</Button></p>
          <p><Button fill disabled>Fill Button Disabled</Button></p>
          <p><Button fill big>Fill Big Button</Button></p>
        </ContentBlock>

        <ContentBlock title="BIG BUTTONS">
          <p><Button big>Big Button</Button></p>
          <p><Button big round>Big Round Button</Button></p>
          <p><Button big round fill>Big Round Fill Button</Button></p>
        </ContentBlock>
      </Page>
    )
  }
}

app(demo.state, demo.actions, demo.view, document.body)
