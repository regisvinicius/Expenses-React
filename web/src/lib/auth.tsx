import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { kindeConfig } from './kinde-config';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  const getUserInfo = useCallback(async (token: string) => {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3 && tokenParts[1]) {
        const payload = JSON.parse(atob(tokenParts[1]));
        
        return {
          id: payload.sub,
          email: payload.email,
          name: payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim(),
        };
      }
    } catch {
      // Token decode failed
    }
    return null;
  }, []);

  const exchangeCodeForToken = useCallback(async (code: string) => {
    try {
      const response = await fetch('https://regisrodrigues.kinde.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: kindeConfig.clientId,
          client_secret: kindeConfig.clientSecret,
          code: code,
          redirect_uri: kindeConfig.postLoginRedirectUrl,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('kinde_token', data.access_token);
        localStorage.setItem('kinde_id_token', data.id_token);
        
        const userInfo = await getUserInfo(data.id_token);
        if (userInfo) {
          setUser(userInfo);
        }
      }
    } catch {
      // Token exchange failed
    }
  }, [getUserInfo]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const storedState = localStorage.getItem('kinde_state');

        if (code && state && state === storedState) {
          await exchangeCodeForToken(code);
          window.history.replaceState({}, document.title, window.location.pathname);
          localStorage.removeItem('kinde_state');
        }

        const token = localStorage.getItem('kinde_token');
        const idToken = localStorage.getItem('kinde_id_token');
        if (token && idToken) {
          const userInfo = await getUserInfo(idToken);
          if (userInfo) {
            setUser(userInfo);
          } else {
            localStorage.removeItem('kinde_token');
            localStorage.removeItem('kinde_id_token');
          }
        }
      } catch {
        localStorage.removeItem('kinde_token');
        localStorage.removeItem('kinde_id_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [exchangeCodeForToken, getUserInfo]);

  const login = () => {
    const state = crypto.randomUUID();
    localStorage.setItem('kinde_state', state);
    
    const kindeUrl = `${kindeConfig.issuerUrl}/oauth2/auth?client_id=${kindeConfig.clientId}&redirect_uri=${kindeConfig.postLoginRedirectUrl}&response_type=code&scope=openid profile email&state=${state}`;
    window.location.href = kindeUrl;
  };

  const logout = () => {
    localStorage.removeItem('kinde_token');
    localStorage.removeItem('kinde_id_token');
    localStorage.removeItem('kinde_state');
    setUser(null);
    
    window.location.href = kindeConfig.postLogoutRedirectUrl;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
