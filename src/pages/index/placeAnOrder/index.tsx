import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'
import { useReducer, useEffect } from "react";
import { useAppSelector } from '../../../store';
import { DateDay, Card } from '../../../components';
import { AtButton } from 'taro-ui';
import { Room, Users, OrderGoodsClient } from 'web-api-client';

const initialState = {
  order: {
    room: Room,
    user: Users,
    startingTime: "",//开始时间
    endTime: "",//结束时间
    createdDate: "",//创建时间
  },
  duration: 120,//时长（分钟）
  onDate: new Date(),
  timeList: [],
  startingHours: null,
}


function reducer(state, action) {
  switch (action.type) {
    case 'changed_order':
      return {
        ...state,
        order: action.data
      };
    case 'changed_duration':
      return {
        ...state,
        duration: action.data
      };
    case 'changed_onDate':
      return {
        ...state,
        onDate: action.data
      };
    case 'changed_timeList':
      return {
        ...state,
        timeList: action.data
      };
    case 'changed_startingHours':
      return {
        ...state,
        startingHours: action.data
      };
  }
}




export default function Index() {
  const roomInfo = useAppSelector((state) => state.room.roomInfo);
  const userInfo = useAppSelector((state) => state.user.userInfo);

  const [state, dispatch] = useReducer(reducer, initialState)
  const { duration, onDate, timeList, startingHours, order, toast } = state

  //返回到店日期和时长
  function setStartingTime(newduration, onDate) {
    dispatch({ type: 'changed_duration', data: newduration })
    dispatch({ type: 'changed_onDate', data: onDate })
  }

  function changedButton(value) {
    dispatch({ type: 'changed_startingHours', data: value })
  }

  function setTime() {
    var date = new Date()
    var newTimeList: Object[] = []
    if (onDate.getDate() == date.getDate()) {
      for (let i = 0; i < 23 - date.getHours(); i++) {
        newTimeList.push({
          text: ('0' + (date.getHours() + 1 + i)).slice(-2) + ':00',
          time: date.getHours() + 1 + i
        })
      }
    }
    else {
      for (let i = 0; i < 24; i++) {
        newTimeList.push({
          text: ('0' + i).slice(-2) + ':00',
          time: i
        })
      }
    }
    dispatch({ type: 'changed_timeList', data: newTimeList })
  }


  async function postOrderClient(value) {
    var client = new OrderGoodsClient()
    await client.createOrderGoods(value)
      .then(() => {
      })
      .catch(error => {
        Taro.showToast({
          title: '预约失败',
          icon: 'none',
          duration: 3000
        })
        console.log(error)
      })
  }

  function postOrder() {
    if (startingHours == null) {
      Taro.showToast({
        title: '请选择到店时间',
        icon: 'none',
        duration: 3000
      })
      return
    }
    if (userInfo.phoneNumber == '') {
      Taro.showToast({
        title: '请先登录账户',
        icon: 'none',
        duration: 3000
      })
      return
    }
    if (userInfo.money < (duration / 60) * roomInfo.money) {
      Taro.showToast({
        title: '用户余额不足',
        icon: 'none',
        duration: 3000
      })
      return
    }
    var newstartingTime = new Date()
    newstartingTime.setFullYear(onDate.getFullYear())
    newstartingTime.setMonth(onDate.getMonth())
    newstartingTime.setDate(onDate.getDate())
    newstartingTime.setHours(startingHours + 8)
    newstartingTime.setMinutes(0)
    newstartingTime.setSeconds(0)

    var newEndTime = new Date()
    newEndTime.setFullYear(onDate.getFullYear())
    newEndTime.setMonth(onDate.getMonth())
    newEndTime.setDate(onDate.getDate())
    newEndTime.setHours(startingHours + 8 + (duration / 60))
    newEndTime.setMinutes(0)
    newEndTime.setSeconds(0)
    var newOrder = {
      room: roomInfo,
      user: new Users({
        phoneNumber: Number(userInfo.phoneNumber)
      }),
      startingTime: newstartingTime,//开始时间
      endTime: newEndTime,//结束时间
      createdDate: new Date(),//创建时间
      duration: duration
    }
    postOrderClient(newOrder)
  }


  useLoad(() => {
    setTime()
  })

  useEffect(() => {
    setTime()
  }, [setStartingTime])

  return (
    <View>
      <DateDay onDate={onDate} duration={duration} changedDuration={(newduration, onDate) => setStartingTime(newduration, onDate)}></DateDay>
      <ScrollView scrollY className='timeView'>
        <View className='at-row  at-row--wrap time_row'>
          {timeList.map((value, e) =>
            <View className='at-col at-col-4 time_col'>
              <AtButton type={startingHours == value.time ? 'primary' : undefined} className='time_btn' onClick={() => changedButton(value.time)}>{value.text}</AtButton>
            </View>
          )}
        </View>
      </ScrollView>
      <View className='pageInation'>
        <Card className='pageInation_card' title=''>
          <View><Text>房间：{roomInfo.name}</Text></View>
          <View><Text>使用时间：共{duration / 60}小时</Text></View>
          <View className='at-row subOrder'>
            <View className='at-col at-col-8'>
              <Text>￥{startingHours == null ? '--' : (duration / 60) * roomInfo.money}</Text>
            </View>
            <View className='at-col at-col-4'>
              <AtButton type='primary' className='subOrder_btn' onClick={() => postOrder()}>预约</AtButton>
            </View>
          </View>
        </Card>
      </View>
    </View>
  )
}
