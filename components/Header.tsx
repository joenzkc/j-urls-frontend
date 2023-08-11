import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className=" bg-light_blue">
      <nav className="mx-auto flex max-w-7xl py-2 px-4">
        <div className="flex lg:flex-1">
          <a href="/" className="">
            <span>
              <img
                className="bg-transparent h-16 w-auto"
                src="/logo.png"
                alt="logo"
              />
            </span>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
