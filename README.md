## idea

Browser-based reference board (like PureRef) for people who don't want to or can't install apps (e.g. Chromebooks/managed computers/personal preference).

## to-do

- [ ] CMD/CTRL + A select all keyboard shortcut
- [ ] drag select
    - [ ] detect drag start and drag end on canvas, on drag move update selection box. will this work in FF?
    - [ ] loop through all RefImages and test if intersects selection box using x/y/width/height 
- [ ] selection resizing
- [ ] Big cleanup and refactor
- [ ] arrange images optimally
- [ ] undo/redo - keep stack of "Action" objects - undo function takes in Action and undoes it based on Action type using Action data
- [ ] save useRefStore state in browser storage using `zustand` persist
    - Map serializing can be handled with superjson, but what about storing the blobs? IndexedDB looks like the solution, but it seems complicated.
- [ ] pan and zoom canvas
    - Use middle click/scroll to control css transform modifiers on Canvas?
    - Idk how we would achieve infinite canvas, but we can at least give the ability to zoom and pan on a finite canvas
    - We can't modify Canvas size because Rnd measures its parent

## for kluo

- [ ] export into zip (image files + JSON describing x,y,width,height)
    - We use the React.js Javascript library with the Next.js React Framework
    - https://react.dev/ - React.js tutorial
    - https://nextjs.org/ - Next.js tutorial. Next just helps with React development. You don't have to "learn" Next.
    - Possible steps:
        1. Make a ExportButton.tsx component (refer to UploadButton.tsx)
        2. Use the `useStore` global state management hook to access refMap
        3. Loop through the values of refMap, which have now been updated to contain all the data you need (x, y, width, height)
        4. I added JSZip to the project. https://stuk.github.io/jszip/ You can use this to zip the files.
- [ ] import from archive

## done

- [x] Fixed drop zone disappearing when dragging over child element (e.g. RefImage)
- [x] Nice card animation for drag and drop
- [x] Splash screen prompt to Browse files or drag and drop
- [x] select all button
- [x] fine-tune mouse event logic
- [x] shift click select
- [x] support for dragging in image links from other browser windows
- [x] css animation for drop prompt when dragging over with file
- [x] manual fullscreen drag n drop upload with fixes to allow for cancelling by dragging away
- [x] fix RefImage having un-updated height before interaction by calculating and updating height in img.onload
- [x] add debug tools
- [x] RefImages now update/sync position and size with store's refMap, surfacing those values for zip export
- [x] refactor to not keep JSX in store but rather RefData objects
- [x] context menu ui polish
- [x] selection handles
- [x] delete and paste using keyboard
- [x] add image by pasting
- [x] context menu
- [x] delete image
- [x] move and resize images
- [x] add image by uploading file
