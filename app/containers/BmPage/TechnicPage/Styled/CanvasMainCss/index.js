import styled from 'styled-components';

const CanvasMainCss = styled.div`
     width:100%;
     height:${props => props.config.height}px;
     *{
        box-sizing: border-box;
     }
     
     .layoutContent{
        height:${props => props.config.layoutContentHeight}px;
        width:100%;
        transform:translate(0,0);
        display: flex;
        overflow: auto;
        // 侧边栏
      >.sider{
        position: fixed;
        width:${props => props.config.siderWidth}px;
        height:100%;
        overflow: auto;
        background:rgb(246,246,246);
        border-right:1px solid #d9d9d9;
        
        // 覆盖ant样式
        .ant-collapse{
          border:none;
        }
        z-index: 10;
      }
      
      // 主题内容
      >.content{
        flex: 1;
        height:100%;
        overflow: auto;
        margin-left:${props => props.config.siderWidth}px;
        background:white;
        background-image:linear-gradient(#eee 1px,transparent 0),linear-gradient(90deg,#eee 1px,transparent 0);
        background-size:20px 20px;
        position: relative;
      }
      
      // 临时canvas
      >.temp-canvas{
        position: fixed;
        left:0;
        top:0;
        z-index: 10;
      }
     }
     
     // footer
      >.footer{
      
        .ant-tabs.hidden{
          .ant-tabs-tabpane{
            //display: none;
          }
        }
      
      }
      
      
`;
export default CanvasMainCss