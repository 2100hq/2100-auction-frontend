import React, {useState,useEffect} from 'react';
import {Link,useParams} from 'react-router-dom'
import wiring from '../wiring'
import {Auction,AuctionHistory,SmallAuctionTable} from '../components/auction'
import { BidButton } from '../components/buttons'
import {Flex,ApplePanel,Hr,Tiny,Box, BurnInput, UnitButton, Vr,Strong} from '../styles'
// import {AuctionChart} from '../components/apexchart'
// import {AuctionChart} from '../components/reactviz-chart'
// import {AuctionChart} from '../components/reactvis-pie'
import {AuctionChart} from '../components/rechart-pie'
import {Row,Col} from 'react-bootstrap'
import humanize from 'humanize-duration'
import {get,humanizeWei,toEth,toWei,BigNumber} from '../utils'



export default wiring.connect((props)=>{
  const {registry={strings:[]},manager,ethers,query,subscribe,dispatch,donate,myAddress} = props
  const {name} = useParams()
  const [bid,setBid] = useState('')
  const [disableInput,setDisableInput] = useState(false)
  const [history,setHistory] = useState([])
  const setDonate = dispatch('setDonate')

  const token = get(registry,['tokens',name])

  //run once
  useEffect(x=>{
    query.getDoneAuctionsByName(name).then(setHistory).catch(dispatch('setError'))
    subscribe.auctionManagers.on(name)
    return ()=>{
      subscribe.auctionManagers.off(name)
    }
  },[name])

  //once our auction manager exists subscribe to the particular auction
  useEffect(x=>{
    if(!token) return

    const id = `${name}!${token.currentAuctionId}`
    subscribe.auctions.on(id)

    const bidid = `${myAddress}!${name}!${token.currentAuctionId}`
    subscribe.bids.on(bidid)

    return ()=>{
      subscribe.auctions.off(id)
      subscribe.bids.off(bidid)
    }
  },[token ? token.id : null])

  // console.log({token,registry})

  if(!registry) return <p> Loading </p>
  if(!token) return <p> Loading </p>

  const auction = get(token,['auctions',token.currentAuctionId])

  if(!auction || !auction.id) return <p> Loading </p>

  let auctionNumber = auction.auctionId
  if(auction.done){
    auctionNumber++
  }

  return <div>
    <Flex flexDirection='column' justifyContent='flex-start'>
      <h1>${auction.name} &nbsp; &nbsp; </h1>
      <p>{token.currentAuctionId} / {toEth(token.maximumSupply)} minted</p>
    </Flex>
    <Row>
      <Col md={9}>
        <hr/>
        <Flex justifyContent='space-between'>
          <h5><Strong>Auction {auctionNumber}</Strong></h5>
          {auction.isActive ? <Strong>Ends in {humanize(new BigNumber(auction.secondsRemaining).times(1000).toString())} </Strong> : null}
        </Flex>
        <Row>
          <Col>
            <Flex flexDirection='column' height='100%'>
              { auction.isActive ? 
                <Flex flexDirection='column' alignItems='center'>
                  <h6>
                    {humanizeWei(auction.deposits || 0)} claiming 1 ${auction.name}
                  </h6> 
                  <Tiny>
                   Implied Market Cap
                  </Tiny>
                </Flex>
                : null
              }
              <Flex flexGrow={1} flexDirection='column' justifyContent='center' alignItems='center' alignContent='center'>
                <Strong>To join the claim:</Strong>
                <Flex>
                  <BidButton 
                    disabled={disableInput}
                    donate={donate} 
                    name={auction.name} 
                    value={bid} 
                    onClick={()=>{setBid(''); setDisableInput(false)}}
                    onSubmit={()=>setDisableInput(true) }
                  />
                  <BurnInput 
                    disabled={disableInput}
                    onChange={e=>setBid(e.target.value)} value={bid}
                  />
                  <UnitButton> <Strong>ETH</Strong> </UnitButton>
                </Flex>
                { 
                  bid && 
                  !isNaN(bid) && 
                  parseFloat(bid) != 0 && 
                  parseFloat(bid) < .0001 ? 
                    <Tiny> {humanizeWei(toWei(bid),4)} </Tiny> : null
                }
                <Box margin='10px' width='200px' className='form-check'>
                  <input className='form-check-input' id='donate' name='donate' type='checkbox' checked={donate} onChange={e=>setDonate(!donate)}/> 
                  <label className='form-check-label' htmlFor='donate'>
                    <Tiny>Donate my eth to the 2100 project instead of burning it</Tiny>
                  </label>
                </Box>
              </Flex>
            </Flex>
          </Col>
          <Col xs={1}>
            <Vr/>
          </Col>
          <Col>
            <Flex justifyContent='space-around' alignItems='center'>
              <AuctionChart newBid={bid} auction={auction} auctionManager={token} myAddress={myAddress}/>
            </Flex>
          </Col>
        </Row>
        <Row>
          <Hr/>
          <AuctionHistory auctions={[...history].reverse()}/>
        </Row>
      </Col>
      <Col xs={1}>
       <Vr/>
      </Col>
      <Col md={2}>
        Other Activity
        <Hr/>
        <SmallAuctionTable auctions={registry.strings.map(x=>({name:x}))}/>
      </Col>
    </Row>

  </div>
})

