import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtButton } from 'taro-ui';
import roomImage from '../../../icon/room.jpg';
import './index.scss'
import { useAppDispatch } from '../../../store';
import { changer_room } from '../../../features/room/room';

function RoomListCom({ className = '', data }) {
    const dispatchRedux = useAppDispatch();
    function openPlace() {
        dispatchRedux(changer_room({
            clientId: data.clientId,
            id: data.id,
            money: data.money,
            name: data.name,
            personnelSituation: data.personnelSituation,
            powerSupply: data.powerSupply,
            state: data.state,
        }))
        Taro.navigateTo({
            url: '../placeAnOrder/index',
        })
    }
    return (
        <View className={'my_roomCom ' + className}>
            <View className='at-row'>
                <View className='at-col at-col-3'>
                    <Image className='img' src={roomImage} />
                </View>
                <View className='at-col at-col-6'>
                    <View className='roomName'><Text>{data.name}</Text></View>
                    <View className='roomMoney'><Text className='roomMoney_f'>￥</Text><Text className='roomMoney_m'>{data.money}</Text><Text className='roomMoney_h'>/小时</Text></View>
                </View>
                <View className='at-col at-col-3'>
                    <AtButton type='primary' className='room_ydbtn' onClick={() => openPlace()}>预约</AtButton>
                </View>
            </View>
        </View>
    )
}

export default RoomListCom