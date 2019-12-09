import Model from './model'
import {loop} from '../utils'

export default (config,libs,emit=x=>x)=>{
  const table = new Map()
  const model = Model(config,{...libs,table},(id,data)=>{
    emit(['auctions',data.name,data.auctionId],data)
  })

  loop(()=>{
    const auctions = [...table.values()]
    return auctions.filter(auction=>auction.isActive).map(auction=>model.tick(auction.id))
  },config.tickRate || 1000)    
  // loop(model.tick,config.tickRate || 1000)
  //   .catch(err=>{
  //     console.log('local auction tick err',err)
  //   })

  return model
}
