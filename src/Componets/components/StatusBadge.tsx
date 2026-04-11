import React from "react";
import { Badge } from "@chakra-ui/react";
import type { Status } from '../types';
import { STATUS_CONFIG } from '../constants';

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const { label, color, bgColor } = STATUS_CONFIG[status];
  return (
    <Badge
      data-testid="test-todo-status"
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

export default StatusBadge;