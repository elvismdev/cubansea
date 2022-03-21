// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// We will bring in the openzeppeling ERC721 NFT functionality.

import "@openzeppeling/contracts/token/ERC721/ERC721.sol";
import "@openzeppeling/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppeling/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    // Counters allow us to keep track of tokenIds.
    // Address of marketplace for NFTs to interact.
    address contractAddress;

    // OBJ: Give the NFT market the ability to transact with tokens or change ownership.
    // setApprovalForAll allows us to that with the cntract address.

    // Constructor to setup our address.
    constructor(address marketplaceAddress) ERC721("CubanSea", "CUBSEA") {
        contractAddress = marketplaceAddress;
    }

    function mintToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        // Passing in ID and URL.
        _mint(msg.sender, newItemId);
        // Set the token URI: ID and URL.
        _setTokenURI(newItemId, tokenURI);
        // Give the marketplace the approval to transact between users.
        setApprovalForAll(contractAddress, true);
        // Mint the token and set it for sale - return the ID to do so.
        return newItemId;
    }
}
