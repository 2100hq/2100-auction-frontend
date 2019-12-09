import React, {useEffect} from 'react';
import {Container,Alert, Toast} from 'react-bootstrap'
// import './App.css';
import { useWeb3Context } from 'web3-react'
import {ethers} from 'ethers'
import {LatestAuction} from './components/auction'
import wiring from './wiring'
import RegistryPage from './pages/registry'
import AuctionPage from './pages/auction'
import BalancesPage from './pages/balances'
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


export default wiring.connect(props=> {
  const {dispatch,error,subspace} = props

  function hideError(){
    dispatch('setError')(null)
  }
 
  return (

    <div className="App">
      <header className="App-header">
        <Toast 
          variant='danger'
          style={{
            position:'absolute',
            top:0,
            right:0,
          }}
          show={Boolean(error)} onClose={x=>hideError()}>
          <Toast.Header> Error </Toast.Header>
          {error? <Toast.Body> {error.message} </Toast.Body> : null}
        </Toast>
      </header>
      <Container>
        <Router>
          <Switch>
            <Route exact path='/'>
              <RegistryPage/>
            </Route>
            <Route path='/auctions/:name'>
              <AuctionPage/>
            </Route>
            <Route path='/balances'>
              <BalancesPage/>
            </Route>
          </Switch>
        </Router>
      </Container>
    </div>
  );
})

