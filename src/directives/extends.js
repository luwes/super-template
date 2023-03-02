import { TemplateInstance, Directive, defineDirective } from '../directives.js';

export class ExtendsDirective extends Directive {

  async update(part, state, processor) {

    try {
      const src = part.expression;
      const data = await request(src);
      const layoutDoc = new DOMParser().parseFromString(data, 'text/html');

      const layoutHeadTp = document.createElement('template');
      layoutHeadTp.content.append(...layoutDoc.head.childNodes);

      state.collected = false;
      state.blocks ||= {};
      state.blocks[''] = new TemplateInstance(part.template, state, processor);
      state.collected = true;

      const layoutHeadTi = new TemplateInstance(layoutHeadTp, state, processor);

      const stylesheets = [...layoutHeadTi.querySelectorAll('link[rel=stylesheet]')];

      // https://web.dev/critical-rendering-path-render-blocking-css/
      const renderBlockingPromises = stylesheets.map(link =>
        new Promise((resolve, reject) => {
          link.addEventListener('load', resolve);
          link.addEventListener('error', reject);
        })
      );

      document.head.append(...prepareNodes(layoutHeadTi.childNodes));

      await Promise.all(renderBlockingPromises);

      const layoutBodyTp = document.createElement('template');
      layoutBodyTp.content.append(...layoutDoc.body.childNodes);
      const layoutBodyTi = new TemplateInstance(layoutBodyTp, state, processor);

      part.replace(...prepareNodes(layoutBodyTi.childNodes));

    } catch (error) {
      console.error(error);
    }
  }
}

defineDirective('extends', ExtendsDirective);


function prepareNodes(nodes) {
  let n = [];

  for (let node of [...nodes]) {

    if (node.localName === 'script') {
      const script = document.createElement('script');

      for (let a of node.attributes)
        script.setAttribute(a.nodeName, a.nodeValue);

      script.textContent = node.textContent;
      node = script;
    }

    n.push(node);
  }

  return n;
}

async function request(resource) {

  const response = await fetch(resource, {
    credentials: 'same-origin'
  });

  if (response.status !== 200) {
    throw new Error(`Failed to load resource: the server responded with a status of ${response.status}`);
  }

  return response.text();
}
