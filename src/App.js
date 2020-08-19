import React, { useState } from "react";
import { render } from "react-dom";
import SearchParams from "./SearchParams";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import Details from "./Details";
import ThemeContext from "./ThemeContext";

const App = () => {
  const themeHook = useState("darkblue");
  return (
    <React.StrictMode>
      <ThemeContext.Provider value={themeHook}>
        <div>
          <Router basename="/adopt-me">
            <header>
              <Link to="/">Adopt Me!</Link>
            </header>
            <Route exact={true} path="/" component={SearchParams} />
            <Route exact={true} path="/details/:id" component={Details} />
          </Router>
        </div>
      </ThemeContext.Provider>
    </React.StrictMode>
  );
};

render(<App />, document.getElementById("root"));
