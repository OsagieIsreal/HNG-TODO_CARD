import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Container,
  Heading,
  Flex,
} from '@chakra-ui/react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TodoCard from './Componets/TodoCard';
import type { Todo, Priority, Status } from './Componets/types';
import { generateId } from './Componets/utils';

interface SortableTodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
}

const SortableTodoCard: React.FC<SortableTodoCardProps> = ({
  todo,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box ref={setNodeRef} style={style}>
      <TodoCard
        {...todo}
        dragHandleProps={{ attributes, listeners }}
        onEdit={() => onEdit(todo)}
        onDelete={() => onDelete(todo.id)}
        onStatusChange={(status) => onStatusChange(todo.id, status)}
      />
    </Box>
  );
};

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      title: 'Welcome to Todo App',
      description: 'This is a sample todo to get you started. Try adding, editing, or deleting todos!',
      priority: 'Medium',
      status: 'Pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      tags: ['welcome', 'sample'],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium' as Priority,
    dueDate: '',
    tags: [] as string[],
    tagInput: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: [],
      tagInput: '',
    });
    setEditingTodo(null);
    setShowForm(false);
  }, []);

  const handleAddTodo = useCallback(() => {
    resetForm();
    setShowForm(true);
  }, [resetForm]);

  const handleEditTodo = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.dueDate.toISOString().split('T')[0],
      tags: [...todo.tags],
      tagInput: '',
    });
    setShowForm(true);
  }, []);

  const handleDeleteTodo = useCallback((id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this todo?');
    if (confirmed) {
      setTodos(prev => prev.filter(todo => todo.id !== id));
    }
  }, []);

  const handleStatusChange = useCallback((id: string, status: Status) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, status } : todo
    ));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    const todoData: Todo = {
      id: editingTodo?.id || generateId(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: editingTodo?.status || 'Pending',
      dueDate: new Date(formData.dueDate),
      tags: formData.tags,
    };

    if (editingTodo) {
      setTodos(prev => prev.map(todo =>
        todo.id === editingTodo.id ? todoData : todo
      ));
    } else {
      setTodos(prev => [...prev, todoData]);
    }

    resetForm();
  }, [formData, editingTodo, resetForm]);

  const handleAddTag = useCallback(() => {
    const tag = formData.tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
        tagInput: '',
      }));
    }
  }, [formData.tagInput, formData.tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  return (
    <Container maxW="4xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="xl" mb={2} color="gray.800">
            Todo App
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Organize your tasks with style
          </Text>
        </Box>

        {/* Add Todo Button */}
        <Flex justify="center">
          <Button
            size="lg"
            colorScheme="blue"
            onClick={handleAddTodo}
            px={8}
            py={3}
            borderRadius="full"
            shadow="md"
            _hover={{ shadow: "lg", transform: "translateY(-1px)" }}
            transition="all 0.2s"
          >
            + Add Todo
          </Button>
        </Flex>

        {/* Add/Edit Form */}
        {showForm && (
          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            shadow="md"
          >
            <form onSubmit={handleSubmit}>
              <VStack gap={4}>
                <Box width="full">
                  <Text fontWeight="medium" mb={2}>Title *</Text>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter todo title"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />
                </Box>

                <Box width="full">
                  <Text fontWeight="medium" mb={2}>Description</Text>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter todo description"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical',
                    }}
                  />
                </Box>

                <HStack gap={4} width="full">
                  <Box flex={1}>
                    <Text fontWeight="medium" mb={2}>Priority</Text>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </Box>

                  <Box flex={1}>
                    <Text fontWeight="medium" mb={2}>Due Date</Text>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />
                  </Box>
                </HStack>

                <Box width="full">
                  <Text fontWeight="medium" mb={2}>Tags</Text>
                  <HStack gap={2} wrap="wrap" mb={2}>
                    {formData.tags.map((tag) => (
                      <Box
                        key={tag}
                        bg="blue.100"
                        color="blue.800"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="sm"
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'inherit',
                            cursor: 'pointer',
                            fontSize: '16px',
                            lineHeight: 1,
                          }}
                        >
                          ×
                        </button>
                      </Box>
                    ))}
                  </HStack>
                  <HStack gap={2}>
                    <input
                      type="text"
                      value={formData.tagInput}
                      onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />
                    <Button type="button" onClick={handleAddTag} colorScheme="blue" variant="outline" size="sm">
                      Add
                    </Button>
                  </HStack>
                </Box>

                <HStack gap={3} width="full" justify="flex-end">
                  <Button variant="ghost" onClick={resetForm} size="sm">
                    Cancel
                  </Button>
                  <Button type="submit" colorScheme="blue" size="sm">
                    {editingTodo ? 'Update' : 'Add'} Todo
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Box>
        )}

        {/* Todos List */}
        {todos.length === 0 ? (
          <Box textAlign="center" py={12}>
            <Text fontSize="xl" color="gray.500" mb={4}>
              No todos yet
            </Text>
            <Text color="gray.400">
              Click "Add Todo" to get started!
            </Text>
          </Box>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <VStack gap={6} align="stretch">
                {todos.map((todo) => (
                  <SortableTodoCard
                    key={todo.id}
                    todo={todo}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteTodo}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </VStack>
            </SortableContext>
          </DndContext>
        )}
      </VStack>
    </Container>
  );
};

export default App;
