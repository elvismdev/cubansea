import Header from "../../components/Header";
import { ethers } from "ethers";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NFTImage from "../../components/nft/NFTImage";
import GeneralDetails from "../../components/nft/GeneralDetails";
import ItemActivity from "../../components/nft/ItemActivity";
import Purchase from "../../components/nft/Purchase";

import { nftaddress, nftmarketaddress } from "../../config";

let rpcUrl = null;
if (process.env.NEXT_PUBLIC_RPC_URL) {
  rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
}

import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import CSMarket from "../../artifacts/contracts/CSMarket.sol/CSMarket.json";

const style = {
  wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
};

const Nft = () => {
  const [selectedNft, setSelectedNft] = useState();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    (async () => {
      loadNFT(router.query.nftId);
    })();
  }, [router.isReady]);

  // Function to load single NFT by itemId.
  async function loadNFT(nftId) {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      CSMarket.abi,
      provider
    );
    const data = await marketContract.getMarketToken(nftId);

    const tokenUri = await tokenContract.tokenURI(data.tokenId);

    // We want to get the token metadata - json.
    const meta = await axios.get(tokenUri);
    let price = ethers.utils.formatUnits(data.price.toString(), "ether");
    let item = {
      price,
      itemId: data.itemId.toNumber(),
      seller: data.seller,
      owner: data.owner,
      image: meta.data.image,
      name: meta.data.name,
      description: meta.data.description,
    };

    setSelectedNft(item);
  }

  return (
    <div>
      <Header />
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.topContent}>
            <div className={style.nftImgContainer}>
              <NFTImage selectedNft={selectedNft} />
            </div>
            <div className={style.detailsContainer}>
              <GeneralDetails selectedNft={selectedNft} />
              <Purchase selectedNft={selectedNft} />
            </div>
          </div>
          <ItemActivity />
        </div>
      </div>
    </div>
  );
};

export default Nft;
