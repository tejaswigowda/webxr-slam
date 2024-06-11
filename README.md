# webxr-slam

This is a simple command line tool. It generates a web server that can be connected to any mobile device. Using the WebXR capabilities of the device, the position and orientation of the device are sent to the server. This server then broadcasts this information over websockets to any connected clients. The clients can then use this information to render a 3D model in the same position and orientation as the device. Applications include AR, VR, and SLAM.

## Installation

```bash
[sudo] npm install -g webxr-slam
```

## Usage

```bash
webxr-slam [port]
```

## Example

```bash
webxr-slam 8080
```

## Online Demo
[https://tejaswigowda.com/webxr-slam/](https://tejaswigowda.com/webxr-slam/).

## Known issues

Only works on android devices. WebXR is not supported on iOS devices.

Please add the url to the trusted sites in the browser settings to allow the camera to be accessed. In chrome it is [chrome://flags/#unsafely-treat-insecure-origin-as-secure](chrome://flags/#unsafely-treat-insecure-origin-as-secure).