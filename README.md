# hypernova-hyperapp  

[Hyperapp](https://github.com/jorgebucaran/hyperapp) bindings for [Hypernova](https://github.com/airbnb/hypernova).

On the server, wraps the component in a function to render it to a HTML string given its props.

On the client, calling this function with your component scans the DOM for any server-side rendered instances of it. It then resumes those components using the server-specified props.

## Install

```sh
npm install hypernova-hyperapp
```

## Stateful components

```js
const Example = ({ items, term }) => (
  <div>
    <strong>{ term }</string>
    <ul>
      {
        items.map(item => (
          <li>{item}</li>
        ))
      }
    </ul>
  </div>
)

export default {
  init: (props) => {
    // init state based on props
    const state = {
      title: props.title
    }

    return state
  },
  nova: {
    beforeCreate: async (props) => {
      const newProps = { ...props }
      if (typeof window === 'undefined') {
        /* fetch content and mutate original props */
        const items = await content.search(props.term)
        newProps.items = items
      }
      return newProps
    }
  },
  view: Example
}
```

## Usage

Here's how to use it in your module:

```js
import { renderHyperapp } from 'hypernova-hyperapp'
import Example from './components/Example'

export default renderHyperapp('Example', Example)
```