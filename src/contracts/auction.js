import assert from 'assert'
export default async (config,libs) => {
  let {name,address,abi,myAddress} = config
  const {BigNumber} = libs

  assert(BigNumber,'requires bignumber')
  assert(name,'requires name')
  assert(address,'requires address')
  assert(myAddress,'requires myAddress')

  abi = JSON.parse(abi || '[ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "MAXIMUM_SUPPLY", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint8" }, { "name": "", "type": "address" } ], "name": "bids", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "AUCTION_START_PRICE", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "AUCTION_AMOUNT", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "AUCTION_DURATION", "outputs": [ { "name": "", "type": "uint64" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "AUCTION_END_PRICE", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [ { "name": "_base", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_spender", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "sender", "type": "address" }, { "indexed": false, "name": "auctionId", "type": "uint256" }, { "indexed": false, "name": "amount", "type": "uint256" } ], "name": "Bid", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "auctionId", "type": "uint256" }, { "indexed": false, "name": "startTime", "type": "uint256" }, { "indexed": false, "name": "endTime", "type": "uint256" } ], "name": "Start", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "auctionId", "type": "uint256" } ], "name": "Finalize", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "note", "type": "string" } ], "name": "NoteS", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "notestring", "type": "string" }, { "indexed": false, "name": "notenumber", "type": "uint256" } ], "name": "NoteN", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "notestring", "type": "string" }, { "indexed": false, "name": "notenumber", "type": "int256" } ], "name": "NoteInt", "type": "event" }, { "constant": true, "inputs": [ { "name": "_auctionId", "type": "uint8" } ], "name": "auctionStarted", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_auctionId", "type": "uint8" } ], "name": "auctionEnded", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_auctionId", "type": "uint8" } ], "name": "isActiveAuction", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "startNextAuction", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "currentAuctionId", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_auctionId", "type": "uint8" } ], "name": "getAuction", "outputs": [ { "name": "auctionId", "type": "uint256" }, { "name": "isActive", "type": "bool" }, { "name": "isStopReached", "type": "bool" }, { "name": "startTime", "type": "uint256" }, { "name": "endTime", "type": "uint256" }, { "name": "secondsPassed", "type": "uint256" }, { "name": "secondsRemaining", "type": "uint256" }, { "name": "currentPrice", "type": "uint256" }, { "name": "finalPrice", "type": "uint256" }, { "name": "deposits", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_auctionId", "type": "uint8" } ], "name": "getMyBid", "outputs": [ { "name": "bid", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_auctionId", "type": "uint8" }, { "name": "_sender", "type": "address" } ], "name": "getBid", "outputs": [ { "name": "bid", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "bid", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_auctionId", "type": "uint8" } ], "name": "calcCurrentPrice", "outputs": [ { "name": "tokenPrice", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "tickAuction", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_auctionId", "type": "uint8" }, { "name": "donation", "type": "uint256" } ], "name": "claimTokens", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "tokenOwner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "tokens", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "spender", "type": "address" }, { "name": "tokens", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "tokens", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "tokenOwner", "type": "address" }, { "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "destroy", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]') 

  const {subspace} = libs

  const contract = await subspace.contract({address,abi})


  async function getState(id,address=myAddress){
    return {
      name,
      address,
      ...(await contract.methods.getAuction(id).call()),
      myBid: await getBid(id,address),
      myBalance: await balanceOf(address),
    }
  }


  async function  balanceOf(address){
    return (await contract.methods.balanceOf(address).call()).toString()
  }

  async function unclaimed(id,address){
    const {isActive,isStopReached,deposits} = await getState(id,address)
    if(isActive) return '0'
    if(!isStopReached) return '0'
    const bid = new BigNumber(await contract.methods.getBid(id,address).call())
    return bid.dividedBy(deposits).toString()
  }

  async function getBid(id,address){
    return (await contract.methods.getBid(id,address).call()).toString()
  }

  async function latestAuction(){
    return contract.methods.currentAuctionId().call()
  }

  async function bid(from,value){
    return contract.methods.bid().send({from,value})
  }

  async function claim(id,donate,from=myAddress){
    return contract.methods.claimTokens(id,donate).send({from})
  }

  return {
    bid,
    getState,
    getBid,
    latestAuction,
    contract,
    balanceOf,
    unclaimed,
    claim,
  }

}

