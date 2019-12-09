import ApexChart from 'react-apexcharts';
import React,{useRef,useCallback,useEffect,useState} from 'react';
import ReactDOM from 'react-dom';
import wiring from '../wiring'
import {normalizedAuctionPrice,normalizedAuctionTime} from '../utils'
import dayjs from 'dayjs'

export function Chart(props){
  return <ApexChart {...props}/>
}

export function AuctionChart({auctionManager,auction,points=10}){
  const [options,setOptions] = useState(getChartOptions(auction,auctionManager))

  function getChartOptions(auction,auctionManager){
    return {
      options:{
        chart: {
          id: 'apexchart-example'
        },
        xaxis: {
          type: 'datetime',
          // min: 0,
          // max: points,
        }
      },
      series: [
        {
        name: 'Price Over Time',
        type:'line',
        data: Array.from({length:points},(_,i)=>{
            const percent = i/(points-1)
            const currentTime = normalizedAuctionTime({percent,...auction}).toString().split('.')[0]
            return [
              parseInt(currentTime) * 1000,
              normalizedAuctionPrice({percent,...auctionManager}).toString().split('.')[0],
            ]
          })     
        },
        {
          name:'Current Price',
          type:'scatter',
          data:[[
            (parseInt(auction.startTime) + parseInt(auction.secondsPassed))*1000,
            auction.currentPrice.split('.')[0],
          ]]
        }
      ]
    }
  }



  useEffect(x=>{
  // console.log('auctionprice',auction.currentPrice)
    options.series[1].data = [[
      (parseInt(auction.startTime) + parseInt(auction.secondsPassed))*1000,
      auction.currentPrice.split('.')[0],
    ]]
    console.log('data',options.series[1].data)

    setOptions({
      ...options,
      series:[
        ...options.series,
      ]
    })
    // setOptions
   // options.data.datasets[1].data[0].y = auction.currentPrice.split('.')[0]
   // options.data.datasets[1].data[0].x = new Date(parseInt(auction.startTime) + parseInt(auction.secondsPassed)*1000)
   // options.tick++
   // setOptions(options)
  },[auction.currentPrice])

  console.log({options})

  return <Chart {...options} />
}

