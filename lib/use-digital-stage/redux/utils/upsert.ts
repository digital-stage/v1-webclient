import _ from 'lodash';

const upsert = <T>(arr: Readonly<T[]>, value: T): T[] => {
  if (!arr) {
    return [value];
  }
  if (_.indexOf<T>(arr, value) === -1) {
    return [...arr, value];
  }
  return [...arr];
};
export default upsert;
