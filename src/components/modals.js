import React, {useState,useEffect} from 'react';
import {Link,useParams} from 'react-router-dom'
import wiring from '../wiring'
import humanize from 'humanize-duration'
import {humanizeWei,toEth,toWei,BigNumber,get} from '../utils'
import {ClaimAllButton} from './buttons'
import {Modal,Button} from 'react-bootstrap'
import {Flex,Box} from '../styles'

export default (props={}) =>{
  const {show,onHide,onClick,body,title} = props
  return <Modal 
    size='md'
    show={show} 
    onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>
        {title}
      </Modal.Title>
    </Modal.Header>

    <Modal.Body>
      {body}
    </Modal.Body>

    <Modal.Footer>
      <Button variant="secondary" onClick={onClick}>Close</Button>
    </Modal.Footer>
  </Modal>
}

