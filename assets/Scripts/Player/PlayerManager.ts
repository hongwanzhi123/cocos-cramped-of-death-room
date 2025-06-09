
import { _decorator, Component, Node, Sprite, UITransform , Animation, AnimationClip, animation, Vec3, SpriteFrame} from 'cc';

import { TILE_HEIGH, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../../Runtime/ResourceManager';
import { CONTROLLER_ENUM, DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';
import { EntityManager } from '../../Base/EntityManager';
import DataManager from '../../Runtime/DataManager';
import { IEntity } from '../../Levels';
const { ccclass, property } = _decorator;


@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {

  targerX : number = 0
  targerY : number = 0
  isMoving:boolean = false
  private readonly speed = 1/10


   async init(params:IEntity){

      this.fsm = this.addComponent(PlayerStateMachine)
      await this.fsm.init()
      super.init(params)

    this.targerX = this.x
    this.targerY = this.y

      EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL,this.inputHandle,this)
      EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER,this.onDeath,this)
    }

    onDestroy(){
      super.onDestroy()
      EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL,this.inputHandle)
      EventManager.Instance.off(EVENT_ENUM.ATTACK_PLAYER,this.onDeath)
    }

    update(){
      this.updateXY()
      super.update()
    }

    updateXY(){
      if(this.targerX < this.x){
        this.x -= this.speed
      }else if(this.targerX > this.x){
        this.x += this.speed
      }

      if(this.targerY < this.y){
        this.y -= this.speed
      }else if(this.targerY > this.y){
        this.y += this.speed
      }

      if(Math.abs(this.x - this.targerX) <= 0.1 && Math.abs(this.y - this.targerY) <= 0.1 && this.isMoving){
        this.isMoving = false
        this.x = this.targerX
        this.y = this.targerY

        EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)

      }

    }

    inputHandle(inputDirection:CONTROLLER_ENUM){

      if(this.isMoving){
        return
      }
      if(this.state === ENTITY_STATE_ENUM.DEATH || this.state === ENTITY_STATE_ENUM.AIRDEATH || this.state === ENTITY_STATE_ENUM.ATTACK){
        return
      }

      const id = this.willAttack(inputDirection)
      if(id){

        EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY,id)
        EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN)
        return
      }

      if(this.willBlock(inputDirection)){
        return
      }

      this.move(inputDirection)

    }

    move(inputDirection:CONTROLLER_ENUM){


      if(inputDirection === CONTROLLER_ENUM.TOP){
        this.targerY -= 1
                this.isMoving = true
      }else if(inputDirection === CONTROLLER_ENUM.BOTTOM){
        this.targerY += 1
            this.isMoving = true
      }else if(inputDirection === CONTROLLER_ENUM.LEFT){
        this.targerX -= 1
            this.isMoving = true
      }else if(inputDirection === CONTROLLER_ENUM.RIGTH){
        this.targerX += 1
            this.isMoving = true
      }else if(inputDirection === CONTROLLER_ENUM.TURNLEFT){
        if(this.direction === DIRECTION_ENUM.TOP){
          this.direction = DIRECTION_ENUM.LEFT
        }else if(this.direction === DIRECTION_ENUM.LEFT){
          this.direction = DIRECTION_ENUM.BOTTOM
        }else if(this.direction === DIRECTION_ENUM.BOTTOM){
          this.direction = DIRECTION_ENUM.RIGHT
        }else if(this.direction === DIRECTION_ENUM.RIGHT){
          this.direction = DIRECTION_ENUM.TOP
        }


        this.state = ENTITY_STATE_ENUM.TURNLEFT
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
      }
    }

    willAttack(type:CONTROLLER_ENUM){
      const enemies = DataManager.Instance.enemies.filter(enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH)
      for(let i = 0;i < enemies.length;++i){
        const {x:enemyX,y:enemyY,id:enemyId} = enemies[i]
        if(type === CONTROLLER_ENUM.TOP && this.direction === DIRECTION_ENUM.TOP && enemyX === this.x && enemyY === this.y - 2){
          this.state = ENTITY_STATE_ENUM.ATTACK

          return enemyId
        }else if(type === CONTROLLER_ENUM.LEFT && this.direction === DIRECTION_ENUM.LEFT && enemyX === this.x - 2 && enemyY === this.y){
          this.state = ENTITY_STATE_ENUM.ATTACK

          return enemyId
        }else if(type === CONTROLLER_ENUM.BOTTOM && this.direction === DIRECTION_ENUM.BOTTOM && enemyX === this.x && enemyY === this.y + 2){
          this.state = ENTITY_STATE_ENUM.ATTACK

          return enemyId
        }else if(type === CONTROLLER_ENUM.RIGTH && this.direction === DIRECTION_ENUM.RIGHT && enemyX === this.x + 2 && enemyY === this.y ){
          this.state = ENTITY_STATE_ENUM.ATTACK

          return enemyId
        }
      }

      return ''
    }

    willBlock(inputDirection:CONTROLLER_ENUM){

      const {targerX:x,targerY:y,direction} = this
      const {tileInfo} = DataManager.Instance
      const{x:doorX,y:doorY,state:doorState} = DataManager.Instance.door
      const enemies = DataManager.Instance.enemies.filter(enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH)
      const bursts = DataManager.Instance.bursts.filter(burst => burst.state !== ENTITY_STATE_ENUM.DEATH)


      if(inputDirection === CONTROLLER_ENUM.TOP){
        if(direction === DIRECTION_ENUM.TOP){
           const playerNextY = y - 1
           const weaponNextY = y - 2
           if(playerNextY < 0){
            this.state = ENTITY_STATE_ENUM.BLOCKFRONT
            return true
           }

           const playerTile = tileInfo[x][playerNextY]
           const weaponTile = tileInfo[x][weaponNextY]

           if(playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable) ){
            // empty
           }else{
            this.state = ENTITY_STATE_ENUM.BLOCKFRONT
            return true
           }

          //  for(let i = 0; i<bursts.length;++i){

          //   const{x:burstX,y:burstY} = bursts[i]
          //   if((x === burstX && playerNextY === burstY) && (!nextWeaponTile || weaponTile.turnable)){

          //   }
          //  }


        }
      }else if(inputDirection === CONTROLLER_ENUM.TURNLEFT){
        let nextX
        let nextY
        if(direction === DIRECTION_ENUM.TOP){
          nextX = x - 1
          nextY = y - 1
        }else  if(direction === DIRECTION_ENUM.BOTTOM){
          nextX = x + 1
          nextY = y + 1
        }else  if(direction === DIRECTION_ENUM.LEFT){
          nextX = x - 1
          nextY = y + 1
        }else  if(direction === DIRECTION_ENUM.RIGHT){
          nextX = x + 1
          nextY = y - 1
        }

        if((!tileInfo[x][nextY] || tileInfo[x][nextY].turnable) &&
        (!tileInfo[nextX][nextY] || tileInfo[nextX][nextY].turnable) &&
        (!tileInfo[nextX][y] || tileInfo[nextX][y].turnable) ){
          // empty
        }else{
          this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT
          return true
        }
      }

      return false
    }

    onDeath(type:ENTITY_STATE_ENUM){
      this.state = type
    }
}


