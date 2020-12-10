import {
  CustomGroup,
  CustomStageMember,
  Group,
  StageMember,
  ThreeDimensionAudioProperties,
} from 'use-digital-stage';

const calculate3DAudioParameters = (
  group: Group,
  customGroup: CustomGroup | undefined,
  stageMember: StageMember,
  customStageMember: CustomStageMember | undefined,
  track: ThreeDimensionAudioProperties
): {
  x: number;
  y: number;
  z: number;
  rX: number;
  rY: number;
  rZ: number;
} => {
  let x = stageMember.x | 0;
  let y = stageMember.y | 0;
  let z = stageMember.z | 0;
  let rX = stageMember.rX | 0;
  let rY = stageMember.rY | 0;
  let rZ = stageMember.rZ | 0;
  if (customStageMember) {
    x = customStageMember.x | 0;
    y = customStageMember.y | 0;
    z = customStageMember.z | 0;
    rX = customStageMember.rX | 0;
    rY = customStageMember.rY | 0;
    rZ = customStageMember.rZ | 0;
  }
  if (customGroup) {
    x = x + customGroup.x | 0;
    y = y + customGroup.y | 0;
    z = z + customGroup.z | 0;
    rX = customGroup.rX | 0;
    rY = customGroup.rY | 0;
    rZ = customGroup.rZ | 0;
  } else {
    x = x + group.x | 0;
    y = y + group.y | 0;
    z = z + group.z | 0;
    rX = group.rX | 0;
    rY = group.rY | 0;
    rZ = group.rZ | 0;
  }
  x = x + track.x | 0;
  y = y + track.y | 0;
  z = z + track.z | 0;
  rX = track.rX | 0;
  rY = track.rY | 0;
  rZ = track.rZ | 0;

  return {
    x,
    y,
    z,
    rX,
    rY,
    rZ,
  };
};
export { calculate3DAudioParameters };
