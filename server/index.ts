import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS calculations (
      id SERIAL PRIMARY KEY,
      inputs JSONB NOT NULL,
      result JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

initDb().catch(console.error);

// POST /api/calculations
app.post('/api/calculations', async (req, res) => {
  const { inputs, result } = req.body;
  if (!inputs || !result) return res.status(400).json({ error: 'inputs and result required' });
  const { rows } = await pool.query(
    'INSERT INTO calculations (inputs, result) VALUES ($1, $2) RETURNING *',
    [JSON.stringify(inputs), JSON.stringify(result)]
  );
  res.status(201).json(rows[0]);
});

// GET /api/calculations/view - HTML table
app.get('/api/calculations/view', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM calculations ORDER BY created_at DESC');
  const tableRows = rows.map((r) => `
    <tr>
      <td>${r.id}</td>
      <td>${new Date(r.created_at).toLocaleString()}</td>
      <td>${r.result?.totalKgCo2ePerYear?.toFixed(1) ?? '-'} kg CO₂e/yr</td>
      <td>${r.inputs?.transport?.fuelType ?? '-'}</td>
      <td>${r.inputs?.food?.dietType ?? '-'}</td>
      <td>${r.inputs?.electricity?.energySource ?? '-'}</td>
    </tr>`).join('');
  res.send(`<!DOCTYPE html><html><head><title>Calculations</title>
    <style>body{font-family:sans-serif;padding:2rem}table{border-collapse:collapse;width:100%}
    th,td{border:1px solid #ccc;padding:8px 12px;text-align:left}th{background:#f5f5f5}</style>
    </head><body><h2>Stored Calculations</h2>
    <table><thead><tr><th>ID</th><th>Date</th><th>Total CO₂e</th><th>Fuel</th><th>Diet</th><th>Energy</th></tr></thead>
    <tbody>${tableRows}</tbody></table></body></html>`);
});

// GET /api/calculations
app.get('/api/calculations', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM calculations ORDER BY created_at DESC LIMIT 20');
  res.json(rows);
});

// DELETE /api/calculations/:id
app.delete('/api/calculations/:id', async (req, res) => {
  await pool.query('DELETE FROM calculations WHERE id = $1', [req.params.id]);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
