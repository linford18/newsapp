import { ethers } from 'ethers'
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios'
import Web3Modal from 'web3modal'
import Web3 from 'web3'
import ReactPlayer from 'react-player'

import {
  marketplaceAddress
} from '../config'

import NewsFeed from '../artifacts/contracts/NewsFeed.sol/NewsFeed.json';

export default function CreatorDashboard() {
  const [videos, setVideos] = useState([])
  const [balanceval, setBalance] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [advOwner, setadvOwner] = useState('null')
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    viewFromLivepeer()
  }, [])

  async function viewFromLivepeer() {
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
    
    const livepeerKey = process.env.alchemyApiKey
    const headers = {
      'Authorization': `Bearer ${livepeerKey}`
    }

    const response = await axios.get('https://livepeer.com/api/asset', {
        headers: headers
      })
    console.log(response)
    for (let data of response.data){
    console.log(data.status);
    if (data.status==="ready"){
      let item = {
        url: data.downloadUrl,
        name: data.name
      }
      setVideos(item)
      break

    }
    console.log(videos)
}
  }

  async function payViewer(){
    console.log('start payauth') 
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const web3 = new Web3()

    let contract = new ethers.Contract(marketplaceAddress, NewsFeed.abi, signer)
    let balance = await contract.PayViewer(advOwner)
    return balance
  }
  async function checkViewerAuthor(){
    console.log('start') 
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const web3 = new Web3()

    let contract = new ethers.Contract(marketplaceAddress, NewsFeed.abi, signer)
    let ads = await contract.fetchAdds( )
    console.log(ads)
    let authorAdd = await contract.fetchAddsOwner( videos.name)
    console.log(authorAdd)
    setadvOwner(authorAdd)
    let boolPay = await contract.checkPayAuthor(authorAdd)
    return boolPay
  }

   function handlePlayPause() {
    setPlaying(!playing)
  }
  async function handlePlay() {
    console.log("playing")
    let boolPay = await checkViewerAuthor()
    console.log("Boolean value:")
    console.log(boolPay)
    if (boolPay){
      if (balanceval<0.01){
        alert("Low Balance. Reload in dashboard")
      }else{
        console.log("Different author and viewer")
        let balance =payViewer(advOwner)
        console.log("New balance")
        console.log(balance)
      }
    }else{
      console.log("Same author and viewer")
      
    }
  }
  
  if (loadingState === 'loaded' && !balanceval) return (<h1 className="py-10 px-20 text-3xl">No NFTs listed</h1>)
  return (
      

    <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
    <div className="rounded overflow-hidden shadow-lg">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{videos.name}</div>

      </div>
      <ReactPlayer
              className='react-player'
              width='100%'
              height='60%'
              url={videos.url}
              playing={playing}
              
              onStart={() => console.log('onStart')}
              onPlay={handlePlay}
              
            />
      <div className="p-4 bg-black">
      <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={handlePlayPause}>{playing ? 'Pause Adv' : 'Play Adv'} </button>
    
    </div>
    </div>
    </div>
  )
}