import * as Name from 'w3name';
import fs from 'fs';

async function loadSigningKey(filename) {
  const bytes = await fs.promises.readFile(filename);
  const name = await Name.from(bytes);
  return name;
}

const name = await loadSigningKey('key2');
const revision = await Name.resolve(name);
console.log('Resolved value:', revision.value);

async function updateFile(cid){
    const nextValue = `/ipfs/${cid}`;
    // Make a revision to the current record (increments sequence number and sets value)
    const nextRevision = await Name.increment(revision, nextValue);
    await Name.publish(nextRevision, name.key);
}

//await updateFile('bafybeiga2qwrfqavrwtfjbvoynybcy5wkfzero4kb7jsvqw4yceqor3upi');
//console.log(name.key.bytes)
