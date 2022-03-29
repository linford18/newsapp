import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { Web3Storage } from 'web3.storage'
import axios from 'axios'
import Web3 from 'web3'


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  marketplaceAddress
} from '../config'

import NewsFeed from '../artifacts/contracts/NewsFeed.sol/NewsFeed.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ article: '', name: '', price: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function uploadToIPFS() {
    const { name, price } = formInput
    if (!name || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, video: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log(url)
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function uploadToLivepeer(url) {
    const { name, price } = formInput
    if (!name || !price || !fileUrl) return
    
    const livepeerKey = process.env.alchemyApiKey
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${livepeerKey}`
    }
    const data = `{
    "url":"${fileUrl}",
    "name":"${name}"
    }`

    const response = axios.post('https://livepeer.com/api/asset/import', data, {
        headers: headers
      })
    console.log(response)
  }

 
  async function listAdv() {
    const url = await uploadToIPFS()
    const livepeerurl = await uploadToLivepeer(url)
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* next, create the item */
    let contract = new ethers.Contract(marketplaceAddress, NewsFeed.abi, signer)
    let listingPrice = await contract.getListingPrice()
    let name = formInput.name
    listingPrice = listingPrice.toString()
    console.log(listingPrice)
    let transaction = await contract.createAdd(url, name, { value: listingPrice })
    await transaction.wait()

    console.log('start') 
    const web3 = new Web3()

    console.log(formInput.price)
    let transaction2 = await contract.deposit( { value: Web3.utils.toWei(formInput.price, 'ether') })
    await transaction2.wait()
    let balanceval = await contract.balance()
    balanceval = web3.utils.fromWei(balanceval.toString(), 'ether')
    console.log(balanceval)
   
    router.push('/video-view')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-64">
        <input 
          placeholder="Headline"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <input
          placeholder="Asset Price in matic"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={listAdv} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Upload Video
        </button>
      </div>
    </div>
  )
}