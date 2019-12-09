import React, {useState,useEffect} from 'react';
import {Link} from 'react-router-dom'
import wiring from '../wiring'
import {ClaimButton} from '../components/buttons'

const AuctionBalances = ({BigNumber,balances={},auctions=[], auctionManagers={}}) =>{
  const fragment = Object.entries(balances).map(([name,auctionIds])=>{
    return <div>
      { 
        Object.entries(auctionIds).map(([id,value])=>{
          // console.log({id,value,auctions,name})
          const {deposits} = auctions.find(x=>name===x.name && id == x.auctionId)
          const unclaimed = new BigNumber(value).dividedBy(deposits).times('1000000000000000000').toString()
          return <div>
            {name} - {id} : { unclaimed}
            <ClaimButton auctionId={id} name={name} total={value} donationPercent={1}/>
          </div>
        })
      }
    </div>
  })

  return <React.Fragment>
    {fragment}
  </React.Fragment>
}

const AuctionBids = ({bids=[],auctions={},BigNumber})=>{
  const claim = Object.values(bids).map(bidData=>{
    const {auctionName,auctionId,bids} = bidData
    if(bids == '0') return null
    const auction = auctions[auctionName]
    let found
    if(auction) found = auction[auctionId]
    if(found == null) return <p> Loading </p>
    const unclaimed = new BigNumber(bids).dividedBy(found.deposits).times('1000000000000000000').toString()
    return <div>
      {found.isActive ? 
        <div>
          {auctionName} - {auctionId} : Pending Completion
        </div> : 
        <div>
          {auctionName} - {auctionId} : { unclaimed}
          <ClaimButton auctionId={auctionId} name={auctionName} total={bids} donationPercent={1}/> 
        </div>
      }
    </div>
  })
  return <div>
    {claim}
  </div>
}


const Balances = ({balances=[]}) => {
  const fragment = Object.values(balances).map(value=>{
    return <p>{value.tokenName} : {value.balance}</p>
  })

  return <React.Fragment>
    {fragment}
  </React.Fragment>
}

export default wiring.connect((props)=>{
  const {
    myAddress,
    dispatch,
    subscribe,
    query,
    registries={},
    registryid,
    bids={},
    balances={},
    auctions={},
    BigNumber,
    models,
  } = props

  const registry = registries[registryid]
  if(registry==null) return <div>Loading</div>

  useEffect(x=>{
    if(myAddress == null) return
    subscribe.tokenBalancesByAddress.on(myAddress)
    subscribe.auctionBidsByAddress.on(myAddress)

    return ()=>{
      subscribe.tokenBalancesByAddress.off(myAddress)
      subscribe.auctionBidsByAddress.off(myAddress)
    }
  },[myAddress])

  useEffect(x=>{
    Object.values(bids).forEach(bid=>{
      const id = [bid.auctionName,bid.auctionId].join('!')
      subscribe.auctions.on(id)
    })

    return ()=>{
      Object.values(bids).forEach(bid=>{
        const id = [bid.auctionName,bid.auctionId].join('!')
        subscribe.auctions.off(id)
      })
    }
  },[Object.values(bids).length])

  return <div>
    <div>
      <Link to='/'>Back</Link>
    </div>
    <p>Current Address {myAddress}</p>
    <p> Unclaimed Auction Tokens </p>
    <AuctionBids BigNumber={BigNumber} bids={bids} auctions={auctions}/>
    <p> Token Balances </p>
    <Balances balances={balances}/>
  </div>
})

