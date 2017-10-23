import styled from 'styled-components';
import {colors} from "../../../../../global-styles";

let gap = '30px';
let contentPadding = '20px'

const ProductCardCss = styled.div`
 
    .productCard{
      margin-bottom: ${gap};
    
       .media{
        display: flex;
        padding: ${contentPadding};
       }
        .media-left{
          width:50px;
          display: flex;
          justify-content:center;
          align-items:center;
          .media-object{
            width: 50px;
            height:50px;
            background:lightgray;
          }
        }

    .media-body{
      flex: 1;
      padding: 0 15px;
      display: flex;
      flex-direction:column;
      justify-content:center;
     }
     
     .control-bottom{
      padding:0 ${contentPadding};
      border-top:1px solid #ddd;
      height:35px;
      line-height:35px;
      
      .anticon {
        font-size:18px;
        margin-left:10px;
        &:hover{
          cursor: pointer;
          color:${colors.blue_0};
        }
      }
      
     }
     
     
    }
 
      
      
`;
export default ProductCardCss