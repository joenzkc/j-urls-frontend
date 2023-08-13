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
import Popup from "@/components/Popup";
import QRCode from "react-qr-code";
import DeletePopup from "@/components/DeletePopup";
import Head from "next/head";
import moment from "moment";

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
  const [qrCode, setQrCode] = useState<string>("");
  const [showQrCode, setShowQrCode] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState<UrlDto>();
  const [showSuccessfulDelete, setShowSuccessfulDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    setIsLoading(true);

    getUsersUrls()
      .then((res) => {
        setUrls(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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
  }, [showSuccessfulDelete]);

  const onClickQr = async (url: string) => {
    try {
      // const qr = await getQrCode(url);
      setQrCode(url);
      setShowQrCode(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onClickCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setShowCopy(true);
    setTimeout(() => {
      setShowCopy(false);
    }, 2000);
  };

  const onClickDelete = (url: UrlDto) => {
    setShowConfirmDeleteModal(true);
    setDeletingUrl(url);
  };

  return (
    // <div>dashboard</div>
    <>
      <Head>
        <title>JURL: Dashboard</title>
      </Head>
      <Container>
        <div className="flex flex-col flex-1 p-2 w-full max-w-2xl">
          <div className="bg-white rounded-md p-4 flex flex-col">
            <h1 className="font-lato font-semibold text-xl">
              Welcome, {user.username}
            </h1>
            <div className="mt-1 flex flex-col min-h-[40rem]">
              <h2 className="font-lato text-lg">Your Recent URLs</h2>
              {isLoading && (
                <div className="flex flex-1 items-center justify-center h-full bg-gray-200 opacity-70 w-full">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              )}
              {urls.length === 0 ? (
                <p className="font-lato text-sm">
                  You have no URLs, Create one now!
                </p>
              ) : (
                <div className="grid container grid-cols-1 font-lato ">
                  {urls.map((url, index) => (
                    <div
                      className="border-2 rounded-md p-2 border-gray-200 mt-1 flex flex-col"
                      key={index}
                    >
                      <div className="flex flex-1">
                        <a
                          href={
                            process.env.NEXT_PUBLIC_FRONTEND_URL + url.hashUrl
                          }
                          className="font-lato text-lg font-bold truncate hover:text-gray-500"
                        >
                          {process.env.NEXT_PUBLIC_FRONTEND_URL}
                          {url.hashUrl}
                        </a>
                      </div>
                      <div className="flex flex-1">
                        <a
                          href={url.url}
                          className="font-lato text-sm text-bright_pink truncate hover:text-pink-400"
                        >
                          {url.url}
                        </a>
                      </div>
                      <div>
                        <p className="text-sm">
                          Created {moment(url.createdAt).fromNow()}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center">
                        <div
                          className="hover:cursor-pointer hover:bg-gray-200 items-center justify-center flex rounded-xl p-1"
                          onClick={() =>
                            onClickQr(
                              process.env.NEXT_PUBLIC_FRONTEND_URL + url.hashUrl
                            )
                          }
                        >
                          <QrCodeScannerIcon className="w-6 h-6" />
                        </div>
                        <div
                          className="hover:cursor-pointer hover:bg-gray-200 items-center justify-center flex rounded-xl p-1 "
                          onClick={() =>
                            onClickCopy(
                              process.env.NEXT_PUBLIC_FRONTEND_URL + url.hashUrl
                            )
                          }
                        >
                          <ContentCopyIcon className="w-6 h-6" />
                        </div>
                        <div
                          className="hover:cursor-pointer hover:bg-gray-200 items-center justify-center flex rounded-xl p-1"
                          onClick={() => onClickDelete(url)}
                        >
                          <DeleteOutlineIcon className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {showQrCode && (
              <Popup setShowPopup={setShowQrCode}>
                <QRCode value={qrCode}></QRCode>
              </Popup>
            )}
            {showCopy && (
              <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded">
                Copied to clipboard!
              </div>
            )}
            {showConfirmDeleteModal && deletingUrl && (
              <DeletePopup
                setShowPopup={setShowConfirmDeleteModal}
                url={deletingUrl}
                setShowSuccessfulDelete={setShowSuccessfulDelete}
              />
            )}
            {showSuccessfulDelete && (
              <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded">
                Successfully deleted!
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default dashboard;
