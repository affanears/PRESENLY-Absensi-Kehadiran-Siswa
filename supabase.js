const SUPABASE_URL =
"https://pjssxeadgaptoebczziv.supabase.co";

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqc3N4ZWFkZ2FwdG9lYmN6eml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMjkyODcsImV4cCI6MjA5NzcwNTI4N30.RLUEfIY--ss7KIHYh5-CWZR1wO9G2j3nS2_t1KkW1ak";

const supabaseClient =
supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);