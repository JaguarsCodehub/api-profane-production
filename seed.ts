import fs from 'fs';
import csv from 'csv-parser';
import { Index } from '@upstash/vector';

interface Row {
  text: string;
}

const index = new Index({
  url: process.env.VECTOR_URL,
  token: process.env.VECTOR_TOKEN,
});

async function parseCSV(filePath: string): Promise<Row[]> {
  return new Promise((resolve, reject) => {
    const rows: Row[] = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',' }))
      .on('data', (row) => {
        rows.push(row);
      })
      .on('error', (err) => {
        reject(err);
      })
      .on('end', () => {
        resolve(rows);
      });
  });
}

// Batch 30 request to our database at a single time
const STEP = 30;
const seed = async () => {
  const data = await parseCSV('training_dataset.csv');

  for (let i = 0; i < data.length; i += STEP) {
    const chunk = data.slice(i, i + STEP);

    // To give proper data to our Database
    const formatted = chunk.map((row, batchIndex) => ({
      data: row.text,
      id: i + batchIndex,
      metadata: { text: row.text },
    }));

    await index.upsert(formatted);
    console.log('Data Upserted to Upstash⚡✅');
  }
};

seed();
