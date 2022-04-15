// We want to load the users NFTs and display.

import { ethers } from "ethers";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Image from "next/image";
import { WalletContext } from "../context/walletContext";
// import toast from "../components/Toast";

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import CSMarket from "../artifacts/contracts/CSMarket.sol/CSMarket.json";

export default function MyAssets(props) {
  const { connect, disconnect } = props;
  const { web3Provider, signer, address } = useContext(WalletContext);
  const [web3ProviderValue, setWeb3ProviderValue] = web3Provider;
  const [signerValue, setSignerValue] = signer;
  const [addressValue, setAddressValue] = address;
  // Array of NTFs.
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  // const welcomeUser = (userName = "Unnamed", toastHandler = toast) =>
  //   toastHandler({
  //     type: "success",
  //     message: `Welcome back${userName !== "Unnamed" ? ` ${userName}` : ""}!`,
  //   });

  // Function to create user if doesn't exists after wallet connection.
  async function createIfNotExists(user) {
    const response = await axios.post("/api/users", {
      where: {
        walletAddress: user.walletAddress,
      },
      update: {},
      create: {
        walletAddress: user.walletAddress,
        userName: user.userName,
      },
    });

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    return response;
  }

  useEffect(() => {
    if (!addressValue) {
      setNfts([]);
      return;
    }
    (async () => {
      // Create user in database with Prisma client.
      const userData = {
        userName: "Unnamed",
        walletAddress: addressValue,
      };
      const result = await createIfNotExists(userData);

      // Show toast welcoming the user.
      // welcomeUser();

      // Load user NFTs.
      loadNFTs();
    })();
  }, [addressValue]);

  // Function to load NFTs.
  async function loadNFTs() {
    const tokenContract = new ethers.Contract(
      nftaddress,
      NFT.abi,
      web3ProviderValue
    );
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      CSMarket.abi,
      signerValue
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

  return (
    <>
      {!addressValue ? (
        <button
          className="mt-5 bg-purple-500 text-white font-bold py-3 px-12 rounded"
          onClick={connect}
        >
          Connect Wallet
        </button>
      ) : (
        <button
          className="mt-5 bg-purple-500 text-white font-bold py-3 px-12 rounded"
          onClick={disconnect}
        >
          Disconnect Wallet
        </button>
      )}
      {addressValue && loadingState === "loaded" && !nfts.length ? (
        <h1 className="px-20 py-7 text-4x1">
          You do not own any NFTs currently :(
        </h1>
      ) : (
        <div className="flex justify-center">
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
