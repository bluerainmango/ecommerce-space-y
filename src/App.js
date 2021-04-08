import Homepage from "./pages/homepage/homepage.page";
import Planets from "./pages/collections/planetsCollection.page";
import Starships from "./pages/collections/starshipsCollection.page";
import NavBar from "./components/navbar/navbar.component";
import { Switch, Route } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <div className="app">
      <NavBar />
      <Switch>
        <Route path="/planets" component={Planets} />
        <Route path="/starships" component={Starships} />
        <Route exact path="/" component={Homepage} />
        {/* <Route path="/planets" component={}/> */}
      </Switch>
    </div>
  );
}

export default App;
