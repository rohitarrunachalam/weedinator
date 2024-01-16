import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://edrqgmsodwuqaxdxcbdg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcnFnbXNvZHd1cWF4ZHhjYmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NzY4NDY0NCwiZXhwIjoyMDEzMjYwNjQ0fQ.ggJe0Ic3xJjkf_23qu3-_Adl-Bo3mph0rngNOlSdVY4';

export const supabase = createClient(supabaseUrl, supabaseKey);



