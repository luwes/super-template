# Template Extends

Build-less template inheritance in the browser. Handy for example or demo pages. 

### layout.html

```html
<template block="head">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</template>

<main>
  <header>header</header>

  <template block="content">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </template>

  <footer>footer</footer>
</main>
```

### index.html

```html
<!doctype html>

<script type="module" src="https://cdn.jsdelivr.net/npm/template-extends"></script>
<link rel="preload" as="fetch" href="./layout.html" crossorigin>

<title>template-extends demo</title>

<body>

<template extends="./layout.html">
  <template block="head">
    {{super}}
    <script type="module" src="https://cdn.jsdelivr.net/npm/media-chrome/+esm"></script>
  </template>

  <template block="content">
    <h1>My blog post title</h1>
    <p>{{super}}</p>
  </template>
</template>
```

## Related

- [Template Extensions](https://github.com/luwes/template-extensions)
