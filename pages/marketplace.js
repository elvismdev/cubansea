import { ethers } from "ethers";
import { useEffect, useState } from "react";
import client from "../lib/urql";
import Web3Modal from "web3modal";
import { providerOptions } from "../wallets/providerOptions";
import NFTCard from "../components/NFTCard";

import { nftaddress, nftmarketaddress } from "../config";

import CSMarket from "../artifacts/contracts/CSMarket.sol/CSMarket.json";

const fetchMarketTokensByOwner = `
  query FetchMarketTokensByOwner($ownerAddress: String!) {
    erc721Tokens(
      where: {owner: $ownerAddress}
      orderDirection: desc
      orderBy: createdAtTimestamp
      first: 10
    ) {
      identifier
      price
      description
      image
      name
      seller {
        id
      }
      owner {
        id
      }
    }
  }
`;

export default function Marketplace(props) {
  const { tokens } = props;
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  let web3Modal;
  if (typeof window !== "undefined") {
    web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions, // required
    });
  }

  useEffect(() => {
    setNfts(tokens);
    setLoadingState("loaded");
  }, []);

  // Function to buy NFTs for market.
  async function buyNFT(nft) {
    try {
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        nftmarketaddress,
        CSMarket.abi,
        signer
      );

      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      const transaction = await contract.createMarketSale(
        nftaddress,
        nft.itemId,
        { value: price }
      );

      await transaction.wait();
    } catch (error) {
      // console.log(error);
    }
  }

  return (
    <div className="overflow-hidden">
      {loadingState === "loaded" && !nfts.length ? (
        <h1 className="px-20 py-7 text-4x1">No NFTs in marketplace</h1>
      ) : (
        <div className="flex flex-wrap">
          {nfts.map((nftItem, id) => (
            <NFTCard key={id} nftItem={nftItem} buyNFT={buyNFT} />
          ))}
        </div>
      )}
    </div>
  );
}

async function fetchData() {
  let data = await client
    .query(fetchMarketTokensByOwner, {
      ownerAddress: nftmarketaddress.toLowerCase(),
    })
    .toPromise();

  let tokensData = await Promise.all(
    data.data.erc721Tokens.map(async (token) => {
      // Format price value.
      let price = ethers.utils.formatUnits(token.price, "ether");
      // Construct tokenItem object.
      let tokenItem = {
        price,
        itemId: Number(token.identifier),
        seller: token.seller.id,
        owner: token.owner.id,
        image: token.image,
        name: token.name,
        description: token.description,
      };
      return tokenItem;
    })
  );
  return tokensData;
}

export async function getServerSideProps() {
  const data = await fetchData();
  return {
    props: {
      tokens: data,
    },
  };
}
