
import { _decorator, Component, Node, UITransform } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../../resources/Utils';
import levels, { ILevel } from '../../Levels';
import  DataManager  from '../../Runtime/DataManager';
import { TILE_HEIGH, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../../Runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager';
import { BurstsManager } from '../Burst/BurstManager';
import { SpikesManager } from '../Spikes/SpikesManager';
const { ccclass, property } = _decorator;


@ccclass('BattleManager')
export class BattleManager extends Component {

    level:ILevel
    stage:Node

    onLoad(){
        DataManager.Instance.levelIndex = 1
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL,this.nextLevel,this)
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.checkArrived,this)
    }

    onDestroy(){
        EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL,this.nextLevel)
    }

    start () {
        this.generateStage()
       this.initLevel()


    }

    initLevel(){
        const level = levels[`level${DataManager.Instance.levelIndex}`];
        if(level){
            this.clearLevel()
            this.level = level;
            DataManager.Instance.mapInfo = this.level.mapInfo
            DataManager.Instance.mapRowCount = this.level.mapInfo.length
            DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length

            this.generateTileMap()
            this.generateBursts()
            this.generateSpikes()
            this.generateEnemies()
            this.generatePlayer()
            this.generateDoor()

        }
    }


    nextLevel(){
        DataManager.Instance.levelIndex++
        this.initLevel()
    }

    clearLevel(){
        this.stage.destroyAllChildren()
        DataManager.Instance.reset()
    }

    generateStage(){
        this.stage = createUINode();
        this.stage.setParent(this.node);


    }

    async generateDoor(){
        const door = createUINode()
        door.setParent(this.stage)

        const doorManager = door.addComponent(DoorManager);
        await doorManager.init(this.level.door);
        DataManager.Instance.door = doorManager

    }

    async generateBursts(){
         const promise = []
        for(let i=0; i<this.level.bursts.length;++i){
            const burst = this.level.bursts[i]
        const node = createUINode()
        node.setParent(this.stage)

        const burstManager = node.addComponent(BurstsManager);
        promise.push(burstManager.init(burst));
        DataManager.Instance.bursts.push(burstManager)


        }
        await Promise.all(promise)
    }

    async generateSpikes(){
        const promise = []
        for(let i=0; i<this.level.spikes.length;++i){
            const spike = this.level.spikes[i]
        const node = createUINode()
        node.setParent(this.stage)

        const spikesManager = node.addComponent(SpikesManager);
        promise.push(spikesManager.init(spike));
        DataManager.Instance.spikes.push(spikesManager)


        }
        await Promise.all(promise)
    }

    async generateTileMap(){

        const tileMap = createUINode();
        tileMap.setParent(this.stage);
        const tileMapManager = tileMap.addComponent(TileMapManager);
        await tileMapManager.init();

        this.adaptPos();

    }

    async generatePlayer(){
        const player = createUINode()
        player.setParent(this.stage)

        const playerManager = player.addComponent(PlayerManager);
        await playerManager.init(this.level.player);
        DataManager.Instance.player = playerManager
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN,true)
    }

    async generateEnemies(){
        const promise = []
        for(let i=0; i<this.level.enemies.length;++i){
            const enemy = this.level.enemies[i]
        const node = createUINode()
        node.setParent(this.stage)
        const Manager = enemy.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN?WoodenSkeletonManager:IronSkeletonManager
        const manager = node.addComponent(Manager);
        promise.push(manager.init(enemy));
        DataManager.Instance.enemies.push(manager)


        }
        await Promise.all(promise)
    }

    checkArrived(){
        const {x:playerX,y:playerY} = DataManager.Instance.player
        const {x:doorX,y:doorY,state:doorState} = DataManager.Instance.door
        if(playerX === doorX && playerY === doorY && doorState === ENTITY_STATE_ENUM.DEATH){
            EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
        }
    }

    adaptPos(){
        const {mapRowCount,mapColumnCount} = DataManager.Instance
        const disX = (TILE_WIDTH * mapRowCount) / 2
        const disY = (TILE_HEIGH * mapColumnCount) / 2 + 80

        this.stage.setPosition(-disX,disY)


}
}
