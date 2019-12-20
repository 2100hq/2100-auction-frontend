import {
  PieChart,Pie,Cell,Tooltip
}  from 'recharts';
import React,{useRef,useCallback,useEffect,useState} from 'react';
import ReactDOM from 'react-dom';
import {useWiring} from '../wiring'
import dayjs from 'dayjs'
import {toEth,BigNumber,humanizeWei,toWei,get} from '../utils'

export const AuctionChart = ({
  auction,
  auctionManager,
  myAddress,
  newBid='0',
  dispatch,
  width=200,
  height=200
})=>{

  const bids = Object.values(get(auction,'bids',{}))

  const yourTotal = bids.reduce((sum,bid)=>{
    // console.log({bid})
    if(bid.address != myAddress) return sum
    return sum.plus(bid.amount)
  },new BigNumber(0))

  const notYours = new BigNumber(auction.deposits).minus(yourTotal)

  const data = []

  function getTokenAmount(yours,theirs){
    // console.log({yours,theirs})
    return `${toEth(new BigNumber(yours).div(new BigNumber(yours).plus(theirs)).times(auctionManager.amount)) } $${auction.name}` 
  }

  if(auction.isActive){
    if(notYours.gt(0)){
      data.push({
        value: parseFloat(notYours.toString()),
        color:'gray',
        name:{
          text:'Everyone Elses Claim',
          amount:getTokenAmount(notYours,yourTotal),
        }
        // name:`Others Claim: ${getTokenAmount(notYours,yourTotal)}`,
      })
    }
    if(yourTotal.gt(0)){
      data.push({
        value:parseFloat(yourTotal.toString()),
        color:'#e5ff9f',
        name:{
          text:'Your Claim',
          amount:getTokenAmount(yourTotal,notYours),
        }

        // name:`Your Claim: ${getTokenAmount(yourTotal,notYours)}`,
      })
    }

    if(!isNaN(newBid) && parseFloat(newBid) > 0 && newBid.length){
      data.push({
        value:parseFloat(toWei(newBid).toString()),
        color:'#cde490',
        name:{
          text:'Add New Claim',
          amount:getTokenAmount(newBid,auction.deposits),
        // name:`Add Your Claim: ${getTokenAmount(newBid,auction.deposits)} `,
        }
        // name:`Add Your Claim: ${getTokenAmount(newBid,auction.deposits)} `,
      })
    }
  }else{
    if(!isNaN(newBid) && parseFloat(newBid) > 0 && newBid.length){
      data.push({
        value:parseFloat(toWei(newBid).toString()),
        color:'#cde490',
        name:{
          text:'Add New Claim',
          amount:getTokenAmount(newBid,auction.deposits),
        }
        // name:`Add Your Claim: ${getTokenAmount(newBid,auction.deposits)} `,
      })
    }else{
      data.push({
        value:1e18,
        color:'#6c757d',
        name:{
          text:'Unclaimed',
          amount:'1',
        }
      })
    }
  }

  return <div
      style={{
        position:'relative',
      }}
    >
    <PieChart 
        height={height}
        width={width}
      >
      <Pie 
        data={data} 
        dataKey='value' 
        isAnimationActive={false}
        legendType='line'
        nameKey='name' 
        fill="#8884d8" 
        innerRadius={width / 3}
        outerRadius={width / 2 - 1}
        paddingAngle={0}
      >
        {
          data.map((data,i)=>{
            return <Cell key={i} fill={data.color} stroke={data.color}/>
          })
        }
      </Pie>
      <Tooltip 
        wrapperStyle={{
          zIndex:2,
        }}
        formatter={(value,name,props)=>{
          return [humanizeWei(value),`${name.text} : ${name.amount}`]
        }}
      />
    </PieChart>
    <div style={{
      zIndex:1,
      margin:0,
      position:'absolute',
      left:width/2 - 25,
      top:width/2 - 25,
      width:50,
      height:50,
      background:'#d3d3d300',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      flexDirection:'column',
    }}>
     <h6><strong>${auction.name}</strong></h6>
    </div>
  </div>
      // <Pie 
      //   data={data} 
      //   isAnimationActive={false}
      //   dataKey='value' 
      //   nameKey='name' 
      //   fill="#fffe59" 
      //   outerRadius={50}
      // >  
      // </Pie>
}




