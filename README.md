# dialoghighlight

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### LOG
Day1. 
  Start up project,
  learn basic components,layout,
  get a general render layout of the app including audio player and subtitle lines below it (still render as discrete line object)
  making upload file functional,
  get the audio player working, 
  try to use real-time tracking of audio player to match its currentTime with the timestamp of the subtitle json, the tracking interval misses alot and is very inconsistent
  try to match current working with dicrete dialog objects parsed from json by reIndexing the whole timestamp and calaculate to find where to highlight by mapping from current timestamp to current display dialog line
Day2.
  can't make real-time tracking of audio player work because of inconsistent fire interval and hardwave factor,
  change idea to run subtitle independently using it own timestamp instead with currentTime tracking only use to calculate where to continue highlighting,
  joinning the whole dialog to 1 single string with html elements for display instead of displaying discrete lines
  make highlight function that style specific "word" and timeout to fire it in the right time
  some adjustment to the calculation of when and how long one word is highlighted
  run test with decent result
  uploading to github, writting README
