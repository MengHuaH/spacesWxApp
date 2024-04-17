import { View, Text } from '@tarojs/components'
import { AtButton, AtIcon } from 'taro-ui';
import Taro from '@tarojs/taro';
import { Card, makePhone } from '../../components';

import './index.scss'


export default function Index() {
  return (
    <View className='index'>
      <Card className='yd'>
        <View>
          <View className='yd_col'><Text style={{ fontSize: '24px', fontWeight: 'bolder' }}>自助预定</Text></View>
          <View className='yd_col yd_btn_view'>
            <AtButton type='primary' className='yd_btn' onClick={() => { Taro.navigateTo({ url: './predetermine/index' }) }}>预定</AtButton>
          </View>
          <View>
            <AtButton type='primary' className='yd_btn_phone' onClick={makePhone}><AtIcon value='phone'></AtIcon></AtButton>
          </View>
        </View>
      </Card>
      <Card type='title' title='体验步骤'>
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
      <Card type='title' title='特别提示'>
        <View className='at-article__p'>
          <Text>[智能控制]对所有规则拥有最终解释权，如不遵守场馆规则影响到他人，我们有权停止您的体验。</Text>
        </View>
      </Card>
    </View>
  )
}
