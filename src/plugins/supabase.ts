import { createClient } from '@supabase/supabase-js'

export default {
  install: (app: any) => {
    const supabase = createClient(
      'https://tizydzbnoppusddwxnay.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpenlkemJub3BwdXNkZHd4bmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NTYwMDYsImV4cCI6MjA3NTAzMjAwNn0.HwizQk9VyYK_8VB0zdCTe4R87dj1ALZmZPID90EJGh8'
    )
    app.config.globalProperties.$supabase = supabase
    app.provide('supabase', supabase)
  }
}