import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad, useTabItemTap  } from '@tarojs/taro'
import './index.scss'
import { AtButton } from 'taro-ui';
import { useEffect, useReducer } from 'react';
import { OrderGoodsClient } from 'web-api-client';
import { useAppSelector } from '../../store';
import { OrderItem } from '../../components';


const initialState = {
  orderGoodsList: [],
  isModalOpen: false,
  pages: {
    pageNumber: 1,
    totalCount: 0,
    totalPages: 1,
    pageSize: 5
  },
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_orderGoodsList':
      return {
        ...state,
        orderGoodsList: action.data
      };
  }
}


export default function Index() {
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const [state, dispatch] = useReducer(reducer, initialState)
  const { orderGoodsList } = state

  async function getOrderList() {
    if(userInfo.phoneNumber == '')return
    console.log(userInfo)
    var client = new OrderGoodsClient()
    await client.getOrderGoodsWithPagination(null,userInfo.phoneNumber,1,10).then(res => {
      dispatch({ type: 'changed_orderGoodsList', data: res.items })
    }).catch(error => console.log(error))
  }


  useEffect(() => {
    getOrderList()
  },[])
  useTabItemTap((e) => {
    getOrderList()
  })


  return (
    <View className='tgyDetailPage'>
      <ScrollView
        className='container'
        scrollY
      >
        {
          orderGoodsList.map((value,e) => {
            return (<OrderItem data={value} ></OrderItem>)
          })
        }
      </ScrollView>
    </View>
  )
}

