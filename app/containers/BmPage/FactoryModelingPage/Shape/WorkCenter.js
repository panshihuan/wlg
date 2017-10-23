// 工作中心:work center
export default class WorkCenter{
    constructor () {
        this.workCenter = new Konva.Rect(Object.assign({}, util.commonAttr, util.workCenter, {
            name:'shape',
            shapeType:'workCenter',
            shapeData : {
                code: "", //工作中心编码
                name: "",  //工作中心名称
                smCalendarGid: "", //日历Id
                calendarName:'',
                remarks: ""

            },
        }))

        this.text = new Konva.Text(Object.assign({}, util.commonTextAttr,{
            y:util.workCenter.y+5,
            text:'工作中心'
        }));
    }



    // 添加group
    addAnchorGroup(shape,clone){
        clone.draggable(false); //停止拖动
        var cloneGroup = new Konva.Group({
            draggable: true,
            groupType:'workCenter',
            name:'anchorGroup',
            id:  util.getUuid(),
        });


        let addHeight = 5; //增加height的高度
        shape.setAttr('height',shape.height()+addHeight);
        clone.setAttr('height',shape.height()+addHeight);

        let shapeWidth = shape.width();
        let shapeHeight = shape.height();
        let cloneText = new Konva.Text(Object.assign({}, util.commonTextAttr,{
            x:-85,
            y:util.workCenter.y+5,
            text:'',
            name:'groupText'
        }));
        cloneGroup.add(clone);
        cloneGroup.add(cloneText);
        mainLayerClass.mainLayer.add(cloneGroup);

        // 平移后顶点坐标
        let orginX = 0 - util.MENU_LAYER_WIDTH + shape.x();
        let orginY = shape.y();
        let changeX = shapeWidth + orginX;
        let changeY = shapeHeight + orginY;

        this.addAnchor(cloneGroup, orginX , orginY, 'topLeft');
        this.addAnchor(cloneGroup, changeX, orginY, 'topRight');
        this.addAnchor(cloneGroup, changeX, changeY, 'bottomRight');
        this.addAnchor(cloneGroup, orginX, changeY, 'bottomLeft');
        
        // 添加group移动事件
        this.addAnchorGroupEvent(cloneGroup);
        
        cloneGroup.startDrag();
        return cloneGroup;
    }

    
    // 添加group拖拽事件
    addAnchorGroupEvent(group){
        let tempGroupPosition = {};

        group.on('dragstart', function (evt) {
            evt.cancelBubble = true;
            tempGroupPosition = group.getPosition();
        })

        group.on('dragend', function (evt) {
            evt.cancelBubble = true;
            var shape = evt.target;
            
            let noContainLength = 0; // 没有包含的元素个数

            // 本身元素 和所有的workCenter的判断是否有碰撞即可
            let workCenterGroups = _.filter(mainLayerClass.mainLayer.find('.anchorGroup'), (o) => {
                return o.getAttr('groupType') == 'workCenter';
            });
            // 循环遍历产线是否在工作空间内
            for(var i=0; i<workCenterGroups.length; i++) {
                // 刚拖拽的元素及添加到了元素上了
                if(group == workCenterGroups[i]) {
                    noContainLength ++;
                    continue;
                }
                
                let contentBlock = workCenterGroups[i].findOne('.shape');
                // 如果碰撞了  则还原
                if(util.konvaCheckCollide(group, contentBlock)){
                    // 位置还原
                    group.position(
                        tempGroupPosition
                    )
                    mainLayerClass.mainLayer.draw();
                } else {
                    // 没有则还原元素节点
                    noContainLength ++;
                }
            }

        })


        // group 拖动
        group.dragBoundFunc((pos) => {
            return {
                x: pos.x < 270 ? 270 : pos.x,
                y: pos.y < -30 ? -30 : pos.y
            };
        })

    }

    // 锚点的更改
    update(activeAnchor) {
        var group = activeAnchor.getParent();
        var topLeft = group.get('.topLeft')[0];
        var topRight = group.get('.topRight')[0];
        var bottomRight = group.get('.bottomRight')[0];
        var bottomLeft = group.get('.bottomLeft')[0];
        // 获取元素内容
        var shape = group.get('.shape')[0];
        var anchorX = activeAnchor.getX();
        var anchorY = activeAnchor.getY();
        // update anchor positions
        switch (activeAnchor.getName()) {
            case 'topLeft':
                topRight.setY(anchorY);
                bottomLeft.setX(anchorX);
                break;
            case 'topRight':
                topLeft.setY(anchorY);
                bottomRight.setX(anchorX);
                break;
            case 'bottomRight':
                bottomLeft.setY(anchorY);
                topRight.setX(anchorX);
                break;
            case 'bottomLeft':
                bottomRight.setY(anchorY);
                topLeft.setX(anchorX);
                break;
        }
        shape.position(topLeft.position());
        var width = topRight.getX() - topLeft.getX();
        var height = bottomLeft.getY() - topLeft.getY();
        if (width && height) {
            shape.width(width);
            shape.height(height);
        }
    }

    // 添加更改的锚点
    addAnchor(group, x, y, name) {
        let _this = this;
        var stage = group.getStage();
        var layer = group.getLayer();
        var anchor = new Konva.Circle({
            x: x,
            y: y,
            stroke: '#666',
            fill: '#ddd',
            strokeWidth: 2,
            radius: 5,
            name: name,
            draggable: true,
            dragOnTop: false
        });
        this.addAnchorEvent(stage,layer,group,anchor);
        group.add(anchor);
    }
    // 添加锚点的事件
    addAnchorEvent(stage,layer,group,anchor){
            let _this = this;
        anchor.on('dragmove', function () {
            _this.update(this);
            layer.draw();
        });
        anchor.on('mousedown touchstart', function () {
            group.setDraggable(false);
            this.moveToTop();
        });
        anchor.on('dragend', function () {
            group.setDraggable(true);
            layer.draw();
        });
        // add hover styling
        anchor.on('mouseover', function () {
            var layer = this.getLayer();
            document.body.style.cursor = 'pointer';
            this.setStrokeWidth(4);
            layer.draw();
        });
        anchor.on('mouseout', function () {
            var layer = this.getLayer();
            document.body.style.cursor = 'default';
            this.setStrokeWidth(2);
            layer.draw();
        });
    }


}