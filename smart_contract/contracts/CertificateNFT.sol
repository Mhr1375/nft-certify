// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CertificateNFT
 * @dev A contract for issuing certificate NFTs
 */
contract CertificateNFT is ERC721URIStorage, Ownable {
    // TokenId counter
    uint256 private _tokenIdCounter;
    
    // Mapping from token ID to certificate details
    mapping(uint256 => CertificateDetails) public certificates;
    
    // Certificate metadata structure
    struct CertificateDetails {
        string recipientName;
        string courseName;
        uint256 issueDate;
        string description;
        bool revoked;
    }
    
    // Events
    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        string recipientName,
        string courseName,
        uint256 issueDate
    );
    
    event CertificateRevoked(uint256 indexed tokenId);
    event CertificateUpdated(uint256 indexed tokenId);
    
    constructor() ERC721("Certificate NFT", "CERT") Ownable(msg.sender) {}
    
    /**
     * @dev Check if the token exists
     * @param tokenId ID of the token to check
     * @return bool indicating if token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        try this.ownerOf(tokenId) returns (address) {
            return true;
        } catch {
            return false;
        }
    }
    
    /**
     * @dev Issues a new certificate NFT
     * @param to Recipient address
     * @param recipientName Name of the certificate recipient
     * @param courseName Name of the course
     * @param description Description of the certificate
     * @param tokenURI URI of the metadata (IPFS URL)
     * @return new token ID
     */
    function issueCertificate(
        address to,
        string memory recipientName,
        string memory courseName,
        string memory description,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        // Increment the token ID counter
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        certificates[newTokenId] = CertificateDetails({
            recipientName: recipientName,
            courseName: courseName,
            issueDate: block.timestamp,
            description: description,
            revoked: false
        });
        
        emit CertificateIssued(
            newTokenId,
            to,
            recipientName,
            courseName,
            block.timestamp
        );
        
        return newTokenId;
    }
    
    /**
     * @dev Updates an existing certificate
     * @param tokenId ID of the token to update
     * @param recipientName New recipient name
     * @param courseName New course name
     * @param description New description
     * @param tokenURI New token URI
     */
    function updateCertificate(
        uint256 tokenId,
        string memory recipientName,
        string memory courseName,
        string memory description,
        string memory tokenURI
    ) public onlyOwner {
        require(_exists(tokenId), "Certificate does not exist");
        require(!certificates[tokenId].revoked, "Certificate is revoked");
        
        certificates[tokenId].recipientName = recipientName;
        certificates[tokenId].courseName = courseName;
        certificates[tokenId].description = description;
        
        _setTokenURI(tokenId, tokenURI);
        
        emit CertificateUpdated(tokenId);
    }
    
    /**
     * @dev Revokes a certificate
     * @param tokenId ID of the token to revoke
     */
    function revokeCertificate(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Certificate does not exist");
        require(!certificates[tokenId].revoked, "Certificate already revoked");
        
        certificates[tokenId].revoked = true;
        
        emit CertificateRevoked(tokenId);
    }
    
    /**
     * @dev Checks if a certificate is valid
     * @param tokenId ID of the token to check
     * @return bool indicating if certificate is valid
     */
    function isValid(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Certificate does not exist");
        return !certificates[tokenId].revoked;
    }
    
    /**
     * @dev Gets certificate details
     * @param tokenId ID of the token
     * @return Certificate details struct
     */
    function getCertificateDetails(uint256 tokenId) public view returns (CertificateDetails memory) {
        require(_exists(tokenId), "Certificate does not exist");
        return certificates[tokenId];
    }
} 