import * as Name from 'w3name';
import fs from 'fs';

const name = await Name.create();
console.log('created new name: ', name.toString());

// value is an IPFS path to the content we want to publish
const value = '/ipfs/bafybeibgttpu76lfim4fjaxsu4qtktavmby7hudkm754z76bmrn6hv3g5m';
// since we don't have a previous revision, we use Name.v0 to create the initial revision
const revision = await Name.v0(name, value);
await Name.publish(revision, name.key);
console.log(name.key)

async function saveSigningKey(name, outputFilename) {
    const bytes = name.key.bytes;
    await fs.promises.writeFile(outputFilename, bytes);
}
saveSigningKey(name,"key")