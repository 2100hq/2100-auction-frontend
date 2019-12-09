import assert from 'assert'
import Bids from './bids/model'
import AuctionContracts from './auctionContracts/model'
import Balances from './balances/model'
import Auctions from './auctions/model'
import Registry from './registry/model'

export default (config={},libs={},emit=x=>x) =>{
  const tables = {
    bids:new Map(),
    balances:new Map(),
    auctions: new Map(),
    registry: new Map(),
    auctionContracts: new Map(),
  }

  const handleEvent = table => (id,data)=>{
    emit(table,id,data)
  }

  const models = {
    bids: Bids(config.bids,{...libs,table:tables.bids},handleEvent('bids')),
    balances: Balances(config.balances,{...libs,table:tables.balances},handleEvent('balances')),
    auctions: Auctions(config.auctions,{...libs,table:tables.auctions},handleEvent('auctions')),
    registry: Registry(config.registry,{...libs,table:tables.registry},handleEvent('registry')),
    auctionContracts: AuctionContracts(config.auctionContracts,{...libs,table:tables.auctionContracts},handleEvent('auctionContracts')),
  }

  return models
}

