/** @jsxRuntime classic */
/** @jsx jsx */
import { Flex, jsx, Box } from 'theme-ui';
import React, { useState } from 'react';
import Controller, { Group } from '../example/Controller';
import VideoPlayer from '../example/VideoPlayer';

const Composition = (): JSX.Element => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [size, setSize] = useState<DOMRect>();
  const wrapperRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    if (wrapperRef.current) {
      const handleResize = () => {
        const rect = wrapperRef.current.getBoundingClientRect();
        setSize(rect);
      }
      wrapperRef.current.addEventListener('resize', handleResize);
      handleResize();
      return () => {
        if (wrapperRef.current) wrapperRef.current.removeEventListener('resize', handleResize);
      };
    }
  }, [wrapperRef, groups])

  const participantWidth = (participants: number): string => {
    let width = `${size.width / groups.length}px`;
    if (participants >= 2) {
      width = `${(size.width / groups.length) / 2}px`
    } else {
      width = `${size.width / groups.length}px`
    }
    return width
  }

  const participantHeight = (participants: number): string => {
    let height = '100%';
    if (participants >= 3) {
      height = `${groupHeight() / Math.round(participants / 2)}px`
    } else {
      height = '100%'
    }
    return height
  }

  const groupHeight = (): number => {
    let height = size.height;
    const participantLength: Array<number> = groups.map(group => group.participants.length)
    const isEqual: boolean = participantLength.every((val, i, arr) => val === arr[0])
    if (isEqual) {
      height = size.height / groups.length
    } else {
      //TODO calculate height if gorups have diff number of participants
    }
    return height;
  }


  return (
    <Box>
      <Flex sx={{ width: '100vw', height: '100vh', flexWrap: 'wrap' }} ref={wrapperRef}>
        {groups.map((group, index) => (
          <Flex
            key={index}
            sx={{
              width: [size.width, `${size.width / groups.length}px`],
              minWidth: [size.width, `${size.width / groups.length}px`],
              maxWidth: [size.width, `${size.width / groups.length}px`],
              height: [`${groupHeight()}px`, '100vh'],
              // border: '1px solid red',
            }}
          >
            <Flex
              sx={{
                flexWrap: 'wrap',
                width: '100%'
              }}
            >
              {group.participants.map((participant, index) => {
                return <Flex
                  key={index}
                  sx={{
                    width: participantWidth(group.participants.length),
                    minWidth: participantWidth(group.participants.length),
                    height: participantHeight(group.participants.length),
                    border: '1px solid green'
                  }}
                >
                  {participant.hasVideo && (
                    <VideoPlayer
                      sx={{
                        position: 'absolute',
                        width: participantWidth(group.participants.length),
                        height: participantHeight(group.participants.length),
                      }}
                      video={participant.video}
                    />
                  )}
                </Flex>
              })}
            </Flex>
          </Flex>
        ))}

      </Flex>
      <Controller groups={groups} setGroups={setGroups} />
    </Box>
  );
};
export default Composition;
