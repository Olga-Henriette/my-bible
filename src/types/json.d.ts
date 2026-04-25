declare module "*.json" {
  import { BibleData } from "./bible";
  const value: BibleData;
  export default value;
}