export type Lorebook = {
  entries: LorebookEntry[];
  config?: LorebookConfig;
};

export type LorebookEntry = {
  id: number;
  name: string;
  keys: string; // comma- or space-separated string, not an array
  content: string;

  // Optional fields:
  enabled?: boolean;
  comment?: string;
  position?: number;
  constant?: boolean;
  selective?: boolean;
  order?: number;
  depth?: number;
  priority?: number;
  range?: number;
  token_budget?: number;
  case_sensitive?: boolean;
  secondary_keys?: string; // same format as keys
  recursive_scanning?: boolean;
};

export type LorebookConfig = {
  tokenizer?: 'gpt2' | 'cl100k_base' | string;
  token_budget?: number;
  token_budget_priority?: boolean;
  insertion_order?: 'sequential' | 'priority';
};
