import { View, Text } from '@tarojs/components'
import { AtButton, AtSwitch } from 'taro-ui';
import Taro, { useLoad, getCurrentInstance } from '@tarojs/taro';
import { useReducer, useEffect, useState } from "react";
import './index.scss'
import { OrderGoods, OrderGoodsClient, Room, RoomClient } from 'web-api-client';
import { Card } from '../../../components';

const initialState = {
  room: Room,
  order: OrderGoods,
  time: {
    startingTime: '',
    endTime: ''
  },
  isDOpen: false,
}

//mqtt
var ws = "ws://101.33.233.99:4880";
var opts = { username: "admin", password: "mhh1112", port: 8083 }

function reducer(state, action) {
  switch (action.type) {
    case 'changed_order':
      return {
        ...state,
        order: action.data
      };
    case 'changed_room':
      return {
        ...state,
        room: action.data
      };
    case 'changed_time':
      return {
        ...state,
        time: action.data
      };
    case 'changed_isDOpen':
      return {
        ...state,
        isDOpen: action.data == null ? !state.isDOpen : action.data
      };
  }
}



const Index = () => {
  const [scoket, setScoket] = useState(null)
  const [state, dispatch] = useReducer(reducer, initialState)
  const { room, order, time, isDOpen } = state
  var $instance = getCurrentInstance()

  async function getOrder(value) {
    var client = new OrderGoodsClient()
    client.getOrderGoodsQuery(null, value, null, null).then(res => {
      dispatch({ type: 'changed_order', data: res[0] })
      dispatch({ type: 'changed_room', data: res[0].room })
      var star = res[0].startingTime?.toLocaleString()
      var end = res[0].endTime?.toLocaleString()
      dispatch({
        type: 'changed_time', data: {
          startingTime: star,
          endTime: end
        }
      })
    })
  }


  function onMState() {
    console.log(room.clientId)
    var data = {
      type: 'LED',
      topic: room.clientId,
      data: 'M_on'
    }
    scoket?.send({ data: JSON.stringify(data) })
    // dispatch({ type: 'changed_isMOpen', data: true })
    // setTimeout(() => {
    //   dispatch({ type: 'changed_isMOpen', data: false })
    // }, 10000);
  }

  async function onDState() {
    var dState
    var newRoom = room

    if (newRoom.powerSupply == 0) {
      dState = "D_on"
      newRoom.powerSupply = 1
    } else {
      dState = "D_off"
      newRoom.powerSupply = 0
    }
    var roomClient = new RoomClient()
    await roomClient.updateRoom(newRoom).catch(error => { console.log(error) })
    // props.getRoomList({ pageNumber: 1, pageSize: 100 })
    var data = {
      type: 'LED',
      topic: room.clientId,
      data: dState
    }
    scoket?.send({ data: JSON.stringify(data) })
    dispatch({ type: 'changed_isDOpen' })
    // dispatch({ type: 'changed_isDOpen', data: true })
    // setTimeout(() => {
    //   dispatch({ type: 'changed_isDOpen', data: false })
    // }, 2000);
  }

  async function toTheStore(){
    // if(order.startingTime > new Date()){
    //   Taro.showToast({
    //     title: '未到预约时间',
    //     icon: 'none',
    //     duration: 3000
    //   })
    //   return
    // }
    var newRoom = room
    var roomClient = new RoomClient()
    newRoom.state = 2
    newRoom.powerSupply = 1
    await roomClient.updateRoom(newRoom)
    var orderClient = new OrderGoodsClient()
    await orderClient.updateOrder({ orderId: order.orderId, state: 1})
    getOrder($instance.router.params.orderId)
    var data = {
      type: 'LED',
      topic: room.clientId,
      data: JSON.stringify({
        type: "ddopen",
        time: order.duration
      })
    }
    scoket?.send({ data: JSON.stringify(data) })
    // onDState()//开灯
    // onMState()//开门
  }

  useLoad((e) => {
    getOrder(e?.orderId)
  })

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
        //console.log('onMessage: ', msg.data)
        if (msg.data == 'D_on' || msg.data == "D_off") {
          getOrder($instance.router.params.orderId)
        }
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
      <View className='roomName'>{room?.name}</View>
      <View>开始时间：{time?.startingTime}</View>
      <View>结束时间：{time?.endTime}</View>
      <View>共{order.duration / 60}小时</View>
      {
        order.orderStatus != 2 ? <Card type='title' title='控制'>
        <View className='at-row'>
          <View className='at-col at-col-4'><Text>房门</Text></View>
          <View className='at-col at-col-8'>
            <AtButton type='primary' size='small' onClick={() => onMState()}>打开</AtButton>
          </View>
        </View>
        <View className='at-row'>
          <View className='at-col at-col-4 col_left'><Text>电源</Text></View>
          <View className='at-col at-col-8' >
            <AtSwitch checked={room.powerSupply != 0} onChange={() => onDState()} key={room.powerSupply} />
          </View>
        </View>
      </Card> :
      <Card>
        <AtButton type='primary' onClick={() => toTheStore()}>确认到店</AtButton>
      </Card>
      }
      
    </View>
  )
}
export default Index
