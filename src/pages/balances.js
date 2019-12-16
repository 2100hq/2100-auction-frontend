import React, {useState,useEffect} from 'react';
import {Link} from 'react-router-dom'
import wiring from '../wiring'
import {ClaimButton} from '../components/buttons'
import {humanizeWei} from '../utils'
import {ClaimCard} from '../components/claim'
import {Row,Col} from 'react-bootstrap'

export default wiring.connect((props)=>{
  const {
    myAddress,
    dispatch,
    subscribe,
    query,
    registries={},
    registryid,
    bids={},
    balances={},
    auctions={},
    BigNumber,
    models,
  } = props

  const registry = registries[registryid]
  if(registry==null) return <div>Loading</div>

  useEffect(x=>{
    if(myAddress == null) return
    // subscribe.balancesByAddress.on(myAddress)
    subscribe.bidsByAddress.on(myAddress)

    return ()=>{
      // subscribe.balancesByAddress.off(myAddress)
      subscribe.bidsByAddress.off(myAddress)
    }
  },[myAddress])

  useEffect(x=>{
    Object.values(bids).forEach(bid=>{
      const id = [bid.name,bid.auctionId].join('!')
      subscribe.auctions.on(id)
    })

    return ()=>{
      Object.values(bids).forEach(bid=>{
        const id = [bid.name,bid.auctionId].join('!')
        subscribe.auctions.off(id)
      })
    }
  },[Object.values(bids).length])

  return <Row>
    <Col auto/>
    <Col md={9}>
      <ClaimCard bids={bids}/>
    </Col>
    <Col auto/>
  </Row>

})

// const AuctionBalances = ({BigNumber,balances={},auctions=[], auctionManagers={}}) =>{
//   const fragment = Object.entries(balances).map(([name,auctionIds])=>{
//     return <div>
//       { 
//         Object.entries(auctionIds).map(([id,value])=>{
//           // console.log({id,value,auctions,name})
//           const {deposits} = auctions.find(x=>name===x.name && id == x.auctionId)
//           const unclaimed = new BigNumber(value).div(deposits).times('1000000000000000000').toString()
//           return <div>
//             {name} - {id} : { humanizeWei(unclaimed)}
//             <ClaimButton auctionId={id} name={name} total={value} donationPercent={1}/>
//           </div>
//         })
//       }
//     </div>
//   })

//   return <React.Fragment>
//     {fragment}
//   </React.Fragment>
// }

// const AuctionBids = ({bids=[],auctions={},BigNumber})=>{
//   const claim = Object.values(bids).map(bidData=>{
//     const {name,auctionId,amount} = bidData
//     if(amount == '0') return null
//     const auction = auctions[name]
//     let found
//     if(auction) found = auction[auctionId]
//     if(found == null) return <p> Loading </p>
//     return <div>
//       {found.isActive ? 
//         <div>
//           {name} - {auctionId} : Pending Completion
//         </div> : 
//         <div>
//           {name} - {auctionId} : { humanizeWei(new BigNumber(amount).div(found.deposits).times('1000000000000000000').toString())}
//           <ClaimButton auctionId={auctionId} name={name} total={amount} donationPercent={1}/> 
//         </div>
//       }
//     </div>
//   })
//   return <div>
//     {claim}
//   </div>
// }


// const Balances = ({balances=[]}) => {
//   const fragment = Object.values(balances).map(value=>{
//     return <p>{value.name} : {value.balance}</p>
//   })

//   return <React.Fragment>
//     {fragment}
//   </React.Fragment>
// }

// export default wiring.connect((props)=>{
//   const {
//     myAddress,
//     dispatch,
//     subscribe,
//     query,
//     registries={},
//     registryid,
//     bids={},
//     balances={},
//     auctions={},
//     BigNumber,
//     models,
//   } = props

//   const registry = registries[registryid]
//   if(registry==null) return <div>Loading</div>

//   useEffect(x=>{
//     if(myAddress == null) return
//     subscribe.balancesByAddress.on(myAddress)
//     subscribe.bidsByAddress.on(myAddress)

//     return ()=>{
//       subscribe.balancesByAddress.off(myAddress)
//       subscribe.bidsByAddress.off(myAddress)
//     }
//   },[myAddress])

//   useEffect(x=>{
//     Object.values(bids).forEach(bid=>{
//       const id = [bid.name,bid.auctionId].join('!')
//       subscribe.auctions.on(id)
//     })

//     return ()=>{
//       Object.values(bids).forEach(bid=>{
//         const id = [bid.name,bid.auctionId].join('!')
//         subscribe.auctions.off(id)
//       })
//     }
//   },[Object.values(bids).length])

//   // console.log({bids,balances})

//   return <div>
//     <div>
//       <Link to='/'>Back</Link>
//     </div>
//     <p>Current Address {myAddress}</p>
//     <p> Unclaimed Auction Tokens </p>
//     <AuctionBids BigNumber={BigNumber} bids={bids} auctions={auctions}/>
//     <p> Token Balances </p>
//     <Balances balances={balances}/>
//   </div>
// })

