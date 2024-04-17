import { View } from '@tarojs/components';
import './index.scss'
function LeftBorder({children , className=''}){
    return <View className={'my_left_border ' + className}>{children}</View>
}

export default LeftBorder