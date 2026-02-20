# Tessera — Sample Data (Copy These Exactly)

These are the exact JSON structures for all data files. Copy them into the `data/` directory. The feed data files are ready to use as-is.

---

## data/registry.json

```json
[
  {
    "feed_id": "defi-risk-signals",
    "name": "DeFi Protocol Risk Signals",
    "description": "Real-time risk signals across major DeFi protocols including TVL anomalies, smart contract risk flags, and liquidity migration patterns. Covers Ethereum, Arbitrum, Base, and Optimism.",
    "category": "defi",
    "query_pattern": "alert",
    "provider": {
      "name": "Sentinel Risk Labs",
      "id": "0x7a3bC41e9D2f8A05c19bE38d09f2e",
      "reputation_score": 94
    },
    "query_cost_credits": 3,
    "data_file": "feeds/defi-risk-signals.json",
    "storage_hash": "pending_0g_upload",
    "storage_network": "0G",
    "last_updated": "2025-02-19T14:30:00Z",
    "update_frequency": "every 15 minutes",
    "schema": {
      "fields": [
        { "name": "signal_id", "type": "string", "description": "Unique signal identifier (DRS-YYYY-XXXX)" },
        { "name": "protocol", "type": "string", "description": "Protocol name (e.g., Aave, Uniswap, Curve)" },
        { "name": "chain", "type": "string", "description": "Blockchain network (Ethereum, Arbitrum, Base, Optimism)" },
        { "name": "signal_type", "type": "string", "description": "tvl_anomaly | contract_risk | liquidity_migration" },
        { "name": "severity", "type": "string", "description": "low | medium | high | critical" },
        { "name": "confidence", "type": "number", "description": "Confidence score 0.0 to 1.0" },
        { "name": "summary", "type": "string", "description": "Human-readable signal description" },
        { "name": "timestamp", "type": "string", "description": "ISO 8601 timestamp" },
        { "name": "tags", "type": "array", "description": "Relevant tags for filtering" }
      ]
    },
    "sample_queries": [
      "Show all critical severity signals",
      "Filter by confidence >= 0.8 in the last 24 hours",
      "Signals related to Ethereum chain protocols",
      "All TVL anomaly signals"
    ]
  },
  {
    "feed_id": "smb-benchmarks",
    "name": "SMB Industry Benchmarks",
    "description": "Comprehensive operational benchmarks for small and medium businesses. Covers key financial and operational metrics segmented by industry vertical and company size tier. Based on quarterly surveys of 5,000+ SMBs across North America.",
    "category": "business-operations",
    "query_pattern": "comparative",
    "provider": {
      "name": "BenchmarkIQ Analytics",
      "id": "benchmarkiq-analytics",
      "reputation_score": 96
    },
    "query_cost_credits": 4,
    "data_file": "feeds/smb-benchmarks.json",
    "storage_hash": "pending_0g_upload",
    "storage_network": "0G",
    "last_updated": "2025-02-15T00:00:00Z",
    "update_frequency": "monthly",
    "schema": {
      "fields": [
        { "name": "benchmark_id", "type": "string", "description": "Unique benchmark identifier (BMK-XXX-XX-NNN)" },
        { "name": "industry", "type": "string", "description": "Industry vertical (manufacturing, professional-services, food-service, retail, construction, healthcare)" },
        { "name": "metric", "type": "string", "description": "Metric key (facilities_maintenance_pct, it_spend_pct, employee_turnover_rate, gross_margin_pct, revenue_per_employee)" },
        { "name": "metric_label", "type": "string", "description": "Human-readable metric name" },
        { "name": "company_size_tier", "type": "string", "description": "Employee count tier: 1-25, 25-100, 100-500" },
        { "name": "p25", "type": "number", "description": "25th percentile value" },
        { "name": "p50", "type": "number", "description": "50th percentile (median)" },
        { "name": "p75", "type": "number", "description": "75th percentile value" },
        { "name": "p90", "type": "number", "description": "90th percentile value" },
        { "name": "unit", "type": "string", "description": "Unit of measurement" },
        { "name": "sample_size", "type": "number", "description": "Number of companies surveyed" },
        { "name": "last_survey", "type": "string", "description": "Survey period (e.g., 2025-Q1)" },
        { "name": "interpretation", "type": "string", "description": "Contextual guidance for interpreting this benchmark" }
      ]
    },
    "sample_queries": [
      "What's the median facilities maintenance spend for manufacturing companies with 25-100 employees?",
      "How does 22% gross margin compare for a food service business?",
      "IT spend benchmarks for professional services firms under 50 employees",
      "Employee turnover rate benchmarks across all industries"
    ]
  },
  {
    "feed_id": "labor-market-intel",
    "name": "Labor Market Intelligence",
    "description": "Trend signals on hiring velocity, salary movements, skills demand shifts, and workforce policy changes. Aggregated from job postings, compensation surveys, and employer reports across major markets.",
    "category": "workforce",
    "query_pattern": "trend",
    "provider": {
      "name": "Praxis Workforce Analytics",
      "id": "0x9e2fB73a1C45d80E62bA47c7d",
      "reputation_score": 89
    },
    "query_cost_credits": 3,
    "data_file": "feeds/labor-market-intel.json",
    "storage_hash": "pending_0g_upload",
    "storage_network": "0G",
    "last_updated": "2025-02-18T12:00:00Z",
    "update_frequency": "weekly",
    "schema": {
      "fields": [
        { "name": "signal_id", "type": "string", "description": "Unique signal identifier (LMI-YYYY-XXXX)" },
        { "name": "role_category", "type": "string", "description": "Role category (engineering, sales, operations, data-science, product, design, finance, hr)" },
        { "name": "region", "type": "string", "description": "Geographic scope (us-national, us-west, us-east, eu, apac, remote-global)" },
        { "name": "trend_type", "type": "string", "description": "hiring_velocity | salary_shift | skills_demand | remote_policy | layoff_pattern" },
        { "name": "trend_direction", "type": "string", "description": "increasing | decreasing | stable" },
        { "name": "magnitude_pct", "type": "number", "description": "Percentage change" },
        { "name": "severity", "type": "string", "description": "low | medium | high | critical" },
        { "name": "confidence", "type": "number", "description": "Confidence score 0.0 to 1.0" },
        { "name": "summary", "type": "string", "description": "Human-readable trend description" },
        { "name": "timestamp", "type": "string", "description": "ISO 8601 timestamp" },
        { "name": "tags", "type": "array", "description": "Relevant tags for filtering" }
      ]
    },
    "sample_queries": [
      "What are the hiring trends for engineering roles nationally?",
      "Are salaries increasing or decreasing for data science positions?",
      "Remote work policy trends in the last month",
      "High-confidence signals about layoff patterns"
    ]
  }
]
```

