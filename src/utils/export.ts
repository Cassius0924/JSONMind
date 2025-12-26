import type { TreeNode } from '../types';

/**
 * Export JSON file
 */
export function exportJsonFile(rootNode: TreeNode | null, treeToJson: (node: TreeNode) => any) {
  if (!rootNode) return;

  const json = treeToJson(rootNode);
  const text = JSON.stringify(json, null, 2);

  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `export_${Date.now()}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Export PNG image
 */
export async function exportPng(graph: any) {
  try {
    const dataUri = await graph.toPNG();
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `mindmap_${Date.now()}.png`;
    link.click();
  } catch (error) {
    console.error('Failed to export PNG:', error);
  }
}

/**
 * Export SVG image
 */
export async function exportSvg(graph: any) {
  try {
    const svgString = await graph.toSVG();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `mindmap_${Date.now()}.svg`;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export SVG:', error);
  }
}
