export default class Singleton{
  private static _instance: any = null

  static GetInstance<T>():T{
  if(this._instance === null){
    // this指的是调用当前方法的类，创建对象存储到_instance
    this._instance = new this()

  }
return this._instance
}
}
