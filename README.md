🎨 https://lijandrew.github.io/webref/

# Table of contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [To-do](#to-do)
4. [Changelog](#changelog)

## Introduction

Browser-based infinite canvas reference board inspired by PureRef.  
Great for those unable/unwilling to install apps (Chromebooks, managed computers, personal preference).

## Features

- WIP!
- Zoomable, pannable, infinite canvas
- Move and resize images
- Keyboard shortcuts
- Supports GIFs!
- Convenient ways to open images
    - Drag and drop from websites
    - ![drop-url](https://github.com/user-attachments/assets/3ad98dd1-f48a-41e7-a66e-ff128df278ff)
    - Paste from clipboard
    - ![paste](https://github.com/user-attachments/assets/31abb83a-ca4c-4cf3-a468-4056481345b0)
    - Drag and drop from files
    - ![drop-file](https://github.com/user-attachments/assets/e3b11d5d-836a-4cf1-a9fd-6acf8395319e)

## To-do

- selection resizing
- button to arrange images optimally
- prevent selection outline and corner handles from scaling with zoom. how? any way to set fixed px width despite parent scaling?
- undo/redo - keep stack of "Action" objects - undo function takes in Action and undoes it based on Action type using Action data
- save useStore state in browser storage using `zustand` persist
    - IndexedDB - how to store blobs?
    - Map serializing can be handled with superjson, but what about storing the blobs? IndexedDB looks like the solution, but it seems complicated.
- touch support
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
- more in-depth architecture.md

## Changelog

- hold shift when dragging selection box on canvas to add to selection
- drag select
- add image at cursor world position on drop. for other methods (file browser, paste), insert at center of viewport.
- center image on point of upload
- make scroll zoom relative to mouse position (added anvanka/panzoom)
- Added app architecture explanation markdown file
- infinite canvas, pan, and zoom! turns out Rnds play well even when moved outside bounds of parent. achieved by simply putting canvas contents in a transform wrapper and applying translate and scale to the wrapper.
- Changed refImage img maxWidth to width to fix image size limit
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
