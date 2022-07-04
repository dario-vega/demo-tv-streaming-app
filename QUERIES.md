# demo-tv-streaming-app
Demo TV streaming application using GraphQL and NoSQL

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

