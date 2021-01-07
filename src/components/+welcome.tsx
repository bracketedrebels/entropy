import { PromiseOf } from "Any/_api";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useReducer, useTask } from "../model";
import projectActivate from "../model/reducers/project.activate";
import projectCache from "../model/reducers/project.cache";
import projectCreate from "../model/tasks/project.create";
import projectLoad from "../model/tasks/project.load";
import projectsList from "../model/tasks/projects.list";
import type { TaskReturnType } from "../model/types";
import UIOperation, { useStatus } from "./ui/UI.operation";
import UITogglerVertical from "./ui/UI.toggler.vertical";
import UIWizardPath from "./ui/UI.wizard.path";
import UIWizardStep from "./ui/UI.wizard.step";

export default () => {
  const history = useHistory();
  const createProject = useTask(projectCreate);
  const activateProject = useReducer(projectActivate);
  const loadProject = useTask(projectLoad);
  const loadProjectsList = useTask(projectsList);
  const cacheProject = useReducer(projectCache);

  const [operation, setOperation] = useState<{
    code: Operation;
    payload?: any;
  }>();
  const [status, setStatus] = useStatus();
  const [projectsToLoad, setProjectsToLoad] = useState(
    [] as TaskReturnType<typeof projectsList>
  );

  useEffect(() => void loadProjectsList().then(setProjectsToLoad), []);

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
    switch (operation?.code) {
      case Operation.create: {
        runOperation(() => createProject().then((v) => activateProject(v)));
        break;
      }
      case Operation.load: {
        runOperation(() =>
          loadProject(operation.payload).then((v) => {
            activateProject(v.id);
            cacheProject(v);
          })
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
              setOperation({
                code: Operation.create,
                payload: OperationCreate.fromScratch,
              }),
              true
            )}
          />
        </UIWizardStep>
        <UIWizardStep caption="Load" description="Load existing project">
          {projectsToLoad.map(({ name, url }) => (
            <UIWizardStep
              caption={name}
              description={url}
              onAboutToChoose={() => (
                setOperation({
                  code: Operation.load,
                  payload: url,
                }),
                true
              )}
            />
          ))}
        </UIWizardStep>
      </UIWizardPath>
      <UITogglerVertical active={!!status}>
        <div className="flex flex-row px-6 py-2 justify-between items-center text-white text-opacity-75 bg-black bg-opacity-25">
          <OperationDescriptor
            code={operation?.code}
            payload={operation?.payload}
          />
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

const OperationDescriptor = ({
  code,
  payload,
}: {
  code: Operation | undefined;
  payload: any;
}) => (
  <div className="flex flex-col justify-evenly items-start">
    <div className="text-2xl font-secondary">
      {code === Operation.create
        ? "Creating new project"
        : code === Operation.load
        ? "Loading project"
        : "Something is happening"}
    </div>
    <div className="text-sm font-secondary">
      {code === Operation.create ? (
        payload === OperationCreate.fromScratch ? (
          "Using 'From Scratch' template"
        ) : (
          ""
        )
      ) : code === Operation.load ? (
        <>{payload}</>
      ) : (
        ""
      )}
    </div>
  </div>
);

const enum Operation {
  create,
  load,
}
const enum OperationCreate {
  fromScratch,
}
