import {useCallback, useEffect, useState} from "react";
import {useSocket} from "../useSocket";
import Client from "../useSocket/model.client";


const useStage = () => {
    const {socket} = useSocket();
    const [stage, setStage] = useState<Client.Stage>();
    const [stages, setStages] = useState<Client.StagePrototype[]>([]);

    useEffect(() => {
        if (socket) {
            socket.on("stage-ready", (stage: Client.Stage) => {
                console.log("stage-ready");
                setStage(stage);
            });
            socket.on("stage-left", () => {
                console.log("stage-left");
                setStage(null);
            });
            socket.on("stage-joined", (stage: Client.Stage) => {
                console.log("stage-joined");
                setStage(stage);
            });
            socket.on("stage-added", (stage: Client.StagePrototype) => {
                console.log("stage-added");
                console.log(stage);
                setStages(prevState => [...prevState, stage]);
            })
            socket.on("stage-removed", (id: string) => {
                console.log("stage-removed");
                setStages(prevState => prevState.filter(s => s._id.toString() !== id));
            })
            console.log("Finished");
        }
    }, [socket])


    const createStage = useCallback((name: string, password: string) => {
        if (socket) {
            socket.emit("add-stage", {
                name: name,
                password: password
            });
        }
    }, [socket]);

    const joinStage = useCallback((stageId: string, groupId: string, password: string) => {
        if (socket) {
            const payload = {
                stageId: stageId,
                groupId: groupId,
                password: password || undefined
            }
            console.log(payload);
            socket.emit("join-stage", payload);
        }
    }, [socket]);

    const leaveStage = useCallback(() => {
        if (socket) {
            socket.emit("leave-stage");
        }
    }, [socket]);

    const updateStage = useCallback((id: string, stage: Partial<Omit<Omit<Omit<Client.StagePrototype, "_id">, "groups">, "admins">>) => {
        if (socket) {
            socket.emit("update-stage", {
                id: id,
                stage: stage
            });
        }
    }, [socket]);

    const deleteStage = useCallback((id: string) => {
        if (socket) {
            socket.emit("remove-stage", id);
        }
    }, [socket]);


    return {stage, createStage, joinStage, leaveStage, updateStage, deleteStage, stages};
}

export default useStage