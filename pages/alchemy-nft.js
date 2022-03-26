import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'
import NftCard from '../components/nftcard';

import {
  marketplaceAddress
} from '../config'

import NewsFeed from '../artifacts/contracts/NewsFeed.sol/NewsFeed.json'

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter()

  const [owner, setOwner] = useState("")
    const [contractAddress, setContractAddress] = useState("")
    const [NFTs, setNFTs] = useState([])


  useEffect(() => {
    fetchNFTs()
  }, [])

  const apiKey = process.env.alchemyApiKey;
  const endpoint = `https://polygon-mumbai.g.alchemy.com/v2/${apiKey}`;

  const getAddressNFTs = async (owner, contractAddress, retryAttempt) => {
      if (retryAttempt === 5) {
          return;
      }
      if (owner) {
          let data;
          try {
              if (contractAddress) {
                  data = await fetch(`${endpoint}/getNFTs?owner=${owner}&contractAddresses%5B%5D=${contractAddress}`).then(data => data.json())
              } else {
                  data = await fetch(`${endpoint}/getNFTs?owner=${owner}`).then(data => data.json())
              }
          } catch (e) {
             console.log("Failed")
              // getAddressNFTs(endpoint, owner, contractAddress, retryAttempt+1)
          }

          // NFT token IDs basically
          return data

      }
  }

  const getNFTsMetadata = async (NFTS) => {
      const NFTsMetadata = await Promise.allSettled(NFTS.map(async (NFT) => {
          const metadata = await fetch(`${endpoint}/getNFTMetadata?contractAddress=${NFT.contract.address}&tokenId=${NFT.id.tokenId}`,).then(data => data.json())
          let imageUrl;
          console.log("metadata", metadata)
          if (metadata.tokenUri.gateway.length) {
              imageUrl = metadata.tokenUri.gateway
          } else {
              imageUrl = "https://via.placeholder.com/500"
          }

          return {
              id: NFT.id.tokenId,
              contractAddress: NFT.contract.address,
              image: imageUrl,
              title: metadata.metadata.name,
              description: NFT.description,
              attributes: metadata.metadata.attributes
          }
      }))
      console.log("NFTsMetadata", NFTsMetadata)
      return NFTsMetadata
  }

  async function fetchNFTs () {
    console.log("fetchNft")
      const data = await getAddressNFTs(marketplaceAddress)
      console.log(data)
      if (data.ownedNfts.length) {
          const NFTs = await getNFTsMetadata(data.ownedNfts)
          let fullfilledNFTs = NFTs.filter(NFT => NFT.status == "fulfilled")
          console.log("nft", fullfilledNFTs)
          setNFTs(fullfilledNFTs)
          console.log("fetchNft")
      } else {
          setNFTs([])
      }
      setLoadingState('loaded') 
  }

  async function loadNFTs() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketplaceContract = new ethers.Contract(marketplaceAddress, NewsFeed.abi, signer)
    const data = await marketplaceContract.fetchMyNewsFeeds()

    const items = await Promise.all(data.map(async i => {
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenURI)
      let price = ethers.utils.formatUnits(i.price.toString(), 'gwei')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  function listNFT(nft) {
    console.log('nft:', nft)
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }





  if (loadingState === 'loaded' && !NFTs.length) return (<h1 className="py-10 px-20 text-3xl">No Articles owned</h1>)

  return (
        <div>
            

            <section className='flex flex-wrap justify-center'>
                {
                    NFTs ? NFTs.map(NFT => {
                        
                        return (
                           <NftCard key={NFT.value.id + NFT.value.  contractAddress} image={NFT.value.image} id={NFT.value.id} title={NFT.value.title} description={NFT.value.description} address={NFT.value.contractAddress} attributes={NFT.value.attributes}></NftCard>
                        )
                    }) : <div>No NFTs found</div>
                }
            </section>
        </div>
    )
}
