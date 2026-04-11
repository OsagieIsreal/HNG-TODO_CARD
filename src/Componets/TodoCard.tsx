import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Badge,
  VStack,
  HStack,
  VisuallyHidden,
} from "@chakra-ui/react";
import type { TodoCardProps, Status, TimeRemaining } from './types';
import { PRIORITY_CONFIG } from './constants';
import { computeTimeRemaining, formatDueDate } from './utils';
import PriorityBadge from './components/PriorityBadge';
import StatusBadge from './components/StatusBadge';
import TagItem from './components/TagItem';

// ─── Main Component ────────────────────────────────────────────────────────────

const TodoCard: React.FC<TodoCardProps> = ({
  id,
  title,
  description,
  priority,
  status,
  dueDate,
  tags,
  onEdit,
  onDelete,
  onStatusChange,
  dragHandleProps,
}) => {
  const [isCompleted, setIsCompleted]       = useState<boolean>(status === "Done");
  const [currentStatus, setCurrentStatus]   = useState<Status>(status);
  const [timeRemaining, setTimeRemaining]   = useState<TimeRemaining>(() =>
    computeTimeRemaining(dueDate)
  );

  // Auto-update time remaining every 60 seconds
  useEffect(() => {
    const tick = () => setTimeRemaining(computeTimeRemaining(dueDate));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [dueDate]);

  // Sync external status prop changes
  useEffect(() => {
    setCurrentStatus(status);
    setIsCompleted(status === "Done");
  }, [status]);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked    = e.target.checked;
    const nextStatus: Status = checked ? "Done" : "Pending";
    setIsCompleted(checked);
    setCurrentStatus(nextStatus);
    onStatusChange?.(nextStatus);
  };

  const formattedDate  = formatDueDate(dueDate);
  const priorityColor  = PRIORITY_CONFIG[priority].color;

  return (
    <Box
      data-testid="test-todo-card"
      bg="white"
      borderRadius={{ base: "xl", md: "2xl" }}
      p={{ base: 5, md: 6 }}
      w="full"
      maxW="lg"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      position="relative"
      overflow="hidden"
      transition="all 0.2s ease"
      _hover={{
        boxShadow: "lg",
        transform: "translateY(-2px)",
        borderColor: "gray.300",
      }}
      fontFamily="body"
      aria-label={`Todo: ${title}`}
    >
      {/* Priority color bar */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="3px"
        bg={priorityColor}
        borderTopRadius={{ base: "xl", md: "2xl" }}
      />

      <VStack gap={4} align="stretch">
        {/* Header: Checkbox + Title */}
        <Flex align="center" justify="space-between" gap={3}>
          <Flex align="flex-start" gap={3} flex={1}>
            <Box mt={0.5}>
              <input
                id={`toggle-${id}`}
                type="checkbox"
                checked={isCompleted}
                onChange={handleToggle}
                data-testid="test-todo-complete-toggle"
                aria-label={`Mark "${title}" as complete`}
                style={{
                  width: "20px",
                  height: "20px",
                  accentColor: priorityColor,
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              />
              <VisuallyHidden>
                Mark "{title}" as complete
              </VisuallyHidden>
            </Box>
            <Text
              as="h2"
              fontFamily="heading"
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight={700}
              color={isCompleted ? "gray.500" : "gray.900"}
              m={0}
              lineHeight={1.3}
              textDecoration={isCompleted ? "line-through" : "none"}
              transition="all 0.2s ease"
              wordBreak="break-word"
              data-testid="test-todo-title"
              flex="1"
            >
              {title}
            </Text>
          </Flex>
          {dragHandleProps ? (
            <Button
              size="sm"
              variant="ghost"
              colorScheme="gray"
              aria-label="Drag to reorder todo"
              style={{ cursor: "grab", minWidth: "auto", padding: "8px 10px" }}
              {...dragHandleProps.attributes}
              {...dragHandleProps.listeners}
            >
              ☰
            </Button>
          ) : null}
        </Flex>

        {/* Description */}
        <Text
          fontSize="sm"
          color="gray.600"
          lineHeight={1.6}
          fontWeight={300}
          wordBreak="break-word"
          data-testid="test-todo-description"
        >
          {description}
        </Text>

        {/* Priority + Status badges */}
        <HStack gap={2} wrap="wrap">
          <PriorityBadge priority={priority} />
          <StatusBadge status={currentStatus} />
        </HStack>

        {/* Due Date + Time Remaining */}
        <Flex align="center" gap={2.5} wrap="wrap">
          <Flex align="center" gap={1.5} fontSize="0.78rem" fontWeight={500} color="gray.500">
            <Text fontSize="0.9rem">📅</Text>
            <Text as="span" data-testid="test-todo-due-date">
              Due {formattedDate}
            </Text>
          </Flex>

          <Badge
            fontSize="xs"
            fontWeight={600}
            letterSpacing="wide"
            px={3}
            py={1}
            borderRadius="full"
            bg={timeRemaining.isOverdue ? "red.100" : "blue.100"}
            color={timeRemaining.isOverdue ? "red.700" : "blue.700"}
            border="1px solid"
            borderColor={timeRemaining.isOverdue ? "red.200" : "blue.200"}
            data-testid="test-todo-time-remaining"
            aria-live="polite"
            aria-atomic="true"
          >
            {timeRemaining.label}
          </Badge>
        </Flex>

        {/* Tags */}
        <HStack gap={2} wrap="wrap" data-testid="test-todo-tags" role="list" aria-label="Tags">
          {tags.map((tag) => (
            <TagItem key={tag} tag={tag} />
          ))}
        </HStack>

        {/* Action Buttons */}
        <Flex gap={2} justify={{ base: "stretch", md: "flex-end" }} direction={{ base: "column", md: "row" }}>
          <Button
            size="sm"
            variant="outline"
            colorScheme="blue"
            bg="blue.50"
            borderColor="blue.200"
            _hover={{ bg: "blue.100", shadow: "sm" }}
            fontSize="sm"
            fontWeight={600}
            px={6}
            py={2}
            borderRadius="lg"
            onClick={(event) => {
              event.stopPropagation();
              onEdit?.();
            }}
            data-testid="test-todo-edit-button"
            data-dnd-kit-no-dnd="true"
            aria-label={`Edit task: ${title}`}
            flex={{ base: 1, md: "none" }}
            transition="all 0.15s ease"
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            colorScheme="red"
            bg="red.50"
            borderColor="red.200"
            _hover={{ bg: "red.100", shadow: "sm" }}
            fontSize="sm"
            fontWeight={600}
            px={6}
            py={2}
            borderRadius="lg"
            onClick={(event) => {
              event.stopPropagation();
              onDelete?.();
            }}
            data-testid="test-todo-delete-button"
            data-dnd-kit-no-dnd="true"
            aria-label={`Delete task: ${title}`}
            flex={{ base: 1, md: "none" }}
            transition="all 0.15s ease"
          >
            Delete
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default TodoCard;
