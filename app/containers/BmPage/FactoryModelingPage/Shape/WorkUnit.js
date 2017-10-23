// 工作单元:work unit
export default class WorkUnit{
    constructor () {
        this.workUnit = new Konva.Rect(Object.assign({}, util.commonAttr, util.workUnit, {
            name:'shape',
            shapeType:'workUnit',
            shapeData : {
                code: "",
                name: "",
                smCalendarGid: "",
                remarks: "",
                calendarName:'',
            },
        }))

        this.text = new Konva.Text(Object.assign({}, util.commonTextAttr,{
            y:util.workUnit.y + 2,
            text:'工作单元',
        }));
    }

    // 添加group
    addAnchorGroup(shape,clone){
        clone.draggable(false); //停止拖动
        var cloneGroup = new Konva.Group({
            groupType:'workUnit',
            draggable: true,
            name:'anchorGroup',
            id: util.getUuid(),
        });

        let cloneText = new Konva.Text(Object.assign({}, util.commonTextAttr,{
            x:util.workUnit.x-util.MENU_LAYER_WIDTH,
            y:util.workUnit.y + 4,
            width:util.workUnit.width,
            height:util.workUnit.height,
            align:'center',
            lineHeight:util.workUnit.height,
            text:'',
            name:'groupText',
        }));
        cloneGroup.add(cloneText);
        cloneGroup.add(clone);
        mainLayerClass.mainLayer.add(cloneGroup)
        cloneGroup.startDrag();
        this.addAnchorGroupEvent(cloneGroup);
        mainLayerClass.mainLayer.draw();
    }

    // 添加group拖拽事件
    addAnchorGroupEvent(group) {
        let tempGroupPosition = {};

        group.on('dragstart', function (evt) {
            evt.cancelBubble = true;
            tempGroupPosition = group.position();
        })

        group.on('dragend', function (evt) {
            evt.cancelBubble = true;
            var shape = evt.target;
            // todo寻找所有的工作空间workCenter 判断当前区域是否在工作空间内， 如果则添加group到此元素上
            let workLineGroups = _.filter(mainLayerClass.mainLayer.find('.anchorGroup'), (o) => {
                return o.getAttr('groupType') == 'workLine';
            });

            let noContainLength = 0; // 没有包含的元素个数
            let parentGroup =  group.findAncestor('.anchorGroup');
            let inParentgroup = parentGroup && parentGroup.getAttr('groupType') == 'workLine';  //是否在parentGroup中

            // 循环遍历产线是否在工作空间内
            for(var i=0; i<workLineGroups.length; i++){
                // 如果在区域内  这里的碰撞区域不能是group 因为如果元素在group中  那么group会随着元素的拖动而改变大小

                let contentBlockArray = workLineGroups[i].getChildren((node) => {
                    return node.getAttr('shapeType') == 'workLine'
                })
                let contentBlock = contentBlockArray[0];


                if(util.konvaCheckCollide(group, contentBlock)){
                    // 判断它是否已经在这个group中了
                    let groupId = group.id();
                    let hasCurrentGroup = workLineGroups[i].find(`#${groupId}`).length > 0 ? true : false;

                    // 如果不在当前组中  这一段我也不知道为什么好使的 我也很懵逼
                    if(!hasCurrentGroup){
                        let absolutePosition = group.getAbsolutePosition();
                        group.moveTo(workLineGroups[i])
                        group.setAbsolutePosition(absolutePosition);
                        mainLayerClass.mainLayer.draw();
                    }
                } else {
                    // 没有则还原元素节点
                    noContainLength ++;
                }
            }

            // 如果不包含任意的一个工作空间中
            if (noContainLength == workLineGroups.length) {
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
}