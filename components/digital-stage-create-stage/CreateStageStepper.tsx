import React from 'react';
import clsx from 'clsx';
import { Stepper, Step, StepLabel, StepConnector, StepIconProps, makeStyles, Theme, createStyles, withStyles, Grid } from '@material-ui/core';
import Button from '../base/Button';
import Icon from '../base/Icon';
// import ButtonStyled from '../../Components/Form/Button';
// import Icons from '../../Components/Icons/Icons';
// import { CreateStageSuccessStep } from './CreateStageFinalStep';
// import { SelectPresetStep } from './SelectPresetStep';
// import { AddInformatinStep } from './AddInformatinStep';
// import { InviteUsersStep } from './InviteUsersStep';
// import { AssignRolesStep } from './AssignRolesStep';
// import { CreateStageStep } from './CreateStageStep';
// import { useCreateStage } from '../../hooks/useCreateStage';


const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 22,
    },
    active: {
        '& $line': {
            backgroundImage:
                'linear-gradient(to right, #472B51, #81254E, #B61E4A)',
        },
    },
    completed: {
        '& $line': {
            backgroundImage:
                'linear-gradient(to right, #472B51, #81254E, #B61E4A)',
        },
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: '#777777',
        borderRadius: 1,
    },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
    root: {
        backgroundColor: '#777777',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    active: {
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        '&.icon1': {
            backgroundColor: "#5D2950 !important"
        },
        '&.icon2': {
            backgroundColor: "#472B51"
        },
        '&.icon3': {
            backgroundColor: "#81254E"
        },
        '&.icon4': {
            backgroundColor: "#B61E4A"
        },
        '&.icon5': {
            backgroundColor: "#DD1947"
        },
    },
    completed: {
        '&.icon1': {
            backgroundColor: "#5D2950 !important"
        },
        '&.icon2': {
            backgroundColor: "#472B51"
        },
        '&.icon3': {
            backgroundColor: "#81254E"
        },
        '&.icon4': {
            backgroundColor: "#B61E4A"
        },
        '&.icon5': {
            backgroundColor: "#DD1947"
        },
    },
});

function ColorlibStepIcon(props: StepIconProps) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    const icons: { [index: string]: React.ReactElement } = {
        1: <Icon name="edit" iconColor="#fff" />,
        2: <Icon name="group-preset" iconColor="#fff" />,
        3: <Icon name="add-users" iconColor="#fff" />,
        4: <Icon name="assign-roles" width={32} height={32} iconColor="#fff" />,
        5: <Icon name="check" iconColor="#fff" />,
    };

    return (

        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed,
            }, `icon${props.icon}`)}
        >
            {icons[String(props.icon)]}
        </div>
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            '& .MuiPaper-root': {
                backgroundColor: "transparent",
            },
            '& .MuiStepLabel-label': {
                color: "#777777"
            },
            '& .MuiStepLabel-label.MuiStepLabel-active, .MuiStepLabel-label.MuiStepLabel-completed': {
                color: "#fff"
            },
            '& .MuiStepper-root': {
                padding: "0px"
            }
        },
        button: {
            marginRight: theme.spacing(2),
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            color: "#fff",
            textAlign: "center",
            maxHeight: "53vh",
            overflowY: "auto"
        }
    }),
);

function getSteps() {
    return ['Add information', 'Select preset', 'Invite users', 'Assign roles', 'Create stage'];
}


export default function CustomizedSteppers() {
    const classes = useStyles();
    // const { resetCreateStageDialog } = useCreateStage();
    const [activeStep, setActiveStep] = React.useState(0);
    const [error, setError] = React.useState<boolean>(false);
    const [emptyField, setEmptyField] = React.useState<string>("");
    const steps = getSteps();

    const handleEmptyField = (field: string) => setEmptyField(field)

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return "Add information"
            // <AddInformatinStep
            //     emptyField={handleEmptyField}
            //     error={error} />;
            case 1:
                return "Select preset"
            // <SelectPresetStep />;
            case 2:
                return "Invite users"
            // <InviteUsersStep />;
            case 3:
                return "add role"
            // <AssignRolesStep />;
            case 4:
                return "create stgae"
            // <CreateStageStep />;
            default:
                return 'Unknown step';
        }
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const checkStep = () => {
        if (emptyField.length > 0) {
            handleNext()
            setError(false)
        }
        else {
            setError(true)
        }
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        // resetCreateStageDialog()
    };

    return (
        <div className={classes.root}>
            <Stepper
                alternativeLabel={true}
                activeStep={activeStep}
                connector={<ColorlibConnector />}
            >
                {steps.map((label, i) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                {activeStep === steps.length ? (
                    <Grid container justify="center">
                        {/* <CreateStageSuccessStep /> */}
                        <Button
                            color="light"
                            text="Close"
                            type="submit"
                            onClick={handleReset}
                        />
                        <Button
                            color="primary"
                            text="Start stage"
                            type="submit"
                        />
                    </Grid>
                ) : (
                        <div>
                            <div
                                className={[classes.instructions, 'step-content'].join(' ')}>
                                {getStepContent(activeStep)}
                            </div>
                            <Grid container justify="center">
                                {activeStep > 0 && <Button
                                    color="light"
                                    text="Back"
                                    type="submit"
                                    // disabled={activeStep === 0}
                                    onClick={handleBack}
                                />}
                                <Button
                                    color="primary"
                                    text={activeStep === steps.length - 1 ? 'Send invitation' : 'Next'}
                                    type="submit"
                                    // onClick={checkStep}
                                    onClick={handleNext}
                                />
                            </Grid>
                        </div>
                    )}
            </div>
        </div>
    );
}
