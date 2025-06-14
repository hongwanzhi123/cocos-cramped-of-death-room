import { AnimationClip } from "cc"
import { StateMachine } from "../../Base/StateMachine"
import { SubStateMachine } from "../../Base/SubStateMachine"
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from "../../Enums"
import State from "../../Base/State"
import DirectionSubStateMachine from "../../Base/DirectionSubStateMachine"


const BASE_URL = "texture/player/blockright"

export default class BlockRightSubStateMachine extends DirectionSubStateMachine{
  constructor(fsm:StateMachine,){
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP,new State(fsm,`${BASE_URL}/top`))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM,new State(fsm,`${BASE_URL}/bottom`))
    this.stateMachines.set(DIRECTION_ENUM.LEFT,new State(fsm,`${BASE_URL}/left`))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT,new State(fsm,`${BASE_URL}/right`))
    }



}
