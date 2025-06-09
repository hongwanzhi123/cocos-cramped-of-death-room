

import { _decorator, Component, Node, Sprite, UITransform , Animation, AnimationClip, animation, Vec3, SpriteFrame} from 'cc';
import { EntityManager } from './EntityManager';
import EventManager from '../Runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../Enums';
import DataManager from '../Runtime/DataManager';
import { IEntity } from '../Levels';



const { ccclass, property } = _decorator;


@ccclass('EnemyManager')
export class EnemynManager extends EntityManager {



   async init(params:IEntity){
      super.init(params)

      EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END,this.onChangeDirection,this)
      EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN,this.onChangeDirection,this)
      EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY,this.onDead,this)

      this.onChangeDirection(true)

    }

    onDestroy(){
      super.onDestroy()
      EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END,this.onChangeDirection)
      EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN,this.onChangeDirection)

      EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY,this.onDead)

    }



    onChangeDirection(isInit:boolean = false){

      if(this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player){
        return
      }

      if(!DataManager.Instance.player){
        return
      }

      const{x:playerX,y:playerY} = DataManager.Instance.player
      const disX = Math.abs(this.x - playerX)
      const disY = Math.abs(this.y - playerX)

      if(disX === disY && !isInit){
        return
      }

      if(playerX >= this.x && playerY <= this.y){
        this.direction = disX < disY ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.RIGHT
      }else if(playerX <= this.x && playerY <= this.y){
        this.direction = disX < disY ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.LEFT
      }else if(playerX <= this.x && playerY >= this.y){
        this.direction = disX < disY ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.LEFT
      }else if(playerX >= this.x && playerY >= this.y){
        this.direction = disX < disY ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.RIGHT
      }


    }



    onDead(id:string){
      if(this.state === ENTITY_STATE_ENUM.DEATH){
        return
      }

      if(this.id === id){
        this.state = ENTITY_STATE_ENUM.DEATH
      }

    }
}


