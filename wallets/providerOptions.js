import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
const infuraProjectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;

export const providerOptions = {
  binancechainwallet: {
    package: true,
  },
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "CubanSea", // Required
      infuraId: infuraProjectId, // Required unless you provide a JSON RPC url; see `rpc` below
    },
  },
  walletconnect: {
    package: WalletConnect, // required
    options: {
      infuraId: infuraProjectId, // required
    },
  },
};
