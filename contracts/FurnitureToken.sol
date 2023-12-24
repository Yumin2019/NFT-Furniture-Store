// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

// alt shift f 정렬
contract FurnitureToken is ERC721Enumerable {
    constructor() ERC721("Furniture NFT Store", "FNS") {}

    mapping(uint256 => NftToken) public nftTokenMap;
    uint256 nftTokenId;

    struct NftToken {
        uint256 tokenId;
        uint256 price;
        uint256 nftItemId;
        uint256 userId;
        bool isSelling;
        bool deleted;
    }

    // 입력한 NFT ITEM ID를 토대로 민팅한다.
    function mintToken(uint256 nftItemId, uint256 userId) public {
        ++nftTokenId;
        nftTokenMap[nftTokenId] = NftToken(
            nftTokenId,
            0,
            nftItemId,
            userId,
            false,
            false
        );
        _mint(msg.sender, nftTokenId);
    }

    // 랜덤으로 NFT ITEM ID를 지정하여 민팅한다.
    function mintRandomToken(uint256 itemLength, uint256 userId) public {
        ++nftTokenId;
        uint256 nftItemId = (uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, nftTokenId))
        ) % itemLength);
        nftTokenMap[nftTokenId] = NftToken(
            nftTokenId,
            0,
            nftItemId,
            userId,
            false,
            false
        );
        _mint(msg.sender, nftTokenId);
    }

    function getSaleTokensCount() internal view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 1; i <= nftTokenId; ++i) {
            if (nftTokenMap[i].deleted) continue;
            if (nftTokenMap[i].isSelling) {
                ++count;
            }
        }
        return count;
    }

    function getTokensCountById(uint256 userId)
        internal
        view
        returns (uint256)
    {
        uint256 count = 0;
        for (uint256 i = 1; i <= nftTokenId; ++i) {
            if (nftTokenMap[i].deleted) continue;
            if (nftTokenMap[i].userId == userId) {
                ++count;
            }
        }
        return count;
    }

    // 현재 판매중인 토큰을 구한다.
    function getSaleTokens() public view returns (NftToken[] memory) {
        uint256 count = getSaleTokensCount();
        require(count > 0, "There's no NftToken on sale");

        uint256 index = 0;
        NftToken[] memory tokenList = new NftToken[](count);
        for (uint256 i = 1; i <= nftTokenId; ++i) {
            if (nftTokenMap[i].deleted) continue;
            if (nftTokenMap[i].isSelling) {
                tokenList[index] = nftTokenMap[i];
                ++index;
            }
        }
        return tokenList;
    }

    // 특정 유저의 토큰을 구한다.
    function getTokens(uint256 userId) public view returns (NftToken[] memory) {
        uint256 count = getTokensCountById(userId);
        require(count > 0, "There's no NftToken");

        uint256 index = 0;
        NftToken[] memory tokenList = new NftToken[](count);
        for (uint256 i = 1; i <= nftTokenId; ++i) {
            if (nftTokenMap[i].deleted) continue;
            if (nftTokenMap[i].userId == userId) {
                tokenList[index] = nftTokenMap[i];
                ++index;
            }
        }
        return tokenList;
    }

    // 토큰을 판매한다.
    function sellToken(uint256 tokenId, uint256 price) public {
        address tokenOwner = ownerOf(tokenId);

        require(tokenId <= nftTokenId, "invalid tokenId");
        require(tokenOwner == msg.sender, "Caller is not token owner");
        require(price > 0, "Price is zero or lower");
        require(
            !nftTokenMap[tokenId].isSelling,
            "This token is already on sale."
        );
        require(
            isApprovedForAll(tokenOwner, address(this)),
            "Token owner did not approve token."
        );

        nftTokenMap[tokenId].isSelling = true;
        nftTokenMap[tokenId].price = price;
    }

    // 토큰 판매를 취소한다. 
    function cancelTokenSales(uint256 tokenId) public {
        address tokenOwner = ownerOf(tokenId);

        require(tokenId <= nftTokenId, "invalid tokenId");
        require(tokenOwner == msg.sender, "Caller is not token owner");
        require(
            nftTokenMap[tokenId].isSelling,
            "You're not selling this token."
        );
        require(
            isApprovedForAll(tokenOwner, address(this)),
            "Token owner did not approve token."
        );

        nftTokenMap[tokenId].isSelling = false;
        nftTokenMap[tokenId].price = 0;
    }

    function buyToken(uint256 tokenId, uint256 userId) public payable {
        uint256 price = nftTokenMap[tokenId].price;
        bool isSelling = nftTokenMap[tokenId].isSelling;
        address tokenOwner = ownerOf(tokenId);

        require(isSelling, "token is not on sale.");
        require(price <= msg.value, "Caller sent lower than price");
        require(tokenOwner != msg.sender, "Caller is token owner");

        // 소유자는 돈을 받고, 구매자는 토큰을 얻는다. 
        payable(tokenOwner).transfer(msg.value);
        safeTransferFrom(tokenOwner, msg.sender, tokenId); // from, to, tokenId

        nftTokenMap[tokenId].isSelling = false;
        nftTokenMap[tokenId].price = 0;
        nftTokenMap[tokenId].userId = userId;
    }

    // 토큰을 삭제한다.
    function deleteToken(uint256 tokenId) public {
        require(tokenId <= nftTokenId, "invalid tokenId");
        require(!nftTokenMap[tokenId].deleted, "already deleted");

        nftTokenMap[tokenId].deleted = true;
        _burn(tokenId);
    }
}
