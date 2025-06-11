
import { _decorator, Component, Node, Sprite, UITransform , Animation, AnimationClip, animation, Vec3, SpriteFrame} from 'cc';
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM } from '../../Enums';
import { StateMachine } from '../../Base/StateMachine';
import { randomByLen } from '../../resources/Utils';
import { ISpikes } from '../../Levels';
import { TILE_HEIGH, TILE_WIDTH } from '../Tile/TileManager';
import { SpikesStateMachine } from './SpikesStateMachine';
import EventManager from '../../Runtime/EventManager';
import DataManager from '../../Runtime/DataManager';



const { ccclass, property } = _decorator;


@ccclass('SpikesManager')
export class SpikesManager extends Component {
  id : string = randomByLen(12)
  x : number = 0
  y : number = 0
  fsm:StateMachine

  private _count: number
  private _totalCount:number
  type:ENTITY_TYPE_ENUM

  get count() {
    return this._count;
  }

  set count(newCount) {
    this._count = newCount;
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT,newCount)
  }

  get totalCount() {
    return this._totalCount;
  }

  set totalCount(newtotalCount) {
    this._totalCount = newtotalCount;
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT,newtotalCount)
  }


   async init(params:ISpikes){

      const sprite = this.addComponent(Sprite)
      sprite.sizeMode = Sprite.SizeMode.CUSTOM

      const transform = this.getComponent(UITransform)
      transform.setContentSize(TILE_WIDTH * 4,TILE_HEIGH * 4)

      this.fsm = this.addComponent(SpikesStateMachine)
      await this.fsm.init()
      this.x = params.x
      this.y = params.y
      this.type = params.type
      this.totalCount = SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[this.type]
      this.count = params.count

      EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onLoop,this)

    }

     onDestroy(){
      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.onLoop)
    }

    update(){
      this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH*1.5,-this.y * TILE_HEIGH + TILE_HEIGH*1.5)
    }



    onLoop(){
      if(this.count === this.totalCount){
        this.count = 1
      }else{
        this.count++
      }

      this.onAttack()

    }

    backZero(){
      this.count = 0
    }

    onAttack(){

      if(!DataManager.Instance.player){
        return
      }
      const {x:playerX,y:playerY} =  DataManager.Instance.player
      if(this.x === playerX && this.y === playerY && this.count === this.totalCount){
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER,ENTITY_STATE_ENUM.DEATH)
      }
    }

}


