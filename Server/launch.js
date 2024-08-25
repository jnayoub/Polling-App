const express = require('express');
const path = require('path');
const env = require('dotenv').config();

const supabase = require('./Connections/supabase');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../')));

app.get('/polls', async (req, res) => {
    const { data, error } = await supabase
        .from('polls')
        .select('*');
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.status(200).json(data);
});

app.post('/polls', async (req, res) => {
    const { question, options } = req.body;
    if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ error: 'At least two options are required' });
    }
    const { data, error } = await supabase
        .from('polls')
        .insert([
            {
                question,
                options,
                votes: Array(options.length).fill(0)
            }
        ]);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.status(201).json(data);
});

app.post('/polls/:id/vote', async (req, res) => {
    const { id } = req.params;
    const { optionIndex } = req.body;
    const { data: poll, error: fetchError } = await supabase
        .from('polls')
        .select('*')
        .eq('id', id)
        .single();
    if (fetchError) {
        return res.status(404).json({ error: 'Poll not found' });
    }
    const updatedVotes = poll.votes;
    if (optionIndex >= 0 && optionIndex < updatedVotes.length) {
        updatedVotes[optionIndex] += 1;
    } else {
        return res.status(400).json({ error: 'Invalid option index' });
    }
    const { data, error } = await supabase
        .from('polls')
        .update({ votes: updatedVotes })
        .eq('id', id);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.status(200).json(data);
});


app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/index.html'));
})

app.get('/createPoll', async (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/createPoll.html'));
})
app.listen(port, () => {
    console.log(`Server is running`);
});
