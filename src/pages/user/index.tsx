import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { UserClient } from "../../../web-api-client";
import { useReducer } from "react";
import { AtCard, AtIcon, AtAvatar } from 'taro-ui';
import { Card } from '../../components/index';


import { changer_user } from '../../features/user/user';
import { useAppSelector, useAppDispatch } from '../../store';

import './index.scss'
import "../../../node_modules/taro-ui/dist/style/components/icon.scss"

const initialState = {
  userListData: [],
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
    case 'changed_userListData':
      return {
        ...state,
        userListData: action.data.items
      };
  }
}


export default function Index() {
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const dispatchRedux = useAppDispatch();
  const [state, dispatch] = useReducer(reducer, initialState)

  useLoad(() => {
    //getUserAxios()
    console.log('Page loaded.')
  })


  function login() {
    Taro.navigateTo({
      url: './login/index',
    })
  }

  function getmoney() {
    var client = new UserClient()
    client.getUser(Number(userInfo.phoneNumber)).then(res => {
      dispatchRedux(changer_user({
        phoneNumber: userInfo.phoneNumber,
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        money: res.money
      }))
    })
  }
 console.log(userInfo)
  return (
    <View className='user'>
      <Card>
        {userInfo.phoneNumber == '' ? (
          <View className='at-row' onClick={login}>
            <View className='at-col at-col-3'>
              <AtIcon value='user' size='60' color='#fff'></AtIcon>
            </View>
            <View className='at-col at-col-9 user_dl'>
              <Text style={{ fontSize: '20px' }}>请点击登录</Text>
            </View>
          </View>
        ) : (
          <View className='at-row'>
            <View className='at-col at-col-3'>
              <AtAvatar size='large' circle image={userInfo.avatarUrl}></AtAvatar>
            </View>
            <View className='at-col at-col-9 user_dl'>
              <Text style={{ fontSize: '20px' }}>{userInfo.nickName}</Text>
            </View>
          </View>
        )}
      </Card>
      <Card className='money'>
        <View className='at-row' onClick={getmoney}>
          <View className='at-col at-col-6 money_icon'>
            <View><AtIcon value='money' size='40' color='#f1f1f1'></AtIcon></View>
            <View><Text style={{ color:'#f1f1f1' }}>余额</Text></View>
          </View>
          <View className='at-col at-col-6 money_number'>
            <Text style={{ fontSize: '20px', color:'#f1f1f1' }}>{userInfo.money}</Text>
          </View>
        </View>
      </Card>
      <Card
        type='title'
        title='我的工具'
      >
        <View className='at-row tools'>
          <View className='at-col at-col-3' onClick={() => Taro.navigateTo({url: './commonProblem/index',})}>
            <View><AtIcon value='file-generic' size='30' color='#000'></AtIcon></View>
            <View><Text>常见问题</Text></View>
          </View>
        </View>
      </Card>
    </View>

  )
}
