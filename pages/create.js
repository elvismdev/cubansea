import { ethers } from "ethers";
import { useState } from "react";
import Web3Modal from "web3modal";
import { providerOptions } from "../wallets/providerOptions";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { nftaddress, nftmarketaddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import { useRouter } from "next/router";
import Image from "next/image";
import CSMarket from "../artifacts/contracts/CSMarket.sol/CSMarket.json";
import Header from "../components/Header";

// In this component we set the IPFS up to host our NFT data of file storage.

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default function Create() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  let web3Modal;
  if (typeof window !== "undefined") {
    web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions, // required
    });
  }

  // Set up a function to fireoff when we update files in our form - we can add our NFT images - IPFS.
  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createMarket() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    // Upload to IPFS.
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      // Run a function that creates sale and passes in the URL.
      createSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createSale(url) {
    try {
      // Create the items and list them on the marketplace.
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      // We want to create the token.
      let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
      let transaction = await contract.mintToken(url);
      let tx = await transaction.wait();
      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();
      const price = ethers.utils.parseUnits(formInput.price, "ether");

      // List the item for sale on the marketplace.
      contract = new ethers.Contract(nftmarketaddress, CSMarket.abi, signer);
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();

      transaction = await contract.makeMarketItem(nftaddress, tokenId, price, {
        value: listingPrice,
      });
      await transaction.wait();
      router.push("./");
    } catch (error) {
      // console.log(error);
    }
  }

  return (
    <>
      <Header />
      <div className="flex justify-center">
        <div className="w-1/2 flex flex-col pb-12">
          <input
            placeholder="Asset Name"
            className="mt-8 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
          <textarea
            placeholder="Asset Description"
            className="mt-2 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
          <input
            placeholder="Asset Price in ETH"
            className="mt-2 border rounded p-4"
            onChange={(e) =>
              updateFormInput({ ...formInput, price: e.target.value })
            }
          />
          <input
            type="file"
            name="Asset"
            className="mt-4"
            onChange={onChange}
          />
          {fileUrl && (
            <div className="rounded mt-4">
              <Image src={fileUrl} alt="" width={380} height={380} />
            </div>
          )}
          <button
            onClick={createMarket}
            className="font-bold mt-4 bg-purple-500 text-white rounded p-4 shadow-lg"
          >
            Mint NFT
          </button>
        </div>
      </div>
    </>
  );
}
