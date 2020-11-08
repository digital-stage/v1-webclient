/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Button, Grid, Heading, Text } from 'theme-ui';
import clsx from 'clsx';
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  StepIconProps,
  makeStyles,
  Theme,
  createStyles,
  withStyles
} from '@material-ui/core';
import Icon from '../base/Icon';
import AddInformatinStep from './AddInformationStep';
import { useStage } from '../stage/useStage';
import AdvancedSettings from './AdvancedSettings';
import useStageActions from '../../lib/digitalstage/useStageActions';
import CreateStageSuccessStep from './CreateStageSuccessStep';

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22
  },
  active: {
    '& $line': {
      backgroundImage: 'linear-gradient(to right, #472B51, #81254E, #B61E4A)'
    }
  },
  completed: {
    '& $line': {
      backgroundImage: 'linear-gradient(to right, #472B51, #81254E, #B61E4A)'
    }
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#777777',
    borderRadius: 1
  }
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
    alignItems: 'center'
  },
  active: {
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    '&.icon1': {
      backgroundColor: '#5D2950 !important'
    },
    '&.icon2': {
      backgroundColor: '#472B51'
    },
    '&.icon3': {
      backgroundColor: '#81254E'
    },
    '&.icon4': {
      backgroundColor: '#B61E4A'
    },
    '&.icon5': {
      backgroundColor: '#DD1947'
    }
  },
  completed: {
    '&.icon1': {
      backgroundColor: '#5D2950 !important'
    },
    '&.icon2': {
      backgroundColor: '#472B51'
    },
    '&.icon3': {
      backgroundColor: '#81254E'
    },
    '&.icon4': {
      backgroundColor: '#B61E4A'
    },
    '&.icon5': {
      backgroundColor: '#DD1947'
    }
  }
});

function ColorlibStepIcon(props: StepIconProps) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <Icon name="edit" iconColor="#fff" />
    // 2: <Icon name="settings" iconColor="#fff" />,
  };

  return (
    <div
      className={clsx(
        classes.root,
        {
          [classes.active]: active,
          [classes.completed]: completed
        },
        `icon${props.icon}`
      )}
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
        backgroundColor: 'transparent'
      },
      '& .MuiStepLabel-label': {
        color: '#777777'
      },
      '& .MuiStepLabel-label.MuiStepLabel-active, .MuiStepLabel-label.MuiStepLabel-completed': {
        color: '#fff'
      },
      '& .MuiStepper-root': {
        padding: '0px'
      }
    },
    button: {
      marginRight: theme.spacing(2)
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      color: '#fff',
      textAlign: 'center',
      // maxHeight: "90vh",
      // overflowY: "auto",
      '&::-webkit-scrollbar': {
        width: '5px',
        backgroundColor: 'transparent'
      },
      '&::-webkit-scrollbar-track': {
        borderRadius: '25px'
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'white',
        borderRadius: '25px'
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'white'
      }
    }
  })
);

function getSteps() {
  return [
    'Add information'
    // 'Advanced settings'
  ];
}

export default function CustomizedSteppers(props: { onClick(): void }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const {
    valueLength,
    setError,
    info,
    advancedSettings,
    error,
    context,
    stage
  } = useStage();
  const steps = getSteps();
  const { createStage, updateStage } = useStageActions();

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <AddInformatinStep />;
      // case 1:
      //     return <AdvancedSettings/>
    }
  }

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const checkStep = () => {
    if (valueLength.name > 0) {
      handleNext();
      setError({ name: false });
    } else {
      setError({ name: true });
    }

    if (activeStep === steps.length - 1 && valueLength.name > 0) {
      if (context === 'new') {
        createStage(
          info.name,
          info.password,
          advancedSettings.width,
          advancedSettings.length,
          advancedSettings.height,
          advancedSettings.damping,
          advancedSettings.absorption
        );
      } else if (context === 'edit') {
        updateStage(stage._id, { ...info, ...advancedSettings });
      }
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
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
            <CreateStageSuccessStep />
            <Button
              color="light"
              text="Close"
              type="submit"
              onClick={props.onClick}
            />
            {/* <Button
                            color="primary"
                            text="Start stage"
                            type="submit"
                        /> */}
          </Grid>
        ) : (
          <div>
            <div className={[classes.instructions, 'step-content'].join(' ')}>
              {getStepContent(activeStep)}
            </div>
            <Grid container justify="center">
              {activeStep > 0 && (
                <Button
                  color="light"
                  text="Back"
                  type="submit"
                  // disabled={activeStep === 0}
                  onClick={handleBack}
                />
              )}

              <Button type="submit" onClick={checkStep}>
                {activeStep === steps.length - 1
                  ? context === 'new'
                    ? 'Create stage'
                    : 'Edit stage'
                  : 'Next'}
              </Button>
            </Grid>
          </div>
        )}
      </div>
    </div>
  );
}
