import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Web3 from 'web3'

import {
  marketplaceAddress
} from '../config'

import NewsFeed from '../artifacts/contracts/NewsFeed.sol/NewsFeed.json'


export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([])
  const [balanceval, setBalance] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadBalance()
  }, [])

  async function loadBalance(){
    console.log('start') 
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const web3 = new Web3()

    let contract = new ethers.Contract(marketplaceAddress, NewsFeed.abi, signer)
    let balanceval = await contract.balance()
    console.log(balanceval)
    balanceval = web3.utils.fromWei(balanceval.toString(), 'ether')
    setBalance(balanceval)
    setLoadingState('loaded') 
    console.log(balanceval)
  }

  async function DepositVal(){
    console.log('start') 
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const web3 = new Web3()

    let contract = new ethers.Contract(marketplaceAddress, NewsFeed.abi, signer)

    let transaction = await contract.deposit( { value: Web3.utils.toWei('0.1', 'ether') })
    await transaction.wait()
    let balanceval = await contract.balance()
    balanceval = web3.utils.fromWei(balanceval.toString(), 'ether')
    setBalance(balanceval)
    setLoadingState('loaded') 
    console.log(balanceval)
  }

  async function WithdrawVal(){
    console.log('start') 
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const web3 = new Web3()

    /* next, create the item */
    // const price = ethers.utils.parseUnits(formInput.price, 'gwei')
    let contract = new ethers.Contract(marketplaceAddress, NewsFeed.abi, signer)
    let transaction = await contract.withdraw( Web3.utils.toWei('0.1', 'ether') )
    await transaction.wait()
    let balanceval = await contract.balance()
    balanceval = web3.utils.fromWei(balanceval.toString(), 'ether')
    setBalance(balanceval)
    setLoadingState('loaded') 
    console.log(balanceval)
  }

  
  if (loadingState === 'loaded' && !balanceval) return (<h1 className="py-10 px-20 text-3xl">No NFTs listed</h1>)
  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl py-2">Items Listed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  
                  <p className="text-2xl font-bold text-black">Balance - {balanceval} Eth</p>
                
        </div>
         <button onClick={DepositVal} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Deposit Token
        </button>
         <button onClick={WithdrawVal} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Withdraw Token
        </button>
      </div>
    </div>
  )
}