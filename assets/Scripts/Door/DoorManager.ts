

import { _decorator, Component, Node, Sprite, UITransform , Animation, AnimationClip, animation, Vec3, SpriteFrame} from 'cc';

import { TILE_HEIGH, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../../Runtime/ResourceManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import { EntityManager } from '../../Base/EntityManager';
import DataManager from '../../Runtime/DataManager';
import { DoorStateMachine } from './DoorStateMachine';
import { IEntity } from '../../Levels';

const { ccclass, property } = _decorator;


@ccclass('DoornManager')
export class DoorManager extends EntityManager {



   async init(params:IEntity){

      this.fsm = this.addComponent(DoorStateMachine)
      await this.fsm.init()
      super.init(params)

      EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN,this.onOpen,this)


    }

    onDestroy(){
      super.onDestroy()
      EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN,this.onOpen)


    }

    onOpen(){
      if(DataManager.Instance.enemies.every(enemy => enemy.state === ENTITY_STATE_ENUM.DEATH) && this.state !== ENTITY_STATE_ENUM.DEATH){
        this.state = ENTITY_STATE_ENUM.DEATH
      }
    }


  }

