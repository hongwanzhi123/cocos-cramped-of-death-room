
import { game, Renderable2D, RenderRoot2D } from "cc"
import Singleton from "../Base/Singleton"
import { createUINode } from "../resources/Utils"
import { DEFAULT_DURATION, DrawManager } from "../UI/DrawManager"


export default class FadeManager extends Singleton{

static get Instance(){
  return super.GetInstance<FadeManager>()
}


  private _fader:DrawManager = null

  get fader(){

    if(this._fader !== null){
      return this._fader
    }
      const root = createUINode()
      root.addComponent(RenderRoot2D)

      const fadeNode = createUINode()
      fadeNode.setParent(root)
      this._fader = fadeNode.addComponent(DrawManager)
      this._fader.init()

      game.addPersistRootNode(root)
      return this._fader

  }

  async fadeIn(duration:number = DEFAULT_DURATION){
    return await this.fader.fadeIn(duration)
  }

   async fadeOut(duration:number = DEFAULT_DURATION){
    return await this.fader.fadeOut(duration)
  }

  mask(){
    return this.fader.mask()
  }

}


