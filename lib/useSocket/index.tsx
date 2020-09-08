import React, {useEffect, useState} from "react";
import {useAuth} from "../useAuth";
import io from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:4000";

export interface SocketProps {
    socket: SocketIOClient.Socket | undefined;
}

const SocketContext = React.createContext<SocketProps>({
    socket: undefined
});

export const useSocket = (): SocketProps => React.useContext<SocketProps>(SocketContext);

export const SocketContextProvider = (props: {
    children: React.ReactNode
}) => {
    const {token} = useAuth();
    const [socket, setSocket] = useState<SocketIOClient.Socket>();

    useEffect(() => {
        if (token) {
            console.log("on server or client?");

            setSocket(io(ENDPOINT, {
                transports: ['websocket'],
                secure: process.env.NODE_ENV !== "development",
                query: {
                    token: token,
                    device: JSON.stringify({
                        name: "Browser",
                        canVideo: true,
                        canAudio: true,
                        sendAudio: true,
                        sendVideo: false
                    })
                }
            }));
        }
    }, [token]);

    return (
        <SocketContext.Provider value={{
            socket: socket
        }}>
            {props.children}
        </SocketContext.Provider>
    );
};