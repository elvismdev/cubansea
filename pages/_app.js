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

function CubanSeaMarketplace({ Component, pageProps }) {
  const [provider, setProvider] = useState(null);
  const [web3Provider, setWeb3Provider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);

  // Function to connect to wallet.
  const connect = useCallback(async function () {
    const connProvider = await web3Modal.connect();
    const connWeb3Provider = new providers.Web3Provider(connProvider);
    const connSigner = connWeb3Provider.getSigner();
    const connAddress = await connSigner.getAddress();
    const connNetwork = await connWeb3Provider.getNetwork();
    // Set connected account state values.
    setProvider(connProvider);
    setWeb3Provider(connWeb3Provider);
    setSigner(connSigner);
    setAddress(connAddress);
    setNetwork(connNetwork);
  }, []);

  // Function to disconnect from wallet.
  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      //reset the state here
      setProvider(null);
      setWeb3Provider(null);
      setSigner(null);
      setAddress(null);
      setNetwork(null);
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
        setAddress(accounts[0]);
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
        <WalletContext.Provider
          value={{
            provider: [provider, setProvider],
            web3Provider: [web3Provider, setWeb3Provider],
            signer: [signer, setSigner],
            address: [address, setAddress],
            network: [network, setNetwork],
          }}
        >
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
