import styled from 'styled-components';

 const positionBox = styled.div`
    width:100%;
    height:auto;  
     border:1px solid #d9d9d9;
    padding:20px 10px 10px;
    position:relative;
    margin:15px 0px 20px;
   > div:first-child{
     width:70px;
     height:5px;
     background:#fff;
     position:absolute;
     top:-3px;
     left:20px;
   }
   > div:nth-of-type(2){
     font-size:15px;
     color:#108ee9;
     position:absolute;
     top:-10px;
     left:22px;
   }
`;
export default positionBox