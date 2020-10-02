import dynamic from "next/dynamic";

const adapter = dynamic(() => import('webrtc-adapter/dist/adapter_core5'), {
    ssr: false
});

export const fixWebRTC = () => {
    adapter;
};
