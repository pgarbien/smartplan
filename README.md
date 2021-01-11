# SmartPlan

SmartPlan is an open-source extension for [SUPLA](https://www.supla.org).
## Development

There are two ways you can get run SmartPlan: using [NPM](https://www.npmjs.com/) or [Docker](https://www.docker.com/get-started) with [docker-compose](https://docs.docker.com/compose/)
### Preparation
1. Log in to [SUPLA Cloud](https://cloud.supla.org/login) using your account and go to `Account -> Integrations -> MY OAUTH APPS` where you can create new OAuth App. 
2. Paste default callback url `http://localhost:4000/auth/supla/callback` or the one you will be using.
3. After creating OAuth app set environment variables `SUPLA_CLIENT_ID` and `SUPLA_CLIENT_SECRET` accordingly to your generated configuration credentials. You can also instead of setting them edit the file `/backend/config/configuration.ts` where the default configuration is.

### using NPM
 Install all necessary dependencies by running from root directory: 
```bash
cd frontend && npm ci
```
and
```bash
cd backend && npm ci
```
Now you can start up the frontend part:
```bash
cd frontend && npm start
```
and backend part by
```bash
cd backend && npm run start:dev
```
You will also need MongoDB database, you can run it using docker: 
```bash
docker run -d -p 27017:27017 -v ~/data:/data/db -e MONGO_INITDB_DATABASE=smartplan_db --name=SMARTPLAN_MONGO mongo
```

### using docker-compose

You can run SmartPlan locally or on server using docker-compose. To configure backend part all you need to do is to edit `.backend.env` file with your webiste, server and callback urls by  setting `WEBSITE_URL`, `SERVER_URL` and `SUPLA_CALLBACK_URL`. You also need to put `SUPLA_CLIENT_ID` and `SUPLA_CLIENT_SECRET` generated in step 3 of Preparation.

To configure frontend part, set `REACT_APP_SERVER_URL` and `REACT_APP_WEBSITE_URL` in `frontend/.env.production` file. Last two variables to be changed are `server_name` and `Host` used in `frontend/nginx.conf` file.

To run whole project simply enter:
```bash
docker-compose up --build
```
## Usage

After running the project you can open your browser and navigate to `localhost:4000` or any url you have configured. There you can login using your SUPLA account and start using SmartPlan! :)
## License
[GPL 2.0](https://choosealicense.com/licenses/gpl-2.0/)
