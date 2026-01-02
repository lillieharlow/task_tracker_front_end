import { Link } from "react-router";

export default function Navbar(){
    return(
        <header>
            <h1>Task Tracker</h1>
            <nav>
                <Link to="/">Home</Link> {" "}
                <Link to="/tasks">Tasks</Link> {" "}
                <Link to="/login">Login</Link> {" "}
                <Link to="/register">Register</Link> {" "}
            </nav>
        </header>
    )
}