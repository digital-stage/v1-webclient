import FlexContainer from "../components/theme/FlexContainer";
import React, { useEffect, useState } from "react";
import { useAuth } from "../lib/digitalstage/useAuth";
import Loading from "../components/theme/Loading";
import { DisplayMedium } from "baseui/typography";
import Login from "./account/login";
import { useRouter } from "next/router";
import VerticalSlider from "../components/digital-stage-ui/VerticalSlider";
import PanControler from "../components/digital-stage-ui/PanControl";
import SwitchButton from "../components/digital-stage-ui/SwitchButton";
import useStageSelector from "../lib/digitalstage/useStageSelector";

const mixers = ["Guitar", "Strings", "Bass", "Cello"]

const Mixer = () => {
    const router = useRouter();
    const { loading, user } = useAuth();
    const { current } = useStageSelector(state => ({
        current: state.current
    }));
    const [initialized, setInitialized] = useState<boolean>();

    const [value, setValue] = React.useState<number>(5)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, newValue: number | number[]) => {
        setValue(value as number)
    }

    useEffect(() => {
        if (initialized) {
            if (current) {
                router.push("/");
            }
        }
    }, [current]);

    useEffect(() => {
        if (router.pathname === "/mixer") {
            setInitialized(true);
        }
    }, [router.pathname]);

    if (!loading) {
        if (!user) {
            return <Login />
        } else {
            return (
                <>
                    <FlexContainer>
                        <PanControler />
                        <PanControler />
                        <PanControler />
                        <PanControler />
                    </FlexContainer>
                    <FlexContainer>
                        <SwitchButton />
                        <SwitchButton />
                        <SwitchButton />
                        <SwitchButton />
                    </FlexContainer>
                    <FlexContainer> {mixers.map(mixer => {
                        return <div>
                            <VerticalSlider
                                text={mixer}
                                defaultValue={value}
                                max={10}
                                min={0}
                                step={1}
                                handleChange={handleChange}
                            /></div>
                    })}
                    </FlexContainer>
                </>
            );
        }
    }

    return <Loading>
        <DisplayMedium>Lade ...</DisplayMedium>
    </Loading>;
}
export default Mixer;