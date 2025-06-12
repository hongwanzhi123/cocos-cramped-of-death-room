
import { _decorator, AnimationClip, Component, Node,Animation, SpriteFrame } from 'cc';
import { ENTITY_STATE_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import State from '../../Base/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import IdleSubStateMachine from './IdleSubStateMachine';
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine';
import BlockFrontSubStateMachine from './BlockFrontSubStateMachine';
import { EntityManager } from '../../Base/EntityManager';
import BlockTurnLeftSubStateMachine from './BlockTurnLeftSubStateMachine';
import DeathSubStateMachine from './DeathSubStateMachine';
import AttackSubStateMachine from './AttackSubStateMachine';
import AirDeathSubStateMachine from './AirDeathSubStateMachine';
import TurnRightSubStateMachine from './TurnRightSubStateMachine';
import BlockBackSubStateMachine from './BlockBackSubStateMachine';
import BlockTurnRightSubStateMachine from './BlockTurnRightSubStateMachine';
import BlockLeftSubStateMachine from './BlockLeftSubStateMachine';
import BlockRightSubStateMachine from './BlockRightSubStateMachine';


const { ccclass, property } = _decorator;


@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {


  async init(){
    this.animationComponet = this.addComponent(Animation)

    this.initParams()
    this.initStateMachine()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }

  initParams(){
    this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURNLEFT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURNRIGHT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKFRONT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKBACK,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKLEFT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKRIGHT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION,getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.DEATH,getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.AIRDEATH,getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.ATTACK,getInitParamsNumber())
  }

  initStateMachine(){
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE,new IdleSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT,new TurnLeftSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNRIGHT,new TurnRightSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKFRONT,new BlockFrontSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKBACK,new BlockBackSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKLEFT,new BlockLeftSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKRIGHT,new BlockRightSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT,new BlockTurnLeftSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT,new BlockTurnRightSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH,new DeathSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.AIRDEATH,new AirDeathSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK,new AttackSubStateMachine(this))
  }

  initAnimationEvent(){
    this.animationComponet.on(Animation.EventType.FINISHED,()=>{
      const name = this.animationComponet.defaultClip.name
      const whiteList = ['block','turn','attack']
      if(whiteList.some(v=>name.includes(v))){
        this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
      }
    })
  }

  run(){
    switch(this.currentState){
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKBACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKRIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.AIRDEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
        if(this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
        }else if(this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT)
        }else if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }else if(this.params.get(PARAMS_NAME_ENUM.ATTACK).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
        }else if(this.params.get(PARAMS_NAME_ENUM.DEATH).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        }else if(this.params.get(PARAMS_NAME_ENUM.AIRDEATH).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.AIRDEATH)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKFRONT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKBACK).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKBACK)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKLEFT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKLEFT)
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKRIGHT).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKRIGHT)
        }else{
          this.currentState = this.currentState
        }
        break;
        default:
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }

}


