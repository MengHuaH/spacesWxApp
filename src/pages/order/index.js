import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'
import { AtButton } from 'taro-ui';
import { useEffect, useState } from 'react';

var reconnectNum = 0;//重连次数
// var ws = "ws://localhost:4880";
var ws = "ws://101.33.233.99:4880";
var opts = { username: "admin", password: "mhh1112", port: 8083 }

export default function Index() {

  const [message, setMessage] = useState('');
  const [scoket, setScoket] = useState(null)
  
  function connectMqtt(a) {
    //client?.publish('esp32/test', "1", { qos: 0 }, () => {//消息发布
    //   console.log("音频消息发布")
    // });
    var data = {
      type: 'LED',
      topic: a == 1 ? 'esp32/test' : 'esp32/test2',
      data:'M_on'
    }
    scoket?.send({ data:  JSON.stringify(data)})
  }


  function counta() {
  }


  useLoad(() => {
    //getUserAxios()
    
    console.log('Page loaded.')
  })

  useEffect(() => {
    Taro.connectSocket({
      url: ws,
      success: function (e) {
        console.log('connect success')
      }
    }).then(task => {
      setScoket(task)
      task?.onMessage(function (msg) {
        console.log('onMessage: ', msg)
      })
      task?.onError(function () {
        console.log('onError')
      })
    })
    
    // client.on('connect', () => {
    //   console.log('Connected to MQTT broker');
    //   client.subscribe('esp32/test'); // 替换为你的主题
    // });
 
    // client.on('message', (topic, message) => {
    //   // 收到消息后更新组件状态
    //   setMessage(message.toString());
    //   console.log(message.toString())
    // });
 
    return () => {
      // 组件卸载时断开连接
      //client.end();
      scoket.onClose(function (e) {
        console.log('onClose: ', e)
      })
    };
  }, []);


  return (
    <View className='index'>
      <Text>{message}</Text>
      <AtButton type='primary' onClick={() => connectMqtt(1)}>1号灯</AtButton >
      <AtButton type='primary' onClick={() => connectMqtt(2)}>2号灯</AtButton >
    </View>
  )
}
