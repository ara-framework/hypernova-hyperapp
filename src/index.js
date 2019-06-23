/* eslint-disable import/prefer-default-export */
import 'raf/polyfill';

import hypernova, { serialize, load } from 'hypernova';
import { h, app } from 'hyperapp';
import { renderToString } from 'hyperapp-render';

export const renderHyperapp = (name, Component) => hypernova({
  server() {
    return async (props) => {
      let view;
      let newProps = props;
      if (typeof Component === 'function') {
        view = h(Component, props);
      } else {
        if (Component.nova) {
          const { beforeCreate } = Component.nova;
          if (beforeCreate) {
            newProps = await beforeCreate(props);
          }
        }

        const state = Component.init(newProps);
        view = h(Component.view, state);
      }
      const html = renderToString(view);
      return serialize(name, html, newProps);
    };
  },

  client() {
    const payloads = load(name);
    if (payloads) {
      payloads.forEach(async (payload) => {
        const { node, data } = payload;

        if (typeof Component === 'function') {
          app({
            view: () => h(Component, data),
            node,
          });
        } else {
          let newProps = data;
          if (Component.nova) {
            const { beforeCreate } = Component.nova;
            if (beforeCreate) {
              newProps = await beforeCreate(data);
            }
          }

          app({
            init: () => Component.init(newProps),
            view: Component.view,
            node,
          });
        }
      });
    }

    return Component;
  },
});
