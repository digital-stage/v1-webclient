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
      };
      wrapperRef.current.addEventListener('resize', handleResize);
      handleResize();
      return () => {
        if (wrapperRef.current) wrapperRef.current.removeEventListener('resize', handleResize);
      };
    }
  }, [wrapperRef, groups]);

  const isEven = (n) => {
    return n % 2 == 0;
  };

  const participantWidth = (participants: number, mobile?: boolean): string => {
    const mobileWidth = mobile ? size.width : size.width / groups.length;
    let width = `${mobileWidth}px`;
    switch (true) {
      case participants >= 12:
        width = `${mobileWidth / 5}px`;
        break;
      case participants >= 9:
        width = `${mobileWidth / 4}px`;
        break;
      case participants >= 6:
        width = `${mobileWidth / 3}px`;
        break;
      case participants >= 2:
        width = `${mobileWidth / 2}px`;
        break;
      default:
        width = `${mobileWidth}px`;
    }
    return width;
  };

  const participantHeight = (participants: number, mobile?: boolean): string => {
    const mobileHeight = !mobile ? size.height : size.height / groups.length;
    let height = `${mobileHeight}px`;
    switch (true) {
      case participants >= 12:
        height = `${mobileHeight / Math.round(participants / 4)}px`;
        break;
      case participants >= 6:
        height = `${mobileHeight / Math.floor(participants / 3)}px`;
        break;
      case participants >= 3:
        height = `${mobileHeight / 2}px`;
        break;
      default:
        height = `${mobileHeight}px`;
    }
    return height;
  };

  // const groupHeight = (): number => {
  //   let height = size.height;
  //   const participantLength: Array<number> = groups.map(group => group.participants.length)
  //   const isEqual: boolean = participantLength.every((val, i, arr) => val === arr[0])
  //   const longestGroupId = Math.max(...groups.map(o => { return o.participants.length; }));
  //   console.log(longestGroupId)
  //   if (isEqual) {
  //     height = size.height / groups.length;
  //   } else {
  //     console.log(groups);
  //     height = size.height / groups.length;
  //     //TODO calculate height if gorups have diff number of participants
  //   }
  //   return height;
  // }

  return (
    <Box>
      <Flex sx={{ width: '100vw', height: '100vh', flexWrap: 'wrap' }} ref={wrapperRef}>
        {groups.map((group, index) => (
          <Flex
            key={index}
            sx={{
              width: [`${size.width}px`, `${size.width / groups.length}px`],
              minWidth: [`${size.width}px`, `${size.width / groups.length}px`],
              maxWidth: [size.width, `${size.width / groups.length}px`],
              height: [`${size.height / groups.length}px`, '100vh'],
              // border: '1px solid red',
            }}
          >
            <Flex
              sx={{
                flexWrap: 'wrap',
                width: '100%',
              }}
            >
              {group.participants.map((participant, index) => {
                return (
                  <Flex
                    key={index}
                    sx={{
                      width: [
                        participantWidth(group.participants.length, true),
                        participantWidth(group.participants.length, false),
                      ],
                      height: [
                        participantHeight(group.participants.length, true),
                        participantHeight(group.participants.length, false),
                      ],
                      // border: '1px solid green'
                    }}
                  >
                    {participant.hasVideo && (
                      <VideoPlayer
                        sx={{
                          position: 'absolute',
                          width: [
                            participantWidth(group.participants.length, true),
                            participantWidth(group.participants.length, false),
                          ],
                          height: [
                            participantHeight(group.participants.length, true),
                            participantHeight(group.participants.length, false),
                          ],
                        }}
                        video={participant.video}
                      />
                    )}
                  </Flex>
                );
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
