# copterjs

Modern remake of the classic addicting flash game.

Play on fly.io: [copterjs.fly.dev](https://copterjs.fly.dev)

![screenshot](https://user-images.githubusercontent.com/1410481/163531396-d0a021b6-2a70-44d7-ada4-60f716c775b8.png)

## Technologies

-   [Node.js](https://nodejs.org/en/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [HTML5 Canvas](https://www.w3schools.com/html/html5_canvas.asp)
-   [Webpack](https://webpack.js.org/)
-   [Babel](https://babeljs.io/)
-   [Socket.IO](https://socket.io/)
-   [Express](http://expressjs.com/)
-   [Mongoose](https://mongoosejs.com/)
-   [MongoDB](https://www.mongodb.com/)

## Local Setup

Install prerequisites:

-   [Node.js](https://nodejs.org/en/download/)
-   [Visual Studio Code](https://code.visualstudio.com/download)
-   [Yarn](https://classic.yarnpkg.com/en/) (`npm i -g yarn`)

Optional (for database-related development only):

-   [Docker Desktop](https://www.docker.com/products/docker-desktop) (plus [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-manual) if on Windows)
-   [Docker VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)

Set up dev environment:

-   Clone repo and open root folder in VS Code.
-   Install recommended VS Code extensions to conform to project linting/formatting config:
    -   [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    -   [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
    -   [EditorConfig](https://marketplace.visualstudio.com/items?itemName=editorconfig.editorconfig)
    -   [TypeScript Import Sorter](https://marketplace.visualstudio.com/items?itemName=mike-co.import-sorter)
-   Run `yarn` in the terminal to install package dependencies.
-   Create and populate a `.env` file in the root folder based on the `.env.example` file, which contains default environment variable values for a dev environment.
-   Optionally switch the `USE_DB` environment variable to `false` and skip the "Set up dev database" instructions below if there is no need for a dev database.

Set up dev database (only required if `USE_DB=true` in the `.env` file):

-   Open Docker Desktop and leave it running in the background.
-   In VS Code, right-click on `/.copterjs-dev-container/docker-compose.yml` and select `Compose Up`.

Launch:

-   Run `yarn dev` to concurrently run the server via ts-node-dev and the client via webpack in watch mode. This will cause either to automatically restart whenever a change is made to any of their respective source code files. The client will be accessible on [localhost:3000](http://localhost:3000).
-   Alternatively, start the `debug` launch configuration in VS Code (press `F5`), which essentially runs `yarn dev` with the VS Code debugger attached to the server. The client can be debugged in the browser developer tools via source maps.
