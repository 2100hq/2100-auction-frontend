import assert from 'assert'

export default (config, {table}, emit=x=>x)=>{

  function makeId(props){
    assert(props.address,'requires address')
    assert(props.name,'requires name')
    return [props.address,props.name].join('!')
  }

  function set(props){
    assert(props.id,'requires balances id')
    table.set(props.id,parse(props))
    emit(props.id,props)
    return props
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
      id:props.id.toString(),
      address:props.address.toString(),
      name:props.name.toString(),
      tokenAddress:props.tokenAddress.toString(),
      balance:props.balance.toString(),
    }
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
    makeId,
  }

}



