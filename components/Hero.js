import React from "react";
import Link from "next/link";

const style = {
  wrapper: `relative`,
  container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('https://i.ibb.co/ZHvvFBr/istockphoto-157434748.jpg')] before:bg-cover before:bg-center before:opacity-50 before:blur-[3px]`,
  contentWrapper: `flex h-screen relative justify-center flex-wrap items-center`,
  copyContainer: `w-1/2`,
  title: `relative text-white text-[46px] font-semibold max-w-[550px]`,
  description: `text-[#d9d9d9] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem] max-w-[500px]`,
  ctaContainer: `flex`,
  accentedButton: ` relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
  button: ` relative text-lg font-semibold px-12 py-4 bg-[#363840] rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
  cardContainer: `rounded-[3rem]`,
  infoContainer: `h-20 bg-[#313338] p-4 rounded-b-lg flex items-center text-white`,
  author: `flex flex-col justify-center ml-4`,
  name: ``,
  infoIcon: `flex justify-end items-center flex-1 text-[#8a939b] text-3xl font-bold`,
};

const Hero = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.contentWrapper}>
          <div className={style.copyContainer}>
            <div className={style.title}>
              Discover, collect, and sell unique NFTs
            </div>
            <div className={style.description}>
              CubanSea is the world&apos;s first NFT marketplace for the global
              Cuban artist community.
            </div>
            <div className={style.ctaContainer}>
              <Link href="/marketplace">
                <button className={style.accentedButton}>Explore</button>
              </Link>
              <Link href="/create">
                <button className={style.button}>Create</button>
              </Link>
            </div>
          </div>
          <div className={style.cardContainer}>
            <img
              className="rounded-t-lg"
              src="https://lh3.googleusercontent.com/LwSL45hmFmoSVu5C6HuWGuxt2kxcI_xw6HS9oq4YUhpp81qnJfSibsauZSdsDyCk48eQ01EPlx6jzCld9uWt-DkukLTa-KYw6l0GaAA=s550"
              alt=""
            />
            <div className={style.infoContainer}>
              <img
                className="h-[2.25rem] rounded-full"
                src="https://avatars.githubusercontent.com/u/3847077?v=4"
                alt=""
              />
              <div className={style.author}>
                <div className={style.name}>n3rdh4ck3r</div>
                <a
                  className="text-[#1868b7]"
                  href="https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/8970768298436072921991073414855549470908393302335808206645720822200320131077"
                >
                  An Ugly Dance with the Sky
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
