//want to break out watching of contract from
//react components so we can manage the timers
//easier. this should basically just emit
//the current state of the contract 
import assert from 'assert'
export default (config={},libs) => {
  let {address,abi} = config

  const {provider,ethers,BigNumber} = libs
  assert(BigNumber,'requires bignumber')

  const contract = new ethers.Contract(address,abi,provider)

  function create(name){
    assert(name,'requires auction name')
    return contract.createToken(name)//,{gasLimit:'0x' + new BigNumber('6721975').toString(16)})
  }
  function claimTokens(addresses,auctionids){
    return contract.claimTokens(addresses,auctionids,{
      gasLimit: 1750000
    })
  }
  function destroyString(name){
    assert(name,'requires auction name')
    return contract.destroyString(name)
  }
  function stringToAddress(name){
    assert(name,'requires auction name')
    return contract.stringToAddress(name)
  }

  return {
    create,
    destroyString,
    claimTokens,
    stringToAddress,
  }

}

