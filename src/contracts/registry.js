//want to break out watching of contract from
//react components so we can manage the timers
//easier. this should basically just emit
//the current state of the contract 
export default async (config={},libs) => {
  let {address,abi} = config
  abi = JSON.parse(abi || '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"string"}],"name":"stringToAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"stringsLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"addressToString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"strings","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_string","type":"string"}],"name":"destroyString","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_string","type":"string"}],"name":"create","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_string","type":"string"},{"indexed":false,"name":"_address","type":"address"},{"indexed":false,"name":"creator","type":"address"}],"name":"Create","type":"event"}]')

  //we could choose another library, but subspace 
  //has some built in timers and streams
  const {subspace} = libs
  const contract = await subspace.contract({address,abi})

  async function getAuction(index=0){
    const name = await contract.methods.strings(index).call()
    return {
      name,
      address:await contract.methods.stringToAddress(name).call()
    }
  }

  async function getAllAuctions(existing=[],end){
    if(end == null) return existing
    if(existing.length == end) return existing
    const result = await getAuction(existing.length)
    existing.push(result)
    return getAllAuctions(existing,end)
  }

  async function getState(state={}){
    const length = await contract.methods.stringsLength().call()
    return {
      name: state.name || await contract.methods.name().call(),
      length,
      auctions: await getAllAuctions(state.auctions,length)
    }
  }

  function create(name,from){
    return contract.methods.create(name).send({from,gasLimit:'6721975'})
  }

  return {
    getState,
    getAllAuctions,
    getAuction,
    contract,
    create,
  }

}
