import React, {useState,useEffect} from 'react';
import {Link,useParams} from 'react-router-dom'
import wiring from '../wiring'
import {Auction} from '../components/auction'
import { BidButton } from '../components/buttons'
// import {AuctionChart} from '../components/apexchart'
import {AuctionChart} from '../components/reactviz-chart'

export default wiring.connect((props)=>{
  const {manager,auctions,ethers,query,subscribe,dispatch,auctionManagers={}} = props
  const {name} = useParams()
  const [bid,setBid] = useState('')

  //run once
  useEffect(x=>{
    subscribe.auctionManagers.on(name)
    return ()=>{
      subscribe.auctionManagers.off(name)
    }
  },[])

  //using ethers subscription rather than graphql because data in graphql does not update
  useEffect(x=>{
    if(auctionManagers[name] == null) return
    const id = `${name}!${auctionManagers[name].currentAuctionId}`
    subscribe.auctions.on(id)
    return ()=>{
      subscribe.auctions.off(id)
    }
  },[auctionManagers[name]])

  // useEffect(x=>{
  //   if(auctionManagers[name] == null) return
  //   const id = `${name}!${auctionManagers[name].currentAuctionId}`
  //   subscribe.auctions.on(id)
  //   return ()=>{
  //     subscribe.auctions.off(id)
  //   }
  // },[auctionManagers[name]])

  if(auctions == null || 
    auctionManagers[name] == null || 
    auctions[name] == null || 
    auctions[name][auctionManagers[name].currentAuctionId] == null) 
      return <div> <p>Loading </p> </div>

  const auction = auctions[name][auctionManagers[name].currentAuctionId]
  const auctionManager = auctionManagers[name]

  return <div>
    <div>
      <Link to='/'>Back</Link>
    </div>
    <label>
      Place Bid (Wei) &nbsp;
      <input onChange={e=>setBid(e.target.value)} value={bid}/>
    </label>
    <BidButton name={auction.name} value={bid} onClick={()=>setBid('')}/>
    <AuctionChart auction={auction} auctionManager={auctionManager}/>
    <Auction auction={auction}/>
  </div>
})

