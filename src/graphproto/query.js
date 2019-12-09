
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
        startPrice
        endPrice
        totalPriceChange
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
        isStopReached,
        startTime,
        endTime,
        secondsPassed,
        secondsRemaining,
        currentPrice,
        finalPrice,
        deposits,
        auctionId,
      }
    }`,'auction')
  }

  function getAuction(name,id){
    return getAuctionById(`${name}!${id}`)
  }

  function getAuctionBalanceById(id){
    return query(`{
      auctionBalance(id:"${id}"){
        id address auctionId auctionName bids
      }
    }`,'auctionBalance')
  }

  function getAuctionBalance(address,name,id){
      return getAuctionBalanceById(`${address}!${name}!${id}`)
  }

  function getTokenBalanceById(id){
    assert(id,'requires id')
    return query(`{
      tokenBalance(id:"${id}"){
        id address tokenAddress tokenName balance
      }
    }`,'tokenBalance')
  }

  function getTokenBalance(address,name){
    return getTokenBalanceById(`${address}!${name}`)
  }

  function getTokenBalances(address,names=[]){
    return Promise.all(names.map(name=>getTokenBalance(address,name)))
  }

  function getTokenBalancesByAddress(address){
    assert(address,'requires address')
    return query(`{
      tokenBalances(where:{balance_gt:0 address:"${address}"}){
        id address tokenAddress tokenName balance
      }
    }`,'tokenBalances')
  }

  function getAuctionBalances(address,name,ids=[]){
    return Promise.all(ids.map(id=>getAuctionBalance(address,name,id)))
  }

  function getAuctions(name,ids=[]){
    return Promise.all(ids.map(id=>getAuction(name,id)))
  }

  function getDoneAuctions(now){
    now = parseInt((now || Date.now())/1000)

    return query(`{
      auctions(where:{endTime_lte:${now}  deposits_gt:0}){
        id,
        address,
        name,
        isActive,
        isStopReached,
        startTime,
        endTime,
        secondsPassed,
        secondsRemaining,
        currentPrice,
        finalPrice,
        deposits,
        auctionId,
      }
    }`,'auctions')
  }

  function getAuctionBidsByAddress(address){
    assert(address,'requires address')
    return query(`{
      auctionBalances(where:{bids_gte:0 address:"${address}"}){
        id bids auctionName address auctionId
      }
    }`,'auctionBalances')
  }

  return {
    getRegistry,
    getAuctionManager,
    getAuctionById,
    getAuction,
    getAuctions,
    getAuctionBalanceById,
    getAuctionBalance,
    getAuctionBalances,
    getDoneAuctions,
    getTokenBalanceById,
    getTokenBalance,
    getTokenBalances,
    getAuctionBidsByAddress,
    getTokenBalancesByAddress,
    query,
  }
}
