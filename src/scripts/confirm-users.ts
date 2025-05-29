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

async function confirmAllUsers() {
  try {
    console.log('Fetching unconfirmed users...')
    
    // Get all users who are not confirmed
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('Error fetching users:', error)
      return
    }

    const unconfirmedUsers = users.users.filter(user => !user.email_confirmed_at)
    
    console.log(`Found ${unconfirmedUsers.length} unconfirmed users`)

    if (unconfirmedUsers.length === 0) {
      console.log('No unconfirmed users found!')
      return
    }

    // Confirm each user
    for (const user of unconfirmedUsers) {
      console.log(`Confirming user: ${user.email}`)
      
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { 
          email_confirm: true
        }
      )

      if (updateError) {
        console.error(`Error confirming user ${user.email}:`, updateError)
      } else {
        console.log(`✅ Confirmed user: ${user.email}`)
      }
    }

    console.log('✅ All users have been confirmed!')
    
  } catch (error) {
    console.error('Script error:', error)
  }
}

// Run the script
confirmAllUsers().then(() => {
  console.log('Script completed')
  process.exit(0)
}).catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
}) 