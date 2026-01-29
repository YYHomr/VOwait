require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'voai-admin-2026';

// Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

let supabase;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client initialized');
} else {
    console.warn('SUPABASE_URL or SUPABASE_ANON_KEY not found. Data will not be saved permanently.');
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/api/waitlist/individual', async (req, res) => {
    try {
        const { fullName, email, reason, source } = req.body;
        if (!fullName || !email || !reason || !source) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!supabase) {
            console.error('Supabase not initialized. Cannot save individual entry.');
            return res.status(503).json({ error: 'Database connection unavailable. Please try again later.' });
        }

        const { data, error } = await supabase
            .from('individuals')
            .insert([
                { 
                    full_name: fullName, 
                    email: email, 
                    reason: reason, 
                    source: source 
                }
            ]);

        if (error) throw error;

        res.status(201).json({ message: 'Successfully joined the waitlist!' });
    } catch (err) {
        console.error('Error saving individual entry:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/waitlist/business', async (req, res) => {
    try {
        const { fullName, email, reason, source, businessName, teamSize, country, website } = req.body;
        if (!fullName || !email || !reason || !source || !businessName || !teamSize || !country || !website) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!supabase) {
            console.error('Supabase not initialized. Cannot save business entry.');
            return res.status(503).json({ error: 'Database connection unavailable. Please try again later.' });
        }

        const { data, error } = await supabase
            .from('businesses')
            .insert([
                { 
                    full_name: fullName, 
                    email: email, 
                    business_name: businessName, 
                    team_size: teamSize, 
                    country: country, 
                    website: website, 
                    reason: reason, 
                    source: source 
                }
            ]);

        if (error) throw error;

        res.status(201).json({ message: 'Business waitlist entry received!' });
    } catch (err) {
        console.error('Error saving business entry:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin API
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        return res.json({ success: true });
    }
    res.status(401).json({ error: 'Invalid password' });
});

app.get('/api/admin/data', async (req, res) => {
    const password = req.headers['x-admin-password'];
    if (password === ADMIN_PASSWORD) {
        if (!supabase) {
            return res.status(503).json({ error: 'Database connection unavailable' });
        }

        try {
            const { data: individual, error: indError } = await supabase
                .from('individuals')
                .select('*')
                .order('created_at', { ascending: false });

            if (indError) throw indError;

            const { data: business, error: busError } = await supabase
                .from('businesses')
                .select('*')
                .order('created_at', { ascending: false });

            if (busError) throw busError;

            // Map back to camelCase for frontend compatibility if needed
            // The frontend seems to expect the original structure
            const mappedIndividual = individual.map(item => ({
                fullName: item.full_name,
                email: item.email,
                reason: item.reason,
                source: item.source,
                timestamp: item.created_at
            }));

            const mappedBusiness = business.map(item => ({
                fullName: item.full_name,
                email: item.email,
                businessName: item.business_name,
                teamSize: item.team_size,
                country: item.country,
                website: item.website,
                reason: item.reason,
                source: item.source,
                timestamp: item.created_at
            }));

            return res.json({ individual: mappedIndividual, business: mappedBusiness });
        } catch (err) {
            console.error('Error fetching admin data:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    }
    res.status(401).json({ error: 'Unauthorized' });
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
