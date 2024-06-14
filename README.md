# [Conjurer](https://canopyconjurer.vercel.app)

Conjurer is a web app that allows one to design audiovisual experiences for the [Canopy of Luminous Conjury](https://se.cretfi.re/canopy/), a large LED art piece by [The Servants of the Secret Fire](https://se.cretfi.re/).

![Conjurer screenshot](public/example.png)

## Overview

You can think of Conjurer as an in-browser Digital Audio Visual Workstation, similar to the concept of a [Digital Audio Workstation (DAW)](https://en.wikipedia.org/wiki/Digital_audio_workstation). Whereas a DAW is used to arrange and produce audio compositions, Conjurer aims to provide the ability to arrange audio and visuals into an "experience" which can be saved and played at a later time.

## Concepts

- Pattern
  - A fragment shader that generates a texture (an image) based purely on parameters (uniforms)
  - This texture can either be rendered directly to the canopy or passed to an effect
- Effect
  - A fragment shader that accepts a texture and applies an effect based purely on parameters, outputting a new texture
  - Just like a pattern, this texture can either be rendered directly to the canopy or passed to an effect
  - Note: Identical to patterns, except that effects accept a texture as an input
- Parameter
  - This is a value that tweaks what is being generated by a pattern/effect
  - "Color", "Fuzziness", "Radius" for example
- Parameter variations
  - Changes over time applied to a pattern/effect parameter
  - "Change the color from blue to green over 5 seconds"

## Developing

We manage dependencies with `yarn`.

```bash
# install dependencies
yarn

# run the app with hot reloading on save
yarn dev
```

Open the app locally by visiting http://localhost:3000.

### Tips

- In this repo, patterns/effects at their core are just fragment shaders. They may seem scary at first, but with a proper introduction like in [The Book of Shaders](https://thebookofshaders.com/), you too could wield their considerable power!
- [The shaders page](docs/shaders.md) contains more useful links for learning about shaders.
- See the [How to make a pattern page](docs/patterns.md) if you are interested in creating a pattern or effect of your own!
- We use [Chakra](https://chakra-ui.com/) for our UI in this repo. Check out the [available components here](https://chakra-ui.com/docs/components) as well as the [default theme](https://chakra-ui.com/docs/styled-system/theme)
- We use [MobX](https://github.com/mobxjs/mobx) for state management. It's not Redux!
- We use [ThreeJS](https://threejs.org/) and [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) to render the shaders/3D canopy.
- We use [`react-icons`](https://react-icons.github.io/react-icons/search). Just search for what you want and import the icon from the correct place using the 2-letter prefix.
- We use [`recharts`](https://recharts.org/en-US/api) to do some simple graphs.
- We use [`wavesurfer.js`](https://wavesurfer-js.org/) for all of our audio needs.

### Scripts

#### `yarn generatePattern PatternName`

Generates boilerplate for a new pattern called PatternName. Choose your own unique PatternName. It prints out the filepaths it writes, including the fragment shader and typescript pattern definition.

#### `yarn controllerServer`

Starts the server that passes messages between conjurer and conjurer controllers.

#### `yarn generateCanopy`

Generates canopy geometry data and stores it in `src/data/canopyGeometry.json`.

#### `yarn unityTestServer`

Starts a websocket server at port 8080 on localhost. For development use only, to mock the websocket server that the Unity app would run. Writes `src/scripts/output.png` once per second.

#### `yarn downloadCloudAssets`

Downloads all of the experience and audio files from s3 into the folder `public/cloud-assets`. Conjurer can then read from these files when in "local asset mode", useful for situations when internet is not available. See section below for more details.

### Preparing to run Conjurer without internet access

In order to run Conjurer without internet access, such as at a festival, you can follow these below steps.

1. Clone this repository as usual.
1. Ensure you are using node 18: `nvm use 18` if you use nvm.
1. Run `yarn` as usual to install dependencies.
1. Run `yarn downloadCloudAssets` to download all cloud assets into the folder `public/cloud-assets`. Note that you are getting a snapshot of all of the experiences and audio files. If you make more changes to these cloud saved files, you will have to rerun this script to download the latest changed assets.
1. Run `yarn build`.
1. Run `yarn dev` as usual to run the app with hot reloading, or `yarn start` to run the production build.
1. Visit the locally running app at http://localhost:3000.
1. Toggle the `Use local assets` button on such that it is orange:

![Use local assets button](public/use-local-assets-button.png)

9. Reload the page.

You are good to go! From now on, you should not need internet access for any functionality. Whenever you open an experience or audio file, it will be loaded from the `public/cloud-assets` directory, and whenever you save an experience file, it will be saved locally into that same directory.

You can toggle the same button again to return to opening/saving files to the cloud. Just be careful of potentially overwriting the wrong thing.

### Setting up Conjurer Playground to run via Controller

1. Find your local IP address, and set `CONTROLLER_SERVER_WEBSOCKET_HOST` (`websocketHost.ts`) to that address.
1. Run `yarn dev`, or `yarn build && yarn start`.
1. Run `yarn controllerServer`.
1. Open http://localhost:3000/playground.
1. On any device on the network, visit http://<IP_ADDRESS>:3000/controller.

You are good to go - when you change things with the controller, you should see the playground page update.

## Todos

To dos are captured in the [wiki](https://github.com/SotSF/conjurer/wiki), and occasionally are captured as issues.

## Contributing

Please do! This is a group effort, and any help is welcome.
