import {
  RadialChart,
}  from 'react-vis';
import React,{useRef,useCallback,useEffect,useState} from 'react';
import ReactDOM from 'react-dom';
import wiring from '../wiring'
import dayjs from 'dayjs'
import {toEth,BigNumber,humanizeWei,toWei} from '../utils'

export const AuctionChart = wiring.connect(({
  subscribe,
  auction,
  auctionManager,
  myAddress,
  newBid='0',
  bids={},
  width=800,
  height=400
})=>{

  useEffect(x=>{
    if(myAddress == null) return
    const id = `${myAddress}!${auction.name}!${auction.auctionId}`
    subscribe.bids.on(id)
    return ()=>{
      subscribe.bids.off(id)
    }
  },[myAddress])

  bids = Object.values(bids)

  const yourTotal = bids.reduce((sum,bid)=>{
    if(bid.address != myAddress) return sum
    if(auction.auctionId != bid.auctionId) return sum
    return sum.plus(bid.amount)
  },new BigNumber(0))

  const notYours = new BigNumber(auction.deposits).minus(yourTotal)

  const data = []

  function getTokenAmount(yours,theirs){
    // console.log({yours,theirs})
    return `${toEth(new BigNumber(yours).div(new BigNumber(yours).plus(theirs)).times(auctionManager.amount)) } $${auction.name.slice(0,5)}` 
  }

  if(auction.isActive){
    if(notYours.gt(0)){
      data.push({
        angle: notYours.toString(),
        color:'gray',
        label:`${getTokenAmount(notYours,yourTotal)}`,
        subLabel:`${humanizeWei(notYours)}`
      })
    }
    if(yourTotal.gt(0)){
      data.push({
        angle:yourTotal.toString(),
        color:'blue',
        label:`${getTokenAmount(yourTotal,notYours)}`,
        subLabel:`${humanizeWei(yourTotal)}`
      })
    }

    if(!isNaN(newBid) && parseFloat(newBid) > 0 && newBid.length){
      data.push({
        angle:newBid.toString(),
        color:'darkblue',
        label:`${getTokenAmount(newBid,auction.deposits)}`,
        subLabel:`${humanizeWei(toWei(newBid))}`
      })
    }
  }else{
    if(!isNaN(newBid) && parseFloat(newBid) > 0 && newBid.length){
      data.push({
        angle:newBid.toString(),
        color:'darkblue',
        label:`${getTokenAmount(newBid,auction.deposits)}`,
        subLabel:`${humanizeWei(toWei(newBid))}`
      })
    }else{
      data.push({
        angle:1,
        color:'#6c757d',
      })
    }
  }

  return <div
    style={{
      position:'relative',
    }}
    >
    <RadialChart
      colorType='literal'
      data={data}
      labelRadiusMultiplier={.5}
      width={width + 100}
      height={width + 100}
      innerRadius={width/3}
      radius={width/2}
      labelsAboveChildren={true}
      showLabels={true}
      style={{
        fontSize:'10',
      }}
      >
    </RadialChart>
    <div style={{
      margin:0,
      position:'absolute',
      left:width/2 - width/4 + 50, 
      top:width/2 - width/4 + 50,
      width:width/2,
      height:width/2,
      borderRadius:'50%',
      background:'lightgray',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      flexDirection:'column',
    }}>
     <h1><strong>1</strong></h1>
     <h6><strong>${auction.name}</strong></h6>
    </div>
  </div>
})



