// import {WebClient} from '@slack/web-api'
import { createEventAdapter } from '@slack/events-api'

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET || "";
// const slackToken = process.env.SLACK_TOKEN || "";
const slackEvents = createEventAdapter(slackSigningSecret)

const port = 80

async function main() {
  // const client = new WebClient(slackToken)
  const server = await slackEvents.start(port)
  console.log(server.address())
}

slackEvents.on("link_shared", event => {
  console.log(event)
})

slackEvents.on("url_verification", event => {
  console.log(event)
})

void main()