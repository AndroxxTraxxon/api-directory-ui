import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from './Toast';

type AuthClaims = {
  sub: string;
  sub_id: string;
  aud: Array<String>;
  exp: number;
  iat: number;
  nbf: number;
};

type AuthContextType = {
  claims: AuthClaims | null,
  login: (_: string) => void,
  logout: () => void,
  authFetch: (url: string, options: RequestInit) => Promise<Response>
}

type TokenMeta = {
  token: string,
  claims: AuthClaims
}

function parseClaims(token: string): AuthClaims {
  const [_, claims64, __] = token.split('.');
  const claims = atob(claims64);
  return JSON.parse(claims);
};

function checkExpiration(claims: AuthClaims | null) {
  const currentTime = Date.now() / 1000;

  if (claims && claims.exp < currentTime) {
    return false;
  }
  return true;
};

function authorizeFetch(token: string) {
  return async function fetchAuthorized(url: string, options: RequestInit): Promise<Response> {
    const { headers, ...fetchOptions } = options;
    return await fetch(url, { ...fetchOptions, headers: { ...headers, Authorization: `Bearer ${token}` } });
  }
}

const AuthContext = createContext<AuthContextType>({
  claims: null,
  login: (_) => { },
  logout: () => { },
  authFetch: fetch,
});

export function useAuth() { return useContext(AuthContext) };

const localStorageAuthKey = "AuthorizationToken";

export function AuthProvider({ children }) {
  const [tokenMeta, setTokenMeta] = useState<TokenMeta | null>(null);
  const { publish: postMessage } = useToast();
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem(localStorageAuthKey);
    setTokenMeta(null);
    postMessage({
      message: "You have successfully logged out.",
      title: "User Logged Out",
      mode: "dismissible",
      variant: "info"
    });
    navigate("/login");
  }

  function login(jwt: string) {
    const claims = parseClaims(jwt);
    localStorage.setItem(localStorageAuthKey, jwt);
    setTokenMeta({ token: jwt, claims });
  }

  useEffect(function loadAuthToken() {
    const token = localStorage.getItem(localStorageAuthKey);
    if (token) {
      const claims = parseClaims(token);
      if (checkExpiration(claims)) {
        setTokenMeta({ token, claims });
      } else {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      claims: tokenMeta?.claims || null,
      authFetch: tokenMeta && authorizeFetch(tokenMeta?.token) || fetch,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function RequireAuth({ children, redirectTo = "/login" }) {
  const { claims, logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (claims === null) {
      return navigate(redirectTo);
    }

  }, []);

  if (!claims?.aud.includes("admin")) {
    return (<div>
      Only admins are permitted to leverage the configuration portal.
      <button type='button' onClick={logout}>Log Out</button>
      </div>);
  }

  return children;
}