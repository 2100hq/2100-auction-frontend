import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import wiring from './wiring'
import RegistryABI from './abis/registry'
import AuctionABI from './abis/auction'
import GraphProto from './graphproto/graphproto'
import Ethers from './ethers'
import Models from './models'
import {loop,BigNumber} from './utils'
import 'bootstrap/dist/css/bootstrap.min.css'
import {throttle} from 'lodash'

import Composer from './data-composer'

const contracts = {
  registry:{
    // address:'0x8fBC76f664ccF77D93D2e4F25D37a995379774B7',
    // address:'0x48fd2fc9a774359d2f64a710e1deb1387cedbaea',
    address:'0xa623Ddf7b1D79baADE582F9a4558a430E6fe9395',
    abi:RegistryABI
  },
  auction:{
    abi:AuctionABI
  }
}


async function init(){
  const set = wiring.dispatch('set')

  const {ethereum,web3} = window
  if(ethereum){
    // window.web3 = new Web3(ethereum)
    await ethereum.enable().catch(wiring.dispatch('setError'))

    web3.eth.getBalance(ethereum.selectedAddress,(err,balance)=>{
      // console.log({err,balance})
      set('balance',balance.toString())
      set('myAddress',ethereum.selectedAddress)
    })

    ethereum.on('accountsChanged',accounts=>{
      console.log('accounts changed',accounts)
      set('myAddress',ethereum.selectedAddress)
      set('accounts',accounts)
      set('bids',{})
      set('balances',{})
    })
  }

  //default donate settings
  const donate = Boolean(localStorage.getItem('donate'))
  set('donate',donate)

  const throttleSet = throttle(set,1000,{leading:true})

  const {bid,claimAll,claim,create,subscribe,query,models} = await Composer({
      graphql:{uri:process.env.REACT_APP_GRAPH_QUERY},
      ethers:contracts
    },
    {provider:ethereum,BigNumber},
    throttleSet
    // set
  )

  // console.log({bid,claim,create,subscribe,query,models})
  return {
    query,
    subscribe,
    bid,
    claim,
    claimAll,
    create,
    models,
    BigNumber,
    ethereum,
    web3,
    registryid:'0',
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
