import React, {useState,useEffect} from 'react';
import {Link,useParams} from 'react-router-dom'
import wiring from '../wiring'
import {Auction,AuctionHistory,SmallAuctionTable,AuctionCard} from '../components/auction'
import { BidButton } from '../components/buttons'
import {Flex,ApplePanel,Hr,Tiny,Box, BurnInput, UnitButton, Vr,Strong} from '../styles'
import {AuctionChart} from '../components/rechart-pie'
import {Row,Col} from 'react-bootstrap'
import humanize from 'humanize-duration'
import {get,humanizeWei,toEth,toWei,BigNumber} from '../utils'

export default wiring.connect((props)=>{
  const {query,dispatch,myAddress} = props

  const {name,id} = useParams()
  const [auction,setAuction] = useState(null)

  useEffect(x=>{

    query.getAuction(name,id).then(setAuction).catch(dispatch('setError'))

  },[name,id])

  console.log({name,id,auction})
  if(auction == null) return <div>Loading</div>

  return <div>
    <Row>
      <Col>
       <Link to={`/auctions/${name}`}>Latest Auction</Link>
       <AuctionCard auction={auction}/>
      </Col>
    </Row>
  </div>
})

