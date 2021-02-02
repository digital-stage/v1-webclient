import { useSelector } from '../../lib/use-digital-stage';
import { jsx, Flex, Button, NavLink, Heading, IconButton } from 'theme-ui';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useIntl } from 'react-intl';
import { GoBroadcast, GoListUnordered, GoSettings } from 'react-icons/go';
import Link from 'next/link';
import { BiChat, BiCube } from 'react-icons/bi';
import PrimaryToggleButton from '../../digitalstage-ui/extra/ToggleButton';
import { FaMicrophone, FaTools, FaVideo } from 'react-icons/fa';

const MobileMenu = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const insideStage = useSelector<boolean>((state) => !!state.global.stageId);
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  if (insideStage) {
    return (
      <React.Fragment>
        {open && (
          <Flex
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              bg: 'background',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              flexDirection: 'column',
            }}
          >
            <Link href="/stage">
              <NavLink title={f('stage')} onClick={() => setOpen(false)}>
                <Heading variant="h1">
                  <GoBroadcast name={f('stage')} /> {f('stage')}
                </Heading>
              </NavLink>
            </Link>

            <Link href="/mixer">
              <NavLink title={f('mixer')} onClick={() => setOpen(false)}>
                <Heading variant="h1">
                  <GoSettings name={f('mixer')} /> {f('mixer')}
                </Heading>
              </NavLink>
            </Link>

            <Link href="/room">
              <NavLink title={f('room')} onClick={() => setOpen(false)}>
                <Heading variant="h1">
                  <BiCube name={f('room')} /> {f('room')}
                </Heading>
              </NavLink>
            </Link>

            <Link href="/chat">
              <NavLink title={f('chat')} onClick={() => setOpen(false)}>
                <Heading variant="h1">
                  <BiChat name={f('chat')} /> {f('chat')}
                </Heading>
              </NavLink>
            </Link>

            <Link href="/settings">
              <NavLink title={f('settings')} onClick={() => setOpen(false)}>
                <Heading variant="h1">
                  <FaTools name={f('settings')} /> {f('settings')}
                </Heading>
              </NavLink>
            </Link>

            <Link href="/stages">
              <NavLink title={f('stages')} onClick={() => setOpen(false)}>
                <Heading variant="h1">
                  <GoListUnordered name={f('stages')} /> {f('stages')}
                </Heading>
              </NavLink>
            </Link>
          </Flex>
        )}
        <PrimaryToggleButton
          sx={{
            display: ['flex', 'none'],
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
          }}
          toggled={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <BsThreeDotsVertical size="24px" />
        </PrimaryToggleButton>
      </React.Fragment>
    );
  }
  return null;
};
export default MobileMenu;
