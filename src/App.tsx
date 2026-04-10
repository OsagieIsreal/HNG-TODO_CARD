import './App.css'
import TodoCard from './Componets/TodoCard';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <TodoCard 
        title="Sample Todo"
        description="This is a sample todo"
        priority="High"
        status="Pending"
        dueDate={new Date("2024-12-31")}
        tags={["important", "work"]}
      />
    </>
  )
}

export default App
