export async function fetchTasks(token) {
    const response = await fetch(`https://jun25-t2-task-tracker-api.onrender.com/api/v1/tasks`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
    });

    if(!response.ok) {
        const data = await response.json();
        const message = data.error || data.name || data.message || 'Failed to load tasks';
        throw new Error(message);
    }

    return response.json();
}