
import { _decorator, Component, ForwardPipeline, isCustomTargetModifier, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import levels from '../../Levels';
import { TILE_TYPE_ENUM } from '../../Enums';

export const TILE_WIDTH = 55
export const TILE_HEIGH = 55

@ccclass('TileManager')
export class TileManager extends Component {
    type:TILE_TYPE_ENUM
    moveable:boolean
    turnable:boolean

    init(type:TILE_TYPE_ENUM,spriteFrame:SpriteFrame,i:number,j:number){
          this.type = type
          if(this.type === TILE_TYPE_ENUM.WALL_ROW ||
             this.type === TILE_TYPE_ENUM.WALL_COLUMN ||
             this.type === TILE_TYPE_ENUM.WALL_LEFT_TOP ||
             this.type === TILE_TYPE_ENUM.WALL_LEFT_BOTTOM ||
             this.type === TILE_TYPE_ENUM.WALL_RIGHT_TOP ||
             this.type === TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM
          ){
            this.moveable = false
            this.turnable = false
          }else if(this.type === TILE_TYPE_ENUM.CLIFF_CENTER ||
             this.type === TILE_TYPE_ENUM.CLIFF_LEFT ||
             this.type === TILE_TYPE_ENUM.CLIFF_RIGHT
            ){
              this.moveable = false
              this.turnable = true
          }else if(this.type === TILE_TYPE_ENUM.FLOOR
          ){
            this.moveable = true
            this.turnable = true

          }
          const sprite = this.addComponent(Sprite);

          sprite.spriteFrame = spriteFrame
          const transform = this.getComponent(UITransform)
          transform.setContentSize(TILE_WIDTH,TILE_HEIGH)

          this.node.setPosition(i * TILE_WIDTH,-j * TILE_HEIGH)

        }

      }



