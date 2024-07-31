## idea

Browser-based reference board (like PureRef) for people who don't want to or can't install apps (e.g. Chromebooks/managed computers/personal preference).

## to-do

- [ ] multi select manipulation - delete and re-add into temporary Rnd? temoprary Rnd DOES NOT WORK. 
- [ ] drag select
    - [ ] detect drag start and drag end on canvas, on drag move update selection box. will this work in FF?
    - [ ] loop through all RefImages and test if intersects selection box using x/y/width/height 
    - [ ] mass delete, just loop through urls
    - [ ] mass move and resize, move selected Rnds into transparent wrapper Rnd?
- [ ] Centralize utilities into a lib? For example, all file/upload related utilities into one neat function, etc.
- [ ] arrange images optimally
- [ ] undo/redo - keep stack of "Action" objects - undo function takes in Action and undoes it based on Action type using Action data
- [ ] save useRefStore state in browser storage using `zustand` persist
    - Map serializing can be handled with superjson, but what about storing the blobs? IndexedDB looks like the solution, but it seems complicated.
- [ ] pan and zoom canvas
    - what if used middle click/scroll to control css transform modifiers on Canvas?
    - idk how we'd do infinite canvas, but we'd at least give the ability to zoom and pan around
    - maybe we can just make the canvas really big. Like make the pixel dimensions huge. 
    - I don't think we can modify Canvas size on the fly because Rnd uses it to measure offset

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
