import React, {useEffect, useState} from 'react';
import wiring from '../wiring'


async function findLatestAuction(contract,index=0){
  const ended = await contract.methods.auctionEnded(index).call()
  if(!ended) return index
  return findLatestAuction(contract,index+1)
}



export const LatestAuction = wiring.connect(({name,auctions,myAddress,balance}) =>{
  return <div>
    {auctions ? <Auction auction={auctions[name]} myAddress={myAddress} balance={balance}/> : null} </div>
})

export const Auction = ({
  auction,
})=>{
  const fields = [
    ['name','Name'],
    ['auctionId','Id'],
    // ['myBid','My Bid'],
    // ['myBalance','My Balance'],
    ['isActive','Active'],
    ['isStopReached','Stopped'],
    ['address','Address'],
    ['currentPrice','Current Price'],
    ['currentTime','Current Time'],
    ['deposits','Total Deposits'],
    ['endTime','End Time'],
    ['startTime','Start Time'],
    ['secondsPassed','Seconds Passed'],
    ['secondsRemaining','Seconds Remaining'],
    ['finalPrice','Final Price'],
    ['currentEndTime','Current End Time'],
    ['currentEndPrice','Current End Price'],
  ]
  
  const showFields = fields.map(([key,display])=>{
    return <p> {display}: {auction[key].toString()} </p>
  })

  return <div>
    {showFields}
  </div>
}
