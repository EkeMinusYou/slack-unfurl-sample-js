/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import fs from 'fs'
import {ChatUnfurlArguments, FilesRemoteAddArguments, WebClient} from '@slack/web-api'
import {// ChatUnfurlArguments, FilesRemoteAddArguments, WebClient} from '@slack/web-api'
import { createEventAdapter } from '@slack/events-api'
import { v4 as uuidv4 } from "uuid";


const slackSigningSecret = process.env.SLACK_SIGNING_SECRET || "";
const slackToken = process.env.SLACK_TOKEN || "";
const slackEvents = createEventAdapter(slackSigningSecret)

const port = 80

async function main() {
  await slackEvents.start(port).catch(error => {
    console.log('server error: '+ String(error))
  })
}

const stream = fs.createReadStream("../IMG_0009.PNG", 'binary')

slackEvents.on("link_shared", event => {
  void (async() => {
    console.log(`link_shared event: ${String(event)}`)
    const client = new WebClient(slackToken)

    const externalId = uuidv4()
    const filesRemoteAddArguments: FilesRemoteAddArguments = {
      title: "sample_title",
      external_url: 'http://example.com',
      external_id: externalId,
      filetype: 'png',
      preview_image: stream,
    }
    console.log(`filesRemoteAddArguments: ${String(filesRemoteAddArguments)}`)
    const filesRemoteAddResponse = await client.files.remote.add(filesRemoteAddArguments)
    console.log(`FilesRemoteAddResponse: ${String(filesRemoteAddResponse)}`)

    // const chatUnfurlArguments: ChatUnfurlArguments = {
    //   channel: event.channel as string,
    //   ts: event.message_ts as string,
      // unfurls: LinkUnfurls,
    // }
    // await client.chat.unfurl(chatUnfurlArguments)
  })()
})

void main()