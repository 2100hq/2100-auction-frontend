import assert from 'assert'
import GraphProto from '../graphproto/graphproto'
import Ethers from '../ethers'
import RegistryABI from '../abis/registry'
import AuctionABI from '../abis/auction'
import Models from '../models'
import {loop} from '../utils'

export default async (config={},{provider,BigNumber},emit=x=>x) =>{
  // assert(query,'requires graphql queries')
  // assert(subscribe,'requires graphql subcriber')
  // assert(ethers,'requires ethers')
  // assert(models,'requires data models')
  assert(BigNumber,'requires bignumber')
  assert(provider,'requires provider')


  const models = Models(config.models,{BigNumber},(table,id,data)=>{
    switch(table){
      case 'auctions':
        return emit([table,data.name,data.auctionId],data)
      case 'registry':
        return emit(['registries',data.id],data)
      case 'auctionContracts':
        return emit(['auctionManagers',data.name],data)
      default:
        console.log(table,id,data)
        emit([table,id],data)
    }
  })

  const ethers = Ethers(config.ethers,{provider,BigNumber})

  const {query,subscribe} = await GraphProto(config.graphql,{},(type,data)=>{
    switch(type){
      case 'bids':
        return models.bids.set(data)
      case 'balances':
        return models.balances.set(data)
      case 'registries':
        return models.registry.set(data)
      case 'auctionManagers':
        return models.auctionContracts.set(data)
      case 'auctions':{
        const id = models.auctions.makeId(data)
        if(models.auctions.has(id)){
          models.auctions.setDeposit(id,data.deposits,data.startTime,data.endTime)
        }else{
          models.auctions.create(data)
        }
        return models.auctions.tick(id)
      }
      default:
        console.log('unhandled event',type,data)
    }
  })

  subscribe.registries.on('0')

  loop(x=>{
    return [...models.auctions.table.keys()].forEach(id=>models.auctions.tick(id,Date.now()))
  },1000)

  async function bid(name,value){
    const auction = await ethers.auction(name)
    return auction.bid(value)
  }

  async function claim(name,auctionId,total,donationPercent='1'){
    assert(name,'requires auction name')
    assert(auctionId != null,'requires auctionId')
    assert(total != null,'requires total bid')
    assert(donationPercent != null,'requires donation percent')
    const donate = new BigNumber(total).times(donationPercent)
    const auction = await ethers.auction(name)
    return auction.claim(auctionId,donate)
  }

  // async function composeBid(bid){
  //   const auctionId = models.auctions.makeId({
  //     auctionId:bid.auctionId,
  //     name:bid.auctionName,
  //   })
  //   const auctionManagerId = bid.auctionName
  //   if(!models.auctions.has(auctionId)) return composeBid(bid)
  //   if(!models.auctionContracts.has(auctionManagerId)) return composeBid(bid)

  //   const auction = models.auctions.get(auctionId)
  //   const auctionManager = models.auctionContracts.get(bid.auctionName)

  // }

  return {
    //bid on an auction
    bid,
    //claim auction token
    claim,
    //create new token name
    create:ethers.create,
    subscribe,
    query,
    models,
  }
}
