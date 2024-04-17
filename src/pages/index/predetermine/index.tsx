import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'
import { RoomClient } from "../../../../web-api-client";
import { useReducer } from "react";
import { useAppSelector, useAppDispatch } from '../../../store';
import { RoomListCom, Card } from '../../../components';
import { AtPagination } from 'taro-ui';

const initialState = {
  roomList: [],
  pages: {
    pageNumber: 1,//当前页
    totalCount: 0,//总数据个数
    totalPages: 1,//总页数
    pageSize: 6//页面个数
  },
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_roomList':
      return {
        ...state,
        roomList: action.data.items
      };
    case 'changed_pages':
      return {
        ...state,
        pages: {
          pageNumber: action.data.pageNumber,//当前页
          totalCount: action.data.totalCount,//总数据个数
          totalPages: action.data.totalPages,//总页数
          pageSize: state.pages.pageSize//页面个数
        }
      }
  }
}




export default function Index() {
  const userInfo = useAppSelector((state) => state.user.userInfo);

  const [state, dispatch] = useReducer(reducer, initialState)
  const { roomList, pages } = state

  function getRoomList(pageNumber) {
    var client = new RoomClient()
    client.getRoomWithPagination(undefined, pageNumber, pages.pageSize).then(res => {
      dispatch({ type: 'changed_roomList', data: res })
      dispatch({ type: 'changed_pages', data: res })
    })
  }

  function onPageChange(e) {
    getRoomList(e.current)
  }
  useLoad(() => {
    getRoomList(pages.pageNumber)
  })

  return (
    <View className='index_predetermine'>
      <View className='roomList'>
        <RoomListCom data={roomList}></RoomListCom>
      </View>
      <View className='pageInation'>
        <Card className='pageInation_card'>
          <AtPagination
            icon
            total={pages.totalCount}
            pageSize={pages.pageSize}
            current={pages.pageNumber}
            onPageChange={onPageChange}
          ></AtPagination>
        </Card>
      </View>
    </View>
  )
}
