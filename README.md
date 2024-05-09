## Building a production grade API with Cloudfare workers, Hono and Upstash

- Using Vector Database to store each index of the word and distribute words in chunks
- Using Similarity Index to guess profane words

**Seed.ts**

- Creating a parseCSV function to read the csv (dataset) and write this data into a Typescript Array
- This Data will be pushed to the `rows array`
- Using the Resolve Reject Method to return a Promise

```Typescript
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

const seed = async () => {
  const data = await parseCSV('training_dataset.csv');
  console.log(data);
};

seed();

```

**fs.pipe():** The readable.pipe() method in a Readable Stream is
used to attach a Writable stream to the readable stream so
that it consequently switches into flowing mode and then pushes all
the data that it has to the attached Writable.
