/**
 * Created by ASUS on 2017/9/20.
 */
import styled,{css} from 'styled-components';

const SendModalCss=styled.div`
    .sendModal{
      color:#333;
      .ant-card-body{
        overflow: auto;
      }

      &-tabTop{
        height:100%;
        &-top{
          max-height:100%;
          overflow: auto;
        }
        &-bottom{
          max-height:80%;
          overflow: auto;
        }
      }

    }
`

export default SendModalCss