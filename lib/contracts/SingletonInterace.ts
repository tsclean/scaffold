import { SingletonTypes } from "types/SingletonTypes";

export interface SingletonInterface {
  generate(params: SingletonTypes): void;
}
