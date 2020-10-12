import * as React from 'react';
import { Table, Modal, Tag } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import './index.less';

const browser_type: Array<string> = ['未知', 'Chrome', 'Eage', 'Firefox']

const columns: Array<object> = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
    render: (text: string, record: object, index: number) => {
      text;
      record;
      return index + 1;
    }
  },
  {
    title: '设备ID',
    dataIndex: 'device_id',
    key: 'device_id',
    width: 200
  },
  {
    title: '浏览器类型',
    dataIndex: 'device_browser_type',
    key: 'device_browser_type',
    render: (text: number) => <Tag color={['', 'red', 'blue', 'green'][text]}>{browser_type[text]}</Tag>,
    width: 120
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    render: (text: string) => dayjs(+text).format('YYYY-MM-DD HH:mm:ss'),
    width: 170,
    sorter: {
      compare: (record_a: any, record_b: any) => record_a.create_time - record_b.create_time,
    },
  },
  {
    title: '上次使用时间',
    dataIndex: 'last_login_time',
    key: 'last_login_time',
    render: (text: string) => dayjs(+text).format('YYYY-MM-DD HH:mm:ss'),
    width: 170,
    sorter: {
      compare: (record_a: any, record_b: any) => record_a.last_login_time - record_b.last_login_time,
    },
  },
  {
    title: '内容',
    dataIndex: 'device_content',
    key: 'device_content',
    render: (text: string) => <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      {text}
    </div>
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 150,
    render: () => { }
  },
];

export default class List extends React.Component {

  state = {
    dataSource: [],
    visible: false,
    todatyCreat: 0, // 今日新增数
    todatyActive: 0, // 今日活跃数
    browser_num: {
      Chrome: 0,
      Eage: 0,
      Firefox: 0,
      Other: 0
    },
    userTypeNum: {
      fund_num: 0,
      stock_num: 0,
      all_num: 0
    },
  }

  componentDidMount() {
    this.handleFetchData();
  }

  /**
   * 获取列表数据
   */
  handleFetchData = () => {
    axios.get('https://topnamei.top/api/device/list')
      .then((response) => {
        let todatyCreat = 0;
        let todatyActive = 0;
        const browser_num: { Chrome: number, Eage: number, Firefox: number, Other: number } = {
          Chrome: 0,
          Eage: 0,
          Firefox: 0,
          Other: 0
        }

        const userTypeNum: { fund_num: number, stock_num: number, all_num: number } = {
          fund_num: 0,
          stock_num: 0,
          all_num: 0
        }

        const dayTime = dayjs().format('YYYY-MM-DD');
        const dayTimeC = dayjs(dayTime).unix() * 1000;
        const nextDayTimeC = dayTimeC + 24 * 60 * 60 * 1000;

        response.data.data.forEach((item: any) => {
          const content = JSON.parse(item.device_content);
          // 今日新增统计
          if (dayTimeC <= item.create_time && item.create_time < nextDayTimeC) {
            todatyCreat += 1
          }
          // 今日活跃统计

          if (dayTimeC <= item.last_login_time && item.last_login_time < nextDayTimeC) {
            todatyActive += 1
          }

          // 浏览器类型统计
          switch (item.device_browser_type) {
            case 0:
              browser_num.Other += 1;
              break;
            case 1:
              browser_num.Chrome += 1;
              break;
            case 2:
              browser_num.Eage += 1;
              break;
            case 3:
              browser_num.Firefox += 1;
              break;
            default:
              break;
          }

          // 内容分析
          if (content.fundListM || content.stockItemList) {

            const hasFund = content.fundListM && content.fundListM.length > 0;
            const hasStock = content.stockItemList && content.stockItemList.length > 0;

            if (hasFund && !hasStock) {
              userTypeNum.fund_num += 1;
            }
            if (hasStock && !hasFund) {
              userTypeNum.stock_num += 1;
            }
            if (hasStock && hasFund) {
              userTypeNum.all_num += 1;
            }
          }

        });

        this.setState({
          dataSource: response.data.data,
          todatyCreat,
          todatyActive,
          browser_num,
          userTypeNum
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * 查看弹框显示隐藏
   */
  handleOk = () => {

  }


  render() {
    const { dataSource, visible, todatyCreat, todatyActive, browser_num, userTypeNum } = this.state;

    return <div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <h2>使用情况</h2>
          <p>总用户：<span>{dataSource.length}</span></p>
          <p>今日新增用户：<span>{todatyCreat}</span></p>
          <p>今日活用户：<span>{todatyActive}</span></p>
        </div>
        <div style={{ flex: 1 }}>
          <h2>浏览器</h2>
          <p>Chrome: <span>{browser_num.Chrome}</span></p>
          <p>Eage: <span>{browser_num.Eage}</span></p>
          <p>Firefox: <span>{browser_num.Firefox}</span></p>
          <p>Other: <span>{browser_num.Other}</span></p>
        </div>
        <div style={{ flex: 1 }}>
          <h2>用户偏好</h2>
          <p>基金: <span>{userTypeNum.fund_num}</span> 人</p>
          <p>股票: <span>{userTypeNum.stock_num}</span> 人</p>
          <p>全用: <span>{userTypeNum.all_num}</span> 人</p>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        scroll={{ y: "60vh" }}
        pagination={
          {
            total: dataSource.length,
            defaultPageSize: 200,
            showTotal: (total: number) => {
              return `共 ${total} 条`;
            }
          }
        }
      />
      <Modal
        title="Basic Modal"
        visible={visible}
        onOk={this.handleOk}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  }

}