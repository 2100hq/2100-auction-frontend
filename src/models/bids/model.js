import assert from 'assert'

export default (config, {table}, emit=x=>x)=>{

  function parse(props){
    return {
      ...props,
      id:props.id.toString(),
      address:props.address.toString(),
      auctionId:props.auctionId.toString(),
      auctionName:props.auctionName.toString(),
      bids:props.bids.toString(),
    }
  }

  function makeId(props){
    assert(props.address,'requires address')
    assert(props.auctionName,'requires auctionName')
    assert(props.auctionId,'requires auctionId')
    return [props.address,props.auctionName,props.auctionId].join('!')
  }

  function set(props){
    assert(props.id,'requires bid id')
    table.set(props.id,parse(props))
    emit(props.id,props)
    return props
  }

  function get(id){
    assert(id,'requires id to get')
    const result = table.get(id)
    assert(result,'no such bid by id: ' + id)
    return result
  }

  function del(props){
    assert(props.id,'requires bid id')
    table.delete(props.id)
    emit(props.id)
    return props
  }

  function has(id){
    return table.has(id)
  }

  function update(id,props={}){
    const data = get(id)
    return set({...data,...props})
  }

  function create(props){
    const id = makeId(props)
    assert(!has(id),'Bid already exists')
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
    makeId,
  }

}




