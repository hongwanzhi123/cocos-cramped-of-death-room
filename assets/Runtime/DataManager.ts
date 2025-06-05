
import Singleton from "../Base/Singleton"
import { ITile } from "../Levels"
import { PlayerManager } from "../Scripts/Player/PlayerManager"
import { TileManager } from "../Scripts/Tile/TileManager"
import { WoodenSkeletonManager } from "../Scripts/WoodenSkeleton/WoodenSkeletonManager"

export default class DataManager extends Singleton{

static get Instance(){
  return super.GetInstance<DataManager>()
}

  mapInfo:Array<Array<ITile>>
  tileInfo:Array<Array<TileManager>>
  mapRowCount:number = 0
  mapColumnCount:number = 0
  levelIndex:number = 1
  player:PlayerManager
  enemies:WoodenSkeletonManager[]


  reset(){
    this.mapInfo = []
    this.tileInfo = []
    this.enemies = []
    this.player = null
    this.mapRowCount = 0
    this.mapColumnCount = 0
  }

}


