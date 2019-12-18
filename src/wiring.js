import React from 'react';
import lodash from 'lodash'
import Wiring from 'react-wiring'
import {set,unset} from '@daywiss/utils/set'

const defaultState = {}

const reducers = {
  //shallow set, top level props only
  set(state,path,data){
    //unset with undefined data
    return {
      ...state,
      [path]:data
    }
  },
  setDonate(state,donate){
    console.log('wiring',{donate})
    if(donate){
      localStorage.setItem('donate','1')
    }else{
      localStorage.removeItem('donate')
    }
    return {
      ...state,
      donate
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

export const [useWiring,store] =  Wiring(React,reducers,defaultState)

