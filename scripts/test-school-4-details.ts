import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSchool4Details() {
  console.log('Testing School 4 Details Retrieval...\n');

  const { data: school, error: schoolError } = await supabase
    .from('schools')
    .select('id, name')
    .eq('id', 4)
    .maybeSingle();

  if (schoolError) {
    console.error('Error fetching school:', schoolError);
    return;
  }

  console.log('School:', school);
  console.log('---\n');

  const { data: details, error: detailsError } = await supabase
    .from('details')
    .select(`
      id,
      school_id,
      category_id,
      documents_required,
      course_details,
      lecture_details,
      fees,
      category:categories(id, name)
    `)
    .eq('school_id', 4)
    .order('category_id');

  if (detailsError) {
    console.error('Error fetching details:', detailsError);
    return;
  }

  console.log(`Found ${details?.length} detail records for School 4\n`);

  details?.forEach((detail: any) => {
    console.log(`Category ${detail.category_id}: ${detail.category?.name}`);
    console.log(`  - Document types: ${detail.documents_required?.length || 0}`);
    console.log(`  - Course sections: ${detail.course_details?.length || 0}`);
    console.log(`  - Lecture sections: ${detail.lecture_details?.length || 0}`);
    console.log(`  - Has fees data: ${detail.fees ? 'Yes' : 'No'}`);
    console.log('');
  });

  console.log('Sample data for Category 1 (Motorcycle):');
  const motorcycleDetail = details?.find((d: any) => d.category_id === 1);
  if (motorcycleDetail) {
    console.log('Documents Required:', JSON.stringify(motorcycleDetail.documents_required?.[0], null, 2));
    console.log('\nCourse Fees:', JSON.stringify(motorcycleDetail.fees?.course_fees?.[0], null, 2));
  }

  console.log('\n✅ Data retrieval test completed successfully!');
}

testSchool4Details().catch(console.error);
