import {get,set,unset} from '../utils'

export default (state)=>{
  return {
    get(...args){
      return get(state,...args)
    },
    set(...args){
      return set(state,...args)
    },
    unset(...args){
      return unset(state,...args)
    }
  }
}
