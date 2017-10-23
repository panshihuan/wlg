// 主舞台，  有且仅有一个  stage -> layer -> group -> Shape
import MenuLayer from '../layer/MenuLayer';
import MainLayer from '../layer/MainLayer';
import pubsub from 'pubsub-js'

export default class Stage{
    constructor () {
        this.stage =  new Konva.Stage({
            container: 'canvas-main',
            width: util.MAIN_WIDTH,
            height: util.MAIN_HEIGHT
        });
        window.menuLayerClass = new MenuLayer();
        window.mainLayerClass = new MainLayer();
        // add the Layer to the Stage
        this.stage.add(menuLayerClass.menuLayer);
        this.stage.add(mainLayerClass.mainLayer);

        pubsub.publish('stageSize.change', {
            width: util.MAIN_WIDTH,
            height: util.MAIN_HEIGHT
        })
    }
}