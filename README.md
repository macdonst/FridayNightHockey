# Runtime CNA Starter
A [serverlessJS](https://serverless.com/) based starter project for runtime.


## Setup
- Run `npm install -g serverless` to install the serverless cli globally
- `npm install`

## Local Dev
- `npm run dev` to start your local Dev server
- App will run on `localhost:9080` by default
- Local dev server uses an expressJS proxy to invoke action code.
- You can invoke your back-end actions defined locally via the url `localhost:9080/actions/<action_name>`

## Test & Coverage
- Run `npm run test` to run tests
- Run `npm run coverage` to generate Code coverage report

## Build & Deploy
- `npm run build` To Build your ui:React code
- `npm run deploy` Deploy All Actions on Runtime and static files in S3

## Dependencies
- serverlessJS for deployments
- expressJS for local dev and serving static files
- parcelJS for packaging UI App (React by default)

## Config

### `.env`

```
OW_APIVERSION=v1
OW_APIHOST=https://adobeioruntime.net
OW_AUTH=<AUTH>
OW_NAMESPACE=<namespace>
OW_PACKAGE=<package>
AWS_ACCESS_KEY_ID=<access-key>
AWS_SECRET_ACCESS_KEY=<secret>
S3_BUCKET_NAME=<bucket-name>
```
🚫 OW_PACKAGE cannot be set to 'default'.

### `REMOTE_ACTIONS`
This variable controls the configuration generation for action URLs used by the
UI.

Use `REMOTE_ACTIONS=true npm run dev` to run the UI locally but access
remotely deployed actions.
