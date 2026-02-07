import { Pool } from 'pg'
    import env from '#start/env'

    const pool = new Pool({connectionString: env.DATABASE_URL})

    const connectDB = async () => {
      try {
        await pool.connect()
        console.log('PostgreSQL connected')
      } catch (error) {
        console.error('PostgreSQL connection error:', error)
        process.exit(1) // Exit process with failure
      }
    }

    export default connectDB
    export { pool }
