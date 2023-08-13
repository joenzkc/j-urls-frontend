// import Container from "postcss/lib/container";

import { useAuth } from "@/components/AuthContext";
import Container from "@/components/Container";
import api, {
  createAnonUrl,
  createCustomUrl,
  createUrl,
} from "@/components/api/apiHelper";
import { ValidUrlDto } from "@/components/util/ValidUrlDto";
import { plainToClass } from "class-transformer";
import { ValidationError, validateOrReject } from "class-validator";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import Popup from "@/components/Popup";
import { validateCustomString } from "@/components/util/util";
import { Transition } from "react-transition-group";
import Head from "next/head";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LoadingComponent from "@/components/loadingComponent";
import { UserDto } from "@/components/util/UserDto";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const { user } = useAuth();
  const token = context.req.cookies.accessToken;

  if (!token) {
    return { props: { user: null } };
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

const Home: React.FC<{ user: UserDto }> = ({ user }) => {
  const router = useRouter();
  // const { user, logout } = useAuth();

  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [invalidUrl, setInvalidUrl] = useState(false);
  const [invalidCustomUrl, setInvalidCustomUrl] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [showLoggedOutPopup, setShowLoggedOutPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // console.log(router.query);
    if (router.query.logout) {
      setShowLoggedOutPopup(true);
      setTimeout(() => setShowLoggedOutPopup(false), 2000);
    }
  }, [router.query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUrl(e.target.value);
  };

  const onClickShorten = async () => {
    try {
      setIsLoading(true);
      const dto: ValidUrlDto = plainToClass(ValidUrlDto, { url });
      await validateOrReject(dto);
      setInvalidUrl(false);
      let res;
      if (user) {
        res = await createUrl(url);
      } else {
        res = await createAnonUrl(url);
      }
      setShortUrl(res.hashUrl);
      setError("");
      setInvalidUrl(false);
      setInvalidCustomUrl(false);
    } catch (err: any) {
      if (err.length > 0) {
        if (
          err[0] instanceof ValidationError ||
          err.response.data.message === "Custom URL already exists"
        ) {
          console.log("validation error");
          setInvalidUrl(true);
          setError("Custom URL already exists");
        }
      }
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickCustomShorten = async () => {
    try {
      setIsLoading(true);
      const validUrl = validateCustomString(customUrl);

      if (!validUrl) {
        setInvalidCustomUrl(true);
        return;
      }

      if (url === "") {
        setInvalidUrl(true);
        return;
      }

      setInvalidUrl(false);
      setInvalidCustomUrl(false);
      const res = await createCustomUrl(url, customUrl);
      setShortUrl(res.hashUrl);
      setError("");
      setInvalidUrl(false);
      setInvalidCustomUrl(false);
    } catch (err: any) {
      console.log(err.response.data.error.message);
      if (err.length > 0 && err[0] instanceof ValidationError) {
        setInvalidUrl(true);
        setError("Custom URL already exists");
      }

      if (err.response.data.error.message === "Custom URL already exists") {
        setError("Custom URL already exists");
      }
      // }
      else {
        setError("Error creating custom URL");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onClickCopy = () => {
    // copy to clipboard the test in the span
    const text = `${process.env.NEXT_PUBLIC_FRONTEND_URL}${shortUrl}`;
    navigator.clipboard.writeText(text);
    setShowCopyPopup(true);
    setTimeout(() => {
      setShowCopyPopup(false);
    }, 2000);
  };

  const onClickSignUp = () => {
    router.push("/signup");
  };

  const onClickLogin = () => [router.push("/login")];

  return (
    <>
      <Head>
        <title>JURL: A URL shortener</title>
      </Head>
      <Container>
        <div className="flex flex-col flex-1 p-2 w-full max-w-2xl">
          <div className="bg-white rounded-md p-4 flex flex-col shadow-lg">
            <div className=" min-h-[2rem]">
              <p className="font-lato text-lg">
                {!user ? "Try shortening a URL!" : "Shorten a URL"}
              </p>
            </div>
            <div className="mt-1 flex-1 flex">
              <input
                className={`border-2 font-lato ${
                  invalidUrl || error ? "border-red-500" : "border-gray-300"
                } bg-white h-10 px-2 rounded-lg text-md flex-1 focus:outline-none`}
                placeholder="Enter your link here..."
                onChange={handleChange}
              />
            </div>
            <div className="my-2 flex flex-col flex-1">
              {invalidUrl ? (
                <p className="text-red-500 font-lato mb-2">Invalid url</p>
              ) : (
                ""
              )}

              <button
                className="flex-1 bg-violet_purple rounded-xl  font-montserrat min-h-[3rem]"
                onClick={onClickShorten}
              >
                {isLoading ? (
                  <div className="flex flex-1 justify-center items-center">
                    <LoadingComponent />
                  </div>
                ) : (
                  <p className=" text-lg text-gray-50">Shorten!</p>
                )}
              </button>
            </div>
          </div>

          {user ? (
            <div className="bg-white rounded-md mt-2 p-4 flex flex-col shadow-lg">
              <div className="flex items-center font-lato text-lg">
                <p>Create Custom URL</p>
                {/* <div></div>
                 */}
                <InfoIcon
                  className="ml-2 cursor-pointer"
                  onClick={() => setShowPopup(true)}
                />
              </div>
              <div className="mt-1 flex-1 grid container grid-cols-1 md:grid-cols-2">
                <span className="border-2 bg-gray-200 border-gray-300 h-10 px-2 text-md rounded-lg flex items-center font-lato">
                  <p>{process.env.NEXT_PUBLIC_FRONTEND_URL}</p>
                </span>
                <div className="flex flex-1 items-center justify-center">
                  <input
                    className={`border-2 ${
                      invalidCustomUrl || error
                        ? "border-red-500"
                        : "border-gray-300"
                    } bg-white h-10 px-2 rounded-lg text-md flex-1 focus:outline-none`}
                    placeholder="Enter your custom link here..."
                    onChange={handleCustomChange}
                  />
                </div>
              </div>
              <div className="my-2 flex flex-col flex-1">
                {invalidCustomUrl ? (
                  <p className="text-red-500 mb-2 font-lato">Invalid url</p>
                ) : (
                  ""
                )}
                {error ? (
                  <p className="text-red-500 font-lato mb-2">{error}</p>
                ) : (
                  ""
                )}
                <button
                  className="flex-1 bg-bright_pink rounded-xl min-h-[3rem]"
                  onClick={onClickCustomShorten}
                >
                  {isLoading ? (
                    <div className="flex flex-1 justify-center items-center">
                      <LoadingComponent />
                    </div>
                  ) : (
                    <p className=" text-lg text-gray-50 font-montserrat">
                      Shorten!
                    </p>
                  )}
                </button>
              </div>
              {showPopup && (
                <Popup setShowPopup={setShowPopup}>
                  <p>
                    Shortened URL cannot have any unauthorized characters, must
                    be at least 5 characters long and less than 20 characters.
                    It must also be unique
                  </p>
                </Popup>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-md mt-2 p-4 flex flex-col font-lato">
              <p>Want to make your own custom URL?</p>
              <button
                className="my-2 flex-1 bg-bright_yellow rounded-xl min-h-[3rem] font-montserrat"
                onClick={onClickSignUp}
              >
                <p className=" text-lg text-gray-50">Sign up</p>
              </button>
              <p
                className="text-sm text-blue-500 self-center hover:cursor-pointer"
                onClick={onClickLogin}
              >
                Already have an account? Login
              </p>
            </div>
          )}
          {shortUrl !== "" ? (
            <div className="bg-white rounded-md mt-2 p-4 flex flex-col min-h-[6rem] font-lato shadow-lg">
              <p>Your shortened url is:</p>
              <span className="bg-gray-200 border-2 border-gray-300 flex-1 h-10 px-2 rounded-lg text-md flex justify-center items-center">
                <p className="truncate flex-1">
                  {process.env.NEXT_PUBLIC_FRONTEND_URL}
                  {shortUrl}
                </p>
                <ContentCopyIcon
                  className="self-center w-6 h-6 hover:cursor-pointer"
                  onClick={onClickCopy}
                />
              </span>
            </div>
          ) : (
            <></>
          )}
          {showCopyPopup && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded font-lato">
              Copied to clipboard!
            </div>
          )}
          {showLoggedOutPopup && (
            <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded font-lato ">
              <div className="">You have been logged out!</div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default Home;
