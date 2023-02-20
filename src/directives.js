export * from 'template-extensions';

export const directives = {};

export class Directive {}

export function defineDirective(name, DirectiveClass) {
  directives[name] ||= DirectiveClass;
}
