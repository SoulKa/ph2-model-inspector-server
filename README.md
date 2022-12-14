# PH2 Model Inspector

<img src="https://github.com/SoulKa/ph2-model-inspector-docs/blob/main/screenshots/model-browser.png?raw=true" width="800">

The Perfect Heist 2 Model Inspector is a tool to inspect FBX 3D-Models and copy them into custom PH2 maps.

**Features:**
- Selection of a custom map to work on
- Automatic detection of FBX Models in a given directory
- Interactive representation of any FBX model
- Automatic detection of textures
- Option to set textures manually for models or whole directories
- Minimalistic design
- Copy FBX models into a custom PH2 map with just one click

## Download and Usage

Check out the [docs](https://soulka.github.io/ph2-model-inspector-docs)

## About this repository

The source code in this repository is a local NodeJS server instance to copy and inspect custom 3D objects for the Perfect Heist 2 level editor. The source code for the UI can be found in this [repository](https://github.com/SoulKa/ph2-model-inspector-client).

## How to run

### Option 1: With precompiled Windows executable

Go to the [latest release](https://github.com/SoulKa/ph2-model-inspector-server/releases/latest) from the [server repository](https://github.com/SoulKa/ph2-model-inspector-server) and download `PH2.Model.Inspector.exe`. This executable is built with [nexe](https://github.com/nexe/nexe) and includes all dependencies.

### Option 2: Run optimized source code directly

1. Go to the [latest release](https://github.com/SoulKa/ph2-model-inspector-server/releases/latest) from the [server repository](https://github.com/SoulKa/ph2-model-inspector-server) and download `build.zip`.
2. Extract the ZIP to a desired location
3. Open a [Node.js](https://nodejs.org/) terminal in the extracted directory and run `node .`

### Option 3: Run server source directly with prebuilt webUI

1. Clone the [server repository](https://github.com/SoulKa/ph2-model-inspector-server). Open a [Node.js](https://nodejs.org/) terminal inside the server directory, then execute `npm i` and `npm run dev`. The server API can be reached under `http://localhost:8080/api`
2. Download the `build.zip` from the [latest release](https://github.com/SoulKa/ph2-model-inspector-client/releases/latest) of the webUI
3. Extract the ZIP and place it under `/public` in the server directory. The webUI is now available under [http://localhost:8080](http://localhost:8080)

### Option 4: Run server and React webUI manually

1. Clone the [server repository](https://github.com/SoulKa/ph2-model-inspector-server). Open a [Node.js](https://nodejs.org/) terminal inside the server directory, then execute `npm i` and `npm run dev`. The server API can be reached under `http://localhost:8080/api`
2. Clone the [webUI repository](https://github.com/SoulKa/ph2-model-inspector-client). Then run `npm i` and `npm start` in it

## Prerequisits

### Option 1: With precompiled Windows executable
**None**. The executable includes a Node.js binary, as well as the server code and the compiled webUI. It does not need any installation, just run it

### Option 2-4: Running manually
You need to install [Node.js](https://nodejs.org/) with npm.

## Contributing

This project is completely open-source, so it can be used and modified by anyone who finds it useful. If you find any bugs or want new features, feel free to [open an issue](https://github.com/SoulKa/ph2-model-inspector-server/issues/new). I made this project for fun in my free time, if you want to contribute features or bug fixes, please open a pull-request.