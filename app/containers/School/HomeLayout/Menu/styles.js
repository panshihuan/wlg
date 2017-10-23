/**
 * Created by ASUS on 2017/10/16.
 */


import styled,{css} from 'styled-components';
import qzl from 'images/qzl.jpg'

const MenuCss=styled.div`
    .menuCss{
      &-bar{
        height:5.4rem;
        overflow: hidden;
        padding:0 15px;
        //border-bottom: 8px solid #ddd;
        //background-image:url(${qzl}); 
        display: flex;
        align-items:center;
        &-left{
          width:3.2rem;
          height:3.2rem;
          overflow: hidden;
          margin-right:0.6rem;
          border-radius: 1.6rem 1.6rem;
          img{
            height:100%;
            width:100%;
          }
        }
        &-right{
          display: flex;
          flex-direction:column;
          p{
            &:first-child{
              margin-bottom: 6px;
            }
            &:last-child{
              margin-top: 6px;
            }
          }
        }
        
      }
      
      &-middle{
        height:1.3rem;
        line-height: 1.3rem;
        font-size: 0.6rem;
        padding:0 0.5rem;
        background: #eee;
        &-sch{
          background: url('/iconfont/icons/school.svg') no-repeat;
          background-size:1.3rem 1.3rem ;
          padding-left:1.5rem;
        }
      }
      
      &-content{
        display: flex;
        justify-content:center;
        align-items:center;
        border-bottom:1px solid #ddd;
        &-item{
          flex:1;
          display: flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          padding:0.3rem;
          font-size: 0.56rem;
          &:not(:last-child){
            border-right:1px solid #ddd;
          }
          &-icon{
            width:60%;
            height:60%;
          }
          &-text{
            text-align: center;
          }
        }
        
      }
      
    } 
    
`

export default MenuCss