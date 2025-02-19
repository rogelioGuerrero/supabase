import express from 'express';
import 'dotenv/config';
import supabase from './config/supabase';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Test Supabase connection route
app.get('/test-connection', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tasks')  // Replace with an actual table in your Supabase project
      .select('*')
      .limit(1);

    if (error) throw error;

    res.status(200).json({ 
      status: 'Supabase connected', 
      data: data 
    });
  } catch (error) {
    console.error('Supabase connection error:', error);
    res.status(500).json({ 
      status: 'Connection failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
