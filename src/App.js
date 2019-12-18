import React, {useEffect} from 'react';
import {Form,FormControl, Button, Container,Alert, Toast, Navbar, Nav, NavDropdown} from 'react-bootstrap'
// import './App.css';
import { useWeb3Context } from 'web3-react'
import {ethers} from 'ethers'
import {LatestAuction} from './components/auction'
import {timeout} from './utils'
import {useWiring} from './wiring'
import RegistryPage from './pages/registry'
import AuctionPage from './pages/auction'
import AuctionHistoryPage from './pages/auctionhistory'
import BalancesPage from './pages/balances'
import {ClaimModalButton} from './components/claim'
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


export default props=> {
  const [{error,success},dispatch] = useWiring(['error','success'])

  useEffect(x=>{
    if(error == null) return
    return timeout(hideError,3000)
  },[error])

  useEffect(x=>{
    if(success == null) return
    return timeout(hideSuccess,3000)
  },[success])

  function hideError(){
    dispatch('setError',null)
  }

  function hideSuccess(){
    dispatch('success',null)
  }
 
  return (
    <div className="App">
      <Router>
        <Toast 
          variant='danger'
          style={{
            zIndex:100,
            position:'absolute',
            top:0,
            right:0,
          }}
          show={Boolean(error)} onClose={x=>hideError()}>
          <Toast.Header> Error </Toast.Header>
          {error? <Toast.Body> {error.message} </Toast.Body> : null}
        </Toast>
        <Toast 
          variant='success'
          style={{
            zIndex:100,
            position:'absolute',
            top:0,
            right:0,
          }}
          show={Boolean(success)} onClose={x=>hideSuccess()}>
          <Toast.Header> Success </Toast.Header>
          {success ? <Toast.Body> {success} </Toast.Body> : null}
        </Toast>
        <Navbar bg="light" expand="lg">
        <Navbar.Brand><Link to='/'>2100</Link></Navbar.Brand>
        <Form inline>
          <ClaimModalButton/>
        </Form>
      </Navbar>
      <Container>
          <Switch>
            <Route exact path='/'>
              <RegistryPage/>
            </Route>
            <Route exact path='/auctions/:name/:id'>
              <AuctionHistoryPage/>
            </Route>
            <Route exact path='/auctions/:name'>
              <AuctionPage/>
            </Route>
            <Route path='/balances'>
              <BalancesPage/>
            </Route>
          </Switch>
      </Container>
    </Router>
  </div>
  );
}

