## idea

Browser-based reference board (like PureRef) for people who don't want to or can't install apps (e.g. Chromebooks/managed computers/personal preference).

## high priority to-do

- pan and zoom infinite canvas
    - panning
        - Use middle click/scroll to control css transform modifiers on Canvas?
        - ?
    - infinite canvas
        - We can't modify Canvas size because Rnd measures its parent...
        - ?

## to-do

- drag select
    - detect drag start and drag end on canvas, on drag move update selection box. will this work in FF?
    - loop through all RefImages and test if intersects selection box using x/y/width/height 
- selection resizing
- arrange images optimally
- undo/redo - keep stack of "Action" objects - undo function takes in Action and undoes it based on Action type using Action data
- save useStore state in browser storage using `zustand` persist
    - Map serializing can be handled with superjson, but what about storing the blobs? IndexedDB looks like the solution, but it seems complicated.
- touch support

## for kluo

- export into zip (image files + JSON describing x,y,width,height)
    - We use the React.js Javascript library with the Next.js React Framework
    - https://react.dev/ - React.js tutorial
    - https://nextjs.org/ - Next.js tutorial. Next just helps with React development. You don't have to "learn" Next.
    - Possible steps:
        1. Make a ExportButton.tsx component (refer to UploadButton.tsx)
        2. Use the `useStore` global state management hook to access refMap
        3. Loop through the values of refMap, which have now been updated to contain all the data you need (x, y, width, height)
        4. I added JSZip to the project. https://stuk.github.io/jszip/ You can use this to zip the files.
- import from archive

## changelog

- Added architecture explanation in useStore
- better debugging panel. wrench icon to toggle console log and debug buttons
- only enable resizing when selected to better mirror PureRef behavior
- reverted back to one single large store because selectUrl needed reference store functions to move the selected RefImage to the top
- CMD/CTRL shortcuts
- Fixed drop zone disappearing when dragging over child element (e.g. RefImage)
- Nice card animation for drag and drop
- Splash screen prompt to Browse files or drag and drop
- select all button
- fine-tune mouse event logic
- shift click select
- support for dragging in image links from other browser windows
- css animation for drop prompt when dragging over with file
- manual fullscreen drag n drop upload with fixes to allow for cancelling by dragging away
- fix RefImage having un-updated height before interaction by calculating and updating height in img.onload
- add debug tools
- RefImages now update/sync position and size with store's refMap, surfacing those values for zip export
- refactor to not keep JSX in store but rather RefData objects
- context menu ui polish
- selection handles
- delete and paste using keyboard
- add image by pasting
- context menu
- delete image
- move and resize images
- add image by uploading file
