import Container from "@/components/Container";
import { signUp } from "@/components/api/apiHelper";
import { LoginDto } from "@/components/util/LoginDto";
import { validateOrReject } from "class-validator";
import { useRouter } from "next/router";
import React, { useState } from "react";

const signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userTaken, setUserTaken] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const router = useRouter();

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onClickSignUp = async () => {
    const dto: LoginDto = { username: name, password };
    try {
      await validateOrReject(dto);
    } catch (err) {
      setIsError(true);
      return;
    }

    try {
      setIsLoading(true);
      await signUp(name, password);
      setIsLoading(false);
      setIsError(false);
      setUserTaken(false);
      setIsSignedUp(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      if (err.response.data.errorType === "QueryFailedError") {
        setUserTaken(true);
      }
      setIsError(true);
    }
  };

  return (
    <Container>
      <div className="flex flex-col flex-1 p-2 w-full max-w-2xl">
        <div className="grid container grid-cols-1 bg-white rounded-md p-4">
          <h1 className="text-lg font-archivo text-center">Welcome</h1>
          <div className="">
            <div className="flex flex-col flex-1">
              <p className="my-2 font-montserrat text-gray-800">Name</p>
              <input
                type="text"
                className="bg-gray-50 border border-gray-400 rounded-lg px-2 h-10 focus:outline-none"
                placeholder="Enter your name"
                onChange={handleChangeName}
              />
            </div>
            <div className="flex flex-col flex-1">
              <p className="my-2 font-montserrat text-gray-800">Password</p>
              <input
                type="password"
                className="bg-gray-50 border border-gray-400 rounded-lg px-2 h-10 focus:outline-none"
                placeholder="Enter your name"
                onChange={handleChangePassword}
              />
            </div>
            {isError ? (
              <div>
                <p className="text-red-500 mt-1">
                  Password must be at least 8 characters long and less than 20
                  characters
                </p>
              </div>
            ) : (
              ""
            )}
            {userTaken ? (
              <div>
                <p className="text-red-500 mt-1">
                  That username has already been taken
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
          <div>
            <button
              className="bg-bright_pink rounded-xl mt-3 min-h-[3rem] w-full"
              onClick={onClickSignUp}
            >
              {isLoading ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
                </div>
              ) : (
                <p className=" text-lg text-gray-50">Sign Up</p>
              )}
            </button>
          </div>
          {isSignedUp ? (
            <div>
              <p className="text-green-500 mt-1">
                You have successfully signed up! Redirecting to login page...
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </Container>
  );
};

export default signup;
