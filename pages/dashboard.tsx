import Container from "@/components/Container";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { UserDto } from "@/components/util/UserDto";
import api, { getUsersUrls } from "@/components/api/apiHelper";
import { UrlDto } from "@/components/util/UrlDto";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

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
  const [urls, setUrls] = useState<UrlDto[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    getUsersUrls()
      .then((res) => {
        console.log(res);
        setUrls(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    // <div>dashboard</div>
    <Container>
      <div className="flex flex-col flex-1 p-2 w-full max-w-2xl">
        <div className="bg-white rounded-md p-4 flex flex-col">
          <h1 className="font-montserrat font-bold text-xl">
            Welcome, {user.username}
          </h1>
          <div className="mt-1 flex flex-col min-h-[40rem]">
            <h2 className="font-lato font-semibold text-lg">Your URLs</h2>
            {urls.length === 0 ? (
              <p className="font-lato text-sm">You have no URLs</p>
            ) : (
              <div className="grid container grid-cols-1 ">
                {urls.map((url, index) => (
                  <div
                    className="border-2 rounded-md p-2 border-gray-200 mt-1"
                    key={index}
                  >
                    <p className="font-lato text-lg font-bold">
                      {process.env.NEXT_PUBLIC_FRONTEND_URL}
                      {url.hashUrl}
                    </p>
                    <p className="font-lato text-sm text-bright_pink">
                      {url.url}
                    </p>
                    <div className="mt-1">
                      <QrCodeScannerIcon />
                      <ContentCopyIcon className="ml-1" />
                      <DeleteOutlineIcon className="ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default dashboard;
