import { TemplateInstance, Directive, defineDirective } from '../directives.js';

export class BlockDirective extends Directive {

  async update(part, state, processor) {

    if (state.collected) {
      const blockTp = state.blocks[part.expression];
      if (blockTp) {
        state.super = new TemplateInstance(part.template, state, processor);
        const blockTi = new TemplateInstance(blockTp, state, processor);
        delete state.super;
        part.replace(blockTi);
      } else {
        part.replace(new TemplateInstance(part.template, state, processor));
      }
      return;
    }

    if (state.blocks) {
      state.blocks[part.expression] = part.template;
      return;
    }
  }
}

defineDirective('block', BlockDirective);
