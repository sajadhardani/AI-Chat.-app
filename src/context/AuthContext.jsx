"use client";

import { removeCookie,getCookie } from "@/utils/cookie";
import { tokenDecoder } from "@/utils/tokenDecoder";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token , setToken] = useState(null)
  const router = useRouter();

  console.log(user);
  useEffect(() => {
    const getUserInfo = async () => {
      const token = await getCookie("token");
      setToken(token)
      // console.log(token);
      if (token) {
        console.log(await tokenDecoder(token))
        setUser(await tokenDecoder(token));
      }
    };
    getUserInfo();
  }, []);

  const login = async(token) => {
    setUser(await tokenDecoder(token));
    router.push("/");
  };

  const logout =async () => {
    setUser(null);
    await removeCookie("token")
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout,token,setToken}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
