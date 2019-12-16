import React, {useState,useEffect} from 'react';
import {Link,useParams} from 'react-router-dom'
import wiring from '../wiring'
import {Auction,AuctionHistory,SmallAuctionTable} from '../components/auction'
import { BidButton } from '../components/buttons'
import {Flex,ApplePanel,Hr,Tiny,Box, BurnInput, UnitButton, Vr,Strong, P} from '../styles'
// import {AuctionChart} from '../components/apexchart'
// import {AuctionChart} from '../components/reactviz-chart'
// import {AuctionChart} from '../components/reactvis-pie'
import {AuctionChart} from '../components/rechart-pie'
import {Row,Col} from 'react-bootstrap'
import humanize from 'humanize-duration'
import {get,humanizeWei,toEth,toWei,BigNumber} from '../utils'
import Modal from '../components/modals'



export default wiring.connect((props)=>{
  const {registry={strings:[]},manager,ethers,query,subscribe,dispatch,donate,myAddress} = props
  const {name} = useParams()
  const [bid,setBid] = useState('')
  const [show,setShow] = useState(false)
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
    <Modal
      show={show}
      onHide={x=>setShow(false)}
      onClick={x=>setShow(false)}
      body={
        <p>
           Estimated auction earnings may be incorrect if bids enter the auction after you bid.
           If others join the auction after you bid, you will earn a token amount proportional 
           to all other participants bid sizes, decreasing your total potential earnings. 
        </p>
      }
      title={
        <p> What Happens During Bidding </p>
      }

    />
    <Row>
      <Col md={9}>
        <Row>
          <Box width='100%'>
            <h1>${auction.name} &nbsp; &nbsp; </h1>
            <Flex justifyContent='space-between'>
              <h5><Strong>Auction {auctionNumber} of {toEth(token.maximumSupply,0)} </Strong></h5>
              {auction.isActive ? <Strong>Ends in {humanize(new BigNumber(auction.secondsRemaining).times(1000).toString())} </Strong> : null}
            </Flex>
          </Box>
          <hr/>
          <Box width='100%'>
        
            { false ? 
              <Box width='100%'>
                <h6>
                  {humanizeWei(auction.deposits || 0)} claiming 1 ${auction.name}
                </h6> 
              </Box>
              : null
            }
            <Flex justifyContent='space-evenly'>
              <AuctionChart newBid={bid} auction={auction} auctionManager={token} myAddress={myAddress}/>
              <Flex flexDirection='column' justifyContent='center'>
                <Flex flexDirection='column' justifyContent='center'>
                    { 
                      bid && 
                      !isNaN(bid) && 
                      parseFloat(bid) != 0 && 
                      parseFloat(bid) < .0001 ? 
                        <Tiny> {humanizeWei(toWei(bid),4)} </Tiny> : null
                    }
                    <Flex alignItems='flex-end' >
                      <BurnInput 
                        disabled={disableInput}
                        onChange={e=>setBid(e.target.value)} value={bid}
                      />
                  </Flex>
                  <P>ETH gets <strong>1 ${auction.name}</strong></P> 
                  <Tiny>(<Link onClick={x=>setShow(true)} >or less</Link>)</Tiny> 
                </Flex>
                <BidButton 
                  disabled={disableInput}
                  donate={donate} 
                  name={auction.name} 
                  value={bid} 
                  onClick={()=>{setBid(''); setDisableInput(false)}}
                  onSubmit={()=>setDisableInput(true) }
                />
              </Flex>
            </Flex>
            
            <Flex margin='10px' width='200px' className='form-check'>
              <input className='form-check-input' id='donate' name='donate' type='checkbox' checked={donate} onChange={e=>setDonate(!donate)}/> 
              <label className='form-check-label' htmlFor='donate'>
                <Tiny>Donate my eth to the 2100 project instead of burning it</Tiny>
              </label>
            </Flex>
          </Box>
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

