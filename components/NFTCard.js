import React from "react";
import Image from "next/image";
import { BiHeart } from "react-icons/bi";
import Router from "next/router";

const style = {
  wrapper: `bg-[#303339] flex-auto w-[14rem] h-[22rem] my-10 mx-5 rounded-2xl overflow-hidden cursor-pointer`,
  imgContainer: `h-2/3 w-full overflow-hidden flex justify-center items-center`,
  nftImg: `w-full object-cover`,
  details: `p-3`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
  infoLeft: `flex-0.6 flex-wrap`,
  collectionName: `font-semibold text-sm text-[#8a939b]`,
  assetName: `font-bold text-lg mt-2`,
  infoRight: `flex-0.4 text-right`,
  priceTag: `font-semibold text-sm text-[#8a939b]`,
  priceValue: `flex items-center text-xl font-bold mt-2`,
  ethLogo: `h-5 mr-2`,
  likes: `text-[#8a939b] font-bold flex items-center w-full justify-end mt-3`,
  likeIcon: `text-xl mr-2`,
};

const NFTCard = ({ nftItem, buyNFT }) => {
  return (
    <div
      className={style.wrapper}
      onClick={() => {
        Router.push({ pathname: `/nft/${nftItem.itemId}` });
      }}
    >
      <div className={style.imgContainer}>
        {nftItem.image && (
          <Image
            src={nftItem.image}
            alt={nftItem.name}
            width={380}
            height={380}
            className={style.nftImg}
          />
        )}
      </div>
      <div className={style.details}>
        <div className={style.info}>
          <div className={style.infoLeft}>
            {/* <div className={style.collectionName}>Collection Name</div> */}
            <div className={style.assetName}>{nftItem.name}</div>
          </div>
          <div className={style.infoRight}>
            <div className={style.priceTag}>Price</div>
            <div className={style.priceValue}>
              <Image
                src="https://openseauserdata.com/files/265128aa51521c90f7905e5a43dcb456_new.svg"
                alt="matic"
                width={14}
                height={14}
                className={style.ethLogo}
              />
              {nftItem.price}
            </div>
          </div>
          {/* <div className={style.likes}>
            <span className={style.likeIcon}>
              <BiHeart />
            </span>{" "}
            {nftItem.likes}
          </div> */}
        </div>
      </div>
      {/* <button
        className="w-full bg-purple-500 text-white font-bold py-2 px-12 rounded"
        onClick={() => buyNFT(nftItem)}
      >
        Buy
      </button> */}
    </div>
  );
};

export default NFTCard;
