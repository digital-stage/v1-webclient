/** @jsxRuntime classic */
/** @jsx jsx */
import DarkDialog from '../../../digitalstage-ui/extra/Dialog';
import { useIntl } from 'react-intl';
import { jsx, Text, Link as ThemeUiLink } from 'theme-ui';
import { Heading } from '@theme-ui/components';

const DownloadClientOverlay = (props: { isOpen: boolean; onClose: () => void }): JSX.Element => {
  const { isOpen, onClose } = props;
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  return (
    <DarkDialog sx={{ m: 4 }} size="auto" closable open={isOpen} onClose={onClose}>
      <Heading variant="h2">{f('clientDownload')}</Heading>
      <Text py={4} variant="body">
        {f('clientDownloadDesc')}
      </Text>
      <Heading variant="h3" py={4}>
        {f('macOS')}
      </Heading>

      <Text variant="body" py={1}>
        <ol>
          <li>
            {f('downloadJackAudio')}
            <ThemeUiLink
              sx={{
                color: 'text',
              }}
              target="_blank"
              href="https://github.com/jackaudio/jack2-releases/releases/download/v1.9.17/jack2-macOS-universal-v1.9.17.tar.gz"
            >
              {f('here')}
            </ThemeUiLink>
          </li>
          <li>
            {f('downloadClient')}
            <ThemeUiLink
              sx={{
                color: 'text',
              }}
              target="_blank"
              href="https://www.digital-stage.org/InstallDigitalStage.dmg"
            >
              {f('here')}
            </ThemeUiLink>
          </li>
        </ol>
      </Text>
      <Text variant="body" py={1}>
        {f('clientAdditionalInstructions')}
      </Text>
      <Text variant="body" py={1}>
        {f('needDetailedInstruction')}&nbsp;
        <ThemeUiLink
          sx={{
            color: 'text',
          }}
          target="_blank"
          href="https://vimeo.com/315487551?dnt=1"
        >
          {f('macOSInstallVideo')}
        </ThemeUiLink>
      </Text>
    </DarkDialog>
  );
};
export default DownloadClientOverlay;
