// 工位:work station
export default class WorkStation{
    constructor () {
        this.workStation = new Konva.Circle(Object.assign({}, util.commonAttr, util.workStation, {
            name:'shape',
            shapeType:'workStation',
            shapeData : {
                code: "",
                name: "",
                smCalendarGid: "",
                remarks: "",
                calendarName:'',
            },
        }))

        this.text = new Konva.Text(Object.assign({}, util.commonTextAttr,{
            y:util.workStation.y - 5,
            text:'工位',

        }));
    }


    // 添加group
    addAnchorGroup(shape,clone){
        clone.draggable(false); //停止拖动
        var cloneGroup = new Konva.Group({
            groupType:'workStation',
            draggable: true,
            name:'anchorGroup',
            id: util.getUuid(),
        });


        let cloneText = new Konva.Text(Object.assign({}, util.commonTextAttr,{
            x:util.workStation.x-174,
            y:util.workStation.y - 5,
            width:util.workStation.width,
            height:util.workStation.height,
            align:'center',
            lineHeight:util.workStation.height,
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
            // workUnitGroups 判断当前区域是否在工作空间内， 如果则添加group到此元素上
            let workUnitGroups = _.filter(mainLayerClass.mainLayer.find('.anchorGroup'), (o) => {
                return o.getAttr('groupType') == 'workUnit';
            });

            let noContainLength = 0; // 没有包含的元素个数
            let parentGroup =  group.findAncestor('.anchorGroup');
            let inParentgroup = parentGroup && parentGroup.getAttr('groupType') == 'workUnit';  //是否在parentGroup中

            // 循环遍历产线是否在工作空间内
            for(var i=0; i<workUnitGroups.length; i++){
                // 如果在区域内  这里的碰撞区域不能是group 因为如果元素在group中  那么group会随着元素的拖动而改变大小

                let contentBlockArray = workUnitGroups[i].getChildren((node) => {
                    return node.getAttr('shapeType') == 'workUnit'
                })
                let contentBlock = contentBlockArray[0];


                if(util.konvaCheckCollide(group, contentBlock)){
                    // 判断它是否已经在这个group中了
                    let groupId = group.id();
                    let hasCurrentGroup = workUnitGroups[i].find(`#${groupId}`).length > 0 ? true : false;

                    // 如果不在当前组中  这一段我也不知道为什么好使的 我也很懵逼
                    if(!hasCurrentGroup){
                        let absolutePosition = group.getAbsolutePosition();
                        group.moveTo(workUnitGroups[i])
                        group.setAbsolutePosition(absolutePosition);
                        mainLayerClass.mainLayer.draw();
                    }
                } else {
                    // 没有则还原元素节点
                    noContainLength ++;
                }
            }

            // 如果不包含任意的一个工作空间中
            if (noContainLength == workUnitGroups.length) {
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