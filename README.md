# demo-tv-streaming-app
Demo TV streaming application using GraphQL and NoSQL

Work in Progress 👷

## Deployment using Docker
1. Start up KVLite in a container

pull the image directly from the GitHub Container Registry:

```shell
docker pull ghcr.io/oracle/nosql:latest-ce
docker tag ghcr.io/oracle/nosql:latest-ce oracle/nosql:ce
```

Start up KVLite in a container. You must give it a name and provide a hostname. Startup of
KVLite is the default `CMD` of the image:

```shell
docker run -d --name=kvlite --hostname=kvlite --env KV_PROXY_PORT=8080 -p 8080:8080 oracle/nosql:ce
```

see instuction https://github.com/oracle/docker-images/tree/main/NoSQL

2. Deploy this application

````shell
docker pull ghcr.io/dario-vega/demo-tv-streaming-app:latest
docker tag ghcr.io/dario-vega/demo-tv-streaming-app:latest demo-tv-streaming-app:latest
````

Start up this demo in a container 

````shell
docker run -d --env NOSQL_ENDPOINT=$HOSTNAME -p 3000:3000 demo-tv-streaming-app:latest 
````
or use user-defined bridge network, to simplify I will use the -- link option

````shell
docker run -d --name=kvlite --hostname=kvlite --env KV_PROXY_PORT=8080 -p 8080:8080 oracle/nosql:ce
````
Note the use of --link to contact the KVLite Container (actual KVLite container is named kvlite; alias is kvlite).

This project offers sample container image to show how to connect a NoSQL application to Oracle NoSQL Database Proxy running in a container

The default values for the env variables are
````
ENV NOSQL_ENDPOINT kvlite
ENV NOSQL_PORT 8080
````

## Deployment using docker-compose

1. Clone this project and run the up docker-compose command

````shell
cd ~/demo-tv-streaming-app
docker-compose up -d
docker-compose ps
````


## Deployment on a external host connected to KVLite runnning in a container

1. Start up KVLite in a container

pull the image directly from the GitHub Container Registry:

```shell
docker pull ghcr.io/oracle/nosql:latest-ce
docker tag ghcr.io/oracle/nosql:latest-ce oracle/nosql:ce
```

Start up KVLite in a container. You must give it a name and provide a hostname. Startup of
KVLite is the default `CMD` of the image:

```shell
docker run -d --name=kvlite --hostname=kvlite --env KV_PROXY_PORT=8080 -p 8080:8080 oracle/nosql:ce
```

see instuction https://github.com/oracle/docker-images/tree/main/NoSQL

2. Clone this project and startup the application 

````shell
cd ~/demo-tv-streaming-app
npm install 
export NOSQL_ENDPOINT=nosql-container-host
export NOSQL_PORT=8080
npm start
````


## Load some test data to KVLite runnning in a container

  
````shell
docker cp insert_stream_acct.sql kvlite:insert_stream_acct.sql
docker exec kvlite  java -jar lib/sql.jar -helper-hosts localhost:5000 \
-store kvstore load -file /insert_stream_acct.sql
````

read  https://github.com/oracle/docker-images/tree/main/NoSQL#using-oracle-nosql-command-line-from-an-external-host if you want to run those commands from your host

## Run some GraphQL queries

````shell
curl --request POST     --header 'content-type: application/json' --url 'localhost:3000' \
--data '{"query":"query Streams { streams { id  acct_data { firstName  lastName country } }}"}' | jq
````
````
{
  "data": {
    "streams": [
      {
        "id": 1,
        "acct_data": {
          "firstName": "John",
          "lastName": "Sanders",
          "country": "USA"
        }
      },
      {
        "id": 3,
        "acct_data": {
          "firstName": "Aniketh",
          "lastName": "Shubham",
          "country": "India"
        }
      },
      {
        "id": 2,
        "acct_data": {
          "firstName": "Tim",
          "lastName": "Greenberg",
          "country": "USA"
        }
      }
    ]
  }
}
````

The steps outlined above are using Oracle NoSQL Database community edition, if you need Oracle NoSQL Database Enterprise Edition, please use the appropriate image name.

WARNING Some queries are raising errors when running using community edition. Please contact me to have instructions about build an image using Enterprise Edition


````
curl --request POST \
    --header 'content-type: application/json' \
    --url 'localhost:3000' \
    --data '{"query":"query WatchTime { watchTime { showName seasonNum length } } "}'
````

more queries below


## deployment on kubernetes 

Work in Progress 👷 

see yaml files for a deployment using OKE (Oracle Kubernetes Engine)

## TEST using https://studio.apollographql.com/sandbox 

Note: In order to manage certificates and SSL, I am using the following url after creating an API Gateway 
https://lc22qxcred2zq4ciqms2tzzxv4.apigateway.us-ashburn-1.oci.customer-oci.com/

This API Gateway is connected to a current deployment using OKE (Oracle Kubernetes Engine)



GraphQL queries
````
query Streams {
  streams {
    id
    acct_data {
      firstName
      lastName
      country
      contentStreamed {
        showName
        showId
        showType
        numSeasons
        seriesInfo {
          seasonNum
          numEpisodes
          episodes {
            episodeID
            lengthMin
            minWatched
          }
        }
      }
    }
  }
}

query Stream($streamId: Int) {
  user1:stream(id: $streamId) {
    id
    acct_data {
      firstName
      lastName
      country
      contentStreamed {
        showName
        showId
        showType
        numSeasons
        seriesInfo {
          seasonNum
          numEpisodes
          episodes {
            episodeID
            lengthMin
            minWatched
          }
        }
      }
    }
  }
}


query Stream($streamId: Int) {
  user1:stream(id: $streamId) {
    id
    acct_data {
      firstName
      lastName
      country
      contentStreamed {
        showName
        showId
        showType
        numSeasons
        seriesInfo {
          seasonNum
          numEpisodes
          episodes {
            episodeID
            lengthMin
            minWatched
          }
        }
      }
    }
  }
  user2: stream(id: 2) {
    id 
    }
}


query Stream ($contentDirective: Boolean!){
    user1: stream (id: 1) {
        id
        ...contentStreamed @include(if: $contentDirective)
    }
    user2: stream(id: 2) {
        id
        ...contentStreamed @include(if: $contentDirective)
    }
}

fragment contentStreamed on Stream {
    acct_data
    {
      contentStreamed {  
        showName
        showId
        showType
        numSeasons    
      }
    }
}

query PeopleWatching($country: String!) {
  peopleWatching(country: $country) {
    showId
    cnt
  }
}

query WatchTime {
  watchTime {
    showName
    seasonNum
    length
  }
}
````
GraphQL queries variable
````
{
  "streamId": 1001,
  "country":"USA",
  "contentDirective": true  
}
````

GraphQL mutations
````
mutation CreateStream($input: StreamEntry) {
  createStream(input: $input) {
    id
    acct_data {
      firstName
      lastName
      country
     }
  }
}

{
  "input": {
    "firstName": "dario",
    "lastName": "vega",
    "country": "France",
    "contentStreamed": [
      {
        "showName": "First"
      }
    ]
  }
}

mutation UpdateStream($updateStreamId: Int, $input: StreamEntry) {
  updateStream(id: $updateStreamId, input: $input) {
    id

  }
}

mutation DeleteStream($deleteStreamId: Int) {
  deleteStream(id: $deleteStreamId) {
    id
  }
}
````
