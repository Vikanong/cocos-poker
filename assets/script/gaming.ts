import { _decorator, Component, Node, Label, SpriteFrame, Prefab, Vec3, tween, instantiate } from 'cc';
import request from './request'
import { getPokers } from '../poker/pokers'
import { pokerCard } from './pokerCard'

const { ccclass, property } = _decorator;


interface pokerInfo {
    suit: string
    point: number
}

@ccclass('gaming')
export class gaming extends Component {

    // 桌面Node
    @property({ type: Node })
    public container: Node = null

    // 开始游戏界面
    @property({ type: Node })
    public startGameNode: Node = null

    // 所有牌
    private _allPokers: pokerInfo[] = []

    // 玩家数量
    private _playersNum: number = 5

    // 当前玩家位置
    private _playerSeat = null

    // 所有玩家持有的底牌
    private _playerHoleCards = {
        0: [],
        1: [],
        2: []
    }

    // 公牌
    private _board = []

    // 公牌坐标
    private _boardPos = [{ x: -204, y: 17 }, { x: -101, y: 17 }, { x: 2, y: 17 }, { x: 104, y: 17 }, { x: 208, y: 17 }]

    // 当前第几轮
    private _roundGame: number = 0

    // 扑克牌
    @property({ type: Prefab })
    public pokerPrefab: Prefab = null

    // 底池
    private _pot = 0
    @property(Label)
    public potLabel: Label = null

    // 小盲注 大盲注
    private _blind = {
        smallBlind: 0,
        bigBlind: 0
    }

    // 大小盲注位置
    private _blindSeat = [1, 2]

    // 大小盲注和庄家图标
    @property({ type: [SpriteFrame] })
    public seatIcons: SpriteFrame[] = []


    start() {
        this.startGameNode.active = true
        this._allPokers = getPokers()
    }

    // 每个玩家发牌的坐标位置
    getPlayersPosition() {
        if (this._playersNum == 5) {
            return [
                { x: -380, y: 160, rotation: 45 },
                { x: 370, y: 150, rotation: -45 },
                { x: 380, y: -160, rotation: 45 },
                { isPlayer: true, x: 0, y: -200, rotation: 0 },
                { x: -380, y: -160, rotation: -45 }
            ]
        }
    }

    // 点击开始游戏
    startGame() {
        this.startGameNode.active = false
        this.smallOrBig()
        this.deal()
    }

    // 开始发牌
    deal() {
        const playerPos = this.getPlayersPosition();
        this._playerSeat = playerPos.findIndex(i => i.isPlayer);
        this._roundGame++;

        // 当前给第几个玩家发牌（0 为第 1 个）
        let positionIndex = 0;

        // 是否是第二轮发牌
        let isSecond = false;

        // 总发牌张数
        let total = this._playersNum * 2;

        // 当前已发牌数量
        let current = 0;

        this.schedule(() => {
            const poks = this.takePoker();
            let poker = poks[0];
            let pokerCardPrefab = instantiate(this.pokerPrefab);
            let pokerComponent = pokerCardPrefab.getComponent(pokerCard);

            if (positionIndex == this._playersNum) {
                positionIndex = 0;
                isSecond = true;
            }

            this._playerHoleCards[positionIndex]?.push(poker);

            pokerComponent.backPoker();
            this.container.addChild(pokerCardPrefab);

            pokerCardPrefab.setPosition(new Vec3(2, 217, 0));
            const pos = playerPos[positionIndex];
            const posVec = isSecond && !pos.isPlayer ? new Vec3(pos.x + 10, pos.y + 10, 0) : new Vec3(pos.x, pos.y, 0);

            // 是否是给当前玩家发牌
            const isPlayer = positionIndex == this._playerSeat;

            tween(pokerCardPrefab).to(0.4, { position: posVec, eulerAngles: new Vec3(0, 0, pos.rotation) }).call(() => {
                if (isPlayer) {
                    console.log("给玩家发");
                    const playerPokerPos = !isSecond ? new Vec3(pos.x - 55, 0, 0) : new Vec3(pos.x + 55, 0, 0);

                    tween(pokerCardPrefab).to(0.2, { eulerAngles: new Vec3(0, -90, 0), scale: new Vec3(1.2, 1.2, 1.2) }).call(() => {
                        pokerComponent.showPoker(poker.suit, poker.point);
                    }).by(0.2, { position: playerPokerPos, eulerAngles: new Vec3(0, 90, 0) }).start();
                }
            }).call(() => {
                current++;
                if (current == total) {
                    console.log("已经发完了");
                    this.dealBoard();
                }
            }).start();
            positionIndex++;
        }, 0.3, total - 1, 0);

    }

    // 发公牌
    dealBoard() {
        if (this._roundGame == 1) {
            const boardArr = this.takePoker(3);
            this._board = this._board.concat(boardArr);
            boardArr.map((poker, index) => {
                let pokerCardPrefab = instantiate(this.pokerPrefab);
                let pokerComponent = pokerCardPrefab.getComponent(pokerCard);
                pokerComponent.backPoker();
                this.container.addChild(pokerCardPrefab);

                pokerCardPrefab.setPosition(new Vec3(2, 217, 0));

                const boardPos = this._boardPos[index];

                tween(pokerCardPrefab).to(0.3, { position: new Vec3(boardPos.x, boardPos.y, 0) }).to(0.2, {
                    eulerAngles: new Vec3(0, -90, 0)
                }).call(() => {
                    pokerComponent.showPoker(poker.suit, poker.point);
                }).by(0.2, { eulerAngles: new Vec3(0, 90, 0) }).start();

            })
        }
    }


    // 随机取牌
    takePoker(num = 1) {
        let arr = []
        for (let i = 0; i < num; i++) {
            const l = this._allPokers.length
            const index = Math.floor((Math.random() * l))
            arr.push(this._allPokers[index])
            this._allPokers.splice(index, 1)
        }
        return arr
    }

    // 确定大小盲注
    smallOrBig() {
        // this._blindSeat

        console.log(this.seatIcons);

    }

    // update(deltaTime: number) {

    // }

    getpoker() {
        // request({
        //     url: 'http://192.168.110.88:8013/test/test',
        //     method: 'GET',
        //     data: {
        //         type: 1
        //     },
        //     success: function (res) {
        //     },
        //     error: function (err) {
        //     }
        // })
    }
}

