import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Todo = {
  id: number
  text: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

const STORAGE_KEY = 'itmangement-todos'

function App() {
  const [draft, setDraft] = useState('')
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      return saved ? (JSON.parse(saved) as Todo[]) : []
    } catch {
      return []
    }
  })
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const visibleTodos = useMemo(() => {
    if (filter === 'active') {
      return todos.filter((todo) => !todo.completed)
    }

    if (filter === 'completed') {
      return todos.filter((todo) => todo.completed)
    }

    return todos
  }, [filter, todos])

  const remainingCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.length - remainingCount

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedText = draft.trim()
    if (!trimmedText) {
      return
    }

    setTodos((current) => [
      {
        id: Date.now() + Math.random(),
        text: trimmedText,
        completed: false,
      },
      ...current,
    ])
    setDraft('')
  }

  const toggleTodo = (id: number) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const deleteTodo = (id: number) => {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos((current) => current.filter((todo) => !todo.completed))
  }

  return (
    <div className="todo-app-shell">
      <div className="todo-card">
        <header className="todo-header">
          <div>
            <p className="eyebrow">ITMANGEMENT.COM</p>
            <h1>To-Do Board</h1>
          </div>
          <div className="summary-badge" aria-live="polite">
            <span>Remaining</span>
            <strong>{remainingCount}</strong>
          </div>
        </header>

        <form className="todo-form" onSubmit={addTodo}>
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add a new task"
            aria-label="Add a new task"
          />
          <button type="submit">Add task</button>
        </form>

        <div className="todo-toolbar" aria-label="Task filters">
          {(['all', 'active', 'completed'] as Filter[]).map((option) => (
            <button
              key={option}
              type="button"
              className={filter === option ? 'filter-button active' : 'filter-button'}
              onClick={() => setFilter(option)}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        <div className="todo-stats">
          <span>{todos.length} total</span>
          <span>{completedCount} done</span>
        </div>

        <ul className="todo-list">
          {visibleTodos.length === 0 ? (
            <li className="empty-state">
              <p>No tasks here yet.</p>
              <span>Add your first item to get started.</span>
            </li>
          ) : (
            visibleTodos.map((todo) => (
              <li key={todo.id} className={todo.completed ? 'todo-item complete' : 'todo-item'}>
                <label className="todo-check">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span>{todo.text}</span>
                </label>
                <button type="button" className="delete-button" onClick={() => deleteTodo(todo.id)}>
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="todo-footer">
          <button type="button" className="clear-button" onClick={clearCompleted} disabled={completedCount === 0}>
            Clear completed
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
