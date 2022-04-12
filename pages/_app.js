import { useState } from "react";
import Web3Modal from "web3modal";
import { providerOptions } from "../wallets/providerOptions";
import { AccountContext } from "../context/AccountContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import "./app.css";

function CubanSeaMarketplace({ Component, pageProps }) {
  /* create local state to save account information after signin */
  const [account, setAccount] = useState(null);

  /* web3Modal configuration for enabling wallet access */
  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      // network: "mainnet", // optional
      cacheProvider: false, // optional
      providerOptions, // required
    });
    return web3Modal;
  }

  /* the connect function uses web3 modal to connect to the user's wallet */
  async function connect() {
    try {
      const web3Modal = await getWeb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      setAccount(await signer.getAddress());
    } catch (err) {
      console.log("error:", err);
    }
  }

  // Function to disconnect wallet.
  async function disconnect() {
    const web3Modal = await getWeb3Modal();
    web3Modal.clearCachedProvider();
    setAccount(null);
  }

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        position="bottom-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        draggable={false}
        pauseOnVisibilityChange
        closeOnClick
        pauseOnHover
      />
    </>
  );
}

export default CubanSeaMarketplace;
