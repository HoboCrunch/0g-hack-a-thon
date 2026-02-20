export interface QueryFilters {
  severity?: string;
  confidence_min?: number;
  tags?: string[];
  limit?: number;
  since?: string;
  industry?: string;
  metric?: string;
  company_size_tier?: string;
  role_category?: string;
  region?: string;
  trend_direction?: string;
  signal_type?: string;
  protocol?: string;
  chain?: string;
  trend_type?: string;
  [key: string]: any;
}

export interface QueryResult {
  results: any[];
  explain: string;
  totalMatching: number;
}

const STRING_FILTER_KEYS = [
  'severity', 'industry', 'metric', 'company_size_tier',
  'role_category', 'region', 'trend_direction', 'signal_type',
  'protocol', 'chain', 'trend_type',
];

export function queryFeed(records: any[], filters: QueryFilters): QueryResult {
  let results = [...records];
  const appliedFilters: string[] = [];

  // String filter keys → case-insensitive exact match on same-named property
  for (const key of STRING_FILTER_KEYS) {
    if (filters[key] !== undefined && filters[key] !== null) {
      const filterValue = String(filters[key]).toLowerCase();
      results = results.filter(r => {
        const recordValue = r[key];
        if (recordValue === undefined || recordValue === null) return false;
        return String(recordValue).toLowerCase() === filterValue;
      });
      appliedFilters.push(`${key}=${filters[key]}`);
    }
  }

  // confidence_min → record.confidence >= value
  if (filters.confidence_min !== undefined) {
    results = results.filter(r =>
      r.confidence !== undefined && r.confidence >= filters.confidence_min!
    );
    appliedFilters.push(`confidence>=${filters.confidence_min}`);
  }

  // since → record.timestamp >= value
  if (filters.since !== undefined) {
    results = results.filter(r =>
      r.timestamp !== undefined && r.timestamp >= filters.since!
    );
    appliedFilters.push(`since=${filters.since}`);
  }

  // tags → array intersection (match if ANY tag matches)
  if (filters.tags !== undefined && filters.tags.length > 0) {
    const filterTags = filters.tags.map(t => t.toLowerCase());
    results = results.filter(r => {
      if (!Array.isArray(r.tags)) return false;
      const recordTags = r.tags.map((t: string) => t.toLowerCase());
      return filterTags.some(ft => recordTags.includes(ft));
    });
    appliedFilters.push(`tags=[${filters.tags.join(',')}]`);
  }

  const totalMatching = results.length;

  // Sort by confidence desc if field exists
  if (results.length > 0 && results[0].confidence !== undefined) {
    results.sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0));
  }

  // limit → cap results (default 10)
  const limit = filters.limit ?? 10;
  results = results.slice(0, limit);

  // Build explain string
  const explain = appliedFilters.length > 0
    ? `Matched ${totalMatching} record${totalMatching !== 1 ? 's' : ''} with filters: ${appliedFilters.join(', ')}. Returning ${results.length}.`
    : `Returning ${results.length} of ${totalMatching} total records (no filters applied).`;

  return { results, explain, totalMatching };
}
