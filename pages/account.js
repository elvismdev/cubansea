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

export default function Account() {
  // Array of NTFs.
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [address, setAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loadingState, setLoadingState] = useState("not-loaded");

  let web3Modal;
  if (typeof window !== "undefined") {
    web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions, // required
    });
  }

  // Function to connnect wallet.
  const connectWallet = async () => {
    try {
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      setProvider(provider);
      setSigner(signer);
      setAddress(await signer.getAddress());
    } catch (error) {
      // console.log(error);
    }
  };

  // Function to disconnect wallet.
  const disconnectWallet = async () => {
    await web3Modal.clearCachedProvider();
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setNfts([]);
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    if (!address) return;
    (async () => {
      loadNFTs();
    })();
  }, [address]);

  // Function to load NFTs.
  async function loadNFTs() {
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

  return (
    <>
      {!address ? (
        <button
          className="mt-5 bg-purple-500 text-white font-bold py-3 px-12 rounded"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <button
          className="mt-5 bg-purple-500 text-white font-bold py-3 px-12 rounded"
          onClick={disconnectWallet}
        >
          Disconnect Wallet
        </button>
      )}
      {address && loadingState === "loaded" && !nfts.length ? (
        <h1 className="px-20 py-7 text-4x1">You have not minted any NFTs!</h1>
      ) : (
        <div className="p-4">
          <h1 style={{ fontSize: "20px", color: "purple" }}>Tokens Minted</h1>
          <div className="px-4" style={{ maxWidth: "1600px" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {nfts.map((nft, i) => (
                <div
                  key={i}
                  className="border shadow rounded-x1 overflow-hidden"
                >
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
      )}
    </>
  );
}
