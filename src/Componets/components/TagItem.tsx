import React from "react";
import { Tag } from "@chakra-ui/react";

const TagItem: React.FC<{ tag: string }> = ({ tag }) => (
  <Tag.Root
    bg="gray.100"
    color="gray.700"
    borderRadius="md"
    px={2.5}
    py={1}
    fontSize="xs"
    fontWeight={600}
    letterSpacing="wide"
    whiteSpace="nowrap"
    _hover={{ bg: "gray.200" }}
  >
    <Tag.Label>#{tag}</Tag.Label>
  </Tag.Root>
);

export default TagItem;