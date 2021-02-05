/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Flex, Button, IconButton } from 'theme-ui';
import { FaPlus, FaArrowRight } from 'react-icons/fa';
import CreateStageModal from './CreateStageModal';
import JoinStageModal from './JoinStageModal';

const ActionBar = (props: { setStageCreated(stageCreated: boolean): void }): JSX.Element => {
  const [isCreateStageOpen, setCreateStageIsOpen] = React.useState<boolean>(false);
  const [isJoinStageOpen, setJoinStageOpen] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      <Flex
        sx={{
          flexDirection: ['column', 'row'],
          width: '100%',
          mt: '-24px',
          borderBottom: '1px solid transparent',
          borderBottomColor: 'gray.3',
        }}
      >
        <Box
          sx={{
            width: ['100%', '50%'],
            borderRight: '1px solid transparent',
            borderRightColor: [null, 'gray.3'],
            py: 6,
            px: 6,
            textAlign: 'center',
          }}
        >
          <Button variant="text" onClick={() => setCreateStageIsOpen((prevState) => !prevState)}>
            <Box
              as="span"
              sx={{
                color: 'secondary',
                textAlign: 'center',
                pt: 6,
                mr: [2, null, 3],
              }}
            >
              <IconButton>
                <FaPlus />
              </IconButton>
            </Box>{' '}
            Neue Bühne erstellen
          </Button>
        </Box>

        <Box
          sx={{
            width: ['100%', '50%'],
            pt: [0, 6],
            pb: 4,
            px: 3,
            textAlign: 'center',
          }}
        >
          {/** TODO: Join function is currently missing */}
          <Button variant="text" onClick={() => setJoinStageOpen((prevState) => !prevState)}>
            <Box
              as="span"
              sx={{
                color: 'secondary',
                textAlign: 'center',
                pt: 2,
                mr: [2, null, 3],
              }}
            >
              <IconButton>
                <FaArrowRight />
              </IconButton>
            </Box>
            Neue Teilnahme
          </Button>
        </Box>
      </Flex>
      <CreateStageModal
        isOpen={isCreateStageOpen}
        onClose={() => setCreateStageIsOpen(false)}
        setStageCreated={props.setStageCreated}
      />
      <JoinStageModal isOpen={isJoinStageOpen} onClose={() => setJoinStageOpen(false)} />
    </React.Fragment>
  );
};

export default ActionBar;
