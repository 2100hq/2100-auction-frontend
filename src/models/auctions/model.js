import assert from 'assert'
import {normalizedAuctionPrice,normalizedAuctionTime} from '../../utils'

export default (config={}, {table,BigNumber}, emit=x=>x)=>{

  const {
    startPrice="10000000000000000000",
    endPrice='1',
    duration=900
  } = config

  const totalPriceChange = new BigNumber(startPrice).minus(endPrice)

  function parse(props){
    return {
      ...props,
      auctionId:props.auctionId.toString(),
      deposits:props.deposits.toString(),
      endTime:props.endTime.toString(),
      finalPrice:props.finalPrice.toString(),
      secondsPassed:props.secondsPassed.toString(),
      secondsRemaining:props.secondsRemaining.toString(),
      startTime:props.startTime.toString(),
      //new props for graphing
      currentEndTime:(props.currentEndTime || 0).toString(),
      currentEndPrice:(props.currentEndPrice || 0).toString(),
      currentTime:(props.currentTime || 0).toString()
    }
  }

  function makeId(props){
    assert(props.name,'requires auction name')
    assert(props.auctionId != null,'requires auction id index')
    return [props.name,props.auctionId.toString()].join('!')
  }

  function set(auction){
    assert(auction.id,'requires auction id')
    auction = parse(auction)
    table.set(auction.id,auction)
    emit(auction.id,auction)
    return auction
  }

  function get(id){
    assert(id,'requires id to get')
    const result = table.get(id)
    assert(result,'no such auction by id: ' + id)
    return result
  }

  function del(auction){
    assert(auction.id,'requires auction id')
    table.delete(auction.id)
    emit(auction.id)
    return auction
  }

  function hasByAuction(auction){
    return table.has(makeId(auction))
  }

  function has(id){
    return table.has(id)
  }



  function create(props){
    const id = makeId(props)
    assert(!has(id),'Auction already exists')
    return set({
      id,
      ...props
    })
  }

  function setDeposit(id,amount,startTime,endTime){
    assert(amount,'requires amount')
    const auction = get(id)
    auction.deposits = amount.toString()
    if(auction.isActive === false && auction.isStopReached === false){
      auction.isActive = true
      auction.startTime = startTime.toString()
      auction.endTime = endTime.toString()
    }
    return set(auction)
  }

  //auction logic
  function tick(id,now){
    now = now || Date.now()
    // console.log(id)
    const auction = calculateState(get(id),now)
    // console.log(auction)
    return set(auction)
  }

  function calculateState(auction,now=Date.now()){
    assert(auction,'requires auction')
    now = now || Date.now()

    const nowS = Math.min(parseInt(now/1000),parseInt(auction.endTime))

    const percentTime = new BigNumber(nowS).minus(auction.startTime).dividedBy(duration)
    const currentPrice = normalizedAuctionPrice({percent:percentTime,startPrice,endPrice})

    const percentPrice = new BigNumber(1).minus(new BigNumber(auction.deposits).dividedBy(totalPriceChange))
    const currentEndTime = normalizedAuctionTime({percent:percentPrice,...auction})

    auction.currentEndTime = currentEndTime.toString().split('.')[0]
    auction.currentEndPrice = auction.deposits
    auction.currentTime = nowS

    const secondsPassed = percentTime.times(duration)
    auction.secondsPassed = secondsPassed.toString().split('.')[0]
    auction.secondsRemaining = new BigNumber(duration).minus(secondsPassed).toString().split('.')[0]

    // console.log(percentTime.toString(),currentPrice.toString(),percentPrice.toString(),currentEndTime.toString())
    if(percentTime.gte(1)){
      auction.isActive = false
      if(new BigNumber(auction.deposits).gt(0)){
        auction.isStopReached = true
        auction.finalPrice = auction.deposits
      }
    }

    if(currentPrice.lt(auction.deposits)){
      auction.currentPrice = auction.deposits
    }else{
      auction.currentPrice = currentPrice.toString().split('.')[0]
    }

    return auction
  }

  return {
    ...table,
    create,
    set,
    get,
    del,
    has,
    hasByAuction,
    setDeposit,
    tick,
    makeId,
    calculateState,
    table,
  }

}
