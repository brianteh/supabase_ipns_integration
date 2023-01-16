import * as Name from 'w3name';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js'
const dotenv = await import('dotenv');
dotenv.config();

const token_id=3;

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// creating new ipns name
const name = await Name.create();
console.log('created new name: ', name.toString());

// value is an IPFS path to the content we want to publish
const value = '/ipfs/bafybeiga2qwrfqavrwtfjbvoynybcy5wkfzero4kb7jsvqw4yceqor3upi';
// since we don't have a previous revision, we use Name.v0 to create the initial revision
const revision = await Name.v0(name, value);
await Name.publish(revision, name.key);
console.log(name.key)

const buffer = name.key.bytes;

const { data, error } = await supabase.storage
  .from(process.env.BUCKET_KEY)
  .upload(`${token_id}/key`,buffer)
