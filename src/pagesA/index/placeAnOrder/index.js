import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'
import { useReducer, useEffect, useState } from "react";
import { changer_user } from '../../../features/user/user';
import { useAppSelector, useAppDispatch } from '../../../store';
import { DateDay, Card } from '../../../components';
import { AtButton } from 'taro-ui';
import { Room, Users, OrderGoodsClient } from '../../../../web-api-client';

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

var ws = "ws://101.33.233.99:4880";
var opts = { username: "admin", password: "mhh1112", port: 8083 }


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
  const [scoket, setScoket] = useState(null)
  const roomInfo = useAppSelector((state) => state.room.roomInfo);
  const userInfo = useAppSelector((state) => state.user.userInfo);

  const [state, dispatch] = useReducer(reducer, initialState)
  const dispatchRedux = useAppDispatch();
  const { duration, onDate, timeList, startingHours } = state

  //返回到店日期和时长
  function setStartingTime(newduration, onDate) {
    dispatch({ type: 'changed_duration', data: newduration })
    dispatch({ type: 'changed_onDate', data: onDate })
  }

  function changedButton(value) {
    var newDur = duration / 60 < 1 ? 1 : duration / 60
    var disSta = true
    for (let i = 0; i < newDur; i++) {
      for (let ii = 0; ii < timeList.length; ii++) {
        if (timeList[ii].time == value + i) {
          if (timeList[ii].disabled) disSta = false
        }
      }
    }
    if (disSta) { 
      dispatch({ type: 'changed_startingHours', data: value }) 
    } else { 
      Taro.showToast({
        title: '当前时间不可选',
        icon: 'none',
        duration: 3000
      })
    }
  }

  function setTime(res) {
    var date = new Date()
    var newTimeList = []
    if (onDate.getDate() == date.getDate()) {
      for (let i = 0; i < 23 - date.getHours(); i++) {
        newTimeList.push({
          text: ('0' + (date.getHours() + 1 + i)).slice(-2) + ':00',
          time: date.getHours() + 1 + i,
          key: date.toLocaleDateString() + ('0' + (date.getHours() + 1 + i)).slice(-2) + ':00'
        })
      }
    }
    else {
      for (let i = 0; i < 24; i++) {
        newTimeList.push({
          text: ('0' + i).slice(-2) + ':00',
          time: i,
          key: onDate.toLocaleDateString() + ('0' + i).slice(-2) + ':00'
        })
      }
    }
    for (let i = 0; i < res.length; i++) {
      var h = res[i].duration / 60
      var startime = res[i].startingTime
      for (let ii = 0; ii < h; ii++) {
        var a = new Date(startime.setHours(startime.getHours() + (ii==0?0:1)))
        for (let iii = 0; iii < newTimeList.length; iii++) {
          if (newTimeList[iii]['key'] == a.toLocaleDateString() + ('0' + a.getHours()).slice(-2) + ':00') {
            newTimeList[iii]['disabled'] = true
            newTimeList[iii]['text'] = '已售'
          }
        }
      }
    }
    //console.log(newTimeList)
    dispatch({ type: 'changed_timeList', data: newTimeList })
  }


  async function postOrderClient(value) {
    var client = new OrderGoodsClient()
    await client.createOrderGoods(value)
      .then(res => {
        Taro.redirectTo({
          url:'../roomControl/index?orderId='+res.state
        })
        console.log(roomInfo)
        var data = {
          type: 'LED',
          topic: roomInfo.clientId,
          data: 'YYDD'
        }
        console.log(scoket)
        scoket?.send({ data: JSON.stringify(data) })
        // dispatchRedux(changer_user({
        //   phoneNumber: userInfo.phoneNumber,
        //   nickName: userInfo.nickName,
        //   avatarUrl: userInfo.avatarUrl,
        //   money: userInfo.money - ((duration / 60) * roomInfo.money)
        // }))
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
    newEndTime.setHours(startingHours + 8 + (duration / 60 < 1 ? 0 : (duration / 60) - 1))
    newEndTime.setMinutes(59)
    newEndTime.setSeconds(59)
    var createTime = new Date()
    var newOrder = {
      room: roomInfo,
      user: new Users({
        phoneNumber: Number(userInfo.phoneNumber)
      }),
      startingTime: newstartingTime,//开始时间
      endTime: newEndTime,//结束时间
      createdDate: new Date(createTime.setHours(createTime.getHours() + 8)),//创建时间
      duration: duration
    }
    postOrderClient(newOrder)
  }

  async function getOrderList() {
    var newdate = new Date()
    newdate.setFullYear(onDate.getFullYear())
    newdate.setMonth(onDate.getMonth())
    newdate.setDate(onDate.getDate())
    newdate.setHours(8)
    newdate.setMinutes(0)
    newdate.setSeconds(0)
    var orderListClient = new OrderGoodsClient()
    await orderListClient.getOrderGoodsQuery(roomInfo.id, null, 2, newdate).then(res => {
      console.log(roomInfo.id,  newdate)
      setTime(res)
    })
  }


  useLoad(() => {
    getOrderList()
  })

  useEffect(() => {
    getOrderList()
  }, [onDate])
  useEffect(() => {
    var closeTask
    Taro.connectSocket({
      url: ws,
      success: function (e) {
        console.log('connect success')
      }
    }).then((task) => {
      setScoket(task)
      closeTask = task
      task.onOpen(function () {
        console.log('onOpen')
      })
      task?.onMessage(function (msg) {
        
      })
      task?.onError(function () {
        console.log('onError')
      })
      task.onClose(function (e) {
        console.log('onClose: ', e)
      })
    })


    return () => {
      // 组件卸载时断开连接
      //client.end();
      // newTask.onClose(function (e) {
      //   console.log('onClose: ', e)
      // })
      Taro.closeSocket()
    };
  }, []);


  return (
    <View>
      <DateDay onDate={onDate} duration={duration} changedDuration={(newduration, onDate) => setStartingTime(newduration, onDate)}></DateDay>
      <ScrollView scrollY className='timeView'>
        <View className='at-row  at-row--wrap time_row'>
          {timeList.map((value, e) =>
            <View className='at-col at-col-4 time_col'>
              <AtButton disabled={value.disabled} type={startingHours == value.time ? 'primary' : undefined} className='time_btn' onClick={() => changedButton(value.time)}>{value.text}</AtButton>
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