---

## data/feeds/defi-risk-signals.json

```json
[
  {
    "signal_id": "DRS-2025-0142",
    "protocol": "Aave V3",
    "chain": "Ethereum",
    "signal_type": "tvl_anomaly",
    "severity": "high",
    "confidence": 0.92,
    "summary": "Aave V3 Ethereum TVL dropped 12.4% ($180M) in a 4-hour window. Correlates with large withdrawals from 3 whale wallets. No governance proposal or exploit detected.",
    "timestamp": "2025-02-19T22:15:00Z",
    "tags": ["aave", "ethereum", "tvl", "whale-activity"]
  },
  {
    "signal_id": "DRS-2025-0143",
    "protocol": "Uniswap V3",
    "chain": "Base",
    "signal_type": "liquidity_migration",
    "severity": "medium",
    "confidence": 0.78,
    "summary": "Significant liquidity migration from Uniswap V3 on Ethereum to Base deployment. $45M in LP positions moved in 12 hours. Likely incentive-driven.",
    "timestamp": "2025-02-19T20:30:00Z",
    "tags": ["uniswap", "base", "ethereum", "liquidity", "migration"]
  },
  {
    "signal_id": "DRS-2025-0144",
    "protocol": "Curve Finance",
    "chain": "Ethereum",
    "signal_type": "contract_risk",
    "severity": "critical",
    "confidence": 0.95,
    "summary": "Unusual interaction pattern detected on Curve stETH/ETH pool. Potential oracle manipulation attempt — 3 large swaps within same block from unverified contract. No funds lost yet.",
    "timestamp": "2025-02-20T01:45:00Z",
    "tags": ["curve", "ethereum", "oracle", "security", "steth"]
  },
  {
    "signal_id": "DRS-2025-0145",
    "protocol": "Compound V3",
    "chain": "Ethereum",
    "signal_type": "tvl_anomaly",
    "severity": "low",
    "confidence": 0.55,
    "summary": "Compound V3 USDC market utilization rate briefly exceeded 95%, triggering elevated borrow rates. Returned to normal within 2 hours. Likely short-term arbitrage activity.",
    "timestamp": "2025-02-19T15:00:00Z",
    "tags": ["compound", "ethereum", "usdc", "utilization"]
  },
  {
    "signal_id": "DRS-2025-0146",
    "protocol": "GMX",
    "chain": "Arbitrum",
    "signal_type": "tvl_anomaly",
    "severity": "medium",
    "confidence": 0.81,
    "summary": "GMX V2 on Arbitrum saw $28M in GLP redemptions over 6 hours, reducing pool depth by 8%. Open interest remains elevated, creating potential liquidity imbalance for large traders.",
    "timestamp": "2025-02-19T18:20:00Z",
    "tags": ["gmx", "arbitrum", "glp", "liquidity", "perps"]
  },
  {
    "signal_id": "DRS-2025-0147",
    "protocol": "Lido",
    "chain": "Ethereum",
    "signal_type": "contract_risk",
    "severity": "low",
    "confidence": 0.48,
    "summary": "Minor discrepancy detected between Lido oracle reported stETH exchange rate and on-chain calculation. Delta of 0.02% — within acceptable range but flagged for monitoring.",
    "timestamp": "2025-02-19T12:00:00Z",
    "tags": ["lido", "ethereum", "steth", "oracle", "monitoring"]
  },
  {
    "signal_id": "DRS-2025-0148",
    "protocol": "Aave V3",
    "chain": "Optimism",
    "signal_type": "liquidity_migration",
    "severity": "medium",
    "confidence": 0.73,
    "summary": "Aave V3 Optimism deposits increased 22% in 48 hours, primarily in WETH and USDC markets. Appears correlated with new incentive program announcement.",
    "timestamp": "2025-02-19T09:30:00Z",
    "tags": ["aave", "optimism", "deposits", "incentives"]
  },
  {
    "signal_id": "DRS-2025-0149",
    "protocol": "dYdX",
    "chain": "Ethereum",
    "signal_type": "tvl_anomaly",
    "severity": "high",
    "confidence": 0.87,
    "summary": "dYdX perpetuals platform experienced 40% surge in open interest for ETH-USD pair in 3 hours. Funding rate spiked to 0.15% per 8 hours. Suggests leveraged directional positioning.",
    "timestamp": "2025-02-20T04:00:00Z",
    "tags": ["dydx", "ethereum", "perps", "open-interest", "funding-rate"]
  },
  {
    "signal_id": "DRS-2025-0150",
    "protocol": "Maker",
    "chain": "Ethereum",
    "signal_type": "contract_risk",
    "severity": "medium",
    "confidence": 0.68,
    "summary": "MakerDAO governance proposal to increase DAI stability fee passed with unusually low voter participation (12% of MKR supply). Change takes effect in 48 hours.",
    "timestamp": "2025-02-18T20:00:00Z",
    "tags": ["maker", "ethereum", "dai", "governance", "stability-fee"]
  },
  {
    "signal_id": "DRS-2025-0151",
    "protocol": "Balancer",
    "chain": "Arbitrum",
    "signal_type": "liquidity_migration",
    "severity": "low",
    "confidence": 0.52,
    "summary": "Gradual outflow from Balancer weighted pools on Arbitrum over past week. ~$8M migrated to concentrated liquidity positions on Uniswap V3. Normal competitive dynamics.",
    "timestamp": "2025-02-18T16:45:00Z",
    "tags": ["balancer", "arbitrum", "uniswap", "liquidity", "migration"]
  },
  {
    "signal_id": "DRS-2025-0152",
    "protocol": "Aave V3",
    "chain": "Base",
    "signal_type": "tvl_anomaly",
    "severity": "high",
    "confidence": 0.89,
    "summary": "Aave V3 Base deployment TVL surpassed $500M for the first time. 60% of deposits in USDC, suggesting stablecoin yield-seeking behavior. Rapid growth may outpace risk parameter tuning.",
    "timestamp": "2025-02-20T06:00:00Z",
    "tags": ["aave", "base", "tvl", "growth", "stablecoin"]
  }
]
```

