// 产线:work line
export default class WorkLine{
    constructor () {
        this.workLine = new Konva.Rect(Object.assign({}, util.commonAttr, util.workLine, {
            name:'shape',
            shapeType:'workLine',
            shapeData : {
                code: "",
                name: "",
                lineType: "",
                smCalendarGid: "",
                remarks: "",
                calendarName:'',
            },
        }))

        this.text = new Konva.Text(Object.assign({}, util.commonTextAttr,{
            y:util.workLine.y,
            text:'产线'
        }));
        
        this.tempGroupPosition = {}
    }

    // 添加group
    addAnchorGroup(shape,clone){
        clone.draggable(false); //停止拖动
        var cloneGroup = new Konva.Group({
            groupType:'workLine',
            draggable: true,
            name:'anchorGroup',
            id: util.getUuid(),
        });

        let shapeWidth = shape.width();
        let shapeHeight = shape.height();
        cloneGroup.add(clone);

        let cloneText = new Konva.Text(Object.assign({}, util.commonTextAttr,{
            x:-150,
            y:util.workCenter.y+80,
            text:'',
            name:'groupText',
        }));
        cloneGroup.add(cloneText);

        mainLayerClass.mainLayer.add(cloneGroup)

        // 平移后顶点坐标
        let orginX = 0 - util.MENU_LAYER_WIDTH + shape.x();
        let orginY = shape.y();
        let changeX = shapeWidth + orginX;
        let changeY = shapeHeight + orginY;
        this.addAnchor(cloneGroup, orginX , orginY+shape.height()/2, 'centerLeft');
        this.addAnchor(cloneGroup, changeX, orginY+shape.height()/2, 'centerRight');
        cloneGroup.startDrag();
        this.addAnchorGroupEvent(cloneGroup);
        mainLayerClass.mainLayer.draw();
    }

    // 改变文描
    changeText(text){

    }

    // 添加group拖拽事件
    addAnchorGroupEvent(group){
        let tempGroupPosition = {};

        group.on('dragstart', function (evt) {
            evt.cancelBubble = true;
            tempGroupPosition = group.position();
        })

        group.on('dragend', function (evt) {
            evt.cancelBubble = true;

            // todo寻找所有的工作空间workCenter 判断当前区域是否在工作空间内， 如果则添加group到此元素上
            let workCenterGroups = _.filter(mainLayerClass.mainLayer.find('.anchorGroup'), (o) => {
                return o.getAttr('groupType') == 'workCenter';
            });
            let noContainLength = 0; // 没有包含的元素个数
            let parentGroup =  group.findAncestor('.anchorGroup');
            let inParentgroup = parentGroup && parentGroup.getAttr('groupType') == 'workCenter';  //是否在parentGroup中

            // 循环遍历产线是否在工作空间内
            for(var i=0; i<workCenterGroups.length; i++){
                // 如果在区域内  这里的碰撞区域不能是group 因为如果元素在group中  那么group会随着元素的拖动而改变大小
                let contentBlockArray = workCenterGroups[i].getChildren((node) => {
                    return node.getAttr('shapeType') == 'workCenter'
                })
                let contentBlock = contentBlockArray[0];


                if(util.konvaCheckContain(group, contentBlock)){
                    // 判断它是否已经在这个group中了
                    let groupId = group.id();
                    let hasCurrentGroup = workCenterGroups[i].find(`#${groupId}`).length > 0 ? true : false;
                   
                    if(!hasCurrentGroup){
                        let absolutePosition = group.getAbsolutePosition();
                        group.moveTo(workCenterGroups[i])
                        group.setAbsolutePosition(absolutePosition);
                        mainLayerClass.mainLayer.draw();
                    }
                } else {
                    // 没有则还原元素节点
                    noContainLength ++;
                }
            }

            // 如果不包含任意的一个工作空间中
            if (noContainLength == workCenterGroups.length) {
                // 如果是刚拖出来的元素
                if (!inParentgroup) {
                    group.destroy();
                    mainLayerClass.mainLayer.draw();
                } else {
                    // 位置还原
                    group.position(
                        tempGroupPosition
                    )
                    mainLayerClass.mainLayer.draw();
                }
            }
        })
    }

    // 锚点的更改
    update(activeAnchor) {
        var group = activeAnchor.getParent();
        var centerLeft = group.get('.centerLeft')[0];
        var centerRight = group.get('.centerRight')[0];

        // 获取元素内容
        var shape = group.get('.shape')[0];
        var anchorX = activeAnchor.getX();
        var anchorY = activeAnchor.getY();
        // update anchor positions
        switch (activeAnchor.getName()) {
            case 'centerLeft':
                break;
            case 'centerRight':
                break;
        }

        let centerLeftPostion = centerLeft.position();
        centerLeftPostion.y -= shape.height()/2;
        shape.position(centerLeftPostion);
        var width = centerRight.getX() - centerLeft.getX();
        if (width) {
            shape.width(width);
        }
    }

    // Anchor dragBoundFunc

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
            dragOnTop: false,
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

        // 只让水平移动
        anchor.dragBoundFunc((pos) => {
            return {
                x: pos.x,
                y: anchor.getAbsolutePosition().y
            }
        })

    }
}