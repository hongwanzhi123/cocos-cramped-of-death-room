
import { _decorator, AnimationClip, Component, Node,Animation, SpriteFrame } from 'cc';
import { ENTITY_STATE_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import State from '../../Base/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import IdleSubStateMachine from './IdleSubStateMachine';
import AttackSubStateMachine from './AttackSubStateMachine';
import { EntityManager } from '../../Base/EntityManager';
import DeathSubStateMachine from './DeathSubStateMachine';



const { ccclass, property } = _decorator;


@ccclass('WoodenSkeletonStateMachine')
export class WoodenSkeletonStateMachine extends StateMachine {


  async init(){
    this.animationComponet = this.addComponent(Animation)

    this.initParams()
    this.initStateMachine()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }

  initParams(){
    this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION,getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.ATTACK,getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.DEATH,getInitParamsNumber())
  }

  initStateMachine(){
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE,new IdleSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK,new AttackSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH,new DeathSubStateMachine(this))
  }

  initAnimationEvent(){
    this.animationComponet.on(Animation.EventType.FINISHED,()=>{
      const name = this.animationComponet.defaultClip.name
      const whiteList = ['attack']
      if(whiteList.some(v=>name.includes(v))){
        this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
      }
    })
  }

  run(){
    switch(this.currentState){
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
        if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }else if(this.params.get(PARAMS_NAME_ENUM.ATTACK).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
        }else if(this.params.get(PARAMS_NAME_ENUM.DEATH).value){
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
        }else{
          this.currentState = this.currentState
        }
        break;
        default:
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }

}


