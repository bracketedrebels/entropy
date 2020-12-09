import { noop } from "ramda-adjunct";
import React, {
  Children,
  Fragment,
  FunctionComponent,
  FunctionComponentElement,
  isValidElement,
  KeyboardEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Key } from "ts-keycode-enum";
import UITogglerVertical from "./UI.toggler.vertical";
import UIWizardStep from "./UI.wizard.step";
import { always } from "ramda";

export default (({ children, back = true }) => {
  const [steps, setSteps] = useState([] as number[]);
  const onBackPressed = useCallback(
    () => setSteps((prev) => prev.slice(0, -1)),
    []
  );

  return (
    <div className="flex flex-col items-stretch">
      <UITogglerVertical active={steps.length > 0 && back}>
        <div
          className="ui/interactable text-2xl font-secondary px-6"
          tabIndex={1}
          onKeyDown={({ which }) => {
            (which === Key.Enter || which === Key.Space) && onBackPressed();
          }}
          onClick={onBackPressed}
        >
          Back
        </div>
      </UITogglerVertical>
      <WizardStepWrapper steps={steps} onPress={setSteps}>
        {children}
      </WizardStepWrapper>
    </div>
  );
}) as FunctionComponent<{
  children:
    | FunctionComponentElement<typeof UIWizardStep>
    | FunctionComponentElement<typeof UIWizardStep>[];
  back?: boolean;
}>;

const truthy = always(true);

const WizardStepWrapper = (({ children, path = [], steps, onPress = noop }) => {
  const kids = useMemo(
    () => Children.toArray(children).filter((v) => isValidElement(v)),
    [children]
  );

  const onStepClick = useCallback(
    (index: number, cb = truthy) => () =>
      Promise.resolve(cb() ? [...path, index] : path).then((v) => onPress(v)),
    [path, onPress]
  );

  const onStepKeyDown = useCallback(
    (index: number, cb = truthy) => ({ which }: KeyboardEvent) =>
      void (
        (which === Key.Enter || which === Key.Space) &&
        Promise.resolve(cb() ? [...path, index] : path).then((v) => onPress(v))
      ),
    [path, onPress]
  );

  return (
    <>
      {kids.map((kid, i) =>
        isValidElement(kid) ? (
          <Fragment key={[...path, i].join(".")}>
            <UITogglerVertical active={steps.join(".") === path.join(".")}>
              <div
                className="ui/interactable"
                tabIndex={1}
                onKeyDown={onStepKeyDown(
                  i,
                  kid.props.onAboutToChoose || truthy
                )}
                onClick={onStepClick(i, kid.props.onAboutToChoose || truthy)}
              >
                <div className="text-2xl font-secondary px-6 pt-2">
                  {kid.props.caption}
                </div>
                {kid.props.description ? (
                  <div className="text-sm font-secondary px-6 pb-2">
                    {kid.props.description}
                  </div>
                ) : null}
              </div>
            </UITogglerVertical>
            <WizardStepWrapper
              steps={steps}
              path={[...path, i]}
              onPress={onPress}
            >
              {kid.props.children}
            </WizardStepWrapper>
          </Fragment>
        ) : null
      )}
    </>
  );
}) as FunctionComponent<{
  onPress: (path: number[]) => void;
  path?: number[];
  steps: number[];
  children:
    | FunctionComponentElement<typeof UIWizardStep>
    | FunctionComponentElement<typeof UIWizardStep>[];
}>;
