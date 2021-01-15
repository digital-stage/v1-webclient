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

  const participantWidth = (participants: number, group: Group): string => {
    let width = `${groupWidth(group)}px`;
    let divider = 2;
    for (let i = 2; i <= participants; i = i * 2) {
      width = `${groupWidth(group) / divider}px`;
      divider++;
    }
    return width;
  };

  const participantHeight = (participants: number, mobile?: boolean): string => {
    const mobileHeight = !mobile ? size.height : size.height / groups.length;
    let height = `${mobileHeight}px`;
    let divider = 2;
    let step = 1;
    for (let i = 3; i <= participants; i = i + step) {
      height = `${mobileHeight / divider}px`;
      divider++;
      step += 3;
    }
    return height;
  };

  const groupWidth = (group: Group) => {
    let width: number;
    const moreThenTen = groups.filter((group) => group.participants.length >= 10).length;
    if (moreThenTen <= 0 || moreThenTen === groups.length) width = size.width / groups.length;
    else if (group.participants.length >= 10)
      width = size.width / groups.length + (size.width / groups.length) * 0.1;
    else
      width =
        size.width / groups.length -
        (size.width / groups.length) * (moreThenTen * (0.1 / (groups.length - moreThenTen)));


    return width;
  };

  return (
    <Box>
      <Flex sx={{ width: '100vw', height: '100vh', flexWrap: 'wrap' }} ref={wrapperRef}>
        {groups.map((group, index) => (
          <Flex
            key={index}
            sx={{
              width: ['100vh', `${groupWidth(group)}px`],
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
                        participantWidth(group.participants.length, group),
                        participantWidth(group.participants.length, group),
                      ],
                      height: [
                        participantHeight(group.participants.length, true),
                        participantHeight(group.participants.length, false),
                      ],
                      // border: '1px solid blue'
                    }}
                  >
                    {participant.hasVideo && (
                      <VideoPlayer
                        sx={{
                          position: 'absolute',
                          width: [
                            participantWidth(group.participants.length, group),
                            participantWidth(group.participants.length, group),
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
