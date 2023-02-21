import { TemplateInstance, AttrPart, InnerTemplatePart, directives } from './directives.js';

// Enable these directives by default.
import './directives/extends.js';
import './directives/block.js';

export const processor = {
  processCallback(instance, parts, state) {
    if (!state) return;
    for (const [expression, part] of parts) {

      if (part instanceof InnerTemplatePart) {
        if (!part.directive) {
          // Transform short-hand if/partial attributes to directive & expression.
          const directive = Object.keys(directives).find((n) => part.template.hasAttribute(n));
          if (directive) {
            part.directive = directive;
            part.expression = part.template.getAttribute(directive);
          }
        }
        const Directive = directives[part.directive];
        if (Directive) {
          const directive = new Directive();
          directive.update(part, state, processor);
        }
        continue;
      }

      if (expression in state) {
        const value = state[expression];
        // boolean attr
        if (
          typeof value === 'boolean' &&
          part instanceof AttrPart &&
          typeof part.element[part.attributeName] === 'boolean'
        ) {
          part.booleanValue = value;
        } else if (typeof value === 'function' && part instanceof AttrPart) {
          part.value = undefined;
          part.element[part.attributeName] = value;
        } else {
          part.value = value;
        }
      }

    }
  },
};

const observer = new MutationObserver((mutationsList) => {
  for (let mutation of mutationsList) {
    mutation.addedNodes.forEach(checkTemplate);
  }
});

observer.observe(document, {
  childList: true,
  subtree: true,
});

document.querySelectorAll('template').forEach(checkTemplate);

function checkTemplate(tpl) {
  if (tpl.localName != 'template') return;

  const directive = Object.keys(directives).find((n) => tpl.hasAttribute(n));

  if (tpl.hasAttribute('directive') || directive) {
    observer.disconnect();

    const template = document.createElement('template');
    template.content.append(tpl.cloneNode(true));

    const instance = new TemplateInstance(template, {}, processor);
    tpl.replaceWith(instance);
  }
}
