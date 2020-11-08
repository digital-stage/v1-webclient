import { Button as BaseButton } from 'baseui/button';
import * as React from 'react';
import { CSSProperties } from 'react';
import { KIND, SHAPE, SIZE } from '../Theme';
import Ripples from '../Ripples';

const Button = (props: {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => any;
  shape?: SHAPE[keyof SHAPE];
  kind?: KIND[keyof KIND];
  size?: SIZE[keyof SIZE];
  style?: CSSProperties;
  startEnhancer?: React.ReactNode;
  endEnhancer?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}) => {
  const {
    children,
    startEnhancer,
    endEnhancer,
    onClick,
    style,
    kind,
    shape,
    size,
    ref
  } = props;
  return (
    <BaseButton
      ref={ref}
      startEnhancer={startEnhancer}
      endEnhancer={endEnhancer}
      onClick={onClick}
      size={size}
      overrides={{
        Root: {
          style: {
            ...style
          }
        },
        BaseButton: {
          style: {
            position: 'relative',
            overflow: 'hidden'
          }
        }
      }}
      kind={kind}
      shape={shape}
    >
      {children}
      <Ripples />
    </BaseButton>
  );
};
export default Button;
