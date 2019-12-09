import React, {useEffect, useState} from 'react';
import wiring from '../wiring'

export const CreateAuctionButton = wiring.connect(({name,create,dispatch,onClick=x=>x})=>{
  function click(){
    return create(name)
      .then(x=>dispatch('success')('Auction Creation Submitted'))
      .catch(dispatch('setError'))
      .finally(onClick)
  }
  return <button onClick={click}>
    Create New Auction
  </button>
})

export const BidButton = wiring.connect(({name,value,bid,dispatch,onClick=x=>x})=>{
  function click(){
    return bid(name,value)
      .then(x=>dispatch('success')('Bid Submitted'))
      .catch(dispatch('setError'))
      .finally(onClick)
  }
  return <button onClick={click}>
    Submit Bid
  </button>
})

export const ClaimButton = wiring.connect(({name,claim,auctionId,total='0',donationPercent='1',dispatch,onClick=x=>x})=>{

  function click(){
    return claim(name,auctionId,total,donationPercent)
      .then(x=>dispatch('success')('Claiming Auction'))
      .catch(dispatch('setError'))
      .finally(onClick)
  }
  return <button onClick={click}>
    Claim Tokens
  </button>
})
