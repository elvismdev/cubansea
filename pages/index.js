import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { providerOptions } from "../wallets/providerOptions";
import Image from "next/image";

import { nftaddress, nftmarketaddress } from "../config";

let rpcUrl = null;
if (process.env.NEXT_PUBLIC_RPC_URL) {
  rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
}

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import CSMarket from "../artifacts/contracts/CSMarket.sol/CSMarket.json";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

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
    setLoadingState("loaded");
  }

  // Function to buy NFTs for market.
  async function buyNFT(nft) {
    try {
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        nftmarketaddress,
        CSMarket.abi,
        signer
      );

      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      const transaction = await contract.createMarketSale(
        nftaddress,
        nft.itemId,
        { value: price }
      );

      await transaction.wait();
      loadNFTs();
    } catch (error) {
      // console.log(error);
    }
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-7 text-4x1">No NFTs in marketplace</h1>;

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-x1 overflow-hidden">
              <Image src={nft.image} alt="" width={380} height={380} />
              <div className="p-4">
                <p
                  style={{ height: "64px" }}
                  className="text-3x1 font-semibold"
                >
                  {nft.name}
                </p>
                <div style={{ height: "72px", overflow: "hidden" }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-3x-1 mb-4 font-bold text-white">
                  {nft.price} ETH
                </p>
                <button
                  className="w-full bg-purple-500 text-white font-bold py-3 px-12 rounded"
                  onClick={() => buyNFT(nft)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
