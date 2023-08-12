// import Container from "postcss/lib/container";

import { useAuth } from "@/components/AuthContext";
import Container from "@/components/Container";
import { createAnonUrl, createCustomUrl } from "@/components/api/apiHelper";
import { ValidUrlDto } from "@/components/util/ValidUrlDto";
import { plainToClass } from "class-transformer";
import { ValidationError, validateOrReject } from "class-validator";
import { useRouter } from "next/router";
import { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import Popup from "@/components/Popup";
import { validateCustomString } from "@/components/util/util";

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [invalidUrl, setInvalidUrl] = useState(false);
  const [invalidCustomUrl, setInvalidCustomUrl] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUrl(e.target.value);
  };

  const onClickShorten = async () => {
    try {
      const dto: ValidUrlDto = plainToClass(ValidUrlDto, { url });
      await validateOrReject(dto);
      const res = await createAnonUrl(url);
      setShortUrl(res.hashUrl);
    } catch (err: any) {
      if (err.length > 0) {
        if (err[0] instanceof ValidationError) {
          console.log("validation error");
          setInvalidUrl(true);
        }
      }
      console.log(err);
    }
  };

  const onClickCustomShorten = async () => {
    try {
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
    } catch (err: any) {
      console.log(err);
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
    <Container>
      <div className="flex flex-col flex-1 p-2 w-full max-w-2xl">
        <div className="bg-white rounded-md p-4 flex flex-col">
          <div className=" min-h-[2rem]">
            <p className="font-lato font-light">Try shortening a URL!</p>
          </div>
          <div className="mt-1 flex-1 flex">
            <input
              className={`border-2 ${
                invalidUrl || error ? "border-red-500" : "border-gray-300"
              } bg-white h-10 px-2 rounded-lg text-md flex-1 focus:outline-none`}
              placeholder="Enter your link here..."
              onChange={handleChange}
            />
          </div>
          <div className="my-2 flex flex-col flex-1">
            {invalidUrl ? <p className="text-red-500 mb-2">Invalid url</p> : ""}
            <button
              className="flex-1 bg-violet_purple rounded-xl min-h-[3rem]"
              onClick={onClickShorten}
            >
              <p className=" text-lg text-gray-50">Shorten!</p>
            </button>
          </div>
          {/* <div className="bg-red-100">Test</div> */}
        </div>

        {user ? (
          // <>Welcome back {user.username}</>
          <div className="bg-white rounded-md mt-2 p-4 flex flex-col">
            <div className="flex items-center">
              <p>Create Custom URL</p>
              {/* <div></div>
               */}
              <InfoIcon className="ml-2" onClick={() => setShowPopup(true)} />
            </div>
            <div className="mt-1 flex-1 grid container grid-cols-1 md:grid-cols-2">
              <span className="border-2 bg-gray-200 border-gray-300 h-10 px-2 text-md rounded-lg flex items-center">
                <p>{process.env.NEXT_PUBLIC_FRONTEND_URL}</p>
              </span>
              <input
                className={`border-2 ${
                  invalidCustomUrl || error
                    ? "border-red-500"
                    : "border-gray-300"
                } bg-white h-10 px-2 rounded-lg text-md flex-1 focus:outline-none mt-1`}
                placeholder="Enter your custom link here..."
                onChange={handleCustomChange}
              />
            </div>
            <div className="my-2 flex flex-col flex-1">
              {invalidCustomUrl ? (
                <p className="text-red-500 mb-2">Invalid url</p>
              ) : (
                ""
              )}
              <button
                className="flex-1 bg-bright_pink rounded-xl min-h-[3rem]"
                onClick={onClickCustomShorten}
              >
                <p className=" text-lg text-gray-50">Shorten!</p>
              </button>
            </div>
            {showPopup && (
              <Popup setShowPopup={setShowPopup}>
                <p>
                  Shortened URL cannot have any unauthorized characters, must be
                  at least 5 characters long and less than 20 characters. It
                  must also be unique
                </p>
              </Popup>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-md mt-2 p-4 flex flex-col">
            <p>Want to make your own custom URL?</p>
            <button
              className="my-2 flex-1 bg-bright_yellow rounded-xl min-h-[3rem]"
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
          <div className="bg-white rounded-md mt-2 p-4 flex flex-col min-h-[6rem]">
            <p>Your shortened url is:</p>
            <span className="bg-gray-200 border-2 border-gray-300 flex-1 h-10 px-2 rounded-lg text-md flex justify-center items-center">
              <p className="truncate flex-1">
                {process.env.NEXT_PUBLIC_FRONTEND_URL}
                {shortUrl}
              </p>
              <img
                alt=""
                src="/content-copy.png"
                className="self-center w-6 h-6 hover:cursor-pointer"
                onClick={onClickCopy}
              />
            </span>
          </div>
        ) : (
          <></>
        )}
        {showCopyPopup && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded">
            Copied to clipboard!
          </div>
        )}
      </div>
    </Container>
  );
}
