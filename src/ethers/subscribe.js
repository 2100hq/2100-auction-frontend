import assert from 'assert'

function Subscriber(process,emit=x=>x){
  const subscriptions = new Set()

  function on(val){
    subscriptions.add(val)
    process(val).then(emit)
  }
  function off(val){
    subscriptions.delete(val)
  }
  function tick(){
    return Promise.all([...subscriptions.values()].map(input=>{
      return process(input).then(emit)
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

export default (config,{auction,loop},emit=x=>x) => {
  assert(loop,'requires loop')
  //subscriptions
  const {interval=5000} = config

  const auctions = Subscriber(async key=>{
    const [name,auctionId] = key.split('!')
    return (await auction(name)).getAuction(auctionId)
  },data=>{
    if(data) emit(`auctions.${data.name}.${data.auctionId}`,data)
  })

  loop(async x=>{
    await auctions.tick()
  },interval).catch(err=>{
    console.log('ethers subscription error',err)
  })

  return {
    auctions,
  }
}

