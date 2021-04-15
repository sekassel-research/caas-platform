export interface Artifact {
  readonly id?: string;
  readonly name: string;
  readonly version: string;
  readonly dockerImage: string;
  readonly history?: Artifact[] | string[];
  readonly certificate?: string; // TODO: Change later to the object or a id string
}
