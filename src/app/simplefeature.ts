import * as constants from './constants';

const foo = "ciao"
const type_label_map = {
  [constants.REGION_TYPE_KEY]: "region"
  , [constants.PROVINCE_TYPE_KEY]: "province"
  , [constants.MUNICIPALITY_TYPE_KEY]: "municipality"
};

const type_order_map = {
  [constants.REGION_TYPE_KEY]: 0
  , [constants.PROVINCE_TYPE_KEY]: 1
  , [constants.MUNICIPALITY_TYPE_KEY]: 2
}

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

  static compareOnType(o1: SimpleFeature, o2: SimpleFeature): number {
    let o1_type = type_order_map[o1._type];
    let o2_type = type_order_map[o2._type];

    if (o1_type < o2_type) {
      return -1;
    }
    if (o1_type > o2_type) {
      return 1;
    }
    return 0;
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

  static compareOnTypeAndName(o1: SimpleFeature, o2: SimpleFeature): number {
    let type_compare = SimpleFeature.compareOnType(o1, o2);
    if(type_compare == 0){
      return SimpleFeature.compareOnName(o1, o2);
    }
    else
      return type_compare;

  }

  static createId(code: string, type: string) {
    return type + '_' + code;
  }
}
