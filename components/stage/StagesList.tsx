/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useEffect } from 'react';
import { jsx, Button } from 'theme-ui';
import { Collapse, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { shallowEqual } from 'react-redux';
import CreateStageModal from '../digital-stage-create-stage/CreateStageModal';
import StageCard from './StageCard';
import { useSelector } from '../../lib/digitalstage/useStageContext/redux';
import { Groups, NormalizedState, Stages } from '../../lib/digitalstage/useStageContext/schema';
import { Stage } from '../../lib/digitalstage/common/model.client';
import { useStage } from './useStage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3, 3, 3, 0),
      width: '100%',
    },
    clickable: {
      cursor: 'pointer',
    },
    leftBorder: {
      borderLeft: '4px solid white',
    },
    leftBorderNormal: {
      borderLeft: '4px solid transparent',
    },
    paddingLeft: {
      paddingLeft: theme.spacing(3),
    },
    stagesList: {
      margin: theme.spacing(2, 0),
      maxHeight: 'calc(100vh - 190px)',
      minHeight: 'calc(100vh - 840px)',
      overflowY: 'scroll',
      '&::-webkit-scrollbar': {
        width: '5px',
        backgroundColor: 'transparent',
      },
      '&::-webkit-scrollbar-track': {
        borderRadius: '25px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'white',
        borderRadius: '25px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'white',
      },
    },
  })
);

const StagesList = (): JSX.Element => {
  const stages = useSelector<NormalizedState, Stages>((state) => state.stages, shallowEqual);
  const groups = useSelector<NormalizedState, Groups>((state) => state.groups);
  const classes = useStyles();
  const [list, setList] = React.useState(stages);
  const [checkedMyStage, setCheckedMyStage] = React.useState(true);
  const [checkedJoindedStages, setCheckedJoinedStages] = React.useState(true);
  const [currentStage, setCurrentStage] = React.useState<Stage>();
  const [openCreateStageModal, setOpenCreateStageModal] = React.useState(false);
  const { handleSetStage, handleSetContext } = useStage();

  const handleMySatgeClick = (): JSX.Element => {
    setCheckedMyStage((prev) => !prev);
  };

  const handleJoindeStagesClick = (): JSX.Element => {
    setCheckedJoinedStages((prev) => !prev);
  };

  useEffect(() => {
    if (stages) {
      setList(stages);
      setCurrentStage(list.byId[Object.keys(list.byId)[0]]);
      handleSetStage(list.byId[Object.keys(list.byId)[0]]);
    }

    setList(stages);
  }, [stages, groups]);

  return (
    <div className={classes.root}>
      <CreateStageModal
        open={openCreateStageModal}
        handleClose={() => setOpenCreateStageModal(false)}
      />
      <Typography variant="h5" className={classes.paddingLeft}>
        Stages
      </Typography>
      <div className={classes.stagesList}>
        <Grid container alignItems="center">
          <Typography variant="h5" className={classes.paddingLeft}>
            My stages
          </Typography>
          <div onClick={handleMySatgeClick}>
            {!checkedMyStage ? <span>ExpandMoreIcon</span> : <span>ExpandLessIcon</span>}
          </div>
        </Grid>
        <div>
          {' '}
          {list.allIds.length > 0 &&
            list.allIds.map((id) => {
              const stage = list.byId[id];
              return (
                <div
                  onClick={() => {
                    setCurrentStage(stage);
                    handleSetStage(stage);
                  }}
                  className={clsx(classes.clickable, {
                    [classes.leftBorder]: currentStage && currentStage._id === id,
                    [classes.leftBorderNormal]: currentStage && !(currentStage._id === id),
                  })}
                  key={id}
                >
                  <Collapse in={checkedMyStage}>
                    {stage.isAdmin && <StageCard stage={stage} />}
                  </Collapse>
                </div>
              );
            })}
        </div>
        <Grid container alignItems="center">
          <Typography variant="h5" className={classes.paddingLeft}>
            Joined stages
          </Typography>
          <div onClick={handleJoindeStagesClick}>
            {!checkedJoindedStages ? <span>ExpandMoreIcon</span> : <span>ExpandLessIcon</span>}
          </div>
        </Grid>
        <div>
          {' '}
          {list.allIds.length > 0 &&
            list.allIds.map((id) => {
              const stage = list.byId[id];
              return (
                <div
                  onClick={() => {
                    setCurrentStage(stage);
                    handleSetStage(stage);
                  }}
                  className={clsx(classes.clickable, {
                    [classes.leftBorder]: currentStage && currentStage._id === id,
                    [classes.leftBorderNormal]: currentStage && !(currentStage._id === id),
                  })}
                  key={id}
                >
                  <Collapse in={checkedMyStage}>
                    {!stage.isAdmin && <StageCard stage={stage} />}
                  </Collapse>
                </div>
              );
            })}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <Button
          type="submit"
          onClick={() => {
            setOpenCreateStageModal(true);
            handleSetContext('new');
          }}
        >
          Create stage
        </Button>
      </div>
    </div>
  );
};

export default StagesList;
