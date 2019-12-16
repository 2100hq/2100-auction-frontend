import React, {useState} from 'react';
import {Link} from 'react-router-dom'
import wiring from '../wiring'
import { CreateAuctionButton } from '../components/buttons'

const AuctionLink = ({name})=>{
  return <Link to={`/auctions/${name}`}> {name} </Link>
}

export default wiring.connect((props)=>{
  const [newAuction,setNewAuction] = useState('')
  const {registry} = props
  
  if(!registry) return <p> Loading </p>

  return <div>
    <p> Registry: {registry.name} </p>
    <p> Registry Address: {registry.address} </p>
    <Link to='/balances'> See Balances </Link>
    <p> Total Auctions: {registry.length} </p>
    <label>
      Create New Auction &nbsp;
      <input onChange={e=>setNewAuction(e.target.value)} value={newAuction}/>
    </label>
    <CreateAuctionButton name={newAuction} onClick={()=>setNewAuction('')}/>
    {registry.strings.map(name=><div key={name} ><AuctionLink name={name}/></div>)}
  </div>
})
