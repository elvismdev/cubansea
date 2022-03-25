import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { providerOptions } from "./providerOptions";

let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions, // required
  });
}

// Function to connnect wallet.
export const connectWallet = async (updateProvider) => {
  try {
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    updateProvider(provider);
  } catch (error) {
    // console.log(error);
  }
};

// Function to disconnect wallet.
export const disconnectWallet = async (updateProvider) => {
  await web3Modal.clearCachedProvider();
  updateProvider(null);
};
