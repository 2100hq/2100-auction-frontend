import assert from 'assert'
export default (config,libs) => {
  let {name,address,abi} = config

  assert(name,'requires name')
  assert(address,'requires address')

  const {provider,ethers,BigNumber} = libs
  assert(BigNumber,'requires bignumber')

  const contract = new ethers.Contract(address,abi,provider)

  async function tickAuction(){
    return contract.tickAuction()
  }

  async function bid(value){
    return contract.bid({value:new BigNumber(value)})
  }

  async function claim(id,donate){
    return contract.claimTokens(id,donate)
  }

  // uint256 auctionId,
  // bool isActive,
  // bool isStopReached,
  // uint256 startTime,
  // uint256 endTime,
  // uint256 secondsPassed,
  // uint256 secondsRemaining,
  // uint256 currentPrice,
  // uint256 finalPrice,
  // uint256 deposits
  async function getAuction(id){
    return contract.getAuction(id).then(result=>{
      return {
        name,
        address,
       ...result
      }
    })
  }

  return {
    bid,
    claim,
    tickAuction,
    getAuction,
  }

}


