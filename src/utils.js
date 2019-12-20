import assert from 'assert'
import bigjs from 'big.js'
import lodash from 'lodash'
export async function loop(fn,delay,...args){
  await fn(...args)
  await new Promise(res=>setTimeout(res,delay))
  return loop(fn,delay,...args)
}
 

export const BigNumber = bigjs

export function auctionPrice({startPrice,endPrice,currentTime,startTime,endTime}){
  const secondsPassed = new BigNumber(currentTime).minus(startTime)
  const duration = new BigNumber(endTime).minus(startTime)
  const percent = secondsPassed.div(duration)
  return normalizedAuctionPrice({startPrice,endPrice,percent})
  // currentTime = new BigNumber(currentTime)
  // if(currentTime.gte(endTime)) return endPrice
  // const secondsPassed = currentTime.minus(startTime)
  // const totalPriceChange = new BigNumber(startPrice).minus(endPrice)
  // const duration = new BigNumber(endTime).minus(startTime)
  // const currentPriceChange = totalPriceChange.times(secondsPassed).div(duration)
  // return new BigNumber(startPrice).minus(currentPriceChange)
}

export function normalizedAuctionPrice({startPrice=0,endPrice=0,percent=0}){
  if(new BigNumber(percent).gte(1)) return new BigNumber(endPrice)
  const totalPriceChange = new BigNumber(startPrice).minus(endPrice)
  console.log({startPrice,endPrice,percent:percent.toString(),totalPriceChange:totalPriceChange.toString()})
  return new BigNumber(startPrice).minus(totalPriceChange.times(percent))
}

export function normalizedAuctionTime({percent=0,startTime=0,endTime=0}){
  if(new BigNumber(percent).gte(1)) return new BigNumber(endTime)
  const duration = new BigNumber(endTime).minus(startTime)
  return (new BigNumber(startTime).plus(duration.times(percent)))
}

export function toWei(eth='0'){
  eth = new BigNumber(eth)
  return eth.times(1e18).toString()
}

export function toEth(wei,fixed=2){
  wei = new BigNumber(wei)
  return wei.div(1e18).toFixed(fixed)
  // return window.web3.fromWei(wei)
}

export function humanizeWei(wei,fixed=2){
  wei = new BigNumber(wei)
  if(wei.eq(0)) return '0 ETH'

  if(wei.lte(`1e${8-fixed}`)){
    return `${wei.toString()} WEI`
  }

  if(wei.lte(`1e${17-fixed}`)){
    return `${wei.div(1e9).toFixed(fixed)} GWEI`
  }

  return `${wei.div(1e18).toFixed(fixed)} ETH`

}

export function timeout(fn,duration,...args){
  const stop = setTimeout(fn,duration,...args)
  return ()=>clearTimeout(stop)
}

//maybe replace this without using lodash
export function set(state,path=[],data){
  return lodash.setWith(state,path,data,Object)
}

export function get(state,path=[],fallback){
  if(path.length == 0) return state || fallback
  return lodash.get(state,path,fallback)
}

export function unset(state,path){
  return lodash.unset(state,path)
}

//this will make new objects along update path for change detection with react
export function setRecursive(state={},path=[],data){
  if(path.length == 0) return data 
  const [head,...rest] = path
  state[head] = setRecursive({...state[head]},rest,data)
  return state
}


