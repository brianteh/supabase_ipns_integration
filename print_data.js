import fetch from "node-fetch";
const cid = 'bafybeicwfvptckeu5cuatzytsx3zdzovgsjw6hqaa7gtgltiircp5xcyqq'
const response = await fetch(`https://ipfs.io/ipfs/${cid}/metadata.json`);
const data = await response.json()
console.log(data.hp,data.damage)