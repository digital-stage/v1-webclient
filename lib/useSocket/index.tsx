import React, {useEffect, useState} from "react";
import {useAuth} from "../useAuth";
import io from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:4000";

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
            const socketIO: SocketIOClient.Socket = io(ENDPOINT, {
                transports: ['websocket'],
                secure: process.env.NODE_ENV !== "development",
                query: {
                    token: token
                }
            });
            setSocket(socketIO);
        }
    }, [token]);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
};