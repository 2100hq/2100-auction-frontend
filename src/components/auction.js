import React, {useEffect, useState} from 'react';
import wiring from '../wiring'
import {Flex,Hr,Box,Tiny,Small,Strong} from '../styles'
import {Link} from 'react-router-dom'
import dayjs from 'dayjs'
import {BigNumber,toEth,humanizeWei} from '../utils'


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

export const AuctionCard = ({auction})=>{
  return <Flex minWidth='256px' flexDirection='column' >
    <Flex justifyContent='space-between' alignItems='center'>
      <Strong>	
        &#x25d1; <Link to={`/auctions/${auction.name}/${auction.auctionId}`}>Auction {auction.auctionId}</Link> 
      </Strong>
      <Tiny> {dayjs().diff(parseInt(auction.endTime) * 1000,'day',true).toFixed(2)} days ago
      </Tiny>
    </Flex>
    <Hr/>
    <Small>Total Deposited {humanizeWei(auction.deposits)}</Small>
    <Small>Implied Cap {humanizeWei(new BigNumber(auction.deposits).times(2100))}</Small>
  </Flex>
}

export const AuctionHistory = ({auctions={}})=>{
  auctions = Object.values(auctions)
  return <Flex flexWrap='wrap' justifyContent='space-between'>
    {
      auctions.map(auction=>{
        return <Box key={auction.id} m={25}>
          <AuctionCard auction={auction}/>
        </Box>

      })
    }
  </Flex>
}

export const AuctionDoneCard = ({auction={}})=>{
}

export const AuctionListItem = ({auction={}})=>{
  return <Flex justifyContent='space-between'>
    <Link to={`/auctions/${auction.name}`}>{auction.name}</Link>
  </Flex>
}

export const AuctionList = ({auctions={}})=>{
  return <React.Fragment>
    {
      Object.values(auctions).map(auction=>{
        return <AuctionListItem key={auction.id} auction={auction}/>
      })
    }
  </React.Fragment>
}

export const SmallAuctionTable = ({title='',auctions={}})=>{
  return <Flex flexDirection='column'>
    <Tiny>{title}</Tiny>
    <AuctionList auctions={auctions}/>
  </Flex>
}

