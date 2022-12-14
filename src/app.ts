/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import fs from 'fs'
import { ChatUnfurlArguments, FilesRemoteAddArguments, WebClient } from '@slack/web-api'
import { v4 as uuidv4 } from "uuid";
import { createEventAdapter } from '@slack/events-api';


const slackSigningSecret = process.env.SLACK_SIGNING_SECRET || "";
const slackToken = process.env.SLACK_TOKEN || "";
const slackEvents = createEventAdapter(slackSigningSecret)

const port = 80

async function main() {
  await slackEvents.start(port).catch(error => {
    console.log('server error: ' + String(error))
  })
}

const buffer = fs.readFileSync("IMG_0009.PNG")

slackEvents.on("link_shared", event => {
  void (async () => {
    console.log(`link_shared event: %o`, event)
    const client = new WebClient(slackToken)

    const externalId = uuidv4()
    const filesRemoteAddArguments: FilesRemoteAddArguments = {
      title: "sample_title",
      external_url: 'http://example.com',
      external_id: externalId,
      filetype: 'png',
      preview_image: buffer,
    }
    console.log(`filesRemoteAddArguments: %o`, filesRemoteAddArguments)
    const filesRemoteAddResponse = await client.files.remote.add(filesRemoteAddArguments)
    console.log(`FilesRemoteAddResponse: %o`, filesRemoteAddResponse)

    const chatUnfurlArguments: ChatUnfurlArguments = {
      channel: event.channel as string,
      ts: event.message_ts as string,
      unfurls: {
        'http://example.com': {
          blocks: [{ type: 'file', source: "remote", external_id: filesRemoteAddResponse.file?.external_id }]
        }
      },
    }
    console.log(`chatUnfurlArguments: %o`, chatUnfurlArguments)
    const chatUnfurlResponse = await client.chat.unfurl(chatUnfurlArguments)
    console.log(`chatUnfurlResponse: %o`, chatUnfurlResponse)
  })().catch(error => {
    console.log(`%o`, error)
  })
})

void main()