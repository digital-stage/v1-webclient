/** @jsxRuntime classic */
/** @jsx jsx */
import { Flex, jsx } from 'theme-ui';
import React, { useState } from 'react';
import Controller, { Group } from '../example/Controller';
import VideoPlayer from '../example/VideoPlayer';

const Composition = (): JSX.Element => {
  const [groups, setGroups] = useState<Group[]>([]);

  return (
    <Flex sx={{}}>
      <Flex
        sx={{
          flexWrap: 'wrap',
        }}
      >
        {groups.map((group, index) => (
          <Flex
            sx={{
              width: '50%',
              border: '1px solid red',
            }}
            key={index}
          >
            GROUP #{index}
            {group.participants.map((participant, index) => (
              <Flex
                sx={{
                  position: 'relative',
                  width: '50vw',
                  border: '1px solid yellow',
                }}
                key={index}
              >
                {participant.hasVideo && (
                  <Flex
                    sx={{
                      position: 'relative',
                      paddingTop: '100%',
                    }}
                  />
                )}
                PARTICIPANT #{index}
                {participant.hasVideo && (
                  <VideoPlayer
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                    }}
                    video={participant.video}
                  />
                )}
              </Flex>
            ))}
          </Flex>
        ))}
      </Flex>

      <Controller groups={groups} setGroups={setGroups} />
    </Flex>
  );
};
export default Composition;
