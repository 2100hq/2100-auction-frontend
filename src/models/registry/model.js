import assert from 'assert'

export default (config, {table}, emit=x=>x)=>{


  function defaults(props={}){
    return {
      strings:[],
      ...props,
    }
  }

  function makeId(props){
    assert(props.id,'requires registryid')
    return props.id
  }

  function set(props){
    assert(props.id,'requires registry id')
    props = defaults(parse(props))
    table.set(props.id,props)
    emit(props.id,props)
    return props
  }

  function get(id){
    assert(id,'requires id to get')
    const result = table.get(id)
    assert(result,'no such registry by id: ' + id)
    return result
  }

  function del(props){
    assert(props.id,'requires registry id')
    table.delete(props.id)
    emit(props.id)
    return props
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


