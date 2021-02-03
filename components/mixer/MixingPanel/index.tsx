/** @jsxRuntime classic */
/** @jsx jsx */
import { Flex, Text, jsx, Box } from 'theme-ui';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import GlobalModeSelect from '../../../digitalstage-ui/extra/GlobalModeSelect';
import { useIsStageAdmin } from '../../../lib/use-digital-stage/hooks';
import VariableMixingPanel from './VariableMixingPanel';

const MixingPanel = (): JSX.Element => {
  const [globalMode, setGlobalMode] = useState<boolean>(false);
  const isStageAdmin = useIsStageAdmin();
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        width: '100%',
        height: '100%'
      }}
    >
      {isStageAdmin && (
        <Box
          sx={{
            width: '100%',
            flexGrow: 0,
          }}
        >
          <GlobalModeSelect
            global={globalMode}
            onChange={(globalMode) => setGlobalMode(globalMode)}
          />
          <Text variant="micro">{f(globalMode ? 'globalDescription' : 'monitorDescription')}</Text>
        </Box>
      )}

      <Flex
        sx={{
          position: 'relative',
          whiteSpace: 'nowrap',
          flexGrow: 1,
          width: '100%',
          margin: 0,
          padding: 0,
        }}
      >
          <Flex
            sx={{
              display: 'flex',
              flexGrow: 1,
              flexDirection: 'row',
              alignItems: 'stretch',
              justifyContent: 'flex-start',
              flexWrap: ['nowrap', 'wrap']
            }}
          >
            <VariableMixingPanel global={globalMode} />
          </Flex>
        </Flex>
    </Flex>
  );
};
export default MixingPanel;
