export class SimpleFeature {
  /** created as: type_<code> */
  // tslint:disable-next-line: variable-name
  private _id: string;
  // tslint:disable-next-line: variable-name
  private _type: string;
  // tslint:disable-next-line: variable-name
  private _name: string;

  constructor(code: string, type: string, name: string) {
    this._id = SimpleFeature.createId(code, type);
    this._type = type;
    this._name = name;
  }

  get id() { return this._id; }
  get type() { return this._type; }
  get name() { return this._name; }

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
