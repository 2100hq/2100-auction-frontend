import assert from 'assert'

export default (config, {table,BigNumber}, emit=x=>x)=>{

  function makeId(props){
    assert(props.name,'requires auction name')
    return props.name
  }

  function set(auction){
    assert(auction.id,'requires auction id')
    auction = parse(auction)
    table.set(auction.id,auction)
    emit(auction.id,auction)
    return auction
  }

  function get(id){
    assert(id,'requires id to get')
    const result = table.get(id)
    assert(result,'no such auction by id: ' + id)
    return result
  }

  function del(auction){
    assert(auction.id,'requires auction id')
    table.delete(auction.id)
    emit(auction.id)
    return auction
  }

  function has(id){
    return table.has(id)
  }

  function parse(props){
    return {
      ...props,
      name:props.name.toString(),
      currentAuctionId:props.currentAuctionId.toString(),
      maximumSupply:props.maximumSupply.toString(),
      amount:props.amount.toString(),
      duration:props.duration.toString(),
      // startPrice:props.startPrice.toString(),
      // endPrice:props.endPrice.toString(),
      // totalPriceChange:props.totalPriceChange.toString(),
    }
  }

  function setCurrent(id,number){
    const data = get(id)

    return set({
      ...data,
      currentAuctionId:number,
    })

  }

  function create(props){
    return set({
      id:makeId(props),
      ...props
    })
  }

  return {
    ...table,
    create,
    set,
    get,
    del,
    has,
    setCurrent,
    makeId,
  }

}

