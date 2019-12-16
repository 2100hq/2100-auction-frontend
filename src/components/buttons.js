import React, {useEffect, useState} from 'react';
import wiring from '../wiring'
import {BurnButton} from '../styles'
import {toWei} from '../utils'
import {Button} from 'react-bootstrap'

export const CreateAuctionButton = wiring.connect(({name,create,dispatch,onClick=x=>x,onSubmit=x=>x})=>{
  function click(){
    return create(name)
      .then(x=>{
        dispatch('success')('Auction Creation Submitted')
        onSubmit(x)
        return x.wait()
      })
      .then(x=>{
        dispatch('success')('Creation Accepted')
      })
      .catch(dispatch('setError'))
      .finally(onClick)
  }
  return <button onClick={click}>
    Create New Auction
  </button>
})

export const BidButton = wiring.connect(({disabled,name,value,donate,bid,dispatch,onClick=x=>x,onSubmit=x=>x})=>{
  function click(){
    return bid(name,toWei(value),donate)
      .then(x=>{
        dispatch('success')('Bid Submitted')
        onSubmit(x)
        return x.wait()
      })
      .then(x=>{
        dispatch('success')('Bid Accepted')
      })
      .catch(dispatch('setError'))
      .finally(onClick)
  }

  return <BurnButton disabled={disabled} onClick={click}>
    {donate ? <strong> Donate Now </strong> : <strong>Send Now</strong>} 
  </BurnButton>
})

export const ClaimButton = wiring.connect(({name,claim,auctionId,total='0',donationPercent='1',dispatch,onClick=x=>x})=>{

  function click(){
    return claim(name,auctionId,total,donationPercent)
      .then(x=>dispatch('success')('Claiming Auction'))
      .catch(dispatch('setError'))
      .finally(onClick)
  }
  return <Button onClick={click}>
    Claim Tokens
  </Button>
})

export const ClaimAllButton = wiring.connect(({name,claimAll,auctionIds,amount='0',dispatch,onClick=x=>x})=>{

  function click(){
    return claimAll(name,auctionIds)
      .then(x=>dispatch('success')('Claiming Auction'))
      .catch(dispatch('setError'))
      .finally(onClick)
  }
  return <Button onClick={click}>
    Withdraw
  </Button>
})
