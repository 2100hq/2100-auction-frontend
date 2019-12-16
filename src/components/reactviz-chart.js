import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, ChartLabel, LineMarkSeries, MarkSeries, Hint}  from 'react-vis';
import React,{useRef,useCallback,useEffect,useState} from 'react';
import ReactDOM from 'react-dom';
import wiring from '../wiring'
import dayjs from 'dayjs'
import {toEth} from '../utils'

export function AuctionChart({auction,auctionManager,width=800,height=400}){
  console.log({auction})
  const startEndPrice = [
    {
      y:auctionManager.startPrice,
      x:auction.startTime,
    },
    {
      y:auctionManager.endPrice,
      x:auction.endTime,
    },
  ]
  const currentPrice = [
    {
      y:auction.currentPrice,
      x:auction.currentTime,
    },
  ]
  const currentEndingPrice = [
    {

      y:auction.currentEndPrice,
      x:auction.currentEndTime,
    },
  ]

  return <XYPlot
    width={width}
    height={height}
    color='gray'
    yDomain={[auctionManager.endPrice,auctionManager.startPrice]}
    margin={{
      left:70,
      bottom:70
    }}
    style={{
      fontSize:'10'
    }}
    >
      <LineSeries 
        strokeWidth='3px'
        color='gray' 
        data={startEndPrice} 
      />
      <MarkSeries 
        strokeWidth='1px'
        color='gray' 
        data={currentPrice} 
      />
      <MarkSeries 
        strokeWidth='1px'
        color='red' 
        data={currentEndingPrice} 
      />
      <XAxis 
        tickTotal={10}
        title='Time' 
        position='middle'
        style={{
          text:{
            fill:'gray'
          },
          title:{
            fill:'gray'
          }
        }}
        tickLabelAngle={-25}
        tickFormat={
          (t,i)=>{
            return dayjs(t * 1000).format('MM/DD/YY hh:mm:ss')
          }
        }
      />
      <YAxis 
        tickTotal={10}
        color='gray' 
        position='middle'
        title= 'Price Eth'
        style={{
          text:{
            fill:'gray'
          },
          title:{
            fill:'gray'
          }
        }}
        tickFormat={
          (t,i)=>{
            return toEth(t) 
          }
        }
      />
  </XYPlot>
}


