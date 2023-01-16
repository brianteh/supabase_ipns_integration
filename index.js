import { Web3Storage } from 'web3.storage'
import { File } from 'web3.storage'

//Read dotenv
const dotenv = await import('dotenv');
dotenv.config();

function getAccessToken () {
    // If you're just testing, you can paste in a token
    // and uncomment the following line:
    // return 'paste-your-token-here'

    // In a real app, it's better to read an access token from an
    // environement variable or other configuration that's kept outside of
    // your code base. For this to work, you need to set the
    // WEB3STORAGE_TOKEN environment variable before you run your code.
    return process.env.WEB3STORAGE_TOKEN
}

function makeStorageClient () {
    return new Web3Storage({ token: getAccessToken() })
}

function makeFileObjects () {
    // You can create File objects from a Buffer of binary data
    // see: https://nodejs.org/api/buffer.html
    // Here we're just storing a JSON object, but you can store images,
    // audio, or whatever you want!
    const obj = { hp:5,damage:99 }
    const buffer = Buffer.from(JSON.stringify(obj))
  
    const files = [
      //new File(['contents-of-file-1'], 'plain-utf8.txt'),
      new File([buffer], 'metadata.json')
    ]
    return files
}

async function storeFiles (files) {
    const client = makeStorageClient()
    const cid = await client.put(files)
    console.log('stored files with cid:', cid)
    return cid
}

async function storeWithProgress (files) {
    // show the root cid as soon as it's ready
    const onRootCidReady = cid => {
      console.log('uploading files with cid:', cid)
    }
  
    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
    let uploaded = 0
  
    const onStoredChunk = size => {
      uploaded += size
      const pct = 100 * (uploaded / totalSize)
      console.log(`Uploading... ${pct.toFixed(2)}% complete`)
    }
  
    // makeStorageClient returns an authorized web3.storage client instance
    const client = makeStorageClient()
  
    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return client.put(files, { onRootCidReady, onStoredChunk })
}

async function retrieve (cid) {
    const client = makeStorageClient()
    const res = await client.get(cid)
    console.log(`Got a response! [${res.status}] ${res.statusText}`)
    if (!res.ok) {
      throw new Error(`failed to get ${cid}`)
    }
    return res
    // request succeeded! do something with the response object here...
}

await storeWithProgress(makeFileObjects());
//console.log(retrieve("bafybeih5o5j3dbti5q5mbkiprkd2qvqtowazfhnv4cube6h4iqbd4szgyq"));