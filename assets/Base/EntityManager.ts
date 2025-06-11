
import { _decorator, Component, Node, Sprite, UITransform , Animation, AnimationClip, animation, Vec3, SpriteFrame} from 'cc';


import { IEntity } from '../Levels';
import { PlayerStateMachine } from '../Scripts/Player/PlayerStateMachine';
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enums';
import { TILE_HEIGH, TILE_WIDTH } from '../Scripts/Tile/TileManager';
import { StateMachine } from './StateMachine';
import { randomByLen } from '../resources/Utils';
const { ccclass, property } = _decorator;


@ccclass('EntityManager')
export class EntityManager extends Component {
  id : string = randomByLen(12)
  x : number = 0
  y : number = 0
  fsm:StateMachine

  private _direction: DIRECTION_ENUM;
  private _state:ENTITY_STATE_ENUM
  type:ENTITY_TYPE_ENUM

  get direction() {
    return this._direction;
  }

  set direction(newDirection) {
    this._direction = newDirection;
    this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION,DIRECTION_ORDER_ENUM[this._direction])
  }

  get state() {
    return this._state;
  }

  set state(newState) {
    this._state = newState;
    this.fsm.setParams(this._state,true)
  }


   async init(params:IEntity){

      const sprite = this.addComponent(Sprite)
      sprite.sizeMode = Sprite.SizeMode.CUSTOM

      const transform = this.getComponent(UITransform)
      transform.setContentSize(TILE_WIDTH * 4,TILE_HEIGH * 4)

      this.x = params.x
      this.y = params.y
      this.type = params.type
      this.direction = params.direction
      this.state = params.state

    }

    update(){
      this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH*1.5,-this.y * TILE_HEIGH + TILE_HEIGH*1.5)
    }

    onDestroy(){

    }

}


