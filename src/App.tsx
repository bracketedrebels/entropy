import React, { Suspense, lazy } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { hot } from "react-hot-loader/root";

// routing components...
const Welcome = lazy(() => import("./components/+welcome"));
const Editor = lazy(() => import("./components/+editor"));
// ...routing components

export default hot(
  (
    props: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
  ) => (
    <div
      {...props}
      style={
        {
          "--neumorphic-light-azimuth": 45,
          "--neumorphic-shadow": "rgba(0, 0, 0, .3)",
          "--neumorphic-light": "rgba(240, 240, 255, 1)",
          "--glass-bevel": "2px",
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 flex items-stretch justify-stretch bg-surface transition-all duration-200">
        <div className="absolute inset-0 pointer-events-none neu-convex" />
        <div className="absolute inset-0 bg-repeat-round opacity-25 pointer-events-none" />

        <BrowserRouter>
          <Suspense
            fallback={<div className="m-auto text-shadow">Loading...</div>}
          >
            <Switch>
              <Route exact path="/welcome" component={Welcome} />
              <Route exact path="/editor" component={Editor} />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </div>
    </div>
  )
);
