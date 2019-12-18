import assert from 'assert'


export default async (config,{apollo,gql},emit=x=>x) => {
  function Subscribe(apollo,gql){
    return (query,key,cb) => {
      return apollo.subscribe({
        query:gql`subscription ${query}`,
        // pollInterval:1000,
      }).subscribe(data=>cb(data.data[key]))
    }
  }

  const subscribe = Subscribe(apollo,gql)

  function registries(cb){
    return subscribe(`
      {
        registries{
          id address length strings name
        }
      }
    `,'registries',(data=[])=>{
      data.forEach(data=>emit('registries',data))
    })
  }
  function auctions(){
    return subscribe(`
      {
        auctions{
          id,
          address,
          name,
          isActive,
          startTime,
          endTime,
          secondsPassed,
          secondsRemaining,
          deposits,
          auctionId,
          amount,
          duration,
        }
      }
    `,'auctions',(data=[])=>{
      data.forEach(data=>emit('auctions',data))
    })             
  }
  function balances(){
    return subscribe(`
      {
        balances{
          id address tokenAddress name balance
        }
      }
    `,'balances',(data=[])=>{
      data.forEach(data=>emit('balances',data))
    })           
  }
  function auctionManagers(){
    return subscribe(`
      {
        auctionManagers{
          name 
          id 
          currentAuctionId 
          address
          maximumSupply
          amount
          duration
        }
      }
    `,'auctionManagers',(data=[])=>{
      data.forEach(data=>emit('auctionManagers',data))
    }) 
  }

  function bids(){
    return subscribe(`
      {
        bids{
        id amount name address auctionId claim
      }
    }
    `,'bids',(data=[])=>{
      data.forEach(data=>emit('bids',data))
    })                   
  }

  return {
    registries,
    auctionManagers,
    bids,
    balances,
    auctions,
  }
  //assert(query,'requires query')
  //assert(loop,'requires loop')
  ////subscriptions
  //const {interval=10000} = config
  //const auctions = Subscriber(query.getAuctionById,data=>{
  //  // if(data) emit(['auctions',data.name,data.auctionId],data)
  //  if(data) emit('auctions',data)
  //})
  //const auctionManagers = Subscriber(query.getAuctionManager,data=>{
  //  // if(data) emit(['auctionManagers',data.name],data)
  //  if(data) emit('auctionManagers',data)
  //})
  //const registries = Subscriber(query.getRegistry,data=>{
  //  // if(data) emit(['registries',data.id],data)
  //  if(data) emit('registries',data)
  //})
  //const balances = Subscriber(query.getBalanceById,data=>{
  //  // if(data) emit(['tokenBalances',data.address,data.tokenName],data.balance)
  //  if(data) emit('balances',data)
  //})
  //const bids = Subscriber(query.getBidById,data=>{
  //  // if(data) emit(['auctionBalances',data.address,data.auctionName,data.auctionId],data.bids)
  //  if(data) emit('bids',data)
  //})
  //const bidsByAddress = Subscriber(query.getBidsByAddress,data=>{
  //  // if(data) emit(['auctionBidsByAddress'],data)
  //  if(data) data.forEach(bid=>emit('bids',bid))
  //})
  //const balancesByAddress = Subscriber(query.getBalancesByAddress,data=>{
  //  // if(data) emit(['tokenBalancesByAddress'],data)
  //  if(data) data.forEach(balance=>emit('balances',balance))
  //})

  //loop(async x=>{
  //  await registries.tick()
  //  await auctionManagers.tick()
  //  await auctions.tick()
  //  await balances.tick()
  //  await bids.tick()
  //  await bidsByAddress.tick()
  //  await balancesByAddress.tick()
  //},interval).catch(err=>{
  //  console.log('graphql subscription error',err)
  //})

  //return {
  //  auctions,
  //  auctionManagers,
  //  registries,
  //  balances,
  //  bids,
  //  bidsByAddress,
  //  balancesByAddress,
  //}
}
