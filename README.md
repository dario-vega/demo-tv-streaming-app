# demo-tv-streaming-app
Demo TV streaming application using GraphQL and NoSQL
Work in Progress 👷

## Deployment
1. Install and Run NoSQL docker image
2. Clone this repository
3. Run

````

cd ~/demo-tv-streaming-app
npm install 
npm start
````

## TEST

1. USE POSTMAN
2. USE studio.apollographql.

Note: In order to manage certificates and SSL, I am using the following url after create an API Gateway 
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

query Streams($streamId: Int) {
  stream(id: $streamId) {
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
