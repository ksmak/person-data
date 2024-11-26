'use client'

import { useState, createContext, useContext, SetStateAction, Dispatch } from "react";
import { Subscription, User } from "@prisma/client";


export type CurrentUserType =
  | ({
    subs: Subscription | null;
  } & User) | undefined;

interface AuthContextValue {
  currentUser?: CurrentUserType;
  setCurrentUser?: Dispatch<SetStateAction<CurrentUserType>>;
}

export const AuthContext = createContext<AuthContextValue>({});

export function useAuth() {
  return useContext(AuthContext);
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUserType>();

  const ctx = {
    currentUser: currentUser,
    setCurrentUser: setCurrentUser,
  };

  return (
    <AuthContext.Provider value={ctx}>
      {children}
    </AuthContext.Provider>
  );
}