import styled,{css} from 'styled-components';

const ExcelCss=styled.div`
    .chart{
      height:100%;
      
      float: right;
      z-index: 9999;
      position: relative;
        .ant-tabs-nav-wrap{
            
        }

        &-navBar{
            height:50px;
            background: #666;
            color:#fff;
            line-height:50px;
            padding:0 20px;
        }

        &-leftBar{
            height:100%;
            &-input{
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0;
            }
        }
        &-rightBar{
            height:100%;
        }

        .show{
            display: block;
        }
        .hide{
            display: none;
        }
    }
`

export default ExcelCss