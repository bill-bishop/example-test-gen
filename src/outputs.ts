import { promises as fs } from 'fs';
import path from 'path';

/**
 * Get the outputs directory path
 */
function getOutputsDir(cwd: string = process.cwd()): string {
  return path.resolve(cwd, 'outputs');
}

/**
 * Box drawing characters for beautiful frames
 */
const BOX = {
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
  leftT: '├',
  rightT: '┤',
};

/**
 * Color codes for terminal output
 */
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

/**
 * Options for rendering output
 */
export interface RenderOptions {
  /** Variables to substitute in the template */
  variables?: Record<string, string>;
  /** Width of the frame (auto if not specified) */
  width?: number;
  /** Title for the frame */
  title?: string;
  /** Color theme for the frame */
  theme?: 'default' | 'error' | 'success' | 'info' | 'warning';
}

/**
 * Theme color mappings
 */
const THEME_COLORS = {
  default: { border: COLORS.cyan, title: COLORS.bright + COLORS.cyan, text: COLORS.reset },
  error: { border: COLORS.red, title: COLORS.bright + COLORS.red, text: COLORS.reset },
  success: { border: COLORS.green, title: COLORS.bright + COLORS.green, text: COLORS.reset },
  info: { border: COLORS.blue, title: COLORS.bright + COLORS.blue, text: COLORS.reset },
  warning: { border: COLORS.yellow, title: COLORS.bright + COLORS.yellow, text: COLORS.reset },
};

/**
 * Read an output file from the outputs directory
 */
export async function readOutputFile(filename: string, cwd?: string): Promise<string> {
  const filePath = path.join(getOutputsDir(cwd), filename);
  return fs.readFile(filePath, 'utf-8');
}

/**
 * Substitute variables in a template string
 * Format: {{variableName}}
 */
export function substituteVariables(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, name) => {
    return variables[name] ?? match;
  });
}

/**
 * Wrap text to fit within a specified width
 */
function wrapText(text: string, width: number): string[] {
  const lines: string[] = [];
  const rawLines = text.split('\n');

  for (const line of rawLines) {
    if (line.length <= width) {
      lines.push(line);
      continue;
    }

    let currentLine = '';
    const words = line.split(' ');

    for (const word of words) {
      if ((currentLine + word).length > width) {
        if (currentLine) {
          lines.push(currentLine.trim());
          currentLine = '';
        }
        // Handle very long words
        if (word.length > width) {
          for (let i = 0; i < word.length; i += width) {
            lines.push(word.slice(i, i + width));
          }
        } else {
          currentLine = word + ' ';
        }
      } else {
        currentLine += word + ' ';
      }
    }

    if (currentLine) {
      lines.push(currentLine.trim());
    }
  }

  return lines;
}

/**
 * Create a beautiful framed box around content
 */
function frameContent(content: string, width: number, title?: string, theme: RenderOptions['theme'] = 'default'): string {
  const colors = THEME_COLORS[theme ?? 'default'];
  const lines = wrapText(content, width - 4); // Account for borders and padding

  let result = '';

  // Top border with optional title
  if (title) {
    const titleLen = title.length;
    const leftWidth = Math.max(2, Math.floor((width - titleLen - 2) / 2));
    const rightWidth = width - titleLen - leftWidth - 2;
    result += colors.border + BOX.topLeft + BOX.horizontal.repeat(leftWidth) + ' ' +
              colors.title + title + colors.border + ' ' +
              BOX.horizontal.repeat(rightWidth) + BOX.topRight + COLORS.reset + '\n';
  } else {
    result += colors.border + BOX.topLeft + BOX.horizontal.repeat(width - 2) + BOX.topRight + COLORS.reset + '\n';
  }

  // Content lines
  for (const line of lines) {
    const padding = width - 4 - line.length;
    result += colors.border + BOX.vertical + ' ' + colors.text + line +
              ' '.repeat(padding) + ' ' + colors.border + BOX.vertical + COLORS.reset + '\n';
  }

  // Bottom border
  result += colors.border + BOX.bottomLeft + BOX.horizontal.repeat(width - 2) + BOX.bottomRight + COLORS.reset;

  return result;
}

/**
 * Render an output file with optional framing and variable substitution
 */
export async function renderOutput(filename: string, options: RenderOptions = {}, cwd?: string): Promise<string> {
  let content = await readOutputFile(filename, cwd);

  // Substitute variables
  if (options.variables) {
    content = substituteVariables(content, options.variables);
  }

  // Calculate width if not specified
  const contentWidth = Math.max(
    ...content.split('\n').map(line => line.length),
    options.title ? options.title.length + 4 : 0
  );
  const width = Math.min(Math.max(contentWidth + 4, 50), 100);

  return frameContent(content, width, options.title, options.theme);
}

/**
 * Print output directly to console
 */
export async function printOutput(filename: string, options: RenderOptions = {}, cwd?: string): Promise<void> {
  const rendered = await renderOutput(filename, options, cwd);
  console.log(rendered);
}

/**
 * Print error output and exit
 */
export async function printErrorAndExit(filename: string, options: RenderOptions = {}, exitCode = 1, cwd?: string): Promise<void> {
  const rendered = await renderOutput(filename, { ...options, theme: 'error' }, cwd);
  console.error(rendered);
  process.exit(exitCode);
}

/**
 * Helper to format a list of errors for display
 */
export function formatErrorList(errors: string[]): string {
  return errors.map((err, i) => `  ${i + 1}. ${err}`).join('\n');
}

/**
 * Helper to format a sample config file for display in errors
 */
export function formatSampleConfig(): string {
  return `export default {
  include: ['src/**/*.ts'],
  exclude: ['src/**/*.test.ts'],
  mapper: 'vitest'  // or 'jest' or a custom function
};`;
}
