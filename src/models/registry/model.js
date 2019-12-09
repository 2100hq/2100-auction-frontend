import assert from 'assert'

export default (config, {table}, emit=x=>x)=>{

  function makeId(props){
    assert(props.id,'requires registryid')
    return props.id
  }

  function set(auction){
    assert(auction.id,'requires auction id')
    table.set(auction.id,parse(auction))
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
      id:props.id.toString(),
      name:props.name.toString(),
      address:props.address.toString(),
      length:props.length.toString(),
      strings:props.strings,
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


