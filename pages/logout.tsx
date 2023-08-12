import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const logout = () => {
  const { logout } = useAuth();
  const router = useRouter();
  // logout();
  useEffect(() => {
    logout();
    router.push({ pathname: "/", query: { logout: true } });
  }, []);

  return <div></div>;
};

export default logout;
