import React from "react";
import { Badge } from "@chakra-ui/react";
import type { Priority } from '../types';
import { PRIORITY_CONFIG } from '../constants';

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const { label, color, bgColor } = PRIORITY_CONFIG[priority];
  return (
    <Badge
      data-testid="test-todo-priority"
      bg={bgColor}
      color={color}
      border={`1px solid ${color}44`}
      px={2.5}
      py={0.5}
      borderRadius="full"
      fontSize="xs"
      fontWeight={700}
      letterSpacing="wide"
      textTransform="uppercase"
      fontFamily="inherit"
    >
      {label}
    </Badge>
  );
};

export default PriorityBadge;