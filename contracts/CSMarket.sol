// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppeling/contracts/token/ERC721/ERC721.sol";
import "@openzeppeling/contracts/security/ReentrancyGuard.sol";
import "@openzeppeling/contracts/utils/Counters.sol";
// Security against transactions for multiple requests.
import "hardhat/console.sol";

contract CSMarket is ReentrancyGuard {
    using Counters for Counters.Counter;

    /* Number of items minting, number of transactions, tokens that have not been sold.
     Keep track of tokens total number - tokenId.
     Arrays need to know the length - help to keep track for arrays */

    Counters.Counter private _tokenIds;
    Counters.Counter private _tokensSold;

    // Determine who is the owner of the contract.
    // Charge a listing fee so the owner makes a commission.

    address payable owner;
    // We are deploying to matic (Polygon), the API is the same so you can use ether the same as matic.
    // They both have 18 decimal places.
    // 0.045 is in the cents.
    uint256 listingPrice = 0.045 ether;

    constructor() {
        // Set the owner.
        owner = payable(msg.sender);
    }

    // Structs can act like objects.

    struct MarketToken {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    // tokenId return which MarketToken - fetch which one it is.

    mapping(uint256 => MarketToken) private idToMarketToken;

    // listen to events from front end applications.
    event MarketTokenMinted(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    // Get the listing price.
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // Two functions to interact with contract.
    // 1. Create a market item to put it up for sale.
    // 2. Create a market sale for buying and selling between parties.

    function mintMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        // nonReentrant is a modifier to prevent reentry attack.

        require(price > 0, "Price must be at least one wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        _tokenIds.increment();
        uint256 itemId = _tokenIds.current();

        // Putting it up for sale - bool - no owner.
        idToMarketToken[itemId] = MarketToken(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        // NFT transaction.
    }
}
