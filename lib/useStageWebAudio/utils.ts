import {
  CustomGroupPosition,
  CustomStageMemberPosition,
  Group,
  StageMember,
} from '../use-digital-stage';
import ThreeDimensionProperties from "../use-digital-stage/types/ThreeDimensionProperties";

const calculate3DAudioParameters = (
  group: Group,
  customGroup: CustomGroupPosition | undefined,
  stageMember: StageMember,
  customStageMember: CustomStageMemberPosition | undefined,
  track: ThreeDimensionProperties
): {
  x: number;
  y: number;
  z: number;
  rX: number;
  rY: number;
  rZ: number;
} => {
  let x = customStageMember?.x || stageMember.x || 0;
  let y = customStageMember?.y || stageMember.y || 0;
  let z = customStageMember?.z || stageMember.z || 0;
  if (customGroup) {
    x = x + (customGroup.x || 0);
    y = y + (customGroup.y || 0);
    z = z + (customGroup.z || 0);
  } else {
    x = x + (group.x || 0);
    y = y + (group.y || 0);
    z = z + (group.z || 0);
  }
  x = x + (track.x || 0);
  y = y + (track.y || 0);
  z = z + (track.z || 0);

  const rX = customStageMember ? customStageMember.rX : stageMember.rX;
  const rY = customStageMember ? customStageMember.rY : stageMember.rY;
  const rZ = customStageMember ? customStageMember.rZ : stageMember.rZ;

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
