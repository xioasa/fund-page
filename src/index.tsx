import React from 'react';
import Home from './home/home';
import './static/index.less';
import ReactDOM from 'react-dom';

// import dayjs from 'dayjs'
// import isLeapYear from 'dayjs/plugin/isLeapYear' // 导入插件
// import 'dayjs/locale/zh-cn' // 导入本地化语言
// dayjs.extend(isLeapYear) // 使用插件
// dayjs.locale('zh-cn') // 使用本地化语言


const App:React.FC = () => {
    return <Home />
};


ReactDOM.render(<App />, document.getElementById('main'));