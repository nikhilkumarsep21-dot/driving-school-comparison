import { createClient } from '@supabase/supabase-js';
import { detectFeePattern } from '../lib/fee-utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyFeePatterns() {
  console.log('🔍 Verifying Fee Pattern Detection\n');
  console.log('=' .repeat(80) + '\n');

  const { data: details, error } = await supabase
    .from('details')
    .select('id, school_id, category_id, fees, category:categories(name)')
    .order('school_id')
    .order('category_id');

  if (error) {
    console.error('❌ Error fetching details:', error);
    return;
  }

  const patternCounts = {
    simple: 0,
    nested: 0,
    rta: 0,
    unknown: 0
  };

  const patternExamples: Record<string, any[]> = {
    simple: [],
    nested: [],
    rta: [],
    unknown: []
  };

  details?.forEach((detail: any) => {
    if (!detail.fees || !detail.fees.course_fees) return;

    detail.fees.course_fees.forEach((courseFee: any) => {
      const pattern = detectFeePattern(courseFee);
      patternCounts[pattern]++;

      if (patternExamples[pattern].length < 2) {
        const categoryName = Array.isArray(detail.category)
          ? detail.category[0]?.name
          : detail.category?.name;

        patternExamples[pattern].push({
          school: detail.school_id,
          category: categoryName || 'Unknown',
          sample: courseFee
        });
      }
    });
  });

  console.log('📊 Pattern Detection Summary:\n');
  console.log(`  Simple Pattern:   ${patternCounts.simple} occurrences`);
  console.log(`  Nested Pattern:   ${patternCounts.nested} occurrences`);
  console.log(`  RTA Pattern:      ${patternCounts.rta} occurrences`);
  console.log(`  Unknown Pattern:  ${patternCounts.unknown} occurrences`);
  console.log('\n' + '='.repeat(80) + '\n');

  for (const [pattern, examples] of Object.entries(patternExamples)) {
    if (examples.length === 0) continue;

    console.log(`\n📋 ${pattern.toUpperCase()} PATTERN EXAMPLES:\n`);
    examples.forEach((ex, idx) => {
      console.log(`  Example ${idx + 1}: School ${ex.school} - ${ex.category}`);
      console.log('  ' + JSON.stringify(ex.sample, null, 2).split('\n').join('\n  '));
      console.log('');
    });
  }

  if (patternCounts.unknown > 0) {
    console.log('\n⚠️  WARNING: Found unknown patterns! Please review and update pattern detection.');
  } else {
    console.log('\n✅ All fee patterns recognized successfully!');
  }
}

verifyFeePatterns().catch(console.error);
