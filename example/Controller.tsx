/** @jsxRuntime classic */
/** @jsx jsx */
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Flex, jsx } from 'theme-ui';

export interface Participant {
  video: MediaStream;
  hasVideo: boolean;
}

export interface Group {
  participants: Participant[];
}

const Controller = (props: {
  groups: Group[];
  setGroups: Dispatch<SetStateAction<Group[]>>;
}): JSX.Element => {
  const { groups, setGroups } = props;
  const [video, setVideo] = useState<MediaStream>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((mediaStream) => setVideo(mediaStream));
  }, []);

  const addGroup = useCallback(() => {
    setGroups((prev) => [
      ...prev,
      {
        id: prev.length,
        participants: [],
      },
    ]);
  }, []);

  const addParticipant = useCallback(
    (groupIndex: number) => {
      setGroups((prev) =>
        prev.map((group, index) => {
          if (index === groupIndex) {
            return {
              ...group,
              participants: [
                ...group.participants,
                {
                  id: group.participants.length,
                  video: video,
                  hasVideo: true,
                },
              ],
            };
          }
          return group;
        })
      );
    },
    [video]
  );

  const toggleVideo = useCallback((groupIndex: number, participantIndex: number) => {
    setGroups((prev) =>
      prev.map((group, index) => {
        if (index === groupIndex) {
          return {
            ...group,
            participants: group.participants.map((participant, pIndex) => {
              if (pIndex === participantIndex) {
                participant.hasVideo = !participant.hasVideo;
              }
              return participant;
            }),
          };
        }
        return group;
      })
    );
  }, []);

  const removeGroup = useCallback((groupIndex: number) => {
    setGroups((prev) => prev.filter((group, index) => index !== groupIndex));
  }, []);

  const removeParticipant = useCallback((groupIndex: number, participantIndex: number) => {
    setGroups((prev) =>
      prev.map((group, index) => {
        if (index === groupIndex) {
          return {
            ...group,
            participants: group.participants.filter((participant, i) => i !== participantIndex),
          };
        }
        return group;
      })
    );
  }, []);

  return (
    <Flex
      sx={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        flexDirection: 'column',
      }}
    >
      <button onClick={addGroup}>Add group</button>
      <ul>
        {groups.map((group, groupIndex) => (
          <li key={groupIndex}>
            Group #{groupIndex}
            <button onClick={() => removeGroup(groupIndex)}>X</button>
            <button onClick={() => addParticipant(groupIndex)}>Add participant</button>
            <ul>
              {group.participants.map((participant, participantIndex) => (
                <li key={participantIndex}>
                  Participant #{participantIndex}
                  <input
                    id={'c-' + participantIndex}
                    type="checkbox"
                    checked={participant.hasVideo}
                    onChange={() => toggleVideo(groupIndex, participantIndex)}
                  />
                  <label htmlFor={'c-' + participantIndex}>video</label>
                  <button onClick={() => removeParticipant(groupIndex, participantIndex)}>X</button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Flex>
  );
};
export default Controller;
