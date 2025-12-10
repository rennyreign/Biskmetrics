import { Box, Chip, LinearProgress, Tooltip } from '@mui/material';
import { TrendingUp, Award, Target, DollarSign, MapPin, Users, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import { programs } from '../data/programs';

// University reputation scores (1-10 scale based on US News rankings, brand recognition, employer perception)
const UNIVERSITY_REPUTATION: Record<string, { score: number; tier: string; strengths: string[] }> = {
  'MSU': { 
    score: 7.5, 
    tier: 'Tier 1 Public',
    strengths: ['Strong Midwest employer network', 'Recognized business programs', 'Large alumni base']
  },
  'SMU': { 
    score: 8.2, 
    tier: 'Tier 1 Private',
    strengths: ['Premium brand perception', 'Strong in finance/business', 'Dallas market access', 'High-income alumni']
  },
  'USF': { 
    score: 7.0, 
    tier: 'Tier 1 Public',
    strengths: ['Growing research university', 'Tampa Bay market', 'Healthcare & tech focus']
  },
  'Emory ECE': { 
    score: 8.5, 
    tier: 'Top 25 Private',
    strengths: ['Elite brand recognition', 'Executive education reputation', 'Atlanta corporate hub']
  },
  'Emory GBS': { 
    score: 8.8, 
    tier: 'Top 25 Private',
    strengths: ['Goizueta Business School prestige', 'Fortune 500 partnerships', 'Premium pricing power']
  },
  'ECSU': { 
    score: 5.5, 
    tier: 'Regional Public',
    strengths: ['HBCU heritage', 'Underserved market access', 'Lower competition']
  },
  'KEEP': { 
    score: 6.0, 
    tier: 'Specialized',
    strengths: ['Niche positioning', 'Specific industry focus']
  }
};

// Market demand scores for program categories (1-10)
const MARKET_DEMAND: Record<string, { score: number; trend: 'rising' | 'stable' | 'declining'; notes: string }> = {
  'AI': { score: 9.5, trend: 'rising', notes: 'Explosive demand across all industries' },
  'Data Analytics': { score: 9.0, trend: 'rising', notes: 'Core business competency' },
  'Digital Transformation': { score: 8.5, trend: 'rising', notes: 'Enterprise priority post-pandemic' },
  'Healthcare': { score: 8.5, trend: 'rising', notes: 'Aging population, regulatory complexity' },
  'Project Management': { score: 7.5, trend: 'stable', notes: 'Steady demand, PMP saturation' },
  'Supply Chain': { score: 8.0, trend: 'rising', notes: 'Post-pandemic resilience focus' },
  'Cybersecurity': { score: 9.0, trend: 'rising', notes: 'Critical shortage of talent' },
  'Leadership': { score: 7.0, trend: 'stable', notes: 'Evergreen but competitive' },
  'Finance': { score: 7.5, trend: 'stable', notes: 'Mature market, fintech disruption' },
  'Marketing': { score: 7.0, trend: 'stable', notes: 'Digital marketing evolution' },
  'Six Sigma': { score: 6.5, trend: 'declining', notes: 'Mature methodology, less differentiation' },
  'General Business': { score: 6.0, trend: 'stable', notes: 'Commoditized, price-sensitive' },
  'Education': { score: 6.0, trend: 'stable', notes: 'Niche market, budget constraints' },
  'Nursing': { score: 8.5, trend: 'rising', notes: 'Critical shortage nationwide' },
};

// Competition level by program type (1-10, higher = more competition)
const COMPETITION_LEVEL: Record<string, number> = {
  'AI': 7,
  'Data Analytics': 8,
  'Healthcare': 6,
  'Project Management': 9,
  'Leadership': 8,
  'Six Sigma': 7,
  'Digital Transformation': 5,
  'Supply Chain': 6,
  'Cybersecurity': 7,
  'Finance': 8,
  'Marketing': 8,
  'General Business': 9,
  'Education': 5,
  'Nursing': 4,
};

// Geo-targeting efficiency (CPM/CPC advantages by region)
const GEO_ADVANTAGES: Record<string, { cpmIndex: number; markets: string[] }> = {
  'MSU': { cpmIndex: 0.75, markets: ['Michigan', 'Midwest', 'Great Lakes'] },
  'SMU': { cpmIndex: 1.1, markets: ['Texas', 'Southwest', 'Energy sector'] },
  'USF': { cpmIndex: 0.85, markets: ['Florida', 'Southeast', 'Retiree markets'] },
  'Emory ECE': { cpmIndex: 1.0, markets: ['Georgia', 'Southeast', 'Fortune 500 HQs'] },
  'Emory GBS': { cpmIndex: 1.0, markets: ['Georgia', 'National executive market'] },
  'ECSU': { cpmIndex: 0.6, markets: ['North Carolina', 'HBCU network', 'Underserved communities'] },
  'KEEP': { cpmIndex: 0.7, markets: ['Regional', 'Specialized verticals'] },
};

// Categorize programs by topic
function categorizeProgram(programName: string): string {
  const name = programName.toLowerCase();
  if (name.includes('ai') || name.includes('artificial intelligence') || name.includes('machine learning')) return 'AI';
  if (name.includes('analytics') || name.includes('data')) return 'Data Analytics';
  if (name.includes('digital transformation')) return 'Digital Transformation';
  if (name.includes('healthcare') || name.includes('health')) return 'Healthcare';
  if (name.includes('project management') || name.includes('pmp')) return 'Project Management';
  if (name.includes('supply chain') || name.includes('logistics')) return 'Supply Chain';
  if (name.includes('cyber') || name.includes('security')) return 'Cybersecurity';
  if (name.includes('leadership') || name.includes('management')) return 'Leadership';
  if (name.includes('six sigma') || name.includes('lean')) return 'Six Sigma';
  if (name.includes('finance') || name.includes('accounting') || name.includes('financial')) return 'Finance';
  if (name.includes('marketing') || name.includes('brand')) return 'Marketing';
  if (name.includes('nursing') || name.includes('nurse')) return 'Nursing';
  if (name.includes('education') || name.includes('teaching')) return 'Education';
  return 'General Business';
}

interface RecommendedProgram {
  program: typeof programs[0];
  overallScore: number;
  metricsScore: number;
  reputationScore: number;
  demandScore: number;
  competitionScore: number;
  geoScore: number;
  category: string;
  verdict: 'strong-buy' | 'buy' | 'hold' | 'reduce';
  reasoning: string[];
}

function analyzePrograms(): RecommendedProgram[] {
  // Filter programs with sufficient data (50+ leads, has conversion rates)
  const validPrograms = programs.filter(
    p => p.leads >= 50 && p.contactToEnrollmentRate != null && p.enrollmentRate != null
  );

  // Find max values for normalization
  const maxLeads = Math.max(...validPrograms.map(p => p.leads));
  const maxContactEnroll = Math.max(...validPrograms.map(p => p.contactToEnrollmentRate || 0));
  const maxEnrollRate = Math.max(...validPrograms.map(p => p.enrollmentRate || 0));

  return validPrograms.map(program => {
    const category = categorizeProgram(program.programName);
    const reputation = UNIVERSITY_REPUTATION[program.school] || { score: 5, tier: 'Unknown', strengths: [] };
    const demand = MARKET_DEMAND[category] || { score: 5, trend: 'stable', notes: '' };
    const competition = COMPETITION_LEVEL[category] || 5;
    const geo = GEO_ADVANTAGES[program.school] || { cpmIndex: 1, markets: [] };

    // Calculate component scores (0-100)
    const volumeScore = (Math.log10(program.leads) / Math.log10(maxLeads)) * 100;
    const contactEnrollScore = ((program.contactToEnrollmentRate || 0) / maxContactEnroll) * 100;
    const enrollScore = ((program.enrollmentRate || 0) / maxEnrollRate) * 100;
    
    // Metrics score: weighted conversion efficiency
    const metricsScore = (volumeScore * 0.2) + (contactEnrollScore * 0.35) + (enrollScore * 0.45);
    
    // Reputation score (normalized to 0-100)
    const reputationScore = reputation.score * 10;
    
    // Demand score (normalized to 0-100)
    const demandScore = demand.score * 10 + (demand.trend === 'rising' ? 10 : demand.trend === 'declining' ? -10 : 0);
    
    // Competition score (inverted - lower competition = higher score)
    const competitionScore = (10 - competition) * 10;
    
    // Geo efficiency score (lower CPM = better)
    const geoScore = ((2 - geo.cpmIndex) / 2) * 100;

    // Overall weighted score
    const overallScore = (
      metricsScore * 0.35 +      // Performance data is most important
      reputationScore * 0.20 +   // Brand matters for conversions
      demandScore * 0.25 +       // Market timing
      competitionScore * 0.10 + // Competitive landscape
      geoScore * 0.10           // Cost efficiency
    );

    // Determine verdict
    let verdict: 'strong-buy' | 'buy' | 'hold' | 'reduce';
    if (overallScore >= 70) verdict = 'strong-buy';
    else if (overallScore >= 55) verdict = 'buy';
    else if (overallScore >= 40) verdict = 'hold';
    else verdict = 'reduce';

    // Generate reasoning
    const reasoning: string[] = [];
    
    if (metricsScore >= 60) reasoning.push(`Strong conversion metrics (${(program.enrollmentRate || 0).toFixed(1)}% enrollment rate)`);
    else if (metricsScore < 30) reasoning.push(`Below-average conversion performance`);
    
    if (reputation.score >= 8) reasoning.push(`Premium university brand (${reputation.tier})`);
    
    if (demand.trend === 'rising') reasoning.push(`${category} skills in high demand (trending up)`);
    else if (demand.trend === 'declining') reasoning.push(`${category} market showing saturation`);
    
    if (competition <= 5) reasoning.push(`Lower competitive pressure in ${category} space`);
    else if (competition >= 8) reasoning.push(`Highly competitive market segment`);
    
    if (geo.cpmIndex < 0.8) reasoning.push(`Cost-efficient geo-targeting (${geo.markets.slice(0, 2).join(', ')})`);

    if (program.leads >= 500) reasoning.push(`Proven lead volume (${program.leads.toLocaleString()} leads)`);

    return {
      program,
      overallScore,
      metricsScore,
      reputationScore,
      demandScore,
      competitionScore,
      geoScore,
      category,
      verdict,
      reasoning
    };
  }).sort((a, b) => b.overallScore - a.overallScore);
}

const VERDICT_COLORS = {
  'strong-buy': { bg: '#dcfce7', text: '#166534', border: '#22c55e' },
  'buy': { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
  'hold': { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
  'reduce': { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' }
};

const VERDICT_LABELS = {
  'strong-buy': 'Strong Buy',
  'buy': 'Buy',
  'hold': 'Hold',
  'reduce': 'Reduce'
};

export function RecommendedVerdict() {
  const analyzedPrograms = analyzePrograms();
  const topPrograms = analyzedPrograms.slice(0, 10);
  const strongBuys = analyzedPrograms.filter(p => p.verdict === 'strong-buy');
  const buys = analyzedPrograms.filter(p => p.verdict === 'buy');

  return (
    <Box sx={{ p: 4 }}>
      {/* Executive Summary */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Award className="text-pink-500" size={28} />
          <h2 className="text-2xl font-bold text-slate-900">Executive Summary</h2>
        </Box>
        
        <Box sx={{ 
          bgcolor: '#f8fafc', 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          p: 4,
          mb: 4
        }}>
          <p className="text-slate-700 mb-4">
            Based on comprehensive analysis of <strong>{analyzedPrograms.length} programs</strong> with 50+ leads, 
            evaluating performance metrics, university reputation, market demand, competitive landscape, and 
            geo-targeting efficiency, we recommend the following investment strategy:
          </p>
          
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 48, height: 48, borderRadius: '50%', 
                bgcolor: VERDICT_COLORS['strong-buy'].bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${VERDICT_COLORS['strong-buy'].border}`
              }}>
                <span className="text-lg font-bold" style={{ color: VERDICT_COLORS['strong-buy'].text }}>
                  {strongBuys.length}
                </span>
              </Box>
              <Box>
                <p className="text-sm text-slate-500">Strong Buy</p>
                <p className="font-semibold text-slate-900">Priority Investment</p>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 48, height: 48, borderRadius: '50%', 
                bgcolor: VERDICT_COLORS['buy'].bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${VERDICT_COLORS['buy'].border}`
              }}>
                <span className="text-lg font-bold" style={{ color: VERDICT_COLORS['buy'].text }}>
                  {buys.length}
                </span>
              </Box>
              <Box>
                <p className="text-sm text-slate-500">Buy</p>
                <p className="font-semibold text-slate-900">Increase Spend</p>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Methodology */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Target className="text-pink-500" size={24} />
          <h3 className="text-xl font-bold text-slate-900">Scoring Methodology</h3>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          {[
            { label: 'Performance Metrics', weight: '35%', icon: TrendingUp, desc: 'Leads, conversion rates' },
            { label: 'Market Demand', weight: '25%', icon: Users, desc: 'Skill trends, job market' },
            { label: 'University Reputation', weight: '20%', icon: Star, desc: 'Brand value, rankings' },
            { label: 'Competition', weight: '10%', icon: AlertTriangle, desc: 'Market saturation' },
            { label: 'Geo Efficiency', weight: '10%', icon: MapPin, desc: 'CPM/targeting costs' },
          ].map(item => (
            <Box key={item.label} sx={{ 
              bgcolor: 'white', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px', 
              p: 2 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <item.icon size={16} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
              </Box>
              <p className="text-2xl font-bold text-pink-500">{item.weight}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Top Recommendations */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <CheckCircle className="text-pink-500" size={24} />
          <h3 className="text-xl font-bold text-slate-900">Top 10 Recommended Programs</h3>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {topPrograms.map((item, index) => {
            const verdictColor = VERDICT_COLORS[item.verdict];
            const reputation = UNIVERSITY_REPUTATION[item.program.school];
            const demand = MARKET_DEMAND[item.category];
            const geo = GEO_ADVANTAGES[item.program.school];
            
            return (
              <Box 
                key={item.program.id}
                sx={{ 
                  bgcolor: 'white',
                  border: '1px solid #e2e8f0',
                  borderLeft: `4px solid ${verdictColor.border}`,
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <span className="text-2xl font-bold text-slate-300">#{index + 1}</span>
                        <h4 className="text-lg font-semibold text-slate-900">{item.program.programName}</h4>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip 
                          label={item.program.school} 
                          size="small"
                          sx={{ bgcolor: '#f1f5f9', color: '#475569' }}
                        />
                        <Chip 
                          label={item.program.level} 
                          size="small"
                          sx={{ 
                            bgcolor: item.program.level === 'Certificate' ? '#dbeafe' : '#f3e8ff',
                            color: item.program.level === 'Certificate' ? '#1e40af' : '#6b21a8'
                          }}
                        />
                        <Chip 
                          label={item.category} 
                          size="small"
                          sx={{ bgcolor: '#fce7f3', color: '#be185d' }}
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip 
                        label={VERDICT_LABELS[item.verdict]}
                        sx={{ 
                          bgcolor: verdictColor.bg,
                          color: verdictColor.text,
                          fontWeight: 'bold',
                          fontSize: '14px',
                          height: '32px'
                        }}
                      />
                      <p className="text-sm text-slate-500 mt-1">Score: {item.overallScore.toFixed(1)}</p>
                    </Box>
                  </Box>

                  {/* Score Breakdown */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, mb: 3 }}>
                    {[
                      { label: 'Metrics', score: item.metricsScore },
                      { label: 'Reputation', score: item.reputationScore },
                      { label: 'Demand', score: item.demandScore },
                      { label: 'Competition', score: item.competitionScore },
                      { label: 'Geo', score: item.geoScore },
                    ].map(s => (
                      <Box key={s.label}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <span className="text-xs text-slate-500">{s.label}</span>
                          <span className="text-xs font-medium text-slate-700">{s.score.toFixed(0)}</span>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(s.score, 100)}
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            bgcolor: '#e2e8f0',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: s.score >= 70 ? '#22c55e' : s.score >= 50 ? '#3b82f6' : s.score >= 30 ? '#f59e0b' : '#ef4444'
                            }
                          }}
                        />
                      </Box>
                    ))}
                  </Box>

                  {/* Key Stats */}
                  <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                    <Box>
                      <p className="text-xs text-slate-500">Leads</p>
                      <p className="text-lg font-semibold text-slate-900">{item.program.leads.toLocaleString()}</p>
                    </Box>
                    <Box>
                      <p className="text-xs text-slate-500">Contact to Enroll</p>
                      <p className="text-lg font-semibold text-slate-900">{item.program.contactToEnrollmentRate?.toFixed(1)}%</p>
                    </Box>
                    <Box>
                      <p className="text-xs text-slate-500">Enrollment Rate</p>
                      <p className="text-lg font-semibold text-slate-900">{item.program.enrollmentRate?.toFixed(1)}%</p>
                    </Box>
                    <Box>
                      <p className="text-xs text-slate-500">University Tier</p>
                      <p className="text-lg font-semibold text-slate-900">{reputation?.tier || 'N/A'}</p>
                    </Box>
                    <Box>
                      <p className="text-xs text-slate-500">Market Trend</p>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {demand?.trend === 'rising' && <TrendingUp size={16} className="text-green-500" />}
                        <p className="text-lg font-semibold text-slate-900 capitalize">{demand?.trend || 'N/A'}</p>
                      </Box>
                    </Box>
                  </Box>

                  {/* Reasoning */}
                  <Box sx={{ bgcolor: '#f8fafc', borderRadius: '8px', p: 2 }}>
                    <p className="text-xs font-medium text-slate-500 mb-2">WHY WE RECOMMEND</p>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {item.reasoning.map((reason, i) => (
                        <Chip 
                          key={i}
                          label={reason}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: '#cbd5e1', color: '#475569', fontSize: '12px' }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Geo Targeting */}
                  {geo && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MapPin size={14} className="text-slate-400" />
                      <span className="text-xs text-slate-500">
                        Target Markets: {geo.markets.join(' • ')} 
                        {geo.cpmIndex < 1 && <span className="text-green-600 ml-2">(Lower CPM region)</span>}
                      </span>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Strategic Notes */}
      <Box sx={{ 
        bgcolor: '#fef3c7', 
        border: '1px solid #f59e0b', 
        borderRadius: '12px', 
        p: 4 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <DollarSign className="text-amber-600" size={24} />
          <h3 className="text-lg font-bold text-amber-900">Investment Strategy Notes</h3>
        </Box>
        <ul className="text-sm text-amber-800 space-y-2">
          <li><strong>AI & Data Programs:</strong> Highest market demand. Prioritize Emory GBS and SMU offerings for premium positioning.</li>
          <li><strong>Healthcare Programs:</strong> Strong demand with lower competition. USF and MSU have cost-efficient geo-targeting.</li>
          <li><strong>Certificates vs Degrees:</strong> Certificates show faster conversion cycles. Consider for quick-win campaigns.</li>
          <li><strong>Geo Strategy:</strong> ECSU and MSU offer 25-40% lower CPMs. Test broader reach with these programs.</li>
          <li><strong>Avoid Over-Investment:</strong> General business and saturated project management programs show diminishing returns.</li>
        </ul>
      </Box>
    </Box>
  );
}
