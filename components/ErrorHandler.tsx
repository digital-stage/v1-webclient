/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Heading, Link } from 'theme-ui';
import { useErrors } from '../lib/useErrors';
import Layout from './Layout';
import AuthPanel from './auth/AuthPanel';

interface Props {
  children: React.ReactNode;
}

const ErrorHandler = ({ children }: Props): JSX.Element => {
  const { errors, warnings } = useErrors();

  if (errors.length > 0) {
    errors.forEach((error) => console.error(error));
    return (
      <Layout>
        <AuthPanel>
          Es tut uns leid, aber der
          <Heading sx={{ my: 4 }}> Service steht derzeit nicht zur Verfügung.</Heading> Aktuelle
          Neuigkeiten erfahren Sie auf unserer {` `}
          <Link sx={{ color: 'text' }} href="https://www.digital-stage.org">
            Website
          </Link>
          {errors.map((error) => error.message)}
        </AuthPanel>
      </Layout>
    );
  }

  if (warnings.length > 0) {
    warnings.forEach((warning) => console.warn(warning));
    return (
      <React.Fragment>
        {children}
        {warnings.length > 0 ? (
          <div>
            Warnung:
            <p>{warnings.map((warning) => warning.message)}</p>
          </div>
        ) : undefined}
      </React.Fragment>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
};
export default ErrorHandler;
