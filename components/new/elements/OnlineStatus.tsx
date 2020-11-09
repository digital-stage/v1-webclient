import React from 'react';
import { StyleObject, useStyletron } from 'styletron-react';

const OnlineStatus = (props: { overrides?: StyleObject; online: boolean }) => {
  const [css] = useStyletron();
  return (
    <div
      className={css({
        width: '1rem',
        height: '1rem',
        backgroundColor: props.online ? 'green' : 'red',
        borderRadius: '50%',
        margin: '.5rem',
        ...props.overrides,
      })}
    />
  );
};
export default OnlineStatus;
