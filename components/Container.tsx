import React from "react";
import Header from "./Header";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="bg-light_blue">
      <Header />
      <div className="mx-auto flex items-center flex-col bg-light_blue min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Container;
