// 左侧功能导航
import WorkCenter from '../Shape/WorkCenter'
import WorkLine from '../Shape/WorkLine'
import WorkUnit from '../Shape/WorkUnit'
import WorkStation from '../Shape/WorkStation'

export default class MenuLayer {
    constructor() {
        this.menuLayer = new Konva.Layer({
            id: 'menuLayer',
            x: 0,
            y: 0,

        });
        //　添加全局变量
        window.workCenterClass = new WorkCenter();
        window.workLineClass = new WorkLine();
        window.workUnitClass = new WorkUnit();
        window.workStationClass = new WorkStation();

        // 私有属性
        this.workCenter = workCenterClass.workCenter;
        this.workLine = workLineClass.workLine;
        this.workUnit = workUnitClass.workUnit;
        this.workStation = workStationClass.workStation;


        this.workCenterText = workCenterClass.text;
        this.workLineText = workLineClass.text;
        this.workUnitText = workUnitClass.text;
        this.workStationText = workStationClass.text;

        // 添加模块 Shape
        this.menuLayer.add(this.workCenter);
        this.menuLayer.add(this.workCenterText);

        this.menuLayer.add(this.workLine);
        this.menuLayer.add(this.workLineText);

        this.menuLayer.add(this.workUnit);
        this.menuLayer.add(this.workUnitText);

        this.menuLayer.add(this.workStation);
        this.menuLayer.add(this.workStationText);


        // 分界线 样式line
        let splitLine = new Konva.Line({
            points: [util.MENU_LAYER_WIDTH, 0, util.MENU_LAYER_WIDTH, util.MAIN_HEIGHT],
            stroke: 'rgb(236,236,236)',
            strokeWidth: 10,
        });
        this.menuLayer.add(splitLine)

        // 添加整体事件
        this.eventDelegation();
    }

    // 子组件拖拽事件委托
    eventDelegation() {
        let _this = this;
        this.menuLayer.on('dragstart', function (evt) {
            var shape = evt.target;
            // get the shape that was clicked on
            shape.stopDrag();

            // 要回到原来的位置
            let shapeType = shape.getAttr('shapeType');
            shape.setAttrs(
                Object.assign({}, util.commonAttr, util[shapeType])
            )

            _this.generateClone(shape);
        });
    }

    // 生成克隆节点  生成group 锚点 与 克隆元素
    generateClone(shape) {
        // 获取当前元素的x
        let currentX = shape.x();
        let clone = shape.clone({
            x:currentX - util.MENU_LAYER_WIDTH,
        });
        // events will also be cloned
        // so we need to disable dragstart
        clone.off('dragstart');

        let shapeType = shape.getAttr('shapeType');
        let superClass = window[shapeType+'Class'];
        if(superClass.addAnchorGroup){
            let group = superClass.addAnchorGroup(shape,clone);
            mainLayerClass.sortAnchorGroupZIndex();
            this.menuLayer.draw();
        }
    }
}