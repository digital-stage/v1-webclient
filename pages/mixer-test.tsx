import FlexContainer from "../components/complex/depreacted/theme/layout/FlexContainer";
import React, { useEffect, useState } from "react";
import { useAuth } from "../lib/digitalstage/useAuth";
import Loading from "../components/complex/depreacted/theme/Loading";
import { DisplayMedium } from "baseui/typography";
import Login from "./account/login";
import { useRouter } from "next/router";
import VerticalSlider from "../components/base/VerticalSlider";
import PanControler from "../components/base/PanControl";
import SwitchButton from "../components/base/SwitchButton";
import useStageSelector from "../lib/digitalstage/useStageSelector";

const mixers = ["Guitar", "Strings", "Bass", "Cello"]

const MixerTest = () => {
    const router = useRouter();
    const { loading, user } = useAuth();
    const stageId = useStageSelector<string | undefined>(state => state.stageId);
    const [initialized, setInitialized] = useState<boolean>();

    const [value, setValue] = React.useState<number>(5)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, newValue: number | number[]) => {
        setValue(value as number)
    }

    useEffect(() => {
        if (initialized) {
            if (stageId) {
                router.push("/");
            }
        }
    }, [stageId]);

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
export default MixerTest;