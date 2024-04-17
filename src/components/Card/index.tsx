import { View } from '@tarojs/components';
import LeftBorder from '../LifetBoder';

import './index.scss'
function Card({ children, className = '', type = '', title='', style={} }) {
    switch (type) {
        case '':
            return <View className={'my_view ' + className} style={style}>{children}</View>
        case 'title':
            return (
                <View className={'my_view my_view_title ' + className} style={style}>
                    <LeftBorder>{title}</LeftBorder>
                    {children}
                </View>
            )

        default:
            break;
    }

}

export default Card