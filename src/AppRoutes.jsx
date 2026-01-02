import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import TaskDetailPage from "./pages/TaskDetailPage";

export default function AppRoutes(){
    return(
        <Routes>
            <Route path='/' element={ <HomePage /> } />
            <Route path='/register' element={ <RegisterPage /> } />
            <Route path='/login' element={ <LoginPage /> } />
            <Route path='/tasks' element={ <TasksPage /> } />
            <Route path='/tasks/:id' element={ <TaskDetailPage /> } />
            <Route path='*' element={ <h1>404 Not Found</h1> } />
        </Routes>
    )
}