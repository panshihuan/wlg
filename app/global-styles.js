import styled, {injectGlobal} from 'styled-components';

export const colors = {
  white: '#FFFFFF',
  blue_1: '#EFF3FA',
  blue_2: '#D8E3F4',
  blue_3: '#B9CCEB',
  blue_4: '#91AFDF',
  blue_5: '#638ED2',
  blue_6: '#326bc4',
  blue_7: '#2B5AAA',
  blue_8: '#25498F',
  blue_9: '#1E3774',
  blue_0: '#172559',
  red_1: '#FAEFEF',
  red_2: '#F4D8D9',
  red_3: '#EBB9B9',
  red_4: '#DF9192',
  red_5: '#D26365',
  red_6: '#C43234',
  red_7: '#AC2C35',
  red_8: '#932637',
  red_9: '#7A1F38',
  red_0: '#61193A',
  yellow_1: '#FDF9EC',
  yellow_2: '#FAF1D2',
  yellow_3: '#F7E6AC',
  yellow_4: '#F2D77D',
  yellow_5: '#EDC748',
  yellow_6: '#E7B50E',
  yellow_7: '#CB940C',
  yellow_8: '#AE710B',
  yellow_9: '#914E09',
  yellow_0: '#742B07',
  gray_1: 'rgba(255, 255, 255, .8)',
  gray_2: 'rgba(255, 255, 255, .6)',
  gray_3: 'rgba(255, 255, 255, .4)',
  gray_4: 'rgba(255, 255, 255, .2)',
  gray_5: 'rgba(255, 255, 255, .1)',
  gray_6: 'rgba(0, 0, 0, .1)',
  gray_7: 'rgba(0, 0, 0, .2)',
  gray_8: 'rgba(0, 0, 0, .4)',
  gray_9: 'rgba(0, 0, 0, .6)',
  gray_0: 'rgba(0, 0, 0, .8',
};

export const sizes = {
  base: 16,
  sm: 8,
  xs: 4,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 36,
};

export const Small = styled.span`font-size: 80%; opacity: .8`;

export const ImeRow = styled.div`
  >*{
    margin-bottom: ${props => {
      switch (props.bottom){
        case 'xs':
          return sizes.xs;
        case 'sm':
          return sizes.sm;
        case 'md':
          return sizes.md;
        case 'lg':
          return sizes.lg;
        case 'xl':
          return sizes.xl;
        case 'xxl':
          return sizes.xxl;
        default: 
          return sizes.base;
      }
    }}px;
  }
  .ant-card{
    .ant-card-extra{
      display: flex;
      align-items: center;
      >div>*{
        margin-left: ${sizes.sm}px;
      }
    }
  }
`;

export const ImeBreadcrumb = styled.div`
  line-height: 3rem;
  .ant-breadcrumb{
    font-size: 14px;
  }
  .breadcrumb-btn >*{
    margin-left: ${sizes.sm}px;
  }
`;

export const ImeToolBar = styled.div`
  .ant-card >.ant-card-body{
    padding: ${sizes.sm}px ${sizes.base}px;
    >div>*{
      margin-right: ${sizes.sm}px;
    }
  }
`;


let menuIcon=(url)=>
    `
      width:2rem;
      height:2rem;
      background: url(${url}) no-repeat;
      background-size:100% 100%;
      background-position:0 3px;
    `;


/* eslint no-unused-expressions: 0 */
injectGlobal`
  
  html,
  body {
    height: 100%;
    width: 100%;
    font-family:'PingFang SC,Helvetica Neue,Hiragino Sans GB,Helvetica,Microsoft YaHei,Arial';
  }
  hr{
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    margin: 16px auto;
  }

  #app {
    background-color: #fff;
    overflow: hidden;
    .left-bar{
      width: 300px !important;
      position: absolute;
    }
    .right-bar{
      padding-left: 300px !important;
    }
  }

  p,
  label {
    //font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
  
  .wrapper
  {
    padding: 24px;
    background: #fff;
    min-height:300px;
  }
  
  .breadcrumb
  {
    margin: 12px 0;
  }
  
  .ant-switch{
    background-color:#c8c8c8
   }

  .orderSplitModal{
    .ant-input-number{
        width:100%
    }
  }

  .ant-input-number{
    width:100%
  }
  
  .ant-layout{
    background: unset;
  };
  .ant-layout-content{
    height:100%;
  }
  
  .ant-card {
    &.ant-card-bordered.ant-card-no-hovering{
      box-shadow: 0 6px 16px -6px ${colors.gray_6};
    }
    &.card-full{
      height: calc( 100vh - 206px );
      .ant-card-body{
        height: calc( 100% - 48px );
        overflow: auto;
      }
    }
    >.ant-card-head{
      padding: 0 ${sizes.base}px;
    }
    >.ant-card-body{
      padding: ${sizes.base}px;
    }
  }
  
  .ant-switch.ant-switch-checked{
    background: ${colors.blue_5}
  }
    
  .chart{
    height:100%;
    
    float: right;
    z-index: 9999;
    position: relative;
  }
  
  .brush-o{
    ${menuIcon('iconfont/icons/brush-o.svg')}
  }
  .phone-o{
    ${menuIcon('iconfont/icons/phone.svg')}
  }
  .news-o{
    ${menuIcon('iconfont/icons/news-o.svg')}
  }
  .kao{
    ${menuIcon('iconfont/icons/kao.svg')}
  }
  .kebiao{
    ${menuIcon('iconfont/icons/kebiao.svg')}
  }
  .zuoye{
    ${menuIcon('iconfont/icons/zuoye.svg')}
  }
  .teacher{
    ${menuIcon('iconfont/icons/teacher.svg')}
  }
  .xc{
    ${menuIcon('iconfont/icons/xc.svg')}
  }
  .shequ{
    ${menuIcon('iconfont/icons/shequ.svg')}
  }
  
`;
