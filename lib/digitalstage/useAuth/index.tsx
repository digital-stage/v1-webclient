import React, {useCallback, useEffect, useState} from "react";
import cookie from 'js-cookie';

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

    createUserWithEmailAndPassword(email: string, password: string, optional?: {
        name: string;
        avatarUrl?: string;
    }): Promise<any>;

    signInWithEmailAndPassword(email: string, password: string): Promise<any>;

    requestPasswordReset(email: string): Promise<any>;

    resetPassword(resetToken: string, password: string): Promise<any>;

    logout(): Promise<any>;
}

const AuthContext = React.createContext<AuthProps>(undefined);

export const useAuth = (): AuthProps => React.useContext<AuthProps>(AuthContext);

const getUserByToken = (token: string): Promise<AuthUser> => fetch(process.env.NEXT_PUBLIC_AUTH_URL + "/profile", {
    headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + token
    }
}).then(result => result.json()).then(json => json as AuthUser);

export const AuthContextProvider = (props: {
    children: React.ReactNode
}) => {
    const [token, setToken] = useState<string>();
    const [user, setUser] = useState<AuthUser>();
    const [loading, setLoading] = useState<boolean>(true);

    const createUserWithEmailAndPassword = useCallback((email: string, password: string, additional?: {
        name: string;
        avatarUrl?: string;
    }) => {
        setLoading(true);
        return fetch(process.env.NEXT_PUBLIC_AUTH_URL + "/signup", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
                name: additional ? additional.name : "",
                avatarUrl: additional ? additional.avatarUrl : "",
            })
        })
            .then(result => {
                if (result.ok)
                    return result.json();
                throw new Error(result.statusText);
            })
            .then(token => getUserByToken(token)
                .then(user => {
                    setUser(user);
                    setToken(token);
                    cookie.set('token', token, {expires: 7});
                }))
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const signInWithEmailAndPassword = useCallback((email: string, password: string) => {
        setLoading(true);
        return fetch(process.env.NEXT_PUBLIC_AUTH_URL + "/login", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(result => {
                if (result.ok)
                    return result.json();
                throw new Error(result.statusText);
            })
            .then(token => getUserByToken(token)
                .then(user => {
                    setUser(user);
                    setToken(token);
                    cookie.set('token', token, {expires: 7});
                }))
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const requestPasswordReset = useCallback((email: string) => {
        return fetch(process.env.NEXT_PUBLIC_AUTH_URL + "/forgot",
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    email: email
                })
            }
        )
            .then(result => {
                if (!result.ok) {
                    throw new Error("Unbekannte E-Mail Adresse")
                }
            });
    }, []);

    const resetPassword = useCallback((resetToken: string, password: string) => {
        return fetch(process.env.NEXT_PUBLIC_AUTH_URL + "/reset",
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    token: resetToken,
                    password: password
                })
            }
        )
            .then(result => {
                if (!result.ok) {
                    throw new Error("Abgelaufener Link")
                }
            });
    }, []);

    const logout = useCallback(() => {
        setLoading(true);
        return fetch(process.env.NEXT_PUBLIC_AUTH_URL + "/logout",
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token
                },
                method: "POST"
            }
        )
            .then(result => {
                if (result.ok) {
                    cookie.remove('token');
                    setToken(undefined);
                    setUser(undefined);
                }
            })
            .finally(() => {
                setLoading(false);
            })
    }, [token]);

    useEffect(() => {
        // First get cookie
        const token = cookie.get('token');
        if (token) {
            // Try to use the token to login
            getUserByToken(token)
                .then(user => {
                    setUser(user);
                    setToken(token);
                })
                .catch(error => {
                    console.error(error);
                    setUser(undefined);
                    setToken(undefined);
                    cookie.remove('token');
                })
                .finally(() => {
                    setLoading(false);
                })
        } else {
            setUser(undefined);
            setLoading(false);
        }
        return () => {
            console.log("[useAuth] Cleaning up");
            setToken(undefined);
            setUser(undefined);
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            createUserWithEmailAndPassword: createUserWithEmailAndPassword,
            signInWithEmailAndPassword: signInWithEmailAndPassword,
            requestPasswordReset: requestPasswordReset,
            resetPassword: resetPassword,
            logout: logout,
            user: user,
            loading: loading,
            token: token
        }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export const withAuth = (ComposedComponent: any) => {
    const DecoratedComponent = (props: any) => {
        return (
            <AuthContext.Consumer>
                {(auth: AuthProps) => (
                    <ComposedComponent user={auth.user} loading={auth.loading} token={auth.token} {...props} />
                )}
            </AuthContext.Consumer>
        );
    };
    return DecoratedComponent;
};
