import * as IPFS from 'ipfs';

export async function uploadToIPFS(img)
{
  const node = await IPFS.create({ silent: true });
  let cid = await node.add(img);

  console.log("Hash generated: ", cid.path);
  
  return cid.path;
}