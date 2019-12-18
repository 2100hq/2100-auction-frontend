import React, {useState,useEffect} from 'react';
import {Link,useParams} from 'react-router-dom'
import {useWiring} from '../wiring'
import {AuctionDone,AuctionNavigation} from '../components/auction'
import { BidButton } from '../components/buttons'
import {Flex,ApplePanel,Hr,Tiny,Box, BurnInput, UnitButton, Vr,Strong} from '../styles'
import {AuctionChart} from '../components/rechart-pie'
import {Row,Col} from 'react-bootstrap'
import humanize from 'humanize-duration'
import {get,humanizeWei,toEth,toWei,BigNumber} from '../utils'

export default (props)=>{
  let {name,id} = useParams()
  id = parseInt(id)
  const [{query,myAddress,registry},,dispatch] = useWiring([['registry','tokens',name]],null,name,id)

  const token = get(registry,['tokens',name])
  const auction = get(token,['auctions',id])

  // const [auction,setAuction] = useState(null)
  // useEffect(x=>{
  //   query.getAuction(name,id).then(setAuction).catch(dispatch('setError'))
  // },[name,id])

  // console.log({name,id,auction})
  if(auction == null) return <div>Loading</div>

  const latest = parseInt(token.currentAuctionId)

  return <div>
    <Row>
      <Col>
        <AuctionNavigation max={latest} current={id} name={name}/>
        <AuctionDone auction={auction}/>
      </Col>
    </Row>
  </div>
}

