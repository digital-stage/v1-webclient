import { useRouter } from 'next/router';
import React from 'react';
import LoadingOverlay from '../../components/global/LoadingOverlay';
import MainLayout from '../../components/layout/MainLayout';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function RedirectPage(): JSX.Element {
  const router = useRouter();
  // Make sure we're in the browser
  if (typeof window !== 'undefined') {
    router.push('/settings/profile');
    return null;
  }

  return <LoadingOverlay />;
}

RedirectPage.getInitialProps = (ctx) => {
  // We check for ctx.res to make sure we're on the server.
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: '/setting/profile' });
    ctx.res.end();
  }
  return {};
};

export default RedirectPage;
