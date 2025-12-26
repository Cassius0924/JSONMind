import { NodeType, type TreeNode, type ContainerNode, type PrimitiveNode } from '../types/node';
import { generateUUID } from '../utils/uuid';

/**
 * Parse result interface
 */
export interface ParseResult {
  success: boolean;
  root?: TreeNode;
  error?: string;
}

/**
 * Convert raw JSON to internal data model tree
 * @param jsonText - JSON string
 * @returns Root node or error message
 */
export function parseJsonToTree(jsonText: string): ParseResult {
  try {
    const rawData = JSON.parse(jsonText);
    const root = convertToNode(rawData, 'root', []);
    return { success: true, root };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid JSON'
    };
  }
}

/**
 * Recursive conversion function (core algorithm)
 */
export function convertToNode(
  value: any,
  key: string,
  path: string[]
): TreeNode {
  const id = generateUUID();
  const currentPath = [...path, key];

  // Check data type
  if (value === null) {
    return {
      id,
      type: NodeType.NULL,
      key,
      path: currentPath,
      value: null
    } as PrimitiveNode;
  }

  if (Array.isArray(value)) {
    return {
      id,
      type: NodeType.ARRAY,
      key,
      path: currentPath,
      children: value.map((item, index) =>
        convertToNode(item, `[${index}]`, currentPath)
      )
    } as ContainerNode;
  }

  if (typeof value === 'object') {
    return {
      id,
      type: NodeType.OBJECT,
      key,
      path: currentPath,
      children: Object.entries(value).map(([k, v]) =>
        convertToNode(v, k, currentPath)
      )
    } as ContainerNode;
  }

  // Basic types
  const type = typeof value === 'string' ? NodeType.STRING :
               typeof value === 'number' ? NodeType.NUMBER :
               NodeType.BOOLEAN;

  return {
    id,
    type,
    key,
    path: currentPath,
    value
  } as PrimitiveNode;
}

/**
 * Infer type from input string
 */
export function inferType(input: string): { value: any; type: NodeType } {
  const trimmed = input.trim();

  // Treat empty or whitespace-only strings as plain strings
  if (trimmed === '') {
    return { value: input, type: NodeType.STRING };
  }

  // Check boolean values
  if (input === 'true') {
    return { value: true, type: NodeType.BOOLEAN };
  }
  if (input === 'false') {
    return { value: false, type: NodeType.BOOLEAN };
  }

  // Check null
  if (input === 'null') {
    return { value: null, type: NodeType.NULL };
  }

  // Try to parse as number
  const num = Number(input);
  if (!isNaN(num) && trimmed !== '') {
    return { value: num, type: NodeType.NUMBER };
  }

  // Default to string
  return { value: input, type: NodeType.STRING };
}
