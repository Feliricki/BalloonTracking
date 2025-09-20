import { Routes, Route, Outlet, Link } from "react-router-dom";
import MapBox from "./MapBox";
import Resume from "./components/Resume";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<MapBox />} />
                <Route path="resume" element={<Resume />} />
            </Route>
        </Routes>
    );
}

function Layout() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Flight Tracker</Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Map</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/resume">Resume</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <hr />
            <Outlet />
        </div>
    );
}

export default App;
