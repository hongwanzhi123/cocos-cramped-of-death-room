
import { _decorator, Component, game, Node } from 'cc';
import EventManager from '../Runtime/EventManager';
import { CONTROLLER_ENUM, EVENT_ENUM } from '../Enums';
const { ccclass, property } = _decorator;



@ccclass('ShakeManager')
export class ShakeManager extends Component {
    private isShakeing = false
    private oldTime:number
    private oldPos:{x:number,y:number} = {x:0,y:0}

    onLoad(){
      EventManager.Instance.on(EVENT_ENUM.SCREEN_SHAKE,this.onShake,this)
    }

    protected onDestroy(): void {
      EventManager.Instance.off(EVENT_ENUM.SCREEN_SHAKE,this.onShake)
    }

    stop(){
      this.isShakeing = false
    }

    onShake(){
      if(this.isShakeing){
        return
      }
      this.oldTime = game.totalTime
      this.isShakeing = true
      this.oldPos.x = this.node.position.x
      this.oldPos.y = this.node.position.y

    }

    update(){
      if(this.isShakeing){
        const duration = 1000
        const amount = 1.6
        const frequency = 12
        const curSecond = (game.totalTime - this.oldTime)/1000
        const totalSecond = duration/1000
        const offset = amount * Math.sin(frequency/Math.PI*curSecond)

        this.node.setPosition(this.oldPos.x,this.oldPos.y+offset)

        if(curSecond > totalSecond){
          this.isShakeing = false
          this.node.setPosition(this.oldPos.x,this.oldPos.y)
        }


      }
    }

}


