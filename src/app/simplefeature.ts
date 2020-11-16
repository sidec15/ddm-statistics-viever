import * as constants from './constants';

const type_label_map = {
  REGION_TYPE_KEY: "region"
  , PROVINCE_TYPE_KEY: "province"
  , MUNICIPALITY_TYPE_KEY: "municipality"
};

export class SimpleFeature {

  /** created as: type_<code> */
  private _id: string;
  private _code: string
  private _type: string;
  private _name: string;

  constructor(code: string, type: string, name: string) {
    this._id = SimpleFeature.createId(code, type);
    this._code = code;
    this._type = type;
    this._name = name;
  }

  get id() { return this._id; }
  get type() { return this._type; }
  get name() { return this._name; }

  get_blob_name(){
    return constants.WEB_RESOURCE_BASE_URL + type_label_map[this._type] + "=" + this._code;
  }

  static compareOnName(o1: SimpleFeature, o2: SimpleFeature): number {
    if (o1._name < o2._name) {
      return -1;
    }
    if (o1._name > o2._name) {
      return 1;
    }
    return 0;
  }

  static createId(code: string, type: string) {
    return type + '_' + code;
  }
}
