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

  try {
    const res = await api.post("auth/verifyToken", undefined, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { id, username } = res.data;
    return {
      props: { user: { id, username } },
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

const dashboard: React.FC<{ user: UserDto }> = ({ user }) => {
  const router = useRouter();

  return (
    // <div>dashboard</div>
    <Container>
      <div className="flex flex-col flex-1 p-2 w-full max-w-2xl">
        <div className="bg-white rounded-md p-4 flex flex-col">
          <h1>Welcome, {user.username}</h1>
        </div>
      </div>
    </Container>
  );
};

export default dashboard;
