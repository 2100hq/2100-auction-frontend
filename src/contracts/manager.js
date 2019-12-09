import Auction from './auction'
import Registry from './registry'
import assert from 'assert'

export default async (config,libs,emit=x=>x) => {
  const auctions = new Map()
  const trackers = new Map()
  let registry
  let registryState = {}
  console.log('init contract man')

  async function init(config){
    await initRegistry(config.registry)
    for(const auction of registryState.auctions){
      await initLatestAuction({...auction,myAddress:config.myAddress})
      await initUnclaimedTokens(auction.name,config.myAddress)
    }
    
  }

  async function initRegistry(props){
    if(registry) return registry
    registry =  await Registry(props,libs)
    registryState = await registry.getState()
    console.log('registrystate',registryState)
    emit('registry',registryState)
    const tracker = registry.contract.methods.stringsLength().track()
    trackers.set('$registry',tracker)
    tracker.subscribe(async length=>{

      const oldLength = registryState.length

      registryState = await registry.getState(registryState)
      const newAuctions = registryState.auctions.slice(oldLength,length)
      console.log({newAuctions,oldLength,length,registryState})
      emit('registry',registryState)


      for(const auction of newAuctions){
        await initLatestAuction({...auction,myAddress:config.myAddress})
        await initUnclaimedTokens(auction.name,config.myAddress)
      }

    })
    return registry
  }

  async function loop(fn,delay,...args){
    await fn(...args)
    await new Promise(res=>setTimeout(res,delay))
    return loop(fn,delay,...args)
  }

  async function initLatestAuction(config){
    if(auctions.has(config.name)) return auctions.get(config.name)
    const auction =  await Auction(config,libs)
    auctions.set(config.name,auction)

    loop(async x=>{
      let latestAuction = await auction.contract.methods.currentAuctionId().call()
      const auctionState = await auction.getState(latestAuction)
      emit(['auctions',config.name],auctionState)
    },5000).catch(err=>{
      console.log('loop error',err)
    })

    return auction
  }

  async function initUnclaimedTokens(name,address){
    const total = await unclaimedTokens(name,address)
    emit(['unclaimed',name],total)
    return total
  }

  async function unclaimedTokens(name,address,index=0,total={}){
    assert(auctions.has(name),'No auction found with by name: ' + name)
    const auction = auctions.get(name)
    let latestAuction = await auction.contract.methods.currentAuctionId().call()
    if(parseInt(latestAuction) < index) return total
    const unclaimed = await auction.unclaimed(index,address)
    if(unclaimed !== '0') total[index] = unclaimed
    return unclaimedTokens(name,address,index+1,total)
  }

  await init(config)

  return {
    async bid(name,from,value){
      if(!auctions.has(name)) throw new Error('no auction with name: ' + name)
      return auctions.get(name).bid(from,value)
    },
    async create(name,from){
      return registry.create(name,from)
    },
    unclaimedTokens,
    initUnclaimedTokens,
    async claimTokens(name,id,donate){
      if(!auctions.has(name)) throw new Error('no auction with name: ' + name)
      return auctions.get(name).claim(id,donate)
    },
  }
}
