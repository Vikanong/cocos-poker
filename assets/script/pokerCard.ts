import { _decorator, Component, Node, SpriteFrame, Sprite, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('pokerCard')
export class pokerCard extends Component {

    @property({ type: SpriteFrame })
    public backSpriteFrame: SpriteFrame = null

    start() {

    }

    public showPoker(suit: string, point: number) {
        let img = this.node.getChildByName('img');
        resources.load(`pokers/${suit}/${suit}_${point}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            img.getComponent(Sprite).spriteFrame = spriteFrame;
        });
    }


    public backPoker(suit: string, point: number) {
        let img = this.node.getChildByName('img');
        img.getComponent(Sprite).spriteFrame = this.backSpriteFrame
    }


    update(deltaTime: number) {

    }
}

