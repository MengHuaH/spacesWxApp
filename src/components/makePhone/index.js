import Taro from '@tarojs/taro';

export default function makePhone(){
    Taro.makePhoneCall({
        phoneNumber: '15676211559'
      })
}