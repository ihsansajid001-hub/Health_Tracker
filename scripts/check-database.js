// Quick script to check if database schema is properly set up
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables not found');
  console.log('Make sure you have .env.local file with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Checking database schema...\n');

  // List of expected tables
  const expectedTables = [
    'user_profiles',
    'sleep_logs', 
    'workout_logs',
    'nutrition_logs',
    'mood_logs',
    'hydration_logs',
    'food_entries',
    'daily_nutrition_summary',
    'journal_entries',
    'mood_entries',
    'meditation_sessions',
    'breathing_sessions',
    'streaks',
    'weekly_reports',
    'achievements'
  ];

  try {
    // Check if we can connect to Supabase
    const { data: connection, error: connectionError } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true });

    if (connectionError && connectionError.code === 'PGRST116') {
      console.log('❌ Table "user_profiles" does not exist');
      console.log('📋 Your schema needs to be applied to Supabase\n');
      
      console.log('To apply your schema:');
      console.log('1. Go to Supabase Dashboard → SQL Editor');
      console.log('2. Copy the contents of supabase/schema.sql');
      console.log('3. Paste and run the SQL');
      console.log('4. Or use: npx supabase db push (if using Supabase CLI)\n');
      
      return false;
    } else if (connectionError) {
      console.error('❌ Connection error:', connectionError.message);
      return false;
    }

    console.log('✅ Database connection successful');
    console.log('✅ user_profiles table exists\n');

    // Check other tables
    let allTablesExist = true;
    for (const table of expectedTables.slice(1)) {
      try {
        const { error } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true });
        
        if (error && error.code === 'PGRST116') {
          console.log(`❌ Table "${table}" missing`);
          allTablesExist = false;
        } else if (error) {
          console.log(`⚠️  Table "${table}" - ${error.message}`);
        } else {
          console.log(`✅ Table "${table}" exists`);
        }
      } catch (err) {
        console.log(`❌ Error checking "${table}":`, err.message);
        allTablesExist = false;
      }
    }

    if (allTablesExist) {
      console.log('\n🎉 All tables exist! Your schema is properly applied.');
    } else {
      console.log('\n📋 Some tables are missing. Please apply your schema.');
    }

    return allTablesExist;

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

checkDatabase().then((success) => {
  process.exit(success ? 0 : 1);
});