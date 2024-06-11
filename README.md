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