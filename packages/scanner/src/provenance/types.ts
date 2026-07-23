import type {
  ProvenanceBucket,
  ProvenanceConfidence,
} from "@verglos/shared";

/**
 * Per-file provenance verdict from the engine.
 * Kept internal to the scanner — downstream code consumes the
 * aggregate {@link RepoProvenance} on ScanResult or the
 * per-finding {@link FindingProvenance}.
 */
export interface FileProvenance {
  file: string;
  aiLikelihood: number; // 0..1, higher = more likely AI-authored
  bucket: ProvenanceBucket;
  signals: string[]; // human-readable, always shown
  confidence: ProvenanceConfidence;
  lineCount: number;
}

/**
 * A named signal that contributed to a file's aiLikelihood score.
 * Each signal is a scored piece of evidence (git trailer, agent
 * artifact, commit shape, code shape). Signals collected across
 * layers are combined by the aggregator.
 */
export interface ProvenanceSignal {
  /** Stable name of the signal — used in `signals[]` output. */
  name: string;
  /** Weight applied when this signal fires,. */
  weight: number;
  /** True if the signal fired for this file. */
  fired: boolean;
  /** Optional human-readable detail for the signals list. */
  detail?: string;
}

/**
 * The contract every per-file signal source implements. Sources
 * return signals for one file at a time; the aggregator combines
 * them into a FileProvenance.
 */
export interface ProvenanceSignalSource {
  id: string;
  detectForFile(
    file: string,
    projectRoot: string,
  ): Promise<ProvenanceSignal[]>;
}

/**
 * A repo-level signal — evidence about the WHOLE codebase rather
 * than a single file. Fires once per scan and contributes a prior
 * boost that raises every file's aiLikelihood before per-file
 * signals apply (design §4, Strong tier: "repo-level prior").
 */
export interface RepoLevelSignal {
  name: string;
  fired: boolean;
  detail?: string;
  /** Additive prior boost applied to every file's aiLikelihood. 0..1. */
  priorBoost: number;
}

export interface RepoLevelSignalSource {
  id: string;
  detectForRepo(projectRoot: string): Promise<RepoLevelSignal[]>;
}
