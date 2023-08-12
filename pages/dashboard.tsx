import Container from "@/components/Container";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { UserDto } from "@/components/util/UserDto";
import api, { getQrCode, getUsersUrls } from "@/components/api/apiHelper";
import { UrlDto, UrlDto } from "@/components/util/UrlDto";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Popup from "@/components/Popup";
import { URL } from "url";
import QRCode from "react-qr-code";
import DeletePopup from "@/components/DeletePopup";

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

  useEffect(() => {
    if (!user) {
      return;
    }

    getUsersUrls()
      .then((res) => {
        setUrls(res);
      })
      .catch((err) => {
        console.log(err);
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
                    <p className="font-lato text-lg font-bold truncate">
                      {process.env.NEXT_PUBLIC_FRONTEND_URL}
                      {url.hashUrl}
                    </p>
                    <p className="font-lato text-sm text-bright_pink">
                      {url.url}
                    </p>
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
  );
};

export default dashboard;
