
import assert from 'assert'

export default async (config,{apollo,gql}) => {

  function Query(apollo,gql){
    return (query,key) => {
      return apollo.query({
        query:gql`${query}`,
        fetchPolicy:'no-cache'
      }).then(result=>{
        if(key) return result.data[key]
        return result.data
      })
    }
  }

  const query = Query(apollo,gql)


  function getRegistry(id='0'){
    assert(id,'requires id')
   return query(`
      {
        registry(id:"${id}"){
          id address length strings name
        }
      }
    `,'registry')           
  }

  function getAuctionManager(name){
    return query(`{
      auctionManager(id:"${name}"){
        name 
        id 
        currentAuctionId 
        address
        maximumSupply
        amount
        duration
      }
    }`,'auctionManager')
  }

  function getAuctionById(id){
    assert(id,'requires id')
    return query(`{
      auction(id:"${id}"){
        address,
        name,
        isActive,
        startTime,
        endTime,
        secondsPassed,
        secondsRemaining,
        deposits,
        auctionId,
      }
    }`,'auction')
  }

  function getAuction(name,id){
    return getAuctionById(`${name}!${id}`)
  }

  function getBidById(id){
    return query(`{
      bid(id:"${id}"){
        id address auctionId name amount
      }
    }`,'bid')
  }

  function getBid(address,name,id){
      return getBidById(`${address}!${name}!${id}`)
  }

  function getBalanceById(id){
    assert(id,'requires id')
    return query(`{
      balance(id:"${id}"){
        id address tokenAddress name balance
      }
    }`,'balance')
  }

  function getBalance(address,name){
    return getBalanceById(`${address}!${name}`)
  }

  function getBalances(address,names=[]){
    return Promise.all(names.map(name=>getBalance(address,name)))
  }

  function getBalancesByAddress(address){
    assert(address,'requires address')
    return query(`{
      balances(where:{balance_gt:0 address:"${address}"}){
        id address tokenAddress name balance
      }
    }`,'balances')
  }

  function getBids(address,name,ids=[]){
    return Promise.all(ids.map(id=>getBid(address,name,id)))
  }

  function getAuctions(name,ids=[]){
    return Promise.all(ids.map(id=>getAuction(name,id)))
  }

  function getDoneAuctionsByName(name,now){
    now = parseInt((now || Date.now())/1000)
    return query(`{
      auctions(where:{endTime_lte:${now} name:"${name}" deposits_gt:0}){
        id,
        address,
        name,
        isActive,
        startTime,
        endTime,
        secondsPassed,
        secondsRemaining,
        deposits,
        auctionId,
      }
    }`,'auctions')
  }

  function getDoneAuctions(now){
    now = parseInt((now || Date.now())/1000)

    return query(`{
      auctions(where:{endTime_lte:${now}  deposits_gt:0}){
        id,
        address,
        name,
        isActive,
        startTime,
        endTime,
        secondsPassed,
        secondsRemaining,
        deposits,
        auctionId,
      }
    }`,'auctions')
  }

  function getBidsByAddress(address){
    assert(address,'requires address')
    return query(`{
      bids(where:{amount_gte:0 address:"${address}"}){
        id amount name address auctionId
      }
    }`,'bids')
  }

  return {
    getRegistry,
    getAuctionManager,
    getAuctionById,
    getAuction,
    getAuctions,
    getDoneAuctions,
    getDoneAuctionsByName,
    getBidById,
    getBid,
    getBids,
    getBidsByAddress,
    getBalanceById,
    getBalance,
    getBalances,
    getBalancesByAddress,
    query,
  }
}
