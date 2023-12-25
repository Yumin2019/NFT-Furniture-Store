// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract FurnitureToken is ERC721Enumerable {
    constructor() ERC721("Furniture NFT Store", "FNS") {}

    mapping(uint256 => NftToken) public nftTokenMap;
    mapping(uint256 => address) public userIdToAddressMap;
    mapping(address => uint256) public addressToUserIdMap;
    uint256 nftTokenId;

    struct NftToken {
        uint256 tokenId;
        uint256 price;
        uint256 nftItemId;
        uint256 userId;
        bool isSelling;
        bool deleted;
    }

    // 계정 등록에 사용하는 함수, 다른 함수 이전에 선행되어야 한다.
    function registerAccount(uint256 userId) public {
        require(userIdToAddressMap[userId] == address(0), "This address is already registerd");
        require(addressToUserIdMap[msg.sender] == 0, "This address is already registerd");

        userIdToAddressMap[userId] = msg.sender;
        addressToUserIdMap[msg.sender] = userId;
        _setApprovalForAll(msg.sender, address(this), true);
    }

    // 입력한 NFT ITEM ID를 토대로 민팅한다.
    function mintToken(uint256 nftItemId) public {
        uint256 userId = addressToUserIdMap[msg.sender];
        require(userId != 0, "You have to address your account first");

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
    function mintRandomToken(uint256 itemLength) public {
        uint256 userId = addressToUserIdMap[msg.sender];
        require(userId != 0, "You have to address your account first");

        ++nftTokenId;
        uint256 nftItemId = (uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, nftTokenId))
        ) % itemLength) + 1;
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

    function buyToken(uint256 tokenId) public payable {
        uint256 userId = addressToUserIdMap[msg.sender];
        uint256 price = nftTokenMap[tokenId].price;
        bool isSelling = nftTokenMap[tokenId].isSelling;
        address tokenOwner = ownerOf(tokenId);

        require(userId != 0, "You have to register your account first");
        require(tokenOwner != msg.sender, "Caller is token owner");
        require(isSelling, "token is not on sale.");
        require(price <= msg.value, "Caller sent lower than price");
        require(
            isApprovedForAll(tokenOwner, address(this)),
            "Token owner did not approve token."
        );

        // 소유자는 돈을 받고, 구매자는 토큰을 얻는다. 
        payable(tokenOwner).transfer(price);
        // fix: buyer 기준으로 safeTransferFrom 호출하는 문제 수정 
        this.safeTransferFrom(tokenOwner, msg.sender, tokenId);

        nftTokenMap[tokenId].isSelling = false;
        nftTokenMap[tokenId].price = 0;
        nftTokenMap[tokenId].userId = userId;
    }

    // 토큰을 삭제한다.
    function deleteToken(uint256 tokenId) public {
        address tokenOwner = ownerOf(tokenId);

        require(tokenOwner == msg.sender, "Caller is not token owner");
        require(tokenId <= nftTokenId, "invalid tokenId");
        require(!nftTokenMap[tokenId].deleted, "already deleted");
        require(
            isApprovedForAll(tokenOwner, address(this)),
            "Token owner did not approve token."
        );

        nftTokenMap[tokenId].deleted = true;
        _burn(tokenId);
    }
}
