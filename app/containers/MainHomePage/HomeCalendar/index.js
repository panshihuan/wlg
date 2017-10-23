/*
 * Calendar
 */

import React from 'react';
import {Calendar, Icon, Table, Tag} from 'antd';
import './calendar.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {colors, ImeRow, sizes} from "../../../global-styles";
moment.locale('zh-cn');

class HomeCalendar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: []
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  dateFtt = (fmt,date) => {
    const o = {
      "Y+" : date.getFullYear(),                    //年份
      "M+" : date.getMonth()+1,                 //月份
      "d+" : date.getDate(),                    //日
      "h+" : date.getHours(),                   //小时
      "m+" : date.getMinutes(),                 //分
      "s+" : date.getSeconds(),                 //秒
      "q+" : Math.floor((date.getMonth()+3)/3), //季度
      "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
      fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(let k in o)
      if(new RegExp("("+ k +")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
  };

  getListData = (value) => {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'normal', content: 'This is usual event.' },
        ]; break;
      case 10:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'normal', content: 'This is usual event.' },
          { type: 'error', content: 'This is error event.' },
        ]; break;
      case 15:
        listData = [
          { type: 'warning', content: 'This is warning event' },
          { type: 'normal', content: 'This is very long usual event。。....' },
          { type: 'error', content: 'This is error event 1.' },
          { type: 'error', content: 'This is error event 2.' },
          { type: 'error', content: 'This is error event 3.' },
          { type: 'error', content: 'This is error event 4.' },
        ]; break;
      default:
    }
    return listData || [];
  };

  dateCellRender = (value) => {
    const listData = this.getListData(value);
    return (
      <div>
          { listData.map((item, i) => (<span key={i} className={`event-${item.type}`} />)) }
      </div>
    );
  };

  getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  };

  monthCellRender = (value) => {
    const num = this.getMonthData(value);
    return num ? <div className="notes-month">
      <section>{num}</section>
      <span>Backlog number</span>
    </div> : null;
  };

  onSelect = (value) => {
    this.setState({
      selectDate: this.dateFtt( 'YY-MM-dd', new Date(value)),
      selectedValue: this.getListData(value),
    });
  };

  getColors = (type)=>{
    switch (type){
      case 'error':
        return {color: colors.red_5, name: '紧急'};
      case 'normal':
        return {color: colors.blue_5, name: '一般'};
      case 'warning':
        return {color: colors.yellow_5, name: '优先'};
      default: return {color: '', name: ''};
    }
  };
  render() {
    const columns = [{
      title: '类型',
      dataIndex: 'type',
      width: '60px',
      key: 'type',
      render: type => <Tag color={this.getColors(type).color}>{this.getColors(type).name}</Tag>,
    }, {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    }, {
      title: '创建时间',
      dataIndex: 'createT',
      key: 'createT',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="#">查看</a>
          <span className="ant-divider" />
          <a href="#">操作</a>
        </span>
      ),
    }];

    return (
      <div>
        <Calendar
          dateCellRender={this.dateCellRender}
          monthCellRender={this.monthCellRender}
          onSelect={this.onSelect}
          bordered={true}
        />

        {this.state.selectedValue.length > 0 &&
        <div>
          <ImeRow bottom='sm'>
            <h5>日程列表 ({this.state.selectDate})</h5>
            <Table
              size="small"
              columns={columns}
              dataSource={this.state.selectedValue}
              rowKey={ item => item.content }
              pagination={false}
              bordered={true}
            />
          </ImeRow>
        </div>
        }
      </div>
    );
  }

}

HomeCalendar.propTypes = {};

export default HomeCalendar;
