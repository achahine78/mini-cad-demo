# mini-cad-demo

Minimal CAD-style 3D editor built with React + TS and Three.js. The point of this project is to give myself a playground to explore both the CAD problem space and 3D in the browser.

![Demo of spawning, moving, and rotating parts in mini-cad-demo](media/herogif.gif)

## Features

- **Parts creation** — Users can create a set of predefined parts: rectangular extrusion, flat plate, and cylindrical extrusion.
- **Selection & highlighting** — Clicking on a part selects it.
- **Drag to move** — You can drag parts across the grid.
- **Rotation** — You can press <kbd>R</kbd> to rotate the selected part in 90° steps around the vertical axis.

## Project structure

```
src/
  App.tsx                      # Wires sidebar + viewport, handles part spawning
  components/
    Sidebar.tsx                # Parts catalog UI
    Viewport.tsx               # Mounts the three.js scene into React
  three/
    SceneManager.ts            # Scene, camera, renderer, controls, render loop
    InteractionManager.ts      # Picking, selection, drag, rotate
    PartsFactory.ts            # Parts catalog data + mesh creation
    grid.ts                    # Grid snapping helper
```

## Build Instructions

```sh
npm install
npm run dev
```

Other scripts: `npm run build` (typecheck + production build), `npm run lint`, `npm run preview`.

## TODO

- [ ] **Delete parts** — Add functionality that allows users to delete parts
- [ ] **Collision detection** — Add functionality that prevents overlaps
- [ ] **Edit parts dimensions** — Let the user change the dimensions of a selected part
- [ ] **Custom Parts via Assembly** — Let the user create composite parts via assembly
