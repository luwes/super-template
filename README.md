# Super Template

Build-less template inheritance in the browser. Handy for example or demo pages. 

## Usage ([Codesandbox](https://codesandbox.io/s/super-template-8n3ci9]))

- `<!doctype html>` is required in the child template because it's not
  possible to dynamically change the doctype of a loaded HTML file.
- The `link[rel=preload]` ensures the base html files are fetched in parallel 
  with the script file. It's optional but recommended for faster page loads.

### layout.html

```html
<template block="head">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</template>

<main>
  <header>header</header>
  <template block="content"></template>
  <footer>footer</footer>
</main>
```

### index.html

```html
<!doctype html>

<script type="module" src="https://cdn.jsdelivr.net/npm/super-template"></script>
<link rel="preload" href="./layout.html" as="fetch" crossorigin>

<title>Super Template Demo</title>

<template extends="./layout.html">
  <template block="head">
    {{super}}
    <script type="module" src="https://cdn.jsdelivr.net/npm/media-chrome/+esm"></script>
  </template>

  <template block="content">
    <h1>Super Template</h1>
    <p>Build-less template inheritance in the browser. Handy for example or demo pages.</p>
  </template>
</template>
```

## Related

- [Template Extensions](https://github.com/luwes/template-extensions)
