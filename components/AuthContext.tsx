import Cookies from "js-cookie";
import api from "./api/apiHelper";
import { UserDto } from "./util/UserDto";
import { useEffect, useState } from "react";
import { plainToClass } from "class-transformer";

export const useAuth = () => {
  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    const token = Cookies.get("accessToken") || Cookies.get("authToken");
    if (!token) {
      logout();
      return;
    }

    api
      .post("auth/verifyToken", undefined, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const dto = plainToClass(UserDto, res.data);
        setUser(dto);
      })
      .catch((err) => {
        console.log(err);
        logout();
      });
  }, []);

  const logout = () => {
    Cookies.remove("accessToken");
    setUser(null);
  };

  return { user, logout };
};
