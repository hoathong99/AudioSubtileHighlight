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

# Project Progress  

## Day 1  
- Started the project  
- Learned basic components and layout  
- Designed the general render layout, including an audio player and subtitle lines (still rendered as discrete line objects)  
- Implemented file upload functionality  
- Got the audio player working  
- Attempted real-time tracking of the audio player to match `currentTime` with subtitle JSON timestamps  
  - Tracking interval was inconsistent and missed a lot  
- Tried matching subtitles with discrete dialog objects by reindexing timestamps  
  - Calculated mappings from the current timestamp to the displayed dialog line for highlighting  

## Day 2  
- Could not achieve reliable real-time tracking due to inconsistent intervals and hardware limitations  
- Switched to running subtitles independently using their own timestamps  
  - `currentTime` tracking now only determines where to continue highlighting  
- Joined the entire dialog into a single string with HTML elements instead of discrete lines  
- Implemented a highlight function to style specific words  
  - Used timeouts to trigger highlights at the correct time  
- Adjusted calculations for timing and duration of word highlights  
- Ran tests with decent results  
- Uploaded the project to GitHub and wrote the README  

[Demo Video](https://youtu.be/JxYszUOaXmU)  
