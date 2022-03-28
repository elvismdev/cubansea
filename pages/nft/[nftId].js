import Header from "../../components/Header";
import { ethers } from "ethers";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { providerOptions } from "../../wallets/providerOptions";
import NFTImage from "../../components/nft/NFTImage";
import GeneralDetails from "../../components/nft/GeneralDetails";
import ItemActivity from "../../components/nft/ItemActivity";

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
  const [provider, setProvider] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [selectedNft, setSelectedNft] = useState();
  const router = useRouter();

  let web3Modal;
  if (typeof window !== "undefined") {
    web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions, // required
    });
  }

  useEffect(() => {
    loadNFTs();
  }, []);

  useEffect(() => {
    if (!nfts) return;
    (async () => {
      const selectedNftArray = nfts.find(
        (nft) => nft.itemId === Number(router.query.nftId)
      );

      setSelectedNft(selectedNftArray);
    })();
  }, [nfts]);

  // Function to load NFTs.
  async function loadNFTs() {
    // What we want to load:
    // *** provider, tokenContract, marketContract, data for our marketItems ***

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      CSMarket.abi,
      provider
    );
    const data = await marketContract.fetchMarketTokens();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        // We want to get the token metadata - json.
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          itemId: i.itemId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );

    setNfts(items);
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
            </div>
          </div>
          <ItemActivity />
        </div>
      </div>
    </div>
  );
};

export default Nft;
