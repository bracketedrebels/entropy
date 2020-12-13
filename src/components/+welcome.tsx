import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useReducer, useTask } from "../model";
import projectActivate from "../model/reducers/project.activate";
import projectCreate from "../model/tasks/project.create";
import UIOperation, { useStatus } from "./ui/UI.operation";
import UITogglerVertical from "./ui/UI.toggler.vertical";
import UIWizardPath from "./ui/UI.wizard.path";
import UIWizardStep from "./ui/UI.wizard.step";

export default () => {
  const history = useHistory();
  const createProject = useTask(projectCreate);
  const activateProject = useReducer(projectActivate);
  const [operation, setOperation] = useState<string>();
  const [status, setStatus] = useStatus();

  const runOperation = useCallback(
    <T,>(operation: () => Promise<T>) => (
      setStatus("inprogress"),
      new Promise((resolve, reject) => {
        operation()
          .then(
            debounce(
              (v: T) => {
                setStatus("success"), resolve(v);
              },
              1000,
              { leading: false, trailing: true }
            )
          )
          .catch(
            debounce(
              (e) => {
                setStatus("failure"), reject(e);
              },
              1000,
              { leading: false, trailing: true }
            )
          );
      })
    ),
    []
  );

  useEffect(() => {
    switch (operation) {
      case "new-project-from-scratch": {
        runOperation(() =>
          createProject({ dependencies: [] }).then((v) => activateProject(v))
        );
        break;
      }
    }
  }, [operation]);

  return (
    <div className="glass-landed m-auto w-2/5 py-6">
      <UIWizardPath back={!operation}>
        <UIWizardStep
          caption="New"
          description="Create new project from different configurations."
        >
          <UIWizardStep
            caption="From Scratch"
            description="Shiny brand new empty project. No dependencies."
            onAboutToChoose={() => (
              setOperation("new-project-from-scratch"), true
            )}
          />
        </UIWizardStep>
      </UIWizardPath>
      <UITogglerVertical active={!!status}>
        <div className="flex flex-row px-6 py-2 justify-between items-center text-white text-opacity-75 bg-black bg-opacity-25">
          <div className="flex flex-col justify-evenly items-start">
            <div className="text-2xl font-secondary">
              {operationTitle(operation)}
            </div>
            <div className="text-sm font-secondary">
              {operationSubtitle(operation)}
            </div>
          </div>
          <UIOperation
            status={status}
            onTransitionEnd={() =>
              status === "success" && history.push("/editor")
            }
          />
        </div>
      </UITogglerVertical>
    </div>
  );
};

const operationTitle = (operationType?: string) => {
  switch (operationType) {
    case "new-project-from-scratch":
      return "Creating new project";
    default:
  }
  return "";
};

const operationSubtitle = (operationType?: string) => {
  switch (operationType) {
    case "new-project-from-scratch":
      return "Using 'From Scratch' template";
    default:
  }
  return "";
};
