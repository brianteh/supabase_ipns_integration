import * as Name from 'w3name';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js'
const dotenv = await import('dotenv');
dotenv.config();

const token_id=3;
const cid = "bafybeicwfvptckeu5cuatzytsx3zdzovgsjw6hqaa7gtgltiircp5xcyqq";
// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const { data, error } = await supabase.storage.from(process.env.BUCKET_KEY).download(`${token_id}/key`)


const buffer = Buffer.from(await data.arrayBuffer()); //data.arrayBuffer is the uint8 array we uploaded previously

async function loadSigningKey(bytes) {
    const name = await Name.from(bytes);//bytes is a buffer
    return name;
}

const name = await loadSigningKey(buffer);
const revision = await Name.resolve(name);
console.log("before: ",revision.value)

async function updateFile(cid){
    const nextValue = `/ipfs/${cid}`;
    // Make a revision to the current record (increments sequence number and sets value)
    const nextRevision = await Name.increment(revision, nextValue);
    await Name.publish(nextRevision, name.key);
}

updateFile(cid);