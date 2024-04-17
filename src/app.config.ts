export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/order/index',
    'pages/user/index',
    'pages/user/login/index',
    'pages/index/predetermine/index',
    'pages/user/commonProblem/index',
  ],
  tabBar: {
    color: '#000000',
    selectedColor: '#DC143C',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        selectedIconPath:'icon/home.png',
        iconPath:'icon/home_on.png',
        text: '',
      },
      {
        pagePath: 'pages/order/index',
        selectedIconPath:'icon/order.png',
        iconPath:'icon/order_on.png',
        text: '',
      },
      {
        pagePath: 'pages/user/index',
        selectedIconPath:'icon/user.png',
        iconPath:'icon/user_on.png',
        text: '',
      },
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    backgroundColor:'#101010'
  }
})
