import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchTasks } from "../api/tasks";

export default function TasksPage() {
  const { isAuthenticated, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    // If not authenticated, don't make any request to load the tasks.
    if (!isAuthenticated || !token) {
      setTasks([]);
      setLoading(false);
      setError(null);
      return;
    }

    async function loadTasks() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchTasks(token);
        if (!isCancelled) {
          setTasks(data);
        }
      } catch (error) {
        if (!isCancelled) {
          setError(error.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadTasks();

    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated, token]);

  if (loading) {
    return <p>Loading tasks.....</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (tasks.length === 0) {
    return <p>You have no tasks yet.</p>;
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section>
      <h1>TasksPage</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.title} {task.status}
          </li>
        ))}
      </ul>
    </section>
  );
}