

import { _decorator, Component, Node, Sprite, UITransform , Animation, AnimationClip, animation, Vec3, SpriteFrame} from 'cc';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import { EntityManager } from '../../Base/EntityManager';
import { IEntity } from '../../Levels';
import { SmokeStateMachine } from './SmokeStateMachine';

const { ccclass, property } = _decorator;


@ccclass('SmokeManager')
export class SmokeManager extends EntityManager {



   async init(params:IEntity){

      this.fsm = this.addComponent(SmokeStateMachine)
      await this.fsm.init()
      super.init(params)


    }





}


