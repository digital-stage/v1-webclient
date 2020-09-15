import React, {useEffect, useState} from "react";
import io from "socket.io-client";
import {useAuth} from "../useAuth";
import {API_URL} from "../../env";

const SocketContext = React.createContext<SocketIOClient.Socket>(undefined);

export const useSocket = (): SocketIOClient.Socket => React.useContext<SocketIOClient.Socket>(SocketContext);

export const SocketContextProvider = (props: {
    children: React.ReactNode
}) => {
    const {token} = useAuth();
    const [socket, setSocket] = useState<SocketIOClient.Socket>(null);

    useEffect(() => {
        if (token) {
            console.log("TOKEN");
            if (!socket) {
                const socketIO: SocketIOClient.Socket = io(API_URL, {
                    transports: ['websocket'],
                    secure: process.env.NODE_ENV !== "development",
                    query: {
                        token: token
                    },
                    reconnection: false
                });
                socketIO.on("disconnect", () => {
                    setSocket(undefined);
                });
                setSocket(socketIO);
            }
        }
    }, [token, socket]);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
};