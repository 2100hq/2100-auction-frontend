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

  async function bid(value,donate = new BigNumber(0)){
    value = new BigNumber(value)
    donate = new BigNumber(donate)
    assert(value.gt(0),'Requires bid above 0')
    assert(donate.gte(0),'Requires bid above 0')
    return contract.bid(donate,{value})
  }

  //no longer used
  async function claimAndDonate(id,donate){
    assert(id,'requires auction id')
    assert(donate,'requires donation amount')
    return contract.claimTokens(id,donate.toString())
  }

  async function claim(id){
    assert(id,'requires auction id')
    return contract.claimTokens(id)
  }

  async function claimAll(ids=[]){
    assert(ids.length,'requires auction ids')
    return contract.batchClaimTokens(ids)
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
    claimAndDonate,
    claimAll,
    tickAuction,
    getAuction,
  }

}


