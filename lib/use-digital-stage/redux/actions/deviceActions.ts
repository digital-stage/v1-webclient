import { Device } from '../../types';
import { ServerDeviceEvents } from '../../global/SocketEvents';

const handleLocalDeviceReady = (device: Device) => {
  return {
    type: ServerDeviceEvents.LOCAL_DEVICE_READY,
    payload: device,
  };
};

const addDevice = (device: Device) => {
  return {
    type: ServerDeviceEvents.DEVICE_ADDED,
    payload: device,
  };
};
const changeDevice = (device: Partial<Device>) => {
  return {
    type: ServerDeviceEvents.DEVICE_CHANGED,
    payload: device,
  };
};
const removeDevice = (deviceId: string) => {
  return {
    type: ServerDeviceEvents.DEVICE_REMOVED,
    payload: deviceId,
  };
};

const client = {};
const server = {
  handleLocalDeviceReady,
  addDevice,
  changeDevice,
  removeDevice,
};

const deviceActions = {
  client,
  server,
};
export default deviceActions;
