import mojs from '@mojs/core';
import React,{useRef,useCallback,useEffect,useState} from 'react';
import ReactDOM from 'react-dom';
import wiring from '../wiring'
import {normalizedAuctionPrice,normalizedAuctionTime} from '../utils'
import dayjs from 'dayjs'

export function Chart(){
  const [chart,setChart] = useState()

  const chartEl = useCallback(node=>{
    if(node == null) return

    const background = new mojs.Shape({
      shape:'rect',
      radius:400,
    })

    // const chart = new Chartjs(node,{
    //   type,
    //   data,
    //   options,
    // })
    // console.log('chart update',{type,data,options})
    // chart.update()
    // setChart(chart)
  },[])

  // useEffect(x=>{
  //   if(chart == null) return
  //   chart.data = {
  //     ...chart.data,
  //     ...data
  //   }
  //   console.log('updating chart',chart.data)
  //   chart.update()
  // },[tick])


  return <div id='mochart'/>
}

export function AuctionChart({auction,auctionManager}){
  const [chart,setChart] = useState()

  const chartEl = useCallback(node=>{
    if(node == null) return

    const background = new mojs.Shape({
      parent:'#mochart',
      isShowStart:true,
      shape:'rect',
      radius:100,
      color:'white',
    })

  },[])

  // useEffect(x=>{
  //   if(chart == null) return
  //   chart.data = {
  //     ...chart.data,
  //     ...data
  //   }
  //   console.log('updating chart',chart.data)
  //   chart.update()
  // },[tick])

  const style={
    width:100,
    heigh:100,
  }

  return <div style={style}>
    <div ref={chartEl} id='mochart'/>
  </div>
}

