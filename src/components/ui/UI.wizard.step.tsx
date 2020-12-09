import { FunctionComponent, ReactElement } from "react";

type component = FunctionComponent<{
  caption: string;
  description?: string;
  onAboutToChoose?: (v: any) => boolean | void;
  children?: ReactElement<component> | ReactElement<component>[];
}>;

export default (() => null) as component;
