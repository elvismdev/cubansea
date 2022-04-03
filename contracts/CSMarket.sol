// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
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
    uint256 listingPrice = 0.025 ether;

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

    function makeMarketItem(
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
        IERC721(nftContract).safeTransferFrom(msg.sender, address(this), tokenId);

        emit MarketTokenMinted(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    // listen to events when market token is sold.
    event MarketTokenSold(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    // Function to conduct transactions and market sales.
    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = idToMarketToken[itemId].price;
        uint256 tokenId = idToMarketToken[itemId].tokenId;
        require(
            msg.value == price,
            "Please submit the asking price in order to continue"
        );

        // Transfer the amount to the seller.
        idToMarketToken[itemId].seller.transfer(msg.value);
        // Transfer the token from contract address to the buyer.
        IERC721(nftContract).safeTransferFrom(address(this), msg.sender, tokenId);
        idToMarketToken[itemId].owner = payable(msg.sender);
        idToMarketToken[itemId].sold = true;
        _tokensSold.increment();

        payable(owner).transfer(listingPrice);

        emit MarketTokenSold(
            itemId,
            nftContract,
            tokenId,
            address(this),
            msg.sender,
            price,
            true
        );
    }

    // Function to fetchMarketItems - minting, buying and selling.
    function fetchMarketTokens() public view returns (MarketToken[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 unsoldItemCount = _tokenIds.current() - _tokensSold.current();
        uint256 currentIndex = 0;

        // Looping over the number of items created (if number has not been sold populate the array).
        MarketToken[] memory items = new MarketToken[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketToken[i + 1].owner == address(0)) {
                uint256 currentId = i + 1;
                MarketToken storage currentItem = idToMarketToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // Function to fech single market item by ID.
    function getMarketToken(uint256 itemId)
        public
        view
        returns (MarketToken memory)
    {
        return idToMarketToken[itemId];
    }

    // Returns NFTs that the user has purchased.
    function fetchMyNFTs() public view returns (MarketToken[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        // A second counter for each induvidual user.
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketToken[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        // Second loop to loop through the amount you have purchased with itemCount.
        // Check to see if the owner address is equal to msg.sender.
        MarketToken[] memory items = new MarketToken[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketToken[i + 1].owner == msg.sender) {
                uint256 currentId = idToMarketToken[i + 1].itemId;
                // Current array.
                MarketToken storage currentItem = idToMarketToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // Function for returning an array of minted NFTs.
    function fetchItemsCreated() public view returns (MarketToken[] memory) {
        // Instead of .owner it will be the .seller.
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketToken[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        // Second loop to loop through the amount you have purchased with itemCount.
        // Check to see if the seller address is equal to msg.sender.
        MarketToken[] memory items = new MarketToken[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketToken[i + 1].seller == msg.sender) {
                uint256 currentId = idToMarketToken[i + 1].itemId;
                MarketToken storage currentItem = idToMarketToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
