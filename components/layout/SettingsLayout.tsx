/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Flex, Button } from 'theme-ui';
import React from 'react';
import Logo from '../../digitalstage-ui/extra/Logo';
import useDigitalStage, { useSelector } from '../../lib/use-digital-stage';
import { useIntl } from 'react-intl';
import LoadingOverlay from '../global/LoadingOverlay';
import Link from 'next/link';

const SettingsLayout = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  const isInsideStage = useSelector<boolean>((state) => !!state.global.stageId);
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });
  const { ready } = useDigitalStage();

  if (!ready) {
    return <LoadingOverlay>{f('loadingStages')}</LoadingOverlay>;
  }

  return (
    <Flex
      sx={{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        px: 3,
        py: 4,
      }}
    >
      {!isInsideStage && (
        <Flex
          sx={{
            width: '100%',
            alignItems: 'center',
            mb: [5, null, 6],
            py: 4,
            px: [5, 7],
          }}
        >
          <Logo alt={f('projectName')} width={110} full />
        </Flex>
      )}
      {!isInsideStage && (
        <Link href="/stages">
          <Button
            sx={{
              mb: '6',
            }}
            variant="primary"
          >
            {f('backToStages')}
          </Button>
        </Link>
      )}
      {children}
    </Flex>
  );
};
export default SettingsLayout;
