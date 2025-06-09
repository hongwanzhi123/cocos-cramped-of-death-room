

import { _decorator, Component, Node, Sprite, UITransform , Animation, AnimationClip, animation, Vec3, SpriteFrame} from 'cc';

import { TILE_HEIGH, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../../Runtime/ResourceManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import { EntityManager } from '../../Base/EntityManager';
import DataManager from '../../Runtime/DataManager';

import {  IEntity,  } from '../../Levels';
import { EnemynManager } from '../../Base/EnemyManager';
import { BurstStateMachine } from './BurstStateMachine';
const { ccclass, property } = _decorator;


@ccclass('BurstnManager')
export class BurstsManager extends EntityManager {



   async init(params:IEntity){

      this.fsm = this.addComponent(BurstStateMachine)
      await this.fsm.init()
      super.init(params)

      const transform = this.getComponent(UITransform)
      transform.setContentSize(TILE_WIDTH ,TILE_HEIGH )

      EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onBurst,this)



    }

    onDestroy(){
      super.onDestroy()

      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.onBurst)


    }

    update(){
      this.node.setPosition(this.x * TILE_WIDTH,-this.y * TILE_HEIGH)
    }

    onBurst(){

      if(this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player){
        return
      }

      const{x:playerX,y:playerY} = DataManager.Instance.player

      if(this.x === playerX && this.y === playerY && this.state === ENTITY_STATE_ENUM.IDLE){
        this.state = ENTITY_STATE_ENUM.ATTACK
      }else if(this.state === ENTITY_STATE_ENUM.ATTACK){
        this.state = ENTITY_STATE_ENUM.DEATH

        if(this.x === playerX && this.y === playerY){
          EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER,ENTITY_STATE_ENUM.AIRDEATH)
        }
      }


}

}