---

## data/feeds/smb-benchmarks.json

```json
[
  {
    "benchmark_id": "BMK-MFG-FM-001",
    "industry": "manufacturing",
    "metric": "facilities_maintenance_pct",
    "metric_label": "Facilities Maintenance as % of Revenue",
    "company_size_tier": "1-25",
    "p25": 3.8,
    "p50": 6.1,
    "p75": 9.2,
    "p90": 12.5,
    "unit": "percent_of_revenue",
    "sample_size": 187,
    "last_survey": "2025-Q1",
    "interpretation": "Smaller manufacturing firms tend to spend more on facilities maintenance as a percentage of revenue due to less efficient scale. Spending above 9% may indicate aging equipment or deferred capital investment.",
    "tags": ["manufacturing", "facilities", "maintenance"]
  },
  {
    "benchmark_id": "BMK-MFG-FM-002",
    "industry": "manufacturing",
    "metric": "facilities_maintenance_pct",
    "metric_label": "Facilities Maintenance as % of Revenue",
    "company_size_tier": "25-100",
    "p25": 3.1,
    "p50": 5.2,
    "p75": 7.8,
    "p90": 10.4,
    "unit": "percent_of_revenue",
    "sample_size": 342,
    "last_survey": "2025-Q1",
    "interpretation": "Median manufacturing SMB (25-100 employees) spends 5.2% of revenue on facilities maintenance. Spending above 7.8% places a company in the top quartile of spenders, suggesting potential inefficiency or aging infrastructure.",
    "tags": ["manufacturing", "facilities", "maintenance"]
  },
  {
    "benchmark_id": "BMK-MFG-FM-003",
    "industry": "manufacturing",
    "metric": "facilities_maintenance_pct",
    "metric_label": "Facilities Maintenance as % of Revenue",
    "company_size_tier": "100-500",
    "p25": 2.4,
    "p50": 4.0,
    "p75": 5.9,
    "p90": 8.1,
    "unit": "percent_of_revenue",
    "sample_size": 156,
    "last_survey": "2025-Q1",
    "interpretation": "Larger manufacturing SMBs benefit from scale in facilities management. Median spend is 4.0% of revenue. Companies above the 75th percentile should evaluate preventive maintenance programs and energy efficiency upgrades.",
    "tags": ["manufacturing", "facilities", "maintenance"]
  },
  {
    "benchmark_id": "BMK-MFG-IT-001",
    "industry": "manufacturing",
    "metric": "it_spend_pct",
    "metric_label": "IT Spend as % of Revenue",
    "company_size_tier": "25-100",
    "p25": 1.2,
    "p50": 2.1,
    "p75": 3.4,
    "p90": 5.0,
    "unit": "percent_of_revenue",
    "sample_size": 298,
    "last_survey": "2025-Q1",
    "interpretation": "Manufacturing SMBs typically underinvest in IT relative to service industries. Median IT spend of 2.1% is common but companies investing above 3% tend to report higher operational efficiency gains from automation.",
    "tags": ["manufacturing", "it", "technology"]
  },
  {
    "benchmark_id": "BMK-MFG-GM-001",
    "industry": "manufacturing",
    "metric": "gross_margin_pct",
    "metric_label": "Gross Margin %",
    "company_size_tier": "25-100",
    "p25": 22.5,
    "p50": 31.0,
    "p75": 38.5,
    "p90": 46.0,
    "unit": "percent",
    "sample_size": 412,
    "last_survey": "2025-Q1",
    "interpretation": "Gross margins in manufacturing vary significantly by sub-sector. Median of 31% is typical for general manufacturing. Custom/specialty manufacturers often exceed 38%, while commodity producers may fall below 22%.",
    "tags": ["manufacturing", "profitability", "margin"]
  },
  {
    "benchmark_id": "BMK-PS-IT-001",
    "industry": "professional-services",
    "metric": "it_spend_pct",
    "metric_label": "IT Spend as % of Revenue",
    "company_size_tier": "1-25",
    "p25": 3.5,
    "p50": 5.8,
    "p75": 8.2,
    "p90": 11.0,
    "unit": "percent_of_revenue",
    "sample_size": 523,
    "last_survey": "2025-Q1",
    "interpretation": "Small professional services firms are highly IT-dependent. Median spend of 5.8% reflects cloud software, collaboration tools, and security. Firms below 3.5% may be underinvesting in productivity tools.",
    "tags": ["professional-services", "it", "technology"]
  },
  {
    "benchmark_id": "BMK-PS-TO-001",
    "industry": "professional-services",
    "metric": "employee_turnover_rate",
    "metric_label": "Annual Employee Turnover Rate",
    "company_size_tier": "25-100",
    "p25": 8.0,
    "p50": 14.5,
    "p75": 22.0,
    "p90": 31.0,
    "unit": "percent",
    "sample_size": 389,
    "last_survey": "2025-Q1",
    "interpretation": "Professional services firms face significant talent competition. Median turnover of 14.5% is considered manageable. Above 22% signals retention issues that typically impact client relationship continuity and institutional knowledge.",
    "tags": ["professional-services", "turnover", "retention", "hr"]
  },
  {
    "benchmark_id": "BMK-PS-RPE-001",
    "industry": "professional-services",
    "metric": "revenue_per_employee",
    "metric_label": "Revenue per Employee ($)",
    "company_size_tier": "25-100",
    "p25": 95000,
    "p50": 145000,
    "p75": 210000,
    "p90": 285000,
    "unit": "dollars",
    "sample_size": 367,
    "last_survey": "2025-Q1",
    "interpretation": "Revenue per employee is the key productivity metric for professional services. Median of $145K is typical for general consulting. Specialized firms (legal, engineering, strategy) often exceed $210K. Below $95K suggests utilization or pricing issues.",
    "tags": ["professional-services", "productivity", "revenue"]
  },
  {
    "benchmark_id": "BMK-FS-GM-001",
    "industry": "food-service",
    "metric": "gross_margin_pct",
    "metric_label": "Gross Margin %",
    "company_size_tier": "1-25",
    "p25": 18.0,
    "p50": 28.0,
    "p75": 35.0,
    "p90": 42.0,
    "unit": "percent",
    "sample_size": 612,
    "last_survey": "2025-Q1",
    "interpretation": "Food service gross margins are tight. Median of 28% is typical for full-service restaurants. Fast-casual concepts often achieve 35%+. Margins below 18% are unsustainable long-term without volume scale.",
    "tags": ["food-service", "profitability", "margin", "restaurant"]
  },
  {
    "benchmark_id": "BMK-FS-TO-001",
    "industry": "food-service",
    "metric": "employee_turnover_rate",
    "metric_label": "Annual Employee Turnover Rate",
    "company_size_tier": "1-25",
    "p25": 45.0,
    "p50": 72.0,
    "p75": 95.0,
    "p90": 130.0,
    "unit": "percent",
    "sample_size": 580,
    "last_survey": "2025-Q1",
    "interpretation": "Food service has the highest turnover of any industry. Median of 72% means the average position turns over in about 17 months. Top-performing operators below 45% typically invest in above-market wages, scheduling flexibility, and growth paths.",
    "tags": ["food-service", "turnover", "retention", "hr"]
  },
  {
    "benchmark_id": "BMK-RET-IT-001",
    "industry": "retail",
    "metric": "it_spend_pct",
    "metric_label": "IT Spend as % of Revenue",
    "company_size_tier": "25-100",
    "p25": 1.5,
    "p50": 2.8,
    "p75": 4.2,
    "p90": 6.5,
    "unit": "percent_of_revenue",
    "sample_size": 445,
    "last_survey": "2025-Q1",
    "interpretation": "Retail IT spend is driven by POS systems, e-commerce, and inventory management. Median of 2.8% is rising as omnichannel becomes standard. Companies below 1.5% are likely missing digital sales opportunities.",
    "tags": ["retail", "it", "technology", "ecommerce"]
  },
  {
    "benchmark_id": "BMK-CON-FM-001",
    "industry": "construction",
    "metric": "facilities_maintenance_pct",
    "metric_label": "Facilities Maintenance as % of Revenue",
    "company_size_tier": "25-100",
    "p25": 1.8,
    "p50": 3.2,
    "p75": 5.1,
    "p90": 7.5,
    "unit": "percent_of_revenue",
    "sample_size": 234,
    "last_survey": "2025-Q1",
    "interpretation": "Construction firms have lower facilities costs relative to manufacturing since most work is on-site. Median of 3.2% covers equipment yards, storage, and office space. Higher values often correlate with companies maintaining heavy equipment fleets.",
    "tags": ["construction", "facilities", "maintenance", "equipment"]
  },
  {
    "benchmark_id": "BMK-HC-TO-001",
    "industry": "healthcare",
    "metric": "employee_turnover_rate",
    "metric_label": "Annual Employee Turnover Rate",
    "company_size_tier": "25-100",
    "p25": 12.0,
    "p50": 19.5,
    "p75": 28.0,
    "p90": 38.0,
    "unit": "percent",
    "sample_size": 312,
    "last_survey": "2025-Q1",
    "interpretation": "Healthcare SMBs face persistent staffing challenges. Median turnover of 19.5% is driven by clinical staff competition and burnout. Organizations above 28% should evaluate compensation, scheduling, and workplace culture investments.",
    "tags": ["healthcare", "turnover", "retention", "hr", "staffing"]
  },
  {
    "benchmark_id": "BMK-HC-RPE-001",
    "industry": "healthcare",
    "metric": "revenue_per_employee",
    "metric_label": "Revenue per Employee ($)",
    "company_size_tier": "25-100",
    "p25": 78000,
    "p50": 112000,
    "p75": 155000,
    "p90": 210000,
    "unit": "dollars",
    "sample_size": 287,
    "last_survey": "2025-Q1",
    "interpretation": "Revenue per employee in healthcare SMBs varies by specialty. Median of $112K is typical for primary care practices. Specialty practices and outpatient surgery centers often exceed $155K due to higher reimbursement rates.",
    "tags": ["healthcare", "productivity", "revenue"]
  }
]
```

