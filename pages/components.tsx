import FlexContainer from "../components/theme/FlexContainer";
import React from "react";
import { useAuth } from "../lib/digitalstage/useAuth";
import Loading from "../components/theme/Loading";
import { DisplayMedium } from "baseui/typography";
import Login from "./account/login";
import Button from "../components/digital-stage-ui/Button";
import SwitchButton from "../components/digital-stage-ui/SwitchButton";
import RadioButton from "../components/digital-stage-ui/RadioButton";
import Checkbox from "../components/digital-stage-ui/Checkbox";
import Slider from "../components/digital-stage-ui/Slider";
import Chip from "../components/digital-stage-ui/Chip";
import TextField from "../components/digital-stage-ui/TextField";
import { Typography } from "@material-ui/core";
import Icon from "../components/digital-stage-ui/Icon";
import Welcome from "../components/digital-stage-sign-in/Welcome";
import LoginIndex from '../components/digital-stage-sign-in'
import Home from "../components/digital-stage-home";



const Components = () => {
    const { loading, user } = useAuth();

    const [deg, setDeg] = React.useState<number>(0)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, newValue: number | number[]) => {
        setDeg(newValue as number)
    }

    if (!loading) {
        if (!user) {
            return <Login />
        } else {
            return (
                <div>
                    {/* <Welcome/> */}
                    {/* <LoginIndex/> */}
                    <Home/>
                    {/* <FlexContainer>
                        <Button color="primary" text="Primary" withIcon iconName="settings" iconColor="white" />
                        <Button color="secondary" text="Seconday" />
                        <Button color="light" text="Light" />
                        <Button color="dark" text="Dark" />
                    </FlexContainer>
                    <FlexContainer>
                        <SwitchButton color="primary" />
                        <SwitchButton color="secondary" />
                        <SwitchButton color="secondary" text="Enable" />
                    </FlexContainer>
                    <FlexContainer>
                        <RadioButton values={[{ value: "radio1" }, { value: "radio2", label: "radio label" }]} />
                    </FlexContainer>
                    <FlexContainer>
                        <Checkbox values={[{ value: "checkbox1" }, { value: "checkbox2", label: "checkbox label" }]}/>
                    </FlexContainer>
                    <FlexContainer>
                        <Slider defaultValue={0} handleChange={handleChange} min={0} max={10} step={1} />
                        <Slider defaultValue={5} handleChange={handleChange} min={0} max={10} step={1} text="Slider label" />
                    </FlexContainer>
                    <FlexContainer>
                        <Chip />
                        <Chip withAvatar />
                        <Chip color="dark" />
                        <Chip color="dark" withAvatar />
                    </FlexContainer>
                    <FlexContainer>
                        <TextField label="Standard" />
                        <TextField error label="Error" />
                        <TextField multiline label="Multiline" maxLength={120} />
                    </FlexContainer>
                    <FlexContainer>
                        <TextField label="Standard" color="light" />
                        <TextField label="Standard" color="light" error />
                    </FlexContainer>
                    <FlexContainer>
                        <Typography variant="h1" color="textPrimary">Heading 1</Typography>
                        <Typography variant="h2" color="textPrimary">Heading 2</Typography>
                        <Typography variant="h3" color="textPrimary">Heading 3</Typography>
                        <Typography variant="h4" color="textPrimary">Heading 4</Typography>
                        <Typography variant="h5" color="textPrimary">Heading 5</Typography>
                        <Typography variant="h6" color="textPrimary">Heading 6</Typography>
                    </FlexContainer>
                    <FlexContainer>
                        <Typography variant="subtitle1" color="textSecondary">Subtitle 1</Typography>
                        <Typography variant="subtitle2" color="textSecondary">Subltitle 2</Typography>
                        <Typography variant="body1" color="textSecondary">Body 1</Typography>
                        <Typography variant="body2" color="textSecondary">Body 2</Typography>
                        <Typography variant="caption" color="textPrimary">Caption</Typography>
                        <Typography variant="overline" color="textPrimary">Overline</Typography>
                    </FlexContainer>
                    <FlexContainer>
                        <Icon name="settings" />
                    </FlexContainer> */}
                </div>
            );
        }
    }

    return <Loading>
        <DisplayMedium>Lade ...</DisplayMedium>
    </Loading>;
}
export default Components;