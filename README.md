# nextjs-tt-integration

To get this repo working, you have to modify a few things.

Webpack:
1) `cd webpack`
2) `yarn && yarn setup`


React:
1) `cd react`
2) `yarn`
3) `cd packages`
4) uncomment lines in `react/index.js`, `react-dom/index.js` and `react-dom/server.node.js`
5) `yarn build` (it's maybe enough to just `yarn build react/index,react-dom/index,react-dom/server`)
6) comment the lines in `react/index.js`, `react-dom/index.js` and `react-dom/server.node.js` so
you they import the built ones

Nextjs:
1) `cd next.js`
2) `yarn link webpack`
3) `yarn` or `yarn dev`

Example app:
1) `cd example-app`
2) `yarn`
3) `yarn dev`