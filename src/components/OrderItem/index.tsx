import { View } from '@tarojs/components';
import './index.scss'
import Card from '../Card';
import { AtTag, AtDivider } from 'taro-ui';
import Taro from '@tarojs/taro';
import { text } from 'stream/consumers';


function OrderItem({ data, className = '' }) {

    function orderStatus(value) {
        switch (value) {
            case 0:
                return {
                    className: 'yjs',
                    text: '已结束'
                }
            case 1:
                return {
                    className: 'yks',
                    text: '已开始'
                }
            case 2:
                if (data.endTime < new Date()) {
                    return {
                        className: 'yjs',
                        text: '已过期'
                    }
                }
                return {
                    className: 'wks',
                    text: '未开始'
                }
            case 3:
                return {
                    className: 'yjs',
                    text: '已取消'
                }
        }
    }

    function toRoom() {
        if (data.orderStatus == 1 || (data.orderStatus == 2 && data.endTime > new Date())) {
            Taro.redirectTo({
                url: '../../pagesA/index/roomControl/index?orderId='+data.orderId,
            })
        }
    }

    return (
        <View onClick={() => toRoom()}>
            <Card className={'orderItem ' + className}>
                <View className='at-row'>
                    <View className='at-col at-col-9'>
                        <View className='roomName'>{data.room.name}</View>
                    </View>
                    <View className='at-col at-col-3 tag'>
                        <AtTag className={orderStatus(data.orderStatus)?.className} >{orderStatus(data.orderStatus)?.text}</AtTag>
                    </View>
                </View>
                <View className={'at-row time ' + orderStatus(data.orderStatus)?.className}>
                    <View className='at-col'>
                        <View>{data?.startingTime.toLocaleDateString()}</View>
                        <View>{data?.startingTime.toLocaleTimeString()}</View>
                    </View>
                    <View className='at-col'>
                        <View>共{data.duration / 60}小时</View>
                        <View className='divider'></View>
                    </View>
                    <View className='at-col'>
                        <View>{data?.endTime.toLocaleDateString()}</View>
                        <View>{data?.endTime.toLocaleTimeString()}</View>
                    </View>
                </View>
            </Card>
        </View>

    )
}

export default OrderItem