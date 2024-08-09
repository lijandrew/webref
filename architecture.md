# Architecture

The easiest way to explain how the app works is probably to walk through an example of a typical use case. Here's a breakdown of what happens when the user uploads images, rearranges and resizes them, and pans and zooms to get a closer look.

### 1. User uploads images

- When the user uploads an image, we create a URL for it and add the URL to `refMap`, a Map in global state. Deleting an image is as simple as removing its entry (and revoking the URL to allow GC).
    - `refMap` maps each URL to a `RefData` object containing its `x`, `y`, `width`, and `height`.
    - **`refMap` is the core of how we work with reference images. Anything that does anything to a reference image reads and/or modifies `refMap`.**
- Each render, the `Canvas` component loops through `refMap` and renders a `RefImage` component for each entry, passing in `url`, `x`, `y`, `width`, and `height` to tell the `RefImage` where/how to render.
- See `useState.ts`, `RefImage.tsx`, `Canvas.tsx`.

### 2. User rearranges and resizes images

- `RefImage` uses `Rnd` from `react-rnd` for dragging and resizing.
- On each drag and resize, we push up the changes to keep the global `refMap` in sync.
- In other words, each `RefImage` *pulls* updates from `refMap` initially on render but also *pushes* updates when its `Rnd` is "directly" manipulated by the user's mouse.
    - This two-way syncing allows `RefImage`s to be moved either:
        - Directly (when the user directly drags or resizes that specific `RefImage`)
        - Indirectly (when an update to its entry in `refMap` causes it to re-render)
    - Two-way syncing enables multi-selection operations (e.g. dragging three selected images at once) by updating the `refMap` entries of all selected images, manipulating them "indirectly".
    - This syncing is also necessary because components like `Selection` rely on the globally-accessible `refMap` for the up-to-date positions and sizes of `RefImage` components.
- There is complex mouse event logic to differentiate intents (e.g. "Is this `mousedown` the start of a drag or an attempt to select the image?") that is probably best understood by reading the code, specifically `RefImage.tsx`'s top comment and mouse handler functions.
- See `useState.ts`, `RefImage.tsx`, `Selection.tsx`

### 3. User zooms and pans

- Zooming and panning is done by CSS transformations in `Canvas.tsx`.
- These transformations are applied to `transformWrapper` in `Canvas`, which contains all `RefImage` components and anything that should respond to panning and zooming.
- We apply the transforms to `transformWrapper` rather than the `Canvas` div itself so that `Canvas` can remain fullscreen and clickable for functionality like context menu and deselect.
- Luckily, `Rnd` continues to work when outside the bounds of its parent element (`transformWrapper` in this case), effectively allowing for an infinite canvas.
- See `Canvas.tsx`

### Summary

- The app's core functionality essentially revolves around the zustand global store.
    - Anything involving reference images goes through `refMap` or its helper functions.
    - The global store also contains other widely-used state information, such as a Set tracking which reference images are selected. See comments in `useStore.ts` for more.
    - Everything else, like mouse event logic, file handling, dragging/resizing, UI, etc., is handled by the components themselves.
