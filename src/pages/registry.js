import React, {useState} from 'react';
import {Link} from 'react-router-dom'
import {useWiring} from '../wiring'
import { CreateAuctionButton } from '../components/buttons'
import {humanizeWei} from '../utils'

const AuctionLink = ({name})=>{
  return <Link to={`/auctions/${name}`}> {name} </Link>
}

export default (props)=>{
  const [newAuction,setNewAuction] = useState('')
  const [{registry}] = useWiring(['registry.strings','registry.stats'])
  
  console.log({registry})
  // if(!registry || !registry.strings) return <p> Loading </p>
  if(!registry || !registry.strings || !registry.stats) return <p> Loading </p>
  const {stats} = registry

  return <div>
    <p> Registry: {registry.name} </p>
    <p> Registry Address: {registry.address} </p>
    <p> Total Auctions: {registry.length} </p>
    <p> Total Donated {humanizeWei(stats.donated)} - Total Burned {humanizeWei(stats.burned)}</p>
    <label>
      Create New Auction &nbsp;
      <input onChange={e=>setNewAuction(e.target.value)} value={newAuction}/>
    </label>
    <CreateAuctionButton name={newAuction} onClick={()=>setNewAuction('')}/>
    {registry.strings.map(name=><div key={name} ><AuctionLink name={name}/></div>)}
  </div>
}
