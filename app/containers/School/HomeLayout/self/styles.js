/**
 * Created by ASUS on 2017/10/16.
 */
/**
 * Created by ASUS on 2017/10/16.
 */


import styled,{css} from 'styled-components';

const SelfCss=styled.div`
    .selfCss{
      &-item{
        overflow: hidden;
        &-icon{
          float:right;
          img{
            overflow: hidden;
            border-radius: 45%;
          }
        }

        .am-list-extra {
          flex-basis: 50%!important;
        }
        
      }
      
      &-btnExit{
        width:90%;
        margin:0.7rem auto;
      }

    }

`

export default SelfCss