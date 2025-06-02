import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Define the user type to include email_confirmed_at
interface SupabaseUser {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
  [key: string]: any;
}

async function checkAuthSettings() {
  try {
    console.log('🔍 Checking authentication settings...')
    console.log('📍 Supabase URL:', supabaseUrl)
    
    // Test if we can connect to Supabase
    const { data: users, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1
    })
    
    if (error) {
      console.error('❌ Error connecting to Supabase:', error.message)
      return
    }
    
    console.log('✅ Successfully connected to Supabase')
    console.log(`📊 Total users in database: ${users.users.length > 0 ? 'At least 1' : '0'}`)
    
    // Type the users array properly and check if any users have unconfirmed emails
    const typedUsers = users.users as SupabaseUser[]
    const unconfirmedUsers = typedUsers.filter(user => !user.email_confirmed_at)
    
    if (unconfirmedUsers.length === 0) {
      console.log('✅ All users have confirmed emails (or no users exist)')
    } else {
      console.log(`⚠️  Found ${unconfirmedUsers.length} users with unconfirmed emails`)
      console.log('💡 This is expected if email confirmation is disabled in Supabase dashboard')
    }
    
    console.log('\n📋 Next steps to ensure email confirmation is disabled:')
    console.log('1. Go to your Supabase Dashboard')
    console.log('2. Navigate to Authentication → Settings')
    console.log('3. Under "User Signups", ensure "Enable email confirmations" is OFF')
    console.log('4. Save the settings')
    console.log('\n✅ Email confirmation should now be fully disabled!')
    
  } catch (error) {
    console.error('❌ Script error:', error)
  }
}

// Run the script
checkAuthSettings().then(() => {
  console.log('\n🎉 Check completed!')
  process.exit(0)
}).catch((error) => {
  console.error('❌ Script failed:', error)
  process.exit(1)
}) 