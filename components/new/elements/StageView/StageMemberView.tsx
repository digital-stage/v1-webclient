import { useStyletron } from 'baseui';
import React from 'react';
import { Avatar } from 'baseui/avatar';
import { Typography } from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import OnlineStatus from '../../../complex/depreacted/theme/OnlineStatus';
import { ExtendedStageMember, useIsStageAdmin } from '../../../../lib/digitalstage/useStageSelector';
import useStageActions from '../../../../lib/digitalstage/useStageActions';
import VideoPlayer from '../VideoPlayer';

const StageMemberTitle = (props: {
  stageMember: ExtendedStageMember
}) => {
  const { stageMember } = props;
  const [css] = useStyletron();
  const { updateStageMember } = useStageActions();
  const isAdmin = useIsStageAdmin();

  return (
    <>
      <div className={css({
        display: 'flex',
        width: 'calc(100% - 2rem)',
        alignItems: 'center',
      })}
      >
        <div className={css({
          margin: '.5rem',
          flexGrow: 0,
        })}
        >
          <Avatar name={stageMember.name} />
        </div>
        <div className={css({
          display: 'flex',
          flexGrow: 1,
        })}
        >
          <Typography variant="h5">{stageMember.name}</Typography>
        </div>

        {isAdmin && (
        <div
          role="presentation"
          className={css({
            display: 'flex',
            flexGrow: 0,
            cursor: 'pointer',
          })}
          onClick={() => updateStageMember(stageMember._id, {
            isDirector: !props.stageMember.isDirector,
          })}
        >
          {stageMember.isDirector ? <StarIcon /> : <StarBorderIcon />}
        </div>
        )}
        <OnlineStatus
          overrides={{
            display: 'flex',
            flexGrow: 0,
          }}
          online={stageMember.online}
        />
      </div>
    </>
  );
};

const StageMemberView = (props: {
  stageMember: ExtendedStageMember
}) => {
  const { stageMember } = props;
  const [css] = useStyletron();

  return (
    <div className={css({
      position: 'relative',
      display: 'flex',
      width: '50vw',
      backgroundImage: 'url("/images/white_logo.png")',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '20%',
      '@media screen and (min-width: 800px)': {
        width: '25vw',
      },
    })}
    >
      <div className={css({
        paddingTop: '100%',
      })}
      />
      {stageMember.videoConsumers.length > 0
            && (
            <VideoPlayer
              className={css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              })}
              consumers={stageMember.videoConsumers}
            />
            )}
      <div className={css({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      })}
      >
        <StageMemberTitle stageMember={stageMember} />
      </div>
    </div>
  );
};
export default StageMemberView;
