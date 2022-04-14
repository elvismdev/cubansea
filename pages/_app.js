import { useEffect, useState, useCallback } from "react";
import { providers } from "ethers";
import Web3Modal from "web3modal";
import { providerOptions } from "../wallets/providerOptions";
import { WalletContext } from "../context/walletContext";
import { ToastContainer } from "react-toastify";
import Header from "../components/Header";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import "./app.css";

const style = {
  container: ``,
};

let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    // network: "mainnet", // optional
    cacheProvider: true,
    providerOptions, // required
  });
}

const accountDetails = {
  provider: null,
  address: null,
  signer: null,
  web3Provider: null,
  network: null,
};

function CubanSeaMarketplace({ Component, pageProps }) {
  const [account, setAccountDetails] = useState(accountDetails);
  const { provider } = account;

  // Function to connect to wallet.
  const connect = useCallback(async function () {
    const provider = await web3Modal.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    const network = await web3Provider.getNetwork();
    const accountDetails = {
      provider,
      web3Provider,
      signer,
      address,
      network,
    };
    setAccountDetails(accountDetails);
  }, []);

  // Function to disconnect from wallet.
  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      //reset the state here
      const accountDetails = {
        provider: null,
        web3Provider: null,
        signer: null,
        address: null,
        network: null,
      };
      setAccountDetails(accountDetails);
    },
    [provider]
  );

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect();
    }
  }, [connect]);

  // Listen to events on the provider object to handle some scenarios.
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        // eslint-disable-next-line no-console
        console.log("accountsChanged", accounts);
        setAccountDetails({
          ...account,
          address: accounts[0],
        });
      };

      const handleChainChanged = (_hexChainId) => {
        window.location.reload();
      };

      const handleDisconnect = (error) => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  return (
    <>
      <Header />
      <div className={style.container}>
        <WalletContext.Provider value={{ account, setAccountDetails }}>
          <Component {...pageProps} connect={connect} disconnect={disconnect} />
        </WalletContext.Provider>
      </div>
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
