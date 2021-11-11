import * as IPFS from 'ipfs-core'

async function upload() {
    const ipfs = await IPFS.create()
    const { cid } = await ipfs.add('Hello world')
    console.info(cid)
}
module.exports = upload