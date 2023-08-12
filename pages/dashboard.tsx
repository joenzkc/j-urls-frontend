import { useAuth } from "@/components/AuthContext";
import Container from "@/components/Container";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { plainToClass } from "class-transformer";
import { UserDto } from "@/components/util/UserDto";
import api from "@/components/api/apiHelper";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const { user } = useAuth();
  const token = context.req.cookies.accessToken;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  let user = null;
  api
    .post("auth/verifyToken", undefined, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const dto = plainToClass(UserDto, res.data);
      user = dto;
    })
    .catch((err) => {
      console.log(err);
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    });
  return {
    props: { user },
  };
};

const dashboard: React.FC<{ user: UserDto }> = ({ user }) => {
  const router = useRouter();

  console.log(user);

  // useEffect(() => {
  //   if (!user) {
  //     console.log(user);
  //     router.push({ pathname: "/login", query: { unauthorized: true } });
  //   }
  // }, [user]);

  return (
    // <div>dashboard</div>
    <Container>
      <div className="flex flex-col flex-1 p-2 w-full max-w-2xl">
        <div className="bg-white rounded-md p-4 flex flex-col">
          <h1>Welcome, {user?.username}</h1>
        </div>
      </div>
    </Container>
  );
};

export default dashboard;
