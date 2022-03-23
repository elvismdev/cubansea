import { ethers } from "ethers";
import { useState } from "react";
import Web3Modal from "web3modal";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { nftaddress, nftmarketaddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import CSMarket from "../artifacts/contracts/CSMarket.sol/CSMarket.json";

// In this component we set the IPFS up to host our NFT data of file storage.

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0/");

export default function MintItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  // Set up a function to fireoff when we update files in our form - we can add our NFT images - IPFS.
  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io:5001/api/v0/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
}
