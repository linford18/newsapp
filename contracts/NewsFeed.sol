// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";
import "./SimpleBank.sol";

contract NewsFeed is ERC721URIStorage, SimpleBank {
	using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _totalArticles;
    address payable owner;
    mapping(uint256 => NewsFeedItem) private idToNewsFeed;


    uint256 _addIds;
    Counters.Counter private _totalAdds;
    mapping(uint256 => AddsFeedItem) private idToAddsFeed;

    struct NewsFeedItem {
      uint256 tokenId;
      address payable author;
      address payable owner;
      string article;
      uint256 price;
      uint256 likes;
      uint256 viwes;
    }

    event NewsFeedCreated (
      uint256 indexed tokenId,
      address author,
      address  owner,
      string article,
      uint256 price,
      uint256 likes,
      uint256 viwes
    );

    struct AddsFeedItem {
      uint256 tokenId;
      address payable author;
      address payable owner;
      string name;
      uint256 viwes;
    }

    event AddsFeedCreated (
      uint256 indexed tokenId,
      address author,
      address  owner,
      string name,
      uint256 viwes
    );

    constructor() ERC721("Metaverse Tokens", "METT") {
      owner = payable(msg.sender);
      _addIds =20;
    }


  // new code
  /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI,string memory article) public payable returns (uint) {
      _tokenIds.increment();

      uint256 newTokenId = _tokenIds.current();

      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);
      createNewsItem(newTokenId,article);
      _totalArticles.increment();
      return newTokenId;
    }
  function createNewsItem(
      uint256 tokenId,
      string memory article
    ) private {
      // require(price > 0, "Price must be at least 1 wei");
      require(msg.value == articlePrice, "Price must be equal to articlePrice");

      idToNewsFeed[tokenId] =  NewsFeedItem(
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        article,
        articlePrice,
        0,
        0
      );

      _transfer(msg.sender, address(this), tokenId);
      emit NewsFeedCreated(
        tokenId,
        msg.sender,
        address(this),
        article,
        articlePrice,
        0,
        0
      );
    }

    /* Returns all news articles */
    function fetchNewsFeeds() public view returns (NewsFeedItem[] memory) {
      uint itemCount = _tokenIds.current();
      uint currentIndex = 0;

      NewsFeedItem[] memory items = new NewsFeedItem[](itemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToNewsFeed[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          NewsFeedItem storage currentItem = idToNewsFeed[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
      return articlePrice;
    }

    /* Returns only items that a user has published */
    function fetchMyNewsFeeds() public view returns (NewsFeedItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToNewsFeed[i + 1].author == msg.sender) {
          itemCount += 1;
        }
      }

      NewsFeedItem[] memory items = new NewsFeedItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToNewsFeed[i + 1].author == msg.sender) {
          uint currentId = i + 1;
          NewsFeedItem storage currentItem = idToNewsFeed[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    function checkPayAuthor(address artAuthor) public view returns (bool) {
      return artAuthor != msg.sender? true : false;

    }

    function getCurrentAddress() public view returns (address){
      return msg.sender;
    }

    function createAdd(string memory tokenURI,string memory addName) public payable returns (uint) {
      _addIds++;

      uint256 newTokenId = _addIds;

      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);
      createAdsItem(newTokenId,addName);
      _totalAdds.increment();
      return newTokenId;
    }
  function createAdsItem(
      uint256 tokenId,
      string memory article
    ) private {
      // require(price > 0, "Price must be at least 1 wei");
      //require(msg.value == articlePrice, "Price must be equal to articlePrice");

      idToAddsFeed[tokenId] =  AddsFeedItem(
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        article,
        0
      );

      _transfer(msg.sender, address(this), tokenId);
      emit AddsFeedCreated(
        tokenId,
        msg.sender,
        address(this),
        article,
        0
      );
    }

    /* Returns all advertisements */
    function fetchAdds() public view returns (AddsFeedItem[] memory) {
      uint itemCount = _addIds;
      uint currentIndex = 0;

      AddsFeedItem[] memory items = new AddsFeedItem[](itemCount);
      for (uint i = 20; i < itemCount; i++) {
        if (idToAddsFeed[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          AddsFeedItem storage currentItem = idToAddsFeed[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    function fetchAddsOwner(string memory name) public view returns (address) {
      uint itemCount = _addIds;

      for (uint i = 20; i < itemCount; i++) {
        if (keccak256(abi.encodePacked(idToAddsFeed[i + 1].name)) == keccak256(abi.encodePacked(name)) ) {
          return idToAddsFeed[i + 1].author;
        }
      }
      return owner;
    }

}