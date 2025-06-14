
import { _decorator, AnimationClip, Component, Node,Animation, SpriteFrame } from 'cc';
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM } from '../../Enums';
import State from '../../Base/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import SpikesOneSubStateMachine from './SpikesOneSubStateMachine';
import SpikesTwoSubStateMachine from './SpikesTwoSubStateMachine';
import SpikesThreeSubStateMachine from './SpikesThreeSubStateMachine';
import SpikesFourSubStateMachine from './SpikesFourSubStateMachine';
import { SpikesManager } from './SpikesManager';




const { ccclass, property } = _decorator;


@ccclass('SpikesStateMachine')
export class SpikesStateMachine extends StateMachine {


  async init(){
    this.animationComponet = this.addComponent(Animation)

    this.initParams()
    this.initStateMachine()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }

  initParams(){

    this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT,getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT,getInitParamsNumber())
  }

  initStateMachine(){
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_ONE,new SpikesOneSubStateMachine(this))
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_TWO,new SpikesTwoSubStateMachine(this))
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_THREE,new SpikesThreeSubStateMachine(this))
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_FOUR,new SpikesFourSubStateMachine(this))

  }

  initAnimationEvent(){
    this.animationComponet.on(Animation.EventType.FINISHED,()=>{
      const name = this.animationComponet.defaultClip.name
      const value = this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)
      if(value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE && name.includes('spikesone/two') ||
        value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_TWO && name.includes('spikestwo/three') ||
        value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_THREE&& name.includes('spikesthree/four') ||
        value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_FOUR && name.includes('spikesfour/five')  ){
          this.node.getComponent(SpikesManager).backZero()
        }
      // const whiteList = ['attack']
      // if(whiteList.some(v=>name.includes(v))){
      //   this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
      // }
    })
  }

  run(){
    const value = this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)
    switch(this.currentState){
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE):
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_TWO):
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_THREE):
      case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_FOUR):

        if(value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE ){
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
        }else if(value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_TWO ){
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_TWO)}
          else if(value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_THREE ){
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_THREE)}
          else if(value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_FOUR ){
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_FOUR)}
          else{
          this.currentState = this.currentState
        }
        break;
        default:
          this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
    }
  }

}


