import assert from 'assert'

function Subscriber(query,emit=x=>x){
  assert(query,'requires query function')
  const subscriptions = new Set()

  function on(val){
    subscriptions.add(val)
    query(val).then(emit)
  }
  function off(val){
    subscriptions.delete(val)
  }
  function tick(){
    return Promise.all([...subscriptions.values()].map(input=>{
      return query(input).then(emit)
    }))
  }

  function length(){
    return subscriptions.size
  }

  return {
    on,
    off,
    tick,
    length,
  }
}

export default async (config,{query,loop},emit=x=>x) => {
  assert(query,'requires query')
  assert(loop,'requires loop')
  //subscriptions
  const {interval=10000} = config
  const auctions = Subscriber(query.getAuctionById,data=>{
    // if(data) emit(['auctions',data.name,data.auctionId],data)
    if(data) emit('auctions',data)
  })
  const auctionManagers = Subscriber(query.getAuctionManager,data=>{
    // if(data) emit(['auctionManagers',data.name],data)
    if(data) emit('auctionManagers',data)
  })
  const registries = Subscriber(query.getRegistry,data=>{
    // if(data) emit(['registries',data.id],data)
    if(data) emit('registries',data)
  })
  const balances = Subscriber(query.getBalanceById,data=>{
    // if(data) emit(['tokenBalances',data.address,data.tokenName],data.balance)
    if(data) emit('balances',data)
  })
  const bids = Subscriber(query.getBidById,data=>{
    // if(data) emit(['auctionBalances',data.address,data.auctionName,data.auctionId],data.bids)
    if(data) emit('bids',data)
  })
  const bidsByAddress = Subscriber(query.getBidsByAddress,data=>{
    // if(data) emit(['auctionBidsByAddress'],data)
    if(data) data.forEach(bid=>emit('bids',bid))
  })
  const balancesByAddress = Subscriber(query.getBalancesByAddress,data=>{
    // if(data) emit(['tokenBalancesByAddress'],data)
    if(data) data.forEach(balance=>emit('balances',balance))
  })

  loop(async x=>{
    await registries.tick()
    await auctionManagers.tick()
    await auctions.tick()
    await balances.tick()
    await bids.tick()
    await bidsByAddress.tick()
    await balancesByAddress.tick()
  },interval).catch(err=>{
    console.log('graphql subscription error',err)
  })

  return {
    auctions,
    auctionManagers,
    registries,
    balances,
    bids,
    bidsByAddress,
    balancesByAddress,
  }
}
