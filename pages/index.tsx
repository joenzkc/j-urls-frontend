// import Container from "postcss/lib/container";

import Container from "@/components/Container";
import { createAnonUrl } from "@/components/api/apiHelper";
import { ValidUrlDto } from "@/components/util/ValidUrlDto";
import { plainToClass } from "class-transformer";
import { ValidationError, validateOrReject } from "class-validator";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [invalidUrl, setInvalidUrl] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
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

  const onClickCopy = () => {
    // copy to clipboard the test in the span
    const text = `${process.env.NEXT_PUBLIC_FRONTEND_URL}${shortUrl}`;
    navigator.clipboard.writeText(text);
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
              } bg-white h-10 px-2 pr-16 rounded-lg text-md flex-1 focus:outline-none`}
              type="search"
              name="search"
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

        {shortUrl !== "" ? (
          <div className="bg-white rounded-md mt-2 p-4 flex flex-col min-h-[6rem]">
            <p>Your shortened url is:</p>
            <span className="bg-gray-300 flex-1 h-10 px-2 rounded-lg text-md flex justify-center items-center">
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
      </div>
    </Container>
  );
}
