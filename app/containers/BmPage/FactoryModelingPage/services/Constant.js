export default class Constant {
    constructor() {
        // ajax信息
        this.BASE_URL = 'http://192.168.138.132:9080';
        // this.BASE_URL = 'http://192.168.137.182:8080'

        // 主体的高宽
        /*this.MAIN_WIDTH = document.querySelector('.canvas-main').offsetWidth;
        this.MAIN_HEIGHT = document.querySelector('.canvas-main').offsetHeight;*/

        this.MAIN_WIDTH = document.querySelector('.ant-layout').offsetWidth - document.querySelector('.ant-layout-sider').offsetWidth;


        this.MAIN_HEIGHT = document.querySelector('.ant-layout-sider').offsetHeight - 110; //ant-breadcrumb + ant-card-body 高度
        this.MENU_LAYER_WIDTH = 170;  //左侧导航栏的宽度


        // 公共属性
        this.commonAttr = {
            strokeWidth: 2, // 线框宽度
            draggable: true,
            dragDistance: 5,
        }

        this.commonTextAttr = {
            x: 15,
            fontSize: 14,
            fill: '#555',
            align: 'center'
        }



        let menuLayerCommonShape = {
            x: 75
        }

        let menuLayerCommonText = {
            x: 75
        }


        //工作中心
        this.workCenter = {
            cornerRadius: 5,
            dash:[5],
            x: menuLayerCommonShape.x,
            y: 50,
            width:70,
            height:20,
            stroke: 'rgb(114,184,254)',
            lineJoin: 'round',
            lineCap: 'round',
        }



        //产线
        this.workLine = {
            x:menuLayerCommonShape.x,
            y:130,
            width:70,
            height:12,
            fill:'rgb(102,204,153)',
        }


        // 工作单元
        this.workUnit = {
            x:menuLayerCommonShape.x,
            y:200,
            width:70,
            height:20,
            stroke: 'rgb(51,153,0)',
        }

        this.workUnitText = {
            x: 20,
            fontSize: 12,
            fill: '#555',
            width: 300,
            padding: 20,
            align: 'center'
        }


        // 工位
        this.workStation = {
            x: menuLayerCommonShape.x +30,
            y: 280,
            radius: 10,
            stroke: 'yellow',
        }
    }
}




