/** @jsxRuntime classic */
/** @jsx jsx */
import AuthLayout from './AuthLayout';
import React from 'react';
import { useAuth } from '../../../lib/useAuth';
import { useSelector } from '../../../lib/use-digital-stage/hooks';
import StageLayout from './StageLayout';
import StagesLayout from './StagesLayout';
import PageSpinner from '../../PageSpinner';
import { jsx } from 'theme-ui';

const Layout = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  const { loading, user } = useAuth();
  const stageId = useSelector((state) => state.global.stageId);

  if (loading) {
    // Return loading screen
    return (
      <AuthLayout>
        <PageSpinner />
      </AuthLayout>
    );
  }

  if (user) {
    // Return stage layout
    return <StageLayout>{children}</StageLayout>;
  }

  // Return auth layout (since user is not logged in)
  return <AuthLayout>{children}</AuthLayout>;
};
export default Layout;
