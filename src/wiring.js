import React from 'react';
import lodash from 'lodash'
import Wiring from 'react-wiring'

const defaultState = {}

const reducers = {
  set(state,path,data){
    // console.log('set',path,data)
    if(data){
      lodash.setWith(state,path,data,Object)
    }else{
      lodash.unset(state,path)
    }
    // console.log('state',{...state})
    return {
      ...state
    }
  },
  success(state,success){
    return {
      ...state,
      success
    }
  },
  setError(state,error){
    // console.log('error',error)
    return {
      ...state,
      error,
    }
  }
}

export default Wiring(React,defaultState,reducers)

