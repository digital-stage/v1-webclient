# Digital Stage Web Client Service

This service implementation provides the React web frontend for the Digital Stage platform once running.


## Tech stack
This service is based on next.js and generates part static and part server-side rendered pages.
We are using an event-driven socket.io API for the client server communication and Redux for the storage of a normalized state.
Currently we are heavily depending on baseweb components, but are replacing them step for step with own designed components.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Current dockerization
Currently a dockerization of all services is planned and on it's way.

## Learn More

### Good resources or tutorials

- [Next.js documentation](https://nextjs.org/docs) -  learn about Next.js
- [Next.js and Redux](https://github.com/vercel/next.js/tree/canary/examples/with-redux) - reference implementation using redux inside the Next.js environment
- [Mediasoup client documentation](https://mediasoup.org/documentation/v3/mediasoup-client/api/) - learn about the WebRTC / SFU implementation

#### For later
- [Capture a MediaStream From a Canvas, Video or Audio Element](https://developers.google.com/web/updates/2016/10/capture-stream) - Capture MediaStream from canvas (for implementing streaming to video platforms later) - we used this tutorial to implement the video inside canvas component (VideoCanvasPlayer.tsx)


Visit [http://www.digital-stage.org](http://www.digital-stage.org)

