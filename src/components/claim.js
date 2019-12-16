import React, {useState,useEffect} from 'react';
import {Link,useParams} from 'react-router-dom'
import wiring from '../wiring'
import humanize from 'humanize-duration'
import {humanizeWei,toEth,toWei,BigNumber,get} from '../utils'
import {ClaimAllButton} from './buttons'
import {Modal,Button} from 'react-bootstrap'
import {Flex,Box} from '../styles'

export const BidRow = (props)=>{
  const {name,amount,auctionIds} = props
  return <Flex justifyContent='space-around'>
    <Flex width={256} marginRight={20} justifyContent='flex-end'>
      <h5>${name}</h5> 
    </Flex>
    <Flex width={256} marginLeft={20} justifyContent='flex-start'>
      <h5>{toEth(amount,18)}</h5>
    </Flex>
    <ClaimAllButton name={name} auctionIds={auctionIds} amount={amount}/>
  </Flex>
}

export const BidsList = (props)=>{
  const {bids=[]} = props
  return <Box width='100%' >
    {
      bids.map(bid=>{
        return <Box m={10}>
          <BidRow {...bid}/>
        </Box>
      })
    }
  </Box>
}

export const ClaimCard = props=>{
  const {bids={}} = props

  const groupedBids = Object.values(bids).reduce((result,bid)=>{
    if(result[bid.name] == null){
      result[bid.name] = {
        name:bid.name,
        auctionIds:[],
        amount:new BigNumber(0),
      }
    }
    result[bid.name].auctionIds.push(bid.auctionId)
    result[bid.name].amount = result[bid.name].amount.plus(bid.amount)
    return result
  },{})


  return <Flex flexDirection='column' alignItems='center'>
    <p> 
      One or more 2100 auctions you participated in have completed.
      Please claim your tokens.
    </p>
    <BidsList bids={Object.values(groupedBids)}/>
  </Flex>
}
  
export const ClaimModal = (props={}) =>{
  const {show,onHide,onClick,bids={}} = props
  return <Modal 
    size='lg'
    show={show} 
    onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>
        <strong>Claim your 2100 tokens</strong>
      </Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <ClaimCard bids={bids}/>
    </Modal.Body>

    <Modal.Footer>
      <Button variant="secondary" onClick={onClick}>Close</Button>
    </Modal.Footer>
  </Modal>
}

export const ClaimModalButton = wiring.connect((props) =>{
  const {
    myAddress,
    dispatch,
    subscribe,
    query,
    registry={},
  } = props

  const [show,setShow] = useState(false)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const myBids = get(registry,['bids',myAddress],{})

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
    Object.values(myBids).forEach(bid=>{
      const id = [bid.name,bid.auctionId].join('!')
      subscribe.auctions.on(id)
    })

    return ()=>{
      Object.values(myBids).forEach(bid=>{
        const id = [bid.name,bid.auctionId].join('!')
        subscribe.auctions.off(id)
      })
    }
  },[Object.values(myBids).length])

  if(registry==null) return <div>Loading</div>


  const inactiveBids = Object.values(myBids).filter(x=>!x.isActive && x.amount != '0')
  // console.log({myBids,inactiveBids,registry})

  return <Box>
    <ClaimModal show={show} onHide={handleClose} onClick={handleClose} bids={inactiveBids}/>
    {
      inactiveBids.length ? 
      <Button variant='warning' size='sm' onClick={handleShow}>
        You have unclaimed tokens! Claim Now
      </Button>
      : null
    }
  </Box>
})


