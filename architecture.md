# Architecture

The easiest way to explain how the app works is probably to walk through an example of a typical use case. Here's a breakdown of what happens when the user uploads images, rearranges and resizes them, and pans and zooms to get a closer look.

### Uploading and deleting images

- When the user uploads an image, we create a URL for it and add the URL to `refMap`, a Map in global state. Deleting an image is as simple as removing its entry (and revoking the URL to allow GC).
- `refMap` maps each URL to a `RefData` object containing its `x`, `y`, `width`, and `height`.
- Anything involving reference images goes through `refMap` or its helper functions.
- Each render, the `Canvas` component loops through `refMap` and renders a `RefImage` component for each entry, passing it its `url` and leaving it to the `RefImage` to look up its own `RefData` in `refMap` to figure out where/how to render.
- See `useState.ts`, `RefImage.tsx`, `Canvas.tsx`.

### Moving and resizing images

- `RefImage` uses `Rnd` from `react-rnd` for dragging and resizing.
- On each drag and resize, we push up the changes to keep the global `refMap` in sync.
- In other words, each `RefImage` *pulls* updates from `refMap` initially on render but also *pushes* updates when its `Rnd` is "directly" manipulated by the user's mouse.
- This two-way syncing allows `RefImage`s to be moved either:
    - Directly (when the user directly drags or resizes that specific `RefImage`)
    - Indirectly (when an update to its entry in `refMap` causes it to re-render)
- Two-way syncing also enables multi-image operations (e.g. dragging three selected images at once) by updating the `refMap` entries of all selected images, manipulating them "indirectly".
- See `useState.ts`, `RefImage.tsx`.

### Selections

- There is complex mouse event logic on `RefImage` to differentiate intents (e.g. "Is this `mousedown` the start of a drag or an attempt to select the image?") that is probably best understood by reading the code, specifically `RefImage.tsx`'s top comment and mouse handler functions.
- `Canvas` allows the user to drag a selection box that will select images it collides with.

### Zooming and panning

- Zooming and panning is achieved using `anvaka/panzoom`.
- Panzoom is applied to `transformWrapper` in `Canvas`, which contains all `RefImage` components and anything that should respond to panning and zooming.
- We apply the transforms to `transformWrapper` rather than the `Canvas` div itself so that `Canvas` can remain fullscreen and clickable for functionality like context menu and deselect.
- Luckily, `Rnd` continues to work when outside the bounds of its parent element (`transformWrapper` in this case), effectively allowing for an infinite canvas.
- An instance of the `PanZoom` object is kept in the global store.
    - The PanZoom instance is primarily for use in `getWorldPosition`, a store helper function that converts screen coordinates into world coordinates (accounting for pan and zoom).
    - When absolute screen coordinates `!=` world coordinates due to zooming and panning, `getWorldPosition` becomes necessary for coordinate-based operations, such as:
        - Adding new images at the cursor position
        - Calculating selection box collisions with RefImages
- See `useStore.ts`, `Canvas.tsx`.
