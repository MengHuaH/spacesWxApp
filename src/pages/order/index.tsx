import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'
import { UserClient } from "../../../web-api-client";
import { useReducer } from "react";
import { AtButton } from 'taro-ui';


import { decrement, increment } from '../../features/counter/counterSlice'
import { useSelector, useDispatch } from 'react-redux';

const initialState = {
  userListData: [],
  pages: {
    pageNumber: 1,
    totalCount: 0,
    totalPages: 1,
    pageSize: 5
  },
  count: 0
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_userListData':
      return {
        ...state,
        userListData: action.data.items
      };
    case 'changed_count':
      return {
        ...state,
        count: state.count + 1
      };
  }
}


export default function Index() {

  const counts = useSelector((state) => state.counter.value);
  const dispatchRedux = useDispatch();
  const [state, dispatch] = useReducer(reducer, initialState)
  const { userListData, count } = state
  async function getUserAxios() {
    var client = new UserClient()
    await client.getUserList(1, 10).then(res => {
      dispatch({ type: "changed_userListData", data: res })
      console.log(res.items)
    })
  }

  function counta() {
    dispatch({ type: "changed_count" })
    console.log(count)
  }

  useLoad(() => {
    //getUserAxios()
    console.log('Page loaded.')
  })


  return (
    <View className='index'>
      <Text>{counts}</Text>
      <AtButton type='primary' onClick={() => counta()}>+</AtButton >
    </View>
  )
}
