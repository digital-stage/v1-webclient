import {
    CustomGroup,
    CustomStageMember,
    Group,
    StageMember,
    ThreeDimensionAudioProperties
} from "../use-digital-stage/types";


const calculate3DAudioParameters = (
    group: Group,
    customGroup: CustomGroup | undefined,
    stageMember: StageMember,
    customStageMember: CustomStageMember | undefined,
    track: ThreeDimensionAudioProperties,
): {
    x: number;
    y: number;
    z: number;
    rX: number;
    rY: number;
    rZ: number;
} => {
    let x = stageMember.x;
    let y = stageMember.y;
    let z = stageMember.z;
    let rX = stageMember.rX;
    let rY = stageMember.rY;
    let rZ = stageMember.rZ;
    if (customStageMember) {
        x = customStageMember.x;
        y = customStageMember.y;
        z = customStageMember.z;
        rX = customStageMember.rX;
        rY = customStageMember.rY;
        rZ = customStageMember.rZ;
    }
    if (customGroup) {
        x = x + customGroup.x;
        y = y + customGroup.y;
        z = z + customGroup.z;
        rX = customGroup.rX;
        rY = customGroup.rY;
        rZ = customGroup.rZ;
    } else {
        x = x + group.x;
        y = y + group.y;
        z = z + group.z;
        rX = group.rX;
        rY = group.rY;
        rZ = group.rZ;
    }
    x = x + track.x;
    y = y + track.y;
    z = z + track.z;
    rX = track.rX;
    rY = track.rY;
    rZ = track.rZ;

    return {
        x,
        y,
        z,
        rX,
        rY,
        rZ
    }
}
export {
    calculate3DAudioParameters
}
