// We want to load the users NFTs and display.

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import Image from "next/image";

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import CSMarket from "../artifacts/contracts/CSMarket.sol/CSMarket.json";

export default function AccountDashboard() {
  // Array of NTFs.
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  // Function to load NFTs.
  async function loadNFTs() {
    // What we want to load:
    // We want to get the msg.sender hook up to the signer to display the owner NFTs.

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      CSMarket.abi,
      signer
    );
    const data = await marketContract.fetchItemsCreated();

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

    // Create a filtered array of items that have been sold.
    const soldItems = items.filter((i) => i.sold);
    setSold(soldItems);
    setNfts(items);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !nfts.length)
    return (
      <h1 className="px-20 py-7 text-4x1">You have not minted any NFTs!</h1>
    );

  return (
    <div className="p-4">
      <h1 style={{ fontSize: "20px", color: "purple" }}>Tokens Minted</h1>
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
