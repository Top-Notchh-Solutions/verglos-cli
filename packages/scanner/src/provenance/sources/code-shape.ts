import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  ProvenanceSignal,
  ProvenanceSignalSource,
} from "../types.js";

/**
 * Medium-tier signal from design §4, weight 0.4.
 *
 * AI-generated code has characteristic surface features:
 *  - uniform comment density,
 *  - docstrings on every function,
 *  - zero formatting drift (very consistent indent + line lengths),
 *  - no dead code, no TODO/FIXME.
 *
 * None of these are conclusive alone — humans also write clean
 * code — which is why the weight is 0.4 and the aggregator can
 * only push a file to `ai-likely` when this stacks with other
 * signals. This source only fires when multiple sub-metrics agree,
 * otherwise it stays silent to keep noise down.
 *
 * Heuristic — the report always says so. Users who disagree see
 * exactly which sub-metrics fired in the signal detail.
 */

const SUPPORTED_EXT = /\.(?:m?[jt]sx?|mts|cts)$/;
const MIN_LINES = 40;

interface CodeShapeMetrics {
  totalLines: number;
  codeLines: number;
  commentDensity: number; // 0..1
  docstringedFunctions: number;
  totalFunctions: number;
  docstringCoverage: number; // 0..1 (or NaN if no functions)
  todoFixmeCount: number;
  indentStdev: number;
}

const FUNCTION_PATTERN =
  /^\s*(?:export\s+(?:async\s+|default\s+)?)?(?:async\s+)?(?:function\s+[A-Za-z_$][\w$]*|(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*(?:async\s*)?(?:function|\([^)]*\)\s*=>)|[A-Za-z_$][\w$]*\s*(?::\s*[^=]+)?\s*=\s*(?:async\s*)?\([^)]*\)\s*=>)/;
const COMMENT_LINE = /^\s*(?:\/\/|\/\*|\*|\*\/)/;
const DOCSTRING_ABOVE = /(?:^|\n)\s*(?:\/\*\*[^]*?\*\/|(?:\/\/[^\n]*\n){2,})\s*$/;

function stdev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function computeMetrics(content: string): CodeShapeMetrics {
  const rawLines = content.split("\n");
  const totalLines = rawLines.length;

  let codeLines = 0;
  let commentLines = 0;
  const indents: number[] = [];
  let totalFunctions = 0;
  let docstringedFunctions = 0;
  let todoFixmeCount = 0;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i] ?? "";
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;

    if (COMMENT_LINE.test(line)) {
      commentLines++;
    } else {
      codeLines++;
      const leadingSpaces = line.match(/^(\s*)/)?.[1] ?? "";
      indents.push(leadingSpaces.length);
    }

    if (/\b(?:TODO|FIXME|XXX|HACK)\b/.test(line)) {
      todoFixmeCount++;
    }

    if (FUNCTION_PATTERN.test(line)) {
      totalFunctions++;
      const above = rawLines
        .slice(Math.max(0, i - 4), i)
        .join("\n");
      if (DOCSTRING_ABOVE.test(above)) {
        docstringedFunctions++;
      }
    }
  }

  const totalWritten = codeLines + commentLines;
  return {
    totalLines,
    codeLines,
    commentDensity: totalWritten === 0 ? 0 : commentLines / totalWritten,
    docstringedFunctions,
    totalFunctions,
    docstringCoverage:
      totalFunctions === 0 ? NaN : docstringedFunctions / totalFunctions,
    todoFixmeCount,
    indentStdev: stdev(indents),
  };
}

function describeReasons(m: CodeShapeMetrics): string[] {
  const reasons: string[] = [];
  if (m.commentDensity >= 0.15) {
    reasons.push(
      `comment density ${(m.commentDensity * 100).toFixed(0)}%`,
    );
  }
  if (!Number.isNaN(m.docstringCoverage) && m.docstringCoverage >= 0.8 && m.totalFunctions >= 2) {
    reasons.push(
      `docstrings on ${m.docstringedFunctions}/${m.totalFunctions} functions`,
    );
  }
  if (m.todoFixmeCount === 0 && m.codeLines >= MIN_LINES) {
    reasons.push("zero TODO/FIXME markers");
  }
  if (m.indentStdev < 1.5 && m.codeLines >= MIN_LINES) {
    reasons.push(`indent stddev ${m.indentStdev.toFixed(2)}`);
  }
  return reasons;
}

export const codeShapeSource: ProvenanceSignalSource = {
  id: "code-shape",
  async detectForFile(file, projectRoot) {
    if (!SUPPORTED_EXT.test(file)) return [];
    let content: string;
    try {
      content = await readFile(join(projectRoot, file), "utf8");
    } catch {
      return [];
    }
    const metrics = computeMetrics(content);
    if (metrics.codeLines < MIN_LINES) return [];

    const reasons = describeReasons(metrics);
    // Require ≥3 of 4 sub-signals to agree. Anything less is noise.
    if (reasons.length < 3) return [];

    const signal: ProvenanceSignal = {
      name: "code-shape",
      weight: 0.4,
      fired: true,
      detail: `Code shape matches AI-generated pattern (${reasons.join("; ")})`,
    };
    return [signal];
  },
};
