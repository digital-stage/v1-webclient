import React, { MouseEventHandler } from 'react';
import { styled, useStyletron } from 'styletron-react';
import generatePath from './generatePath';

const Svg = styled('svg', {
  fill: 'currentColor',
});

const Icon = (props: {
  name: string,
  label?: string;
  size?: number,
  onClick?: MouseEventHandler<HTMLOrSVGElement>,
  className?: string;
}) => {
  const [css] = useStyletron();
  const {
    name, className, size, onClick, label,
  } = props;

  return (
    <Svg
      className={className}
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      onClick={onClick}
    >
      <title id={name}>{label || name}</title>
      <g className={css({
        fill: 'currentColor',
      })}
      >
        {generatePath(name, 'currentColor')}
      </g>
    </Svg>
  );
};
export default Icon;
