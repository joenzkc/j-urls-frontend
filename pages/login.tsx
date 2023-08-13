import Container from "@/components/Container";
import { signIn } from "@/components/api/apiHelper";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import moment from "moment";
import { useAuth } from "@/components/AuthContext";
import Head from "next/head";

//TODO: some weird bug with auto fill not working
const login = () => {
  const usernameElement = useRef<HTMLInputElement>(null);
  const passwordElement = useRef<HTMLInputElement>(null);

  const { user, logout } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  useEffect(() => {
    setName(usernameElement?.current?.value ?? "");
    setPassword(passwordElement?.current?.value ?? "");
  }, [usernameElement, passwordElement]);

  // const onBlurName = () => {
  //   setName(name)
  // }

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onClickSignup = () => {
    router.push("/signup");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name === "") {
      setIsUsernameEmpty(true);
      return;
    }

    if (password === "") {
      setIsPasswordEmpty(true);
      return;
    }

    const dto = { username: name, password };
    setIsPasswordEmpty(false);
    setIsUsernameEmpty(false);
    try {
      setIsLoading(true);
      const data = await signIn(name, password);
      const token = data.token;
      const expires = moment().add(30, "minutes").toDate();
      Cookies.set("accessToken", token, { expires: expires, sameSite: "lax" });
      setIsLoading(false);
      setIsLoggedIn(true);
      router.push("/");
    } catch (err: any) {
      console.log(err.response);
      setIsError(true);
    }
  };

  if (user) {
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>JURL: Login</title>
      </Head>
      <Container>
        <form
          className="flex flex-col flex-1 p-2 w-full max-w-2xl"
          onSubmit={handleLogin}
        >
          <div className="grid container grid-cols-1 bg-white rounded-md p-4">
            <h1 className="text-lg font-archivo text-center">Login</h1>
            <div className="">
              <div className="flex flex-col flex-1">
                <p className="my-2 font-montserrat text-gray-800">Name</p>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-400 rounded-lg px-2 h-10 focus:outline-none"
                  placeholder="Enter your name"
                  ref={usernameElement}
                  onInput={handleChangeName}
                />
                {isUsernameEmpty ? (
                  <p className="text-red-500 mt-1">Username cannot be empty</p>
                ) : (
                  ""
                )}
              </div>
              <div className="flex flex-col flex-1">
                <p className="my-2 font-montserrat text-gray-800">Password</p>
                <input
                  type="password"
                  className="bg-gray-50 border border-gray-400 rounded-lg px-2 h-10 focus:outline-none"
                  placeholder="Enter your name"
                  ref={passwordElement}
                  onInput={handleChangePassword}
                />
                {isPasswordEmpty ? (
                  <p className="text-red-500 mt-1">Password cannot be empty</p>
                ) : (
                  ""
                )}
              </div>
              {isError ? (
                <div>
                  <p className="text-red-500 mt-1">
                    Failed to login! Please check your username and password.
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>

            <div>
              <button
                className="bg-bright_pink rounded-xl mt-2 min-h-[3rem] w-full"
                // onClick={onClickLogin}
                type="submit"
              >
                {isLoading ? (
                  <div className="flex flex-1 items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
                  </div>
                ) : (
                  <p className=" text-lg text-gray-50">Sign In</p>
                )}
              </button>
            </div>
            <div className="mt-1">
              <p
                className="text-blue-500 cursor-pointer"
                onClick={onClickSignup}
              >
                Not a user? Sign up!
              </p>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default login;
