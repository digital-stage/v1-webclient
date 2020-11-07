import * as React from 'react';
import cookie from 'js-cookie';
import fetch from 'isomorphic-unfetch';
import { useErrors } from '../useErrors';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthProps {
  user: AuthUser;
  loading: boolean;
  token: string | null;

  createUserWithEmailAndPassword(
    email: string,
    password: string,
    name: string,
    avatarUrl?: string
  ): Promise<any>;

  signInWithEmailAndPassword(
    email: string,
    password: string,
    staySignedIn?: boolean
  ): Promise<any>;

  requestPasswordReset(email: string): Promise<any>;

  resetPassword(resetToken: string, password: string): Promise<any>;

  logout(): Promise<any>;
}

const AuthContext = React.createContext<AuthProps>(undefined);

export const useAuth = (): AuthProps => React.useContext<AuthProps>(AuthContext);

const getUserByToken = (token: string): Promise<AuthUser> => fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/profile`, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})
  .then((result) => result.json())
  .then((json) => json as AuthUser);

export const AuthContextConsumer = AuthContext.Consumer;

export const AuthContextProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const { reportError } = useErrors();

  const [token, setToken] = React.useState<string>();
  const [user, setUser] = React.useState<AuthUser>();
  const [loading, setLoading] = React.useState<boolean>(true);

  const createUserWithEmailAndPassword = React.useCallback(
    (email: string, password: string, name: string, avatarUrl?: string) => {
      setLoading(true);
      return fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/signup`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          name,
          avatarUrl: avatarUrl || '',
        }),
      })
        .then((result) => {
          console.log('send res', result);
          if (result.ok) return result.json();
          throw new Error(result.statusText);
        })
        .then((resToken) => getUserByToken(resToken).then((resUser) => {
          setUser(resUser);
          setToken(resToken);
          cookie.set('token', resToken, { expires: 7 });
        }))
        .catch((error) => {
          reportError(error.message);
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [],
  );

  const signInWithEmailAndPassword = React.useCallback(
    (email: string, password: string, staySignedIn?: boolean) => {
      setLoading(true);
      return fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((result) => {
          if (result.ok) return result.json();
          throw new Error(result.statusText);
        })
        .then((resToken) => getUserByToken(resToken).then((resUser) => {
          setUser(resUser);
          setToken(resToken);
          cookie.set('token', resToken, { expires: staySignedIn ? 7 : 1 });
        }))
        .catch((error) => reportError(error.message))
        .finally(() => {
          setLoading(false);
        });
    },
    [],
  );

  const requestPasswordReset = React.useCallback(
    (email: string) => fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/forgot`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    })
      .then((result) => {
        if (!result.ok) {
          throw new Error('Unbekannte E-Mail Adresse');
        }
      })
      .catch((error) => reportError(error.message)),
    [],
  );

  const resetPassword = React.useCallback(
    (resetToken: string, password: string) => fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/reset`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        token: resetToken,
        password,
      }),
    })
      .then((result) => {
        if (!result.ok) {
          throw new Error('Abgelaufener Link');
        }
      })
      .catch((error) => reportError(error.message)),
    [],
  );

  const logout = React.useCallback(() => {
    setLoading(true);
    return fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/logout`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
    })
      .then((result) => {
        if (result.ok) {
          cookie.remove('token');
          setToken(undefined);
          setUser(undefined);
        }
      })
      .catch((error) => reportError(error.message))
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  React.useEffect(() => {
    // First get cookie
    const resToken = cookie.get('token');
    if (resToken) {
      // Try to use the token to login
      getUserByToken(resToken)
        .then((resUser) => {
          setUser(resUser);
          setToken(resToken);
        })
        .catch((resError) => {
          console.error(resError);
          setUser(undefined);
          setToken(undefined);
          cookie.remove('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setUser(undefined);
      setLoading(false);
    }
    return () => {
      setToken(undefined);
      setUser(undefined);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        requestPasswordReset,
        resetPassword,
        logout,
        user,
        loading,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const withAuth = (ComposedComponent: any) => {
  const DecoratedComponent = () => (
    <AuthContext.Consumer>
      {(auth: AuthProps) => (
        <ComposedComponent
          user={auth.user}
          loading={auth.loading}
          token={auth.token}
        />
      )}
    </AuthContext.Consumer>
  );
  return DecoratedComponent;
};
