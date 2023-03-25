import { TemplateInstance, Directive, defineDirective } from '../directives.js';

export class ExtendsDirective extends Directive {

  async update(part, state, processor) {

    try {
      const src = part.expression;
      const data = await request(src);
      const layoutDoc = new DOMParser().parseFromString(data, 'text/html');

      // Move all template[extends] to the body
      for (let node of [...layoutDoc.head.childNodes]) {
        if (node.localName === 'template' && node.getAttribute('extends')) {
          layoutDoc.body.prepend(node);
        }
      }

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

      document.head.append(layoutHeadTi);

      await Promise.all(renderBlockingPromises);

      // Copy html/head/body attributes from base to super if not set
      for (let type of ['documentElement', 'head', 'body']) {
        for (let attr of layoutDoc[type]?.attributes ?? []) {
          if (!document[type].hasAttribute(attr.name)) {
            document[type].setAttribute(attr.name, attr.value);
          }
        }
      }

      const layoutBodyTp = document.createElement('template');
      layoutBodyTp.content.append(...layoutDoc.body.childNodes);
      const layoutBodyTi = new TemplateInstance(layoutBodyTp, state, processor);

      // First extract all scripts from the layout body otherwise they will be 
      // executed when the layout body is appended to the document before the
      // custom elements are upgraded.
      let scripts = layoutBodyTi.querySelectorAll('script');
      let newScripts = [...scripts].map(script => script.cloneNode(true));
      scripts.forEach(script => (script.textContent = ''));

      part.replace(layoutBodyTi);

      scripts.forEach(script => script.replaceWith(newScripts.shift()));

    } catch (error) {
      console.error(error);
    }
  }
}

defineDirective('extends', ExtendsDirective);


async function request(resource) {

  const response = await fetch(resource, {
    credentials: 'same-origin'
  });

  if (response.status !== 200) {
    throw new Error(`Failed to load resource: the server responded with a status of ${response.status}`);
  }

  return response.text();
}
