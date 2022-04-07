import React from "react";
import { useState } from "react"; // import state
import Link from "next/link";
import Image from "next/image";
import cubanseaLogo from "../assets/cubansea-logo.png";
import { AiOutlineSearch } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";

const style = {
  wrapper: `bg-[#04111d] w-screen px-[1.2rem] py-[0.8rem] `,
  navBar: ` mx-auto px-4 flex min-w-full max-w-7xl `,
  logoContainer: `cursor-pointer flex items-center`,
  logoText: `ml-[0.8rem] text-white font-semibold text-2xl`,
  // searchBar: `flex-1 mx-[0.8rem] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#4c505c]`,
  // searchIcon: `text-[#8a939b] mx-3 font-bold text-lg`,
  // searchInput: `h-[2.6rem] min-w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
  headerItems: `menu flex hidden md:flex items-center space-x-1`,
  headerItem: `text-white px-4 font-bold text-[#c8cacd] hover:text-white cursor-pointer`,
  headerIcon: `text-[#8a939b] text-3xl font-black px-4 hover:text-white cursor-pointer`,
};

const Header = () => {
  return (
    <div className={style.wrapper}>
      <nav className={style.navBar}>
        <div className={style.headerItems}></div>
      </nav>
      <div className="navbar">
        <div className="navbar-start">
          <Link href="/">
            <div className={style.logoContainer}>
              <Image src={cubanseaLogo} height={40} width={40} />
              <div className={style.logoText}>CubanSea</div>
            </div>
          </Link>
        </div>
        <div className="navbar-center">
          <div className={style.searchBar}>
            <div className={style.searchIcon}>
              <AiOutlineSearch />
            </div>
            <input
              className={style.searchInput}
              placeholder="Search items, collections, and accounts"
            />
          </div>
        </div>
        <div className="navbar-end">
          <ul className="menu menu-horizontal p-0 hidden lg:flex">
            <li>
              <Link href="/marketplace">
                <div className={style.headerItem}>Marketplace</div>
              </Link>
            </li>
            {/* <div className={style.headerItem}>Stats</div> */}
            <li>
              <Link href="/create">
                <div className={style.headerItem}>Create</div>
              </Link>
            </li>
            <li>
              <Link href="/my-nfts">
                <div className={style.headerItem}>My NFTs</div>
              </Link>
            </li>
            <li>
              <Link href="/account">
                <div className={style.headerIcon}>
                  <CgProfile />
                </div>
              </Link>
            </li>
            <li>
              <div className={style.headerIcon}>
                <MdOutlineAccountBalanceWallet />
              </div>
            </li>
          </ul>
          <div className="dropdown dropdown-end">
            <label tabIndex="0" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex="0"
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
              <Link href="/marketplace">
                <div className={style.headerItem}>Marketplace</div>
              </Link>
            </li>
            {/* <div className={style.headerItem}>Stats</div> */}
            <li>
              <Link href="/create">
                <div className={style.headerItem}>Create</div>
              </Link>
            </li>
            <li>
              <Link href="/my-nfts">
                <div className={style.headerItem}>My NFTs</div>
              </Link>
            </li>
            <li>
              <Link href="/account">
                <div className={style.headerIcon}>
                  <CgProfile />
                </div>
              </Link>
            </li>
            <li>
              <div className={style.headerIcon}>
                <MdOutlineAccountBalanceWallet />
              </div>
            </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
