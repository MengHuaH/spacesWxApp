import { View } from '@tarojs/components';
import RoomCom from './RoomCom';
import './index.scss'
function RoomListCom({className='', data}){
    const roomlist = data.map(res => {
        return <RoomCom data={res}></RoomCom>
    })

    return (
        <View className={'my_roomListCom ' + className}>
            {roomlist}
        </View>
    )
}

export default RoomListCom