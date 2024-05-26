import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { CreateUserCommand, UserClient } from "../../../../web-api-client";
import { AtButton } from 'taro-ui';
import { Card } from '../../../components/index';

import { changer_user } from '../../../features/user/user';
import { useAppDispatch } from '../../../store';

import './index.scss'
import axios from 'taro-axios';

export default function Index() {
  const dispatchRedux = useAppDispatch();
  async function getUserAxios(phoneNumber, wxUserInfo) {
    var client = new UserClient()
    await client.getUser(Number(phoneNumber)).then(res => {
      var a = new CreateUserCommand({
        phoneNumber: Number(phoneNumber),
        userName: wxUserInfo.userInfo.nickName,
        money: 100,
      })
      if (res.id == 0) {
        client.createUser(a).then(createRes => {
          dispatchRedux(changer_user({
            phoneNumber: createRes,
            nickName: wxUserInfo.userInfo.nickName,
            avatarUrl: wxUserInfo.userInfo.avatarUrl,
            money: 100
          }))
        })
      } else {
        dispatchRedux(changer_user({
          phoneNumber: phoneNumber,
          nickName: wxUserInfo.userInfo.nickName,
          avatarUrl: wxUserInfo.userInfo.avatarUrl,
          money: res.money
        }))
      }
    }).catch(e => { console.log(e) })
  }

  async function getPhoneNumber(e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      var token = await axios('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx457e931dcbe4954d&secret=029998f69a02d62d76e5ce89064ea70e')//测试
      // var token = await axios('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxbe29291fa2d83fcb&secret=8a1c4121f4c78706e5c523326c588d8b')//正式
      var phone = await axios.post('https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=' + token.data.access_token, { "code": e.detail.code })
      var res = await Taro.getUserInfo()
      getUserAxios(phone.data.phone_info.phoneNumber, res)
      Taro.navigateBack()
    }
  }



  return (
    <View className='user_login'>
      <Card className='login_text'>
        <Text>24小时智能控制</Text>
      </Card>
      <Card>
        <Card>
          <AtButton type='primary' openType='getPhoneNumber' onGetPhoneNumber={getPhoneNumber}>一键登录/注册</AtButton>
        </Card>
      </Card>
    </View>

  )
}
