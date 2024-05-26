import { View } from '@tarojs/components'
import { Card, makePhone } from '../../../components';

import './index.scss'
import { AtButton, AtIcon } from 'taro-ui'

export default function Index() {

  return (
    <View>
      <Card>
        <View className='at-article__h3 text_h'>如何体验？</View>
        <View className='at-article__p'>
          1、线上预约付费成功
        </View>
        <View className='at-article__p'>
          2、到达门店后，点击开门
        </View>
        <View className='at-article__p'>
          3、开始订单
        </View>
        <View className='at-article__p'>
          4、订单开始电源自动开启
        </View>
      </Card>
      <View className='phone_btn'>
        <Card>
          <AtButton type='primary' onClick={makePhone}><AtIcon value='phone' size='18' color='#fff'></AtIcon> 联系客服</AtButton>
        </Card>
      </View>
    </View>

  )
}
