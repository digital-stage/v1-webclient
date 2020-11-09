/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Flex, Button } from 'theme-ui';
import { FaPlus, FaArrowRight } from 'react-icons/fa';
import CreateStageModal from './new/elements/StageList/CreateStageModal';

const StageOverviewLinks = (): JSX.Element => {
  const [isCreateStageOpen, setCreateStageIsOpen] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      <Flex
        sx={{
          flexDirection: ['column', 'row'],
          width: '100%',
          mt: '-16px',
          borderBottom: '1px solid transparent',
          borderBottomColor: 'gray.2',
        }}
      >
        <Box
          sx={{
            width: ['100%', '50%'],
            borderRight: '1px solid transparent',
            borderRightColor: [null, 'gray.3'],
            py: 4,
            px: 3,
            textAlign: 'center',
          }}
        >
          <Button variant="text" onClick={() => setCreateStageIsOpen((prevState) => !prevState)}>
            <Box
              as="span"
              sx={{
                color: 'secondary',
                textAlign: 'center',
                pt: 2,
                mr: [2, null, 3],
              }}
            >
              <FaPlus />
            </Box>{' '}
            Neue Bühne erstellen
          </Button>
        </Box>

        <Box
          sx={{
            width: ['100%', '50%'],
            pt: [0, 4],
            pb: 4,
            px: 3,
            textAlign: 'center',
          }}
        >
          {/** TODO: Join function is currently missing */}
          <Button variant="text" onClick={() => setCreateStageIsOpen((prevState) => !prevState)}>
            <Box
              as="span"
              sx={{
                color: 'secondary',
                textAlign: 'center',
                pt: 2,
                mr: [2, null, 3],
              }}
            >
              <FaArrowRight />
            </Box>{' '}
            Neue Teilnahme
          </Button>
        </Box>
      </Flex>
      <CreateStageModal isOpen={isCreateStageOpen} onClose={() => setCreateStageIsOpen(false)} />
    </React.Fragment>
  );
};

export default StageOverviewLinks;
