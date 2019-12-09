import assert from 'assert'
export async function loop(fn,delay,...args){
  await fn(...args)
  await new Promise(res=>setTimeout(res,delay))
  return loop(fn,delay,...args)
}

export const BigNumber = window.web3.BigNumber

export function auctionPrice({startPrice,endPrice,currentTime,startTime,endTime}){
  const secondsPassed = new BigNumber(currentTime).minus(startTime)
  const duration = new BigNumber(endTime).minus(startTime)
  const percent = secondsPassed.dividedBy(duration)
  return normalizedAuctionPrice({startPrice,endPrice,percent})
  // currentTime = new BigNumber(currentTime)
  // if(currentTime.gte(endTime)) return endPrice
  // const secondsPassed = currentTime.minus(startTime)
  // const totalPriceChange = new BigNumber(startPrice).minus(endPrice)
  // const duration = new BigNumber(endTime).minus(startTime)
  // const currentPriceChange = totalPriceChange.times(secondsPassed).dividedBy(duration)
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


export function toEth(wei){
  return window.web3.fromWei(wei)
}
