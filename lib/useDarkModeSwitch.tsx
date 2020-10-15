import React, {useEffect, useState} from "react";
import {useSelector} from "./digitalstage/useStageContext/redux";
import {NormalizedState} from "./digitalstage/useStageContext/schema";

const DarkModeContext = React.createContext<boolean>(false);

export const useDarkModeSwitch = () => React.useContext(DarkModeContext);

export const DarkModeConsumer = DarkModeContext.Consumer;

export const DarkModeProvider = (props: {
    children: React.ReactNode
}) => {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const stageId = useSelector<NormalizedState, string | undefined>(state => state.stageId);

    useEffect(() => {
        setDarkMode(stageId !== undefined);
    }, [stageId]);

    return (
        <DarkModeContext.Provider value={darkMode}>
            {props.children}
        </DarkModeContext.Provider>
    )
};

export const withDarkMode = (Component) => {
    const WithDarkMode = (props) => {
        const darkMode = useDarkModeSwitch();
        return (
            <Component darkMode={darkMode} {...props} />
        )
    };
    return WithDarkMode;
};
