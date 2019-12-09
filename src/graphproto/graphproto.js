import Query from './query'
import Connect    from './connect'
import Subscribe  from './subscribe'
import {loop}     from '../utils'

export default async (config,libs,emit=x=>x) => {

  const connect = await Connect(config,libs)
  const query = await Query(config,connect)
  const subscribe = await Subscribe(config,{query,loop},emit)

  return {
    ...connect,
    query,
    subscribe,
  }

}
