'use client'

import { useState, createContext, useContext, SetStateAction, Dispatch, useEffect } from "react";
import { Subscription, User } from "@prisma/client";
import { auth } from "@/auth";
import { fetchUserByEmail } from "@/app/lib/data";
import { updateUserInfo } from "./app/lib/actions";


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

  const updateCurrentUser = async () => {
    setCurrentUser(await updateUserInfo());
  }

  const ctx = {
    currentUser: currentUser,
    setCurrentUser: setCurrentUser,
  };

  useEffect(() => {
    updateCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={ctx}>
      {children}
    </AuthContext.Provider>
  );
}