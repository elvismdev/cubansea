// We want to load the users NFTs and display.

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { providerOptions } from "../wallets/providerOptions";
import Image from "next/image";

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import CSMarket from "../artifacts/contracts/CSMarket.sol/CSMarket.json";

export default function MyAssets() {
  // Array of NTFs.
  const [nfts, setNfts] = useState([]);
  const [provider, setProvider] = useState();
  const [loadingState, setLoadingState] = useState("not-loaded");

  // Function to connnect wallet.
  const connectWallet = async () => {
    const web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions, // required
    });

    try {
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      setProvider(provider);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (provider) {
      loadNFTs();
    }
  }, [provider]);

  // Function to load NFTs.
  async function loadNFTs() {
    // What we want to load:
    // We want to get the msg.sender hook up to the signer to display the owner NFTs.

    const signer = provider.getSigner();

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      CSMarket.abi,
      signer
    );
    const data = await marketContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        // We want to get the token metadata - json.
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
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

  if (!provider)
    return (
      <button
        className="mt-5 bg-purple-500 text-white font-bold py-3 px-12 rounded"
        onClick={connectWallet}
      >
        Connect Wallet
      </button>
    );

  if (loadingState === "loaded" && !nfts.length)
    return (
      <h1 className="px-20 py-7 text-4x1">
        You do not own any NFTs currently :(
      </h1>
    );

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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
