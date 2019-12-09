import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import wiring from './wiring'
import RegistryABI from './abis/registry'
import AuctionABI from './abis/auction'
import GraphProto from './graphproto/graphproto'
import Ethers from './ethers'
import Models from './models'
import {loop} from './utils'
import 'bootstrap/dist/css/bootstrap.min.css'

import Composer from './data-composer'

const contracts = {
  registry:{
    address:'0x8fBC76f664ccF77D93D2e4F25D37a995379774B7',
    abi:RegistryABI
  },
  auction:{
    abi:AuctionABI
  }
}

async function init(){
  const set = wiring.dispatch('set')

  const {ethereum,web3} = window
  if(!ethereum){
    return wiring.dispatch('setError')(new Error('You must have metamask installed'))
  }
  // window.web3 = new Web3(ethereum)
  await ethereum.enable().catch(wiring.dispatch('setError'))

  web3.eth.getBalance(ethereum.selectedAddress,(err,balance)=>{
    console.log({err,balance})
    set('balance',balance.toString())
    set('registryid','0')
    set('myAddress',ethereum.selectedAddress)
  })

  ethereum.on('accountsChanged',accounts=>{
    console.log('accounts',accounts)
    set('accounts',accounts)
  })

  // const {query,subscribe} = await GraphProto({uri:process.env.REACT_APP_GRAPH_QUERY},{},(type,data)=>{
  //   switch(type){
  //     case 'bids':
  //       return models.bids.set(data)
  //     case 'balances':
  //       return models.balances.set(data)
  //     case 'registries':
  //       return models.registry.set(data)
  //     case 'auctionManagers':
  //       return models.auctionContracts.set(data)
  //     case 'auctions':{
  //       const id = models.auctions.makeId(data)
  //       if(models.auctions.has(id)){
  //         models.auctions.setDeposit(id,data.deposits,data.startTime,data.endTime)
  //       }else{
  //         models.auctions.create(data)
  //       }
  //       return models.auctions.tick(id)
  //     }
  //     default:
  //       console.log('unhandled event',type,data)
  //   }
  // })

  //const models = Models({},{BigNumber:window.web3.BigNumber},(table,id,data)=>{
  //  switch(table){
  //    case 'auctions':
  //      return set([table,data.name,data.auctionId],data)
  //    case 'registry':
  //      return set(['registries',data.id],data)
  //    case 'auctionContracts':
  //      return set(['auctionManagers',data.name],data)
  //    default:
  //      // console.log(table,id,data)
  //      set([table,id],data)
  //  }
  //})

  //loop(x=>{
  //  return [...models.auctions.table.keys()].forEach(id=>models.auctions.tick(id,Date.now()))
  //},1000)

  //const ethers = Ethers(contracts,{provider:window.ethereum,BigNumber:window.web3.BigNumber},(path,data)=>{
  //  //events are not needed anymore here
  //})

  const {bid,claim,create,subscribe,query,models} = await Composer({
      graphql:{uri:process.env.REACT_APP_GRAPH_QUERY},
      ethers:contracts
    },
    {provider:ethereum,BigNumber:web3.BigNumber},
    set
  )

  // console.log({bid,claim,create,subscribe,query,models})
  return {
    query,
    subscribe,
    bid,
    claim,
    create,
    models,
    BigNumber:web3.BigNumber,
    ethereum,
    web3
  }
}

window.addEventListener('load', async ()=>{
  const state = await init().catch(console.log)
  ReactDOM.render(
    <wiring.Provider {...state}>
      <App />
    </wiring.Provider>
    ,
    document.getElementById('root')
  );
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
