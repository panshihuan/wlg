import styled,{css} from 'styled-components';

const TableFieldCss=styled.div`
  .ant-table{
    width: 100%;
    .formTable{
      margin: 10px 0 24px;
      width: 100%;
      overflow: auto;
      .ant-table-thead{
        th{
          background: #f7f7f7;
        }
      }
      .ant-table-tbody{
        background-color:#fff;
        td{
          padding: 6px 8px;
        }
      }
      .ant-form-item {
        margin: 0;
      }
      .ant-select,.ant-input,.ant-input-number{
        min-width: 80px;
        width: 100%;
      }
      .ant-calendar-picker{
        min-width: 80px;
        width: 100% !important;
      }
      .operate{
        a{
          display: inline-block;
          min-width: 30px;
        }
      }
    }
  }
  
`
export default TableFieldCss