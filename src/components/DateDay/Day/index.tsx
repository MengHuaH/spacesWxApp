import { View, Text } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import './index.scss'
function Day({ date, onDateChange, onDate }) {

    function setWeek() {
        var week = date.getDay()
        switch (week) {
            case new Date().getDay():
                return '今天'
            case 1:
                return '周一'
            case 2:
                return '周二'
            case 3:
                return '周三'
            case 4:
                return '周四'
            case 5:
                return '周五'
            case 6:
                return '周六'
            case 0:
                return '周日'
            default:
                break;
        }
    }
    return (
        <AtButton type={date.getDate() == onDate.getDate() ? 'primary' : undefined} onClick={() => onDateChange(date)} className='atbutton' >
            <View>{('0' + (date.getMonth() + 1)).slice(-2)}.{('0' + date.getDate()).slice(-2)}</View>
            <View>{setWeek()}</View>
        </AtButton>
    )

}

export default Day