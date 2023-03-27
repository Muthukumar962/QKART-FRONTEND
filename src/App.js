import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import  Login  from "./components/Login";
import  Products from "./components/Products";
import Register from "./components/Register";
import { ThemeProvider } from "@emotion/react";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";
import theme from "./theme";
import React from "react";

// import { BrowserRouter as Router, Route } from "react-router-dom";


export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <>
    <div>
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
    
      <React.StrictMode>
      
        <ThemeProvider theme={theme}>
          <Switch>
            <Route exact path="/" component={Products} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path = "/checkout" component= {Checkout}/>
            <Route path = "/thanks" component= {Thanks}/>
          </Switch>
        </ThemeProvider>
      </React.StrictMode>
    </div>
    </>
  );
}

export default App;
