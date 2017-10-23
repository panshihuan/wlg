import styled from 'styled-components';
import {colors, sizes} from "../../global-styles";


export const SiderHeader = styled.div`
  * { transition: none }
  img{
    padding: ${props => props.collapsed ? sizes.xs : 0}px;
  }
  a {
    height: ${ 2* sizes.base + 50}px;
    overflow: hidden;
    color: ${colors.white};
    display: block;
    padding: ${props => props.collapsed ? sizes.sm : sizes.base}px;
    background: ${colors.gray_5};
    text-align: ${props => props.collapsed ? 'center' : 'left'};
    & > span {
      font-size: ${props => props.collapsed ? sizes.sm : sizes.base}px;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
      display: inline-block;
      overflow: ${props => props.collapsed ? 'hidden' : 'initial'};
      padding-top: ${props => props.collapsed ? sizes.xs : sizes.sm}px;
      margin-left: ${props => props.collapsed ? 0 : sizes.sm}px;
    }
  }
`;

export const ImeHeader = styled.div`
  background: ${colors.blue_6};
  padding: 0 ${sizes.lg}px;
  font-size: 14px;
  color: white;
  height: ${sizes.base * 5}px;
  line-height: ${sizes.base * 5}px;
  border-bottom: 1px solid ${colors.gray_4};
  position: relative;
  width: 100%;
  a{
    color: white;
  }
  input {
    width: 225px;
  }
  .ant-menu{
    color: white;
    background: ${colors.blue_6};
    line-height: ${sizes.base * 5}px;
    border:none;
    &-tiem > a:hover,
    &-tiem:hover,
    &-item-active, 
    &:not(.ant-menu-inline) .ant-menu-submenu-open, 
    &-submenu-open, 
    &-submenu-title:hover{
      color: white;
      background: ${colors.blue_7};
    }
    &-inline,
    &-vertical{
      border-right: none;
    }
    > .ant-menu-item-divider{
      background-color: ${colors.gray_4}
    }
  }
  .ant-menu-item > a:hover{
    color: white;
  }
  .ant-menu-horizontal{
    & > .ant-menu-item, 
    & > .ant-menu-submenu{
      top: 0;
      border-bottom: none;
      &.menu-item-icon{
        margin: 0;
      }
    }
    & > .ant-menu-item:hover,
    & > .ant-menu-submenu:hover, 
    & > .ant-menu-item-active, 
    & > .ant-menu-submenu-active,
    & > .ant-menu-item-open, 
    & > .ant-menu-submenu-open, 
    & > .ant-menu-item-selected, 
    & > .ant-menu-submenu-selected{
      color:white;
    }
    & > .ant-menu-item-active:not(.menu-item-icon){
      background: ${colors.blue_7};
    }
  }
  .ant-menu-submenu-horizontal > .ant-menu{
    margin-top: 0;
    border-radius: 4px;
    overflow: auto;
    max-height: 300px;
  }
  .ant-menu-item:not(.menu-item-icon):active, 
  .ant-menu-submenu-title:active{
    background: ${colors.blue_7};
  }
  .ant-menu-horizontal > .ant-menu-item > a,
  .ant-menu-horizontal > .ant-menu-submenu > a{
    color: white;
  }
  .ant-menu-submenu-title .anticon{
    font-size: 12px;
  }
  .ant-menu-item .anticon,
  .ant-menu-submenu-title .anticon{
    min-width: unset;
    margin-right: 0;
  }
  .ant-menu-item{
    &.menu-item-icon{
      padding: 0;
      > a{
        padding: 0 ${sizes.sm}px;
      }
    }
  }
  .ant-input{
    background: ${colors.gray_6};
    border-color: ${colors.gray_4};
    color: ${colors.gray_2};
    &::-webkit-input-placeholder{
      color: ${colors.gray_3};
    }
    &:focus,&:hover{
      color: white;
      border-color: ${colors.gray_3};
    }
  }
  .ant-input-affix-wrapper .ant-input-prefix, 
  .ant-input-affix-wrapper .ant-input-suffix{
    color: ${colors.gray_2};
    &:hover{
      color: ${colors.gray_1};
    }
  }
  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected{
    background: ${colors.blue_7};
  }
  .ant-menu-vertical.ant-menu-sub > .ant-menu-item,
  .ant-menu-vertical.ant-menu-sub > .ant-menu-submenu{
    border-bottom: 1px solid ${colors.gray_5};
  }
`;

export const ImeSider = styled.div`
  height: 100vh;
  margin-top: -${sizes.base * 5}px;
  padding-top: ${sizes.base * 5}px;
  background: white;
  .h-full{
    overflow: hidden;
  }
  .ant-layout-sider{
    background: ${colors.blue_6};
    overflow: ${props => props.collapsed ? 'unset' : 'auto'};
  }
  .ant-menu{
    background: ${colors.blue_6};
    color: white;
    &:not(.ant-menu-horizontal){
      .ant-menu-item-selected{
        background-color: ${colors.blue_5};
        &>a{
          color: white;
        }
      }
    }
  }
  .ant-menu-vertical .ant-menu-submenu-selected,
  .ant-menu-vertical .ant-menu-submenu-selected>a,
  .ant-menu-item > a,
  .ant-menu-item:hover, 
  .ant-menu-item-active, 
  .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open, 
  .ant-menu-submenu-active, 
  .ant-menu-submenu-title:hover{
    color: white;
  }
  .ant-menu-item:active, 
  .ant-menu-submenu-title:active{
    background-color: ${colors.blue_5};
  }
  .ant-menu-submenu > ul{
    background-color: ${props => props.collapsed ? colors.blue_6 : colors.gray_6};
  };
  .ant-menu-inline, .ant-menu-vertical{
    border:none;
  }
  .ant-menu-inline .ant-menu-item, 
  .ant-menu-vertical .ant-menu-item{
    margin: 0;
    left: 0;
  }
  .ant-menu-vertical .ant-menu-item, 
  .ant-menu-inline .ant-menu-item, 
  .ant-menu-vertical .ant-menu-submenu-title, 
  .ant-menu-inline .ant-menu-submenu-title{
    font-size: 14px;
  }
`;

export const IemContent = styled.div`
  padding: 0 ${sizes.base}px;
  background: rgba(0, 0, 0, .05);
  overflow: auto;
  width: 100%;
`;