
import assert from 'assert'
import { ethers } from 'ethers'
import Registry from './registry'
import Auction from './auction'
import Subscribe from './subscribe'
import {loop} from '../utils'

export default (config={registry:{},auction:{}},{provider},emit=x=>x) => {
  assert(provider,'requires provider')
  const {BigNumber} = ethers.utils

  provider = new ethers.providers.Web3Provider(provider)
  
  const signer = provider.getSigner()

  const registry = Registry(config.registry,{provider:signer,ethers,BigNumber})

  //caching auction contracts
  const auctions = new Map()
  async function auction(name){
    if(auctions.has(name)) return auctions.get(name)
    const address = await registry.stringToAddress(name)
    const auction = Auction({...config.auction,address,name},{provider:signer,ethers,BigNumber})
    auctions.set(name,auction)
    return auction
  }

  // const subscribe = Subscribe(config,{auction,loop},emit)

  return {
    ...registry,
    // subscribe,
    auction,
    utils:ethers.utils,
  }

}
