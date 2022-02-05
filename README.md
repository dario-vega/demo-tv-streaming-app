# demo-tv-streaming-app
Demo TV streaming application using GraphQL and NoSQL
Work in Progress 👷

## Deployment on Docker
1. Run NoSQL KVLITE docker container

see instuction https://github.com/oracle/docker-images/tree/main/NoSQL

2. Deploy this application

````shell
docker pull ghcr.io/dario-vega/demo-tv-streaming-app:latest
docker tag ghcr.io/dario-vega/demo-tv-streaming-app:latest demo-tv-streaming-app:latest
````

Start up the demo in a container. 

````shell
docker run -d --link kvlite:kvlite -p 3000:3000 demo-tv-streaming-app:latest 
````

Note the use of --link to contact the KVLite Container (actual KVLite container is named kvlite; alias is kvlite).

This project offers sample container image to show how to connect a NoSQL application to Oracle NoSQL Database Proxy

ENV NOSQL_ENDPOINT kvlite
ENV NOSQL_PORT 8080

## Deployment on a external host connected to NoSQL KVLITE docker container


Clone this project

````shell
cd ~/demo-tv-streaming-app
npm install 
export NOSQL_ENDPOINT=nosql-container-host
export NOSQL_PORT=8080
npm start
````


## TEST USING KVLITE CONTAINER

Load test data
  
````shell
docker cp insert_stream_acct.sql kvlite:insert_stream_acct.sql
docker exec kvlite  java -jar lib/sql.jar -helper-hosts localhost:5000 -store kvstore load -file /insert_stream_acct.sql
````

Run some GraphQL queries

````shell
curl --request POST     --header 'content-type: application/json'     --url 'localhost:3000'     --data '{"query":"query Streams {\r\n  streams {\r\n    id\r\n    acct_data {\r\n      firstName\r\n      lastName\r\n      country\r\n    }\r\n  }\r\n}"}' | jq
````

more queries below

## deployment on kubernetes 

Work in Progress 👷 

## TEST using https://studio.apollographql.com/sandbox 

Note: In order to manage certificates and SSL, I am using the following url after creating an API Gateway 
https://lc22qxcred2zq4ciqms2tzzxv4.apigateway.us-ashburn-1.oci.customer-oci.com/



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
