1.pull the repo from github

2.make config.env
      NODE_ENV=development
     # Database Connection
     DATABASE_URL=postgres://postgres:135710@localhost:5432/mtn
    DB_HOST=localhost
    DB_USER=postgres
    DB_PASSWORD=135710
    DB_NAME=mtn
    DB_PORT=5432
    ## JWT
   JWT_SECRET_KEY=123MNQD@4234mflozzziu
   JWT_EXPIRE_TIME=15m
     ## JWT Refresh
    JWT_REFRESH_SECRET_KEY=123MfQg@42649flozzziu
   JWT_REFRESH_EXPIRE_TIME=7d

3. run in terminal  <npm install> to download the packages
_______________________________________________________________________________________________________________________________________
  ----------------- IN NORMAL MTN APP  -------------------------                                                                                                                      
4. run <CREATE DATABASE mtn;>  in local database                                                                              
5. run in terminal  <npm run db:generate>   to generate our schemas (this command use else when change in db schema)                               
6. run in terminal  <npm run db:migrate>     to migrate  our schemas in database mtn (this command use else when change in db schema)                                
7. run in terminal  <npm run studio>            to see the database in UI                                                                              
8. run in terminal   <npm run start>             to start app  this command will write in terminal  link to swagger UI to test APIs                                 
_______________________________________________________________________________________________________________________________________
    ------------------IN DOCKER MTN APP --------------------------------
4. change config.env.DATABASE_URL=postgres://postgres:135710@db:5432/mtn                                                               
5. change config.env.DB_HOST=db                                                                                                               
6. run in terminal  <docker-compose up --build -d>                                    to build the app container                           
7. run in terminal  <docker-compose exec app npm run db:generate>         if change in db schema                                         
8. run in terminal  <docker-compose exec app npm run db:migrate>           if need migrate the schema                                        
9. run in terminal   <docker-compose down>                                               to shut down the docker container                              
10. write in browser <http://localhost:8000/api-docs/>                               to test APIs in swagger                                       
