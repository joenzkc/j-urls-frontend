import Image from "next/image";
import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const loggedInMenu = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Logout", href: "/logout" },
  ];

  const loggedOutMenu = [
    { name: "Home", href: "/" },
    { name: "Login", href: "/login" },
    { name: "Sign up", href: "/signup" },
  ];

  return (
    <header className=" bg-light_blue">
      <nav className="mx-auto flex max-w-7xl py-2 px-4 justify-between items-center">
        <div className="flex lg:flex-1">
          <Link href="/" className="">
            <span>
              <Image
                className="bg-light_blue h-16 w-auto"
                src="/logo.png"
                alt="logo"
                width={64}
                height={64}
              />
            </span>
          </Link>
        </div>
        <button
          className="sm:hidden hover:text-gray-600 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <MenuIcon />
        </button>
        <div className="hidden sm:block hover:text-gray-600 focus:outline-none">
          {/* Test */}
          {user
            ? loggedInMenu.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="ml-4 px-3 py-2 text-md font-medium text-white rounded-md hover:text-gray-600"
                >
                  {item.name}
                </a>
              ))
            : loggedOutMenu.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="ml-4 px-3 py-2 text-md font-medium text-white rounded-md hover:text-gray-600"
                >
                  {item.name}
                </a>
              ))}
        </div>
        {isMenuOpen && (
          <div className="absolute right-0 w-48 mt-44">
            <ul className="bg-white shadow-lg rounded-lg py-2">
              {user
                ? loggedInMenu.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-600 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))
                : loggedOutMenu.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-600 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
