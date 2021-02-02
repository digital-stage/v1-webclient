/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui';
import { CustomStageMember, StageMember, User } from '../../../../lib/use-digital-stage/types';

const StageMemberRow = (props: {
  user: User;
  stageMember: StageMember;
  customStageMember?: CustomStageMember;
  onChange: (volume: number, muted: boolean) => void;
  children?: React.ReactNode;
  reset?: boolean;
  onReset?: () => void;
  isLastChild?: boolean;
  inactive?: boolean;
}) => {
  return <div></div>;
};
export default StageMemberRow;
