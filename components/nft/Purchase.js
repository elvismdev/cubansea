import { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { HiTag } from "react-icons/hi";
import { IoMdWallet } from "react-icons/io";
import toast from "../Toast";
import { useRouter } from "next/router";
import { WalletContext } from "../../context/walletContext";

import { nftaddress, nftmarketaddress } from "../../config";

import CSMarket from "../../artifacts/contracts/CSMarket.sol/CSMarket.json";

const style = {
  button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
  buttonIcon: `text-xl`,
  buttonText: `ml-2 text-lg font-semibold`,
};

const MakeOffer = ({ selectedNft, connect }) => {
  const { signer } = useContext(WalletContext);
  const [signerValue, setSignerValue] = signer;
  const [enableButton, setEnableButton] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!selectedNft) return;

    setEnableButton(true);
  }, [selectedNft]);

  const confirmPurchase = (toastHandler = toast) =>
    toastHandler({ type: "success", message: "Purchase successful!" });

  // Function to buy NFTs for market.
  async function buyNFT(nft) {
    try {
      connect();
      const contract = new ethers.Contract(
        nftmarketaddress,
        CSMarket.abi,
        signerValue
      );

      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      const transaction = await contract.createMarketSale(
        nftaddress,
        nft.itemId,
        { value: price }
      );

      await transaction.wait();
      confirmPurchase();
      router.push("/");
    } catch (error) {
      //   console.log(error);
    }
  }

  return (
    <div className="flex h-20 w-full items-center rounded-lg border border-[#151c22] bg-[#303339] px-12">
      <div
        onClick={() => {
          enableButton ? buyNFT(selectedNft) : null;
        }}
        className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
      >
        <IoMdWallet className={style.buttonIcon} />
        <div className={style.buttonText}>Buy Now</div>
      </div>
      {/* <div
        className={`${style.button} border border-[#151c22]  bg-[#363840] hover:bg-[#4c505c]`}
      >
        <HiTag className={style.buttonIcon} />
        <div className={style.buttonText}>Make Offer</div>
      </div> */}
    </div>
  );
};

export default MakeOffer;
