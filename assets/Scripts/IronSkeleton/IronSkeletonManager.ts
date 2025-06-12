

import { _decorator, Component, Node, Sprite, UITransform , Animation, AnimationClip, animation, Vec3, SpriteFrame} from 'cc';

import { TILE_HEIGH, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../../Runtime/ResourceManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import { EntityManager } from '../../Base/EntityManager';
import DataManager from '../../Runtime/DataManager';

import { IEntity } from '../../Levels';
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine';
import { EnemyManager } from '../../Base/EnemyManager';
const { ccclass, property } = _decorator;


@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {



   async init(params:IEntity){

      this.fsm = this.addComponent(IronSkeletonStateMachine)
      await this.fsm.init()
      super.init(params)


    }





}


