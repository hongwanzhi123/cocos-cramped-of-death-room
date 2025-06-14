import { AnimationClip } from "cc"
import { StateMachine } from "../../Base/StateMachine"
import { SubStateMachine } from "../../Base/SubStateMachine"
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM, SPIKES_COUNT_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM } from "../../Enums"
import State from "../../Base/State"

import SpikesSubStateMachine from "./SpikesSubStateMachine"


const BASE_URL = "texture/spikes/spikesfour"

export default class SpikesFourSubStateMachine extends SpikesSubStateMachine{
  constructor(fsm:StateMachine,){
    super(fsm)
    this.stateMachines.set(SPIKES_COUNT_ENUM.ZERO,new State(fsm,`${BASE_URL}/zero`))
    this.stateMachines.set(SPIKES_COUNT_ENUM.ONE,new State(fsm,`${BASE_URL}/one`))
    this.stateMachines.set(SPIKES_COUNT_ENUM.TWO,new State(fsm,`${BASE_URL}/two`))
    this.stateMachines.set(SPIKES_COUNT_ENUM.THREE,new State(fsm,`${BASE_URL}/three`))
    this.stateMachines.set(SPIKES_COUNT_ENUM.FOUR,new State(fsm,`${BASE_URL}/four`))
    this.stateMachines.set(SPIKES_COUNT_ENUM.FIVE,new State(fsm,`${BASE_URL}/five`))

    }

}
