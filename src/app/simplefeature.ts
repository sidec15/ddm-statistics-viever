export class SimpleFeature {
  type: string;
  name: string;

  static compareOnName(o1: SimpleFeature, o2: SimpleFeature): number {
    if (o1.name < o2.name) {
      return -1;
    }
    if (o1.name > o2.name) {
      return 1;
    }
    return 0;
  }
}
