import assert from 'assert'
import GraphProto from '../graphproto/graphproto'
import Ethers from '../ethers'
import RegistryABI from '../abis/registry'
import AuctionABI from '../abis/auction'
import Models from '../models'
import {loop,BigNumber} from '../utils'
import State from './state'

export default async (config={},{provider},emit=x=>x) =>{
  assert(BigNumber,'requires bignumber')
  const state = State({})
  //{
  //  registry:{
  //    tokens:{
  //      balances:{},
  //      auctions:{
  //         bids:{}
  //      }
  //    }
  //  }
  //}
  const models = Models(config.models,{BigNumber},(table,id,data)=>{

    let path = []
    switch(table){
      case 'auctions':{
        //an auction finished, we should increment the manager
        //if(!data.isActive && data.deposits != '0'){
        //  try{
        //    const auction = models.auctionContracts.setCurrent(data.name,new BigNumber(data.auctionId).plus(1))
        //    models.auctions.create({
        //      auctionId:auction.currentAuctionId,
        //      name:data.name,
        //    })
        //  }catch(err){
        //    //ignore
        //  }
        //}
        // return emit([table,data.name,data.auctionId],data)
        path = ['registry','tokens',data.name,'auctions',data.auctionId]
        break;
      }
      case 'registry':{
        path = ['registry']
        break;
      }
      case 'auctionContracts':{
        path = ['registry','tokens',data.name]
        break;
      }
      case 'balances':{
        path = ['registry','tokens',data.name,'balances']
        break;
      }
      case 'bids':{
        //default to bid is active
        const {isActive} = state.get(['registry','tokens',data.name,'auctions',data.auctionId],{isActive:true})

        data = {...data,isActive}

        path = ['registry','tokens',data.name,'auctions',data.auctionId,'bids',data.address]
        //hack in a bids index
        state.set(['registry','bids',data.address,data.id],data)
        break;
      }
      default:
        throw new Error('unhandled type',table)
        // console.log(table,id,data)
        // emit([table,id],data)
    }
    if(data){
      const prev = state.get(path,{})
      state.set(path,{...prev,...data})
    }else{
      state.unset(path)
    }
    // console.log(state.get())
    emit('registry',state.get('registry'))
  })

  //provider is now optional so we can still read the site 
  let ethers
  if(provider){
     ethers = Ethers(config.ethers,{provider,BigNumber})
  }

  const {query,subscribe} = await GraphProto(config.graphql,{},(type,data)=>{
    switch(type){
      case 'bids':
        return models.bids.set(data)
      case 'balances':
        return models.balances.set(data)
      case 'registries':
        return models.registry.set(data)
      case 'auctionManagers':
        // if(models.auctionContracts.has(data.name)) return
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

  async function bid(name,value,donate=false){
    assert(ethers,'Please connect metamask')
    const auction = await ethers.auction(name)
    return auction.bid(value, donate ? value : 0)
  }

  //deprecated
  async function claimAndDonate(name,auctionId,total,donationPercent='1'){
    assert(ethers,'Please connect metamask')
    assert(name,'requires auction name')
    assert(auctionId != null,'requires auctionId')
    assert(total != null,'requires total bid')
    assert(donationPercent != null,'requires donation percent')
    const donate = new BigNumber(total).times(donationPercent)
    const auction = await ethers.auction(name)
    console.log({donate:donate.toString(),auctionId,total,name})
    return auction.claimAndDonate(auctionId,donate)
  }

  async function claimAll(name,auctionids=[]){
    assert(ethers,'Please connect metamask')
    assert(name,'requires auction name')
    const auction = await ethers.auction(name)
    return auction.claimAll(auctionids)
  }

  async function claim(name,auctionid){
    assert(ethers,'Please connect metamask')
    assert(name,'requires auction name')
    const auction = await ethers.auction(name)
    return auction.claim(auctionid)
  }

  return {
    //bid on an auction
    bid,
    //claim auction token
    claimAndDonate,
    claimAll,
    claim,
    //create new token name
    create:async (...args)=>{
      assert(ethers,'Please connect metamask')
      return ethers.create(...args)
    },
    subscribe,
    query,
    models,
  }
}
