import React, {useEffect, useState} from 'react';
import {useWiring} from '../wiring'
import {BurnButton} from '../styles'
import {toWei} from '../utils'
import {Button} from 'react-bootstrap'

export const CreateAuctionButton = ({name,onClick=x=>x,onSubmit=x=>x})=>{
  const [{create},,dispatch] = useWiring()
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
}

export const BidButton = ({disabled,name,value,donate,onClick=x=>x,onSubmit=x=>x})=>{
  const [{bid},,dispatch] = useWiring()
  function click(){

    if(value.length == 0) return dispatch('setError')(new Error('Please enter value to bid'))

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
}

export const ClaimButton = ({name,auctionId,onClick=x=>x,onSubmit=x=>x})=>{
  const [{claim},,dispatch] = useWiring()
  function click(){
    return claim(name,auctionId)
      .then(x=>{
        dispatch('success')('Claiming Auction')
        onSubmit(x)
        return x.wait()
      })
      .catch(dispatch('setError'))
      .finally(onClick)
  }
  return <Button onClick={click}>
    Withdraw
  </Button>
}

export const ClaimAllButton = ({name,auctionIds,amount='0',onClick=x=>x})=>{
  const [{claimAll},,dispatch] = useWiring()
  function click(){
    return claimAll(name,auctionIds)
      .then(x=>dispatch('success')('Claiming Auction'))
      .catch(dispatch('setError'))
      .finally(onClick)
  }
  return <Button onClick={click}>
    Withdraw
  </Button>
}
