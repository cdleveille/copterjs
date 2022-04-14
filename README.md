# copterjs

Modern remake of the classic addicting flash game.

## Local Setup

Install prerequisites:

-   [Node.js](https://nodejs.org/en/download/)
-   [Docker Desktop](https://www.docker.com/products/docker-desktop) (plus [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-manual) if on Windows)
-   [Visual Studio Code](https://code.visualstudio.com/download)
-   [Yarn](https://classic.yarnpkg.com/en/) (`npm i -g yarn`)

Also recommended (for database-related development only):

-   [Azure Data Studio](https://azure.microsoft.com/en-us/services/developer-tools/data-studio/) (plus [PostgreSQL extension](https://docs.microsoft.com/en-us/sql/azure-data-studio/extensions/postgres-extension?view=sql-server-ver15))

Set up environment:

-   Clone repo and open root folder in VS Code.
-   Install recommended VS Code extensions `Docker`, `ESLint`, `Prettier`, `EditorConfig`, and `TypeScript Import Sorter`.
-   Run `yarn` to install package dependencies.
-   Create and populate a `.env` file in the root folder based on the `.env.example` file.
    -   If you want to play locally without a high scores database, set the `USE_DB` environment variable to `false` and skip the "Set up database" instructions below.

Set up database (only needed if `USE_DB=true` in .env file):

-   Open Docker Desktop and leave it running in the background.
-   Run `docker network create helicopter-dev-network` to create the Docker network.
-   In VS Code, right-click on `helicopter-dev-container\docker-compose.yml` and select `Compose Up`.
-   Run `yarn db:up` to execute the default database migration checked into source control.
    -   If schema changes are subsequently made, run `yarn db:create` to generate a new migration and `yarn db:up` to execute it.

Launch:

-   Run `yarn dev` to concurrently run the server via ts-node-dev and the client via webpack in watch mode, which will cause either to automatically restart whenever a change is made to any of their respective source code files. The client will be accessible on [localhost:3000](http://localhost:3000).
-   Alternatively, start the "`debug`" launch configuration in VS Code (press `F5`), which essentially runs `yarn dev` with the degugger attached to the server.
