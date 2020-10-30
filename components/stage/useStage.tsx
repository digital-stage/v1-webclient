import React, {
    useState,
    useContext,
    createContext,
    useEffect
} from "react";
import { Stage } from "../../lib/digitalstage/common/model.server";

export interface AdvancedSettings {
    width: number,
    length: number,
    height: number,
    absorption: number,
    damping: number
}

export interface Info {
    name?: string,
    password?: string
}

export interface InfoLength {
    name?: number,
    password?: number
}

export interface Error {
    name?: boolean,
}

interface IStage {
    stage: any,
    info: Info,
    valueLength: InfoLength,
    handleSetStage(stage: any): void,
    handleInfoChange(e: React.ChangeEvent<HTMLInputElement>): void,
    error: Error,
    setError(e: Error): void,
    advancedSettings: AdvancedSettings,
    handleAdvancedSettingsChange(e: React.ChangeEvent<HTMLInputElement>): void,
    reset(): void,
    handleSetContext(context: "edit" | "new"): void,
    context: "edit" | "new"
}
const stageContext = createContext<IStage>(undefined!);

export function ProvideStage({ children }: any) {
    const Stage: IStage = useProvideStage();
    return <stageContext.Provider value={Stage}>{children}</stageContext.Provider>;
}

export const useStage = () => {
    return useContext(stageContext);
};

function useProvideStage() {
    const [stage, setStage] = useState<Stage>();
    const [info, setInfo] = useState<Info>({ name: "", password: "" })
    const [valueLength, setValueLength] = React.useState<InfoLength>({ name: 0, password: 0 })
    const [error, setError] = React.useState<Error>({});
    const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({ width: 25, length: 13, height: 7.5, absorption: 0.7, damping: 0.6 })
    const [context, setContext] = React.useState<"edit" | "new">();

    const handleSetContext = (context) => {
        setContext(context)
    }

    const reset = () => {
        setInfo({ name: "", password: "" })
        setValueLength({ name: 0, password: 0 })
        setError({})
    }

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInfo(state => ({ ...state, [e.target.name]: e.target.value }))
        setValueLength(state => ({ ...state, [e.target.name]: e.target.value.length }))
        setError({})
    }

    const handleAdvancedSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdvancedSettings(state => ({ ...state, [e.target.name]: e.target.value }))
        setValueLength(state => ({ ...state, [e.target.name]: e.target.value.length }))
    }

    const handleSetStage = (stage: Stage) => {
        setStage(stage)
    }

    useEffect(() => {
        if (context === "new") {
            setInfo({ name: "", password: "" })
        }
        if (stage && context === "edit") {
            setInfo({ name: stage.name, password: stage.password })
            setValueLength({ name: stage.name.length, password: stage.password.length })
        }
    }, [context, stage])

    return {
        stage,
        info,
        valueLength,
        error,
        advancedSettings,
        context,
        handleSetStage,
        handleInfoChange,
        setError,
        handleAdvancedSettingsChange,
        reset,
        handleSetContext
    };
}
