import Chartjs from 'chart.js';
import React,{useRef,useCallback,useEffect,useState} from 'react';
import ReactDOM from 'react-dom';
import wiring from '../wiring'
import {normalizedAuctionPrice,normalizedAuctionTime} from '../utils'
import dayjs from 'dayjs'

export function Chart({width=800, height=800, options={},data={},type='line',tick}){
  const [chart,setChart] = useState()

  const chartEl = useCallback(node=>{
    if(node == null) return
    const chart = new Chartjs(node,{
      type,
      data,
      options,
    })
    console.log('chart update',{type,data,options})
    chart.update()
    setChart(chart)
  },[])

  useEffect(x=>{
    if(chart == null) return
    chart.data = {
      ...chart.data,
      ...data
    }
    console.log('updating chart',chart.data)
    chart.update()
  },[tick])


  return <div style={{width,height}}><canvas ref={chartEl}/></div>
}

export function AuctionChart({auctionManager,auction,points=10}){
  const {BigNumber} = window.web3
  const {
    startPrice,
    endPrice
  } = auctionManager

  function getChartOptions(auction,auctionManager){
    return {
      type:'line',
      data:{
        labels:Array.from({length:points},(_,i)=>{
          const percent = i/(points-1)
          const currentTime = normalizedAuctionTime({percent,...auction}).toString().split('.')[0]
          // return dayjs(parseInt(currentTime) * 1000).format('MM/DD/YY hh:mm:ss')
          return new Date(parseInt(currentTime) * 1000)
        }),
        datasets:[
          {
            label:'Price Curve',
            pointRadius:0,
            fill:false,
            order:1,
            // data:[startPrice,endPrice],
            data: Array.from({length:points},(_,i)=>{
              const percent = i/(points-1)
              const currentTime = normalizedAuctionTime({percent,...auction}).toString().split('.')[0]
              return {
                y:normalizedAuctionPrice({percent,...auctionManager}).toString().split('.')[0],
                x:new Date(parseInt(currentTime) * 1000)
              }
            })
          },
          {
            label:'Current Price',
            order:2,
            pointBorderColor:'white',
            pointBackgroundColor:'white',
            pointStyle:'square',
            backgroundColor:'white',
            label:'Current Price',
            pointRadius:5,
            type:'bubble',
            data:[{
              y:auction.currentPrice.split('.')[0],
              // x:dayjs((parseInt(auction.startTime) + parseInt(auction.secondsPassed))*1000).format('MM/DD/YY hh:mm:ss'),
              x:new Date((parseInt(auction.startTime) + parseInt(auction.secondsPassed))*1000),
              r:5
            }],
          }
        ]
      },
      tick:0,
      options:{
         scales: {
          xAxes: [{
            position: 'bottom',
            ticks: {
              autoSkip: true,
            }
          }],
        }
      },
    }
  }


  // console.log({auction})
  const [options,setOptions] = useState(getChartOptions(auction,auctionManager))

  useEffect(x=>{
  console.log('auctionprice',auction.currentPrice)
   options.data.datasets[1].data[0].y = auction.currentPrice.split('.')[0]
   options.data.datasets[1].data[0].x = new Date(parseInt(auction.startTime) + parseInt(auction.secondsPassed)*1000)
   options.tick++
   setOptions(options)
  },[auction.currentPrice])

  if(auctionManager == null) return <div>Loading</div>
  if(auction == null) return <div>Loading</div>
  if(options == null) return <div>Loading</div>

  return <Chart {...options}/>
}