---

## data/feeds/labor-market-intel.json

```json
[
  {
    "signal_id": "LMI-2025-0301",
    "role_category": "engineering",
    "region": "us-national",
    "trend_type": "hiring_velocity",
    "trend_direction": "increasing",
    "magnitude_pct": 18.3,
    "severity": "medium",
    "confidence": 0.88,
    "summary": "Backend and infrastructure engineering job postings increased 18.3% quarter-over-quarter nationally. Demand concentrated in mid-senior roles. Junior positions remain flat.",
    "timestamp": "2025-02-17T10:00:00Z",
    "tags": ["engineering", "backend", "hiring", "infrastructure"]
  },
  {
    "signal_id": "LMI-2025-0302",
    "role_category": "engineering",
    "region": "us-west",
    "trend_type": "salary_shift",
    "trend_direction": "stable",
    "magnitude_pct": 1.2,
    "severity": "low",
    "confidence": 0.82,
    "summary": "Software engineering base salaries on the West Coast plateaued after 2 years of growth. Median senior engineer comp holding at $195K. Total comp increases driven by equity refresh grants rather than base adjustments.",
    "timestamp": "2025-02-15T14:00:00Z",
    "tags": ["engineering", "salary", "west-coast", "compensation"]
  },
  {
    "signal_id": "LMI-2025-0303",
    "role_category": "engineering",
    "region": "remote-global",
    "trend_type": "remote_policy",
    "trend_direction": "decreasing",
    "magnitude_pct": -15.4,
    "severity": "high",
    "confidence": 0.91,
    "summary": "Remote-first engineering job postings declined 15.4% month-over-month. Major tech employers (500+ employees) leading the shift to hybrid-required policies. Startups (<50 employees) remain predominantly remote-first.",
    "timestamp": "2025-02-18T08:00:00Z",
    "tags": ["engineering", "remote", "hybrid", "policy-shift"]
  },
  {
    "signal_id": "LMI-2025-0304",
    "role_category": "data-science",
    "region": "us-national",
    "trend_type": "skills_demand",
    "trend_direction": "increasing",
    "magnitude_pct": 42.0,
    "severity": "high",
    "confidence": 0.93,
    "summary": "Job postings requiring 'AI/ML engineering' skills surged 42% quarter-over-quarter, outpacing traditional 'data science' postings which grew only 3%. Market shifting from analysis-focused to production ML roles.",
    "timestamp": "2025-02-16T11:00:00Z",
    "tags": ["data-science", "ai-ml", "skills", "machine-learning"]
  },
  {
    "signal_id": "LMI-2025-0305",
    "role_category": "sales",
    "region": "us-national",
    "trend_type": "hiring_velocity",
    "trend_direction": "decreasing",
    "magnitude_pct": -8.7,
    "severity": "medium",
    "confidence": 0.76,
    "summary": "Sales hiring slowed 8.7% quarter-over-quarter across SaaS companies. SDR/BDR roles most affected. Companies shifting budget toward account management and customer success over new business acquisition.",
    "timestamp": "2025-02-14T09:00:00Z",
    "tags": ["sales", "saas", "sdr", "hiring-slowdown"]
  },
  {
    "signal_id": "LMI-2025-0306",
    "role_category": "operations",
    "region": "us-east",
    "trend_type": "salary_shift",
    "trend_direction": "increasing",
    "magnitude_pct": 12.1,
    "severity": "medium",
    "confidence": 0.79,
    "summary": "Operations and supply chain manager salaries on the East Coast rose 12.1% year-over-year. Driven by reshoring initiatives and increased domestic manufacturing investment. Logistics roles seeing strongest growth.",
    "timestamp": "2025-02-17T15:00:00Z",
    "tags": ["operations", "supply-chain", "salary", "reshoring", "logistics"]
  },
  {
    "signal_id": "LMI-2025-0307",
    "role_category": "design",
    "region": "us-national",
    "trend_type": "hiring_velocity",
    "trend_direction": "decreasing",
    "magnitude_pct": -22.0,
    "severity": "high",
    "confidence": 0.85,
    "summary": "Product design hiring contracted 22% quarter-over-quarter. Companies citing AI-assisted design tools as reducing headcount needs. UX research roles declining fastest. Interaction and visual design more stable.",
    "timestamp": "2025-02-13T10:00:00Z",
    "tags": ["design", "ux", "product-design", "ai-displacement"]
  },
  {
    "signal_id": "LMI-2025-0308",
    "role_category": "engineering",
    "region": "eu",
    "trend_type": "hiring_velocity",
    "trend_direction": "increasing",
    "magnitude_pct": 24.6,
    "severity": "high",
    "confidence": 0.86,
    "summary": "EU engineering hiring surged 24.6% quarter-over-quarter, led by Germany and Netherlands. AI regulation compliance driving demand for ML engineers with governance experience. Companies building EU-specific AI teams.",
    "timestamp": "2025-02-18T12:00:00Z",
    "tags": ["engineering", "eu", "ai-regulation", "compliance", "hiring"]
  },
  {
    "signal_id": "LMI-2025-0309",
    "role_category": "finance",
    "region": "us-national",
    "trend_type": "skills_demand",
    "trend_direction": "increasing",
    "magnitude_pct": 31.5,
    "severity": "medium",
    "confidence": 0.74,
    "summary": "Finance roles now requiring 'AI literacy' or 'automation experience' increased 31.5% year-over-year. FP&A and accounting positions leading the shift. Traditional finance-only requirements declining in mid-market companies.",
    "timestamp": "2025-02-12T16:00:00Z",
    "tags": ["finance", "ai-literacy", "automation", "skills-shift"]
  },
  {
    "signal_id": "LMI-2025-0310",
    "role_category": "hr",
    "region": "us-national",
    "trend_type": "layoff_pattern",
    "trend_direction": "increasing",
    "magnitude_pct": 5.3,
    "severity": "low",
    "confidence": 0.62,
    "summary": "HR and People Operations layoffs ticked up 5.3% month-over-month, continuing a slow trend from Q4 2024. Primarily affecting companies with 200-1000 employees consolidating HR functions. HRIS and people analytics roles remain in demand.",
    "timestamp": "2025-02-10T08:00:00Z",
    "tags": ["hr", "layoffs", "people-ops", "consolidation"]
  },
  {
    "signal_id": "LMI-2025-0311",
    "role_category": "product",
    "region": "us-national",
    "trend_type": "hiring_velocity",
    "trend_direction": "stable",
    "magnitude_pct": 2.1,
    "severity": "low",
    "confidence": 0.71,
    "summary": "Product management hiring is essentially flat (+2.1% QoQ). However, job descriptions increasingly emphasize 'technical product management' and 'AI product strategy' over traditional PM skills. Titles shifting from 'Product Manager' to 'AI Product Manager'.",
    "timestamp": "2025-02-16T14:00:00Z",
    "tags": ["product", "product-management", "ai", "hiring"]
  }
]
```
