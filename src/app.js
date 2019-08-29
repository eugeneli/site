import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/home/Home";
import MTA from "./mta/";

function AppRouter() {
  return (
    <Router>
        <Route path="/" exact component={Home} />
        <Route path="/mta" exact component={MTA} />
    </Router>
  );
}

export default AppRouter;