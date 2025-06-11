
import { _decorator, Component, director, Node, UITransform } from 'cc';
import { TileMapManager } from '../Tile/TileMapManager';
import { createUINode } from '../../resources/Utils';
import levels, { ILevel } from '../../Levels';
import  DataManager, { IRecord }  from '../../Runtime/DataManager';
import { TILE_HEIGH, TILE_WIDTH } from '../Tile/TileManager';
import EventManager from '../../Runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, SCENE_ENUM } from '../../Enums';
import { PlayerManager } from '../Player/PlayerManager';
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager';
import { DoorManager } from '../Door/DoorManager';
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager';
import { BurstsManager } from '../Burst/BurstManager';
import { SpikesManager } from '../Spikes/SpikesManager';
import { SmokeManager } from '../Smoke/SmokeManager';
import FadeManager from '../../Runtime/FadeManager';
import { ShakeManager } from '../../UI/ShakeManager';
const { ccclass, property } = _decorator;


@ccclass('BattleManager')
export class BattleManager extends Component {

    level:ILevel
    stage:Node
    private smokeLayer:Node
    private inited = false

    onLoad(){
        DataManager.Instance.levelIndex = 1
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL,this.nextLevel,this)
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.checkArrived,this)
        EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE,this.generateSmoke,this)
        EventManager.Instance.on(EVENT_ENUM.RECORD_STEP,this.record,this)
        EventManager.Instance.on(EVENT_ENUM.REVOKE_STEP,this.revoke,this)
        EventManager.Instance.on(EVENT_ENUM.RESTART_LEVEL,this.initLevel,this)
        EventManager.Instance.on(EVENT_ENUM.OUT_BATTLE,this.outBattle,this)
    }

    onDestroy(){
        EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL,this.nextLevel)
          EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.checkArrived)
        EventManager.Instance.off(EVENT_ENUM.SHOW_SMOKE,this.generateSmoke)
        EventManager.Instance.off(EVENT_ENUM.RECORD_STEP,this.record)
        EventManager.Instance.off(EVENT_ENUM.REVOKE_STEP,this.revoke)
         EventManager.Instance.on(EVENT_ENUM.RESTART_LEVEL,this.initLevel)
        EventManager.Instance.on(EVENT_ENUM.OUT_BATTLE,this.outBattle)
    }

    start () {
        this.generateStage()
       this.initLevel()


    }

    async initLevel(){
        const level = levels[`level${DataManager.Instance.levelIndex}`];
        if(level){
            if(this.inited){
                await FadeManager.Instance.fadeIn()
            }else{
                await FadeManager.Instance.mask()
            }

            this.clearLevel()
            this.level = level;
            DataManager.Instance.mapInfo = this.level.mapInfo
            DataManager.Instance.mapRowCount = this.level.mapInfo.length
            DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length

           await Promise.all([
            this.generateTileMap(),
            this.generateBursts(),
            this.generateSpikes(),
            this.generateEnemies(),
            this.generateSmokeLayer(),
            this.generatePlayer(),
            this.generateDoor(),])


            await FadeManager.Instance.fadeOut()
            this.inited = true
        }else{
            this.outBattle()
        }
    }


    nextLevel(){
        DataManager.Instance.levelIndex++
        this.initLevel()
    }

    async outBattle(){
        await FadeManager.Instance.fadeIn()
        director.loadScene(SCENE_ENUM.start)
    }

    clearLevel(){
        this.stage.destroyAllChildren()
        DataManager.Instance.reset()
    }

    generateStage(){
        this.stage = createUINode();
        this.stage.setParent(this.node);
        this.stage.addComponent(ShakeManager)


    }

    async generateSmoke(x:number,y:number,direction:DIRECTION_ENUM){
        const item = DataManager.Instance.smokes.find(smoke => smoke.state === ENTITY_STATE_ENUM.DEATH)
        if(item){

            item.x = x,
            item.y = y,
            item.direction = direction,
            item.state = ENTITY_STATE_ENUM.IDLE,
            item.node.setPosition(x * TILE_WIDTH - TILE_WIDTH*1.5,-y * TILE_HEIGH + TILE_HEIGH*1.5)
        }else{
            const smoke = createUINode()
            smoke.setParent(this.smokeLayer)

            const smokeManager = smoke.addComponent(SmokeManager);
        await smokeManager.init({
            x,
            y,
            direction,
            state:ENTITY_STATE_ENUM.IDLE,
            type:ENTITY_TYPE_ENUM.SMOKE,
        }
        )
         DataManager.Instance.smokes.push(smokeManager)
        }
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

    async generateSmokeLayer(){
        this.smokeLayer = createUINode()
        this.smokeLayer.setParent(this.stage)
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
        if(!DataManager.Instance.player || !DataManager.Instance.door){
            return
        }

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
        this.stage.getComponent(ShakeManager).stop()
        this.stage.setPosition(-disX,disY)


}

    record(){
        const item:IRecord = {
            player:{
                x:DataManager.Instance.player.x,
                y:DataManager.Instance.player.y,
                direction:DataManager.Instance.player.direction,
                state:DataManager.Instance.player.state === ENTITY_STATE_ENUM.IDLE ||
                DataManager.Instance.player.state === ENTITY_STATE_ENUM.DEATH ||
                DataManager.Instance.player.state === ENTITY_STATE_ENUM.AIRDEATH
                ?DataManager.Instance.player.state:ENTITY_STATE_ENUM.IDLE,
                type:DataManager.Instance.player.type,
            },
            door:{
                x:DataManager.Instance.door.x,
                y:DataManager.Instance.door.y,
                direction:DataManager.Instance.door.direction,
                state:DataManager.Instance.door.state,
                type:DataManager.Instance.door.type,
            },
            enemies:DataManager.Instance.enemies.map(({x,y,direction,state,type})=>({
                x,
                y,
                direction,
                state,
                type,
            })),
             bursts:DataManager.Instance.bursts.map(({x,y,direction,state,type})=>({
                x,
                y,
                direction,
                state,
                type,
            })),
             spikes:DataManager.Instance.spikes.map(({x,y,count,type})=>({
                x,
                y,
                count,
                type,
            })),

        }
        DataManager.Instance.records.push(item)
    }

    revoke(){
        const item = DataManager.Instance.records.pop()
        if(item){
            DataManager.Instance.player.x = DataManager.Instance.player.targerX = item.player.x
            DataManager.Instance.player.y = DataManager.Instance.player.targerY= item.player.y
            DataManager.Instance.player.state = item.player.state
            DataManager.Instance.player.direction = item.player.direction

            DataManager.Instance.door.x = item.door.x
            DataManager.Instance.door.y  = item.door.y
            DataManager.Instance.door.state = item.door.state
            DataManager.Instance.door.direction = item.door.direction

            for(let i = 0; i < DataManager.Instance.enemies.length;++i){
                const enemy = item.enemies[i]
                DataManager.Instance.enemies[i].x = enemy.x
                DataManager.Instance.enemies[i].y = enemy.y
                DataManager.Instance.enemies[i].direction = enemy.direction
                DataManager.Instance.enemies[i].state = enemy.state

            }

             for(let i = 0; i < DataManager.Instance.bursts.length;++i){
                const burst = item.bursts[i]
                DataManager.Instance.bursts[i].x = burst.x
                DataManager.Instance.bursts[i].y = burst.y
                DataManager.Instance.bursts[i].direction = burst.direction
                DataManager.Instance.bursts[i].state = burst.state

            }

            for(let i = 0; i < DataManager.Instance.spikes.length;++i){
                const one = item.spikes[i]
                DataManager.Instance.spikes[i].x = one.x
                DataManager.Instance.spikes[i].y = one.y
                DataManager.Instance.spikes[i].count = one.count
                DataManager.Instance.spikes[i].type = one.type

            }
        }
    }
}
