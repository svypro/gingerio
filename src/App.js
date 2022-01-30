import {
	BrowserRouter as Router,
	Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Articles from '../src/components/articles';
import Authors from '../src/components/authors';

function App() {
  return (
		<Router>
		<div className="App">
			<header>
				<a href="/"><img className='headerimg' src="https://assets-global.website-files.com/5cbad46537d84e6404551ac1/5dd5c32acd567c47165e77ed_ginger-logo-header.svg" width="100" alt="Ginger logo" /></a>
				<div className='navbar'>
					<a href="/">Home</a>
					<a href="/articles">Articles</a>
				</div>
			</header>
			<div className='container'>
				<Switch>
				<Route exact path="/">
					<span className='homepage-msg'>Please click on the navigation bar!</span>
				</Route>
				<Route exact path="/articles">
					<Articles />
				</Route>
				<Route exact path="/authors">
            <Authors />
          </Route>
          <Route path="/authors/:name">
            <Authors />
          </Route>
			</Switch>
			</div>
    </div>
		</Router>    
  );
}

export default App;
