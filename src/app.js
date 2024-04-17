import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import { View } from '@tarojs/components';

import { Provider } from 'react-redux';
import store from './store';

import './app.scss'
//import "../node_modules/taro-ui/dist/style/index.scss";
//import "../node_modules/taro-ui/dist/style/components/icon.scss";

// function App({ children }: PropsWithChildren<any>) {

//   useLaunch(() => {
//     console.log('App launched.')
//   })
//   // children 是将要会渲染的页面
  
//   return <View id='taro_app'><Provider store={store}>{children}</Provider></View>
// }

// export default App

const App = ({children}) => {
  
  return (
    <Provider store={store}> <View id='taro_app'>{children}</View></Provider>
  );
};
export default App