const { ApolloServer, gql } = require('apollo-server');

const fs = require('fs')
const NoSQLClient = require('oracle-nosqldb').NoSQLClient;
const Region = require('oracle-nosqldb').Region;
const ServiceType = require('oracle-nosqldb').ServiceType;

process
.on('SIGTERM', function() {
  console.log("\nTerminating");
  if (client) {
     console.log("\close client SIGTERM");
     client.close();
  }
  process.exit(0);
})
.on('SIGINT', function() {
  console.log("\nTerminating");
  if (client) {
     console.log("\close client SIGINT");
     client.close();
  }
  process.exit(0);
});

async function createTable(client) {
  const createDDL = fs.readFileSync('demo_stream_acct.ddl', 'utf8')
  // readUnits, writeUnits, storageGB only used if Cloud Service
  let resTab = await client.tableDDL(createDDL, {
      tableLimits: {
          readUnits: 20,
          writeUnits: 20,
          storageGB: 1
      }
  });
  await client.forCompletion(resTab);
  console.log('  Creating table %s', resTab.tableName);
  console.log('  Table state: %s', resTab.tableState.name);
}

function createNoSQLClient() {
       return new NoSQLClient({
            serviceType: ServiceType.KVSTORE,
            endpoint: process.env.NOSQL_ENDPOINT + ":" + process.env.NOSQL_PORT
        });
}


//
// NoSQL Access Helpers
//
const TABLE_NAME = 'stream_acct';

async function getAllStreamsHelper() {
  let statement = `SELECT d.id, d.acct_data as acct_data FROM ${TABLE_NAME} d LIMIT 100`;
  const rows = [];
  let cnt ;
  let res;
  do {
     res = await client.query(statement, { continuationKey:cnt});
     rows.push.apply(rows, res.rows);
     cnt = res.continuationKey;
  } while(res.continuationKey != null);
  return rows;
}

async function peopleWatching(country) {
  let statement = `SELECT $show.showId, count(*) as cnt FROM ${TABLE_NAME} $s, unnest($s.acct_data.contentStreamed[] as $show) WHERE $s.acct_data.country = "USA" GROUP BY $show.showId ORDER BY count(*) DESC` 
  const rows = [];
  let cnt ;
  let res;
  do {
     res = await client.query(statement, { continuationKey:cnt});
     rows.push.apply(rows, res.rows);
     cnt = res.continuationKey;
  } while(res.continuationKey != null);
  return rows;
}

async function watchTime() {
  let statement = `SELECT $show.showName, $seriesInfo.seasonNum, sum($seriesInfo.episodes.minWatched) AS length FROM stream_acct n, unnest(n.acct_data.contentStreamed[] AS $show, $show.seriesInfo[] as $seriesInfo) GROUP BY $show.showName, $seriesInfo.seasonNum ORDER BY sum($seriesInfo.episodes.minWatched)`
  const rows = [];
  let cnt ;
  let res;
  do {
     res = await client.query(statement, { continuationKey:cnt});
     rows.push.apply(rows, res.rows);
     cnt = res.continuationKey;
  } while(res.continuationKey != null);
  return rows;
}

async function getOneStreamHelper(id) {
  res = await client.get(TABLE_NAME, { id: id });
  //let z = Object.assign({id :id}, res.row.acct_data)
  return res.row;
}

async function createStreamHelper(input) {
  res = await client.putIfAbsent(TABLE_NAME, {
        acct_data: input
  });
  let newStream = {id: res.generatedValue , acct_data: input};
  return newStream;
}

async function updateStreamHelper(id, input) {
  res = await client.putIfPresent(TABLE_NAME, {
        id: id,
        acct_data: input
  });
  let updStream = {id :id,  acct_data: input};
  return updStream;
}

async function deleteStreamHelper(id) {
  res = await client.delete(TABLE_NAME, {
        id: id
  });
  delStream = {id: id, acct_data: null};
  return delStream;
}

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
type episodes {
  episodeID: Int!,
  lengthMin: Int!,
  minWatched: Int!
}

type seriesInfo {
  seasonNum: Int!,
  numEpisodes: Int!,
  episodes: [episodes]
}
type contentStreamed {
  showName: String!
  showId: Int,
  showType: String,
  numSeasons: Int,
  seriesInfo: [seriesInfo]
}
type StreamContent {
  firstName: String!,
  lastName: String!,
  country: String!,
  contentStreamed: [contentStreamed]
}
type Stream {
  id: Int!,
  acct_data: StreamContent
}
type AggResult1 {
  showId: Int!,
  cnt: Int!
}
type AggResult2 {
  showName: String!,
  seasonNum: Int!,
  length: Int!
}
type Query {
  streams: [Stream],
  stream(id: Int): Stream,
  peopleWatching(country: String!): [AggResult1!],
  watchTime: [AggResult2!]
}
input contentStreamedEntry {
  showName: String!
}
input StreamEntry {
  firstName: String!,
  lastName: String!,
  country: String!,
  contentStreamed: [contentStreamedEntry]
}
type Mutation {
  createStream(input: StreamEntry): Stream!,
  updateStream(id: Int, input: StreamEntry): Stream!,
  deleteStream(id: Int): Stream!
}
`;


// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    streams(root, args, context, info) {
      return getAllStreamsHelper();
    },
    stream(root, {id}, context, info) {
      return getOneStreamHelper(id);
    },
    peopleWatching(root, {country}, context, info) {
      return peopleWatching(country);
    },
    watchTime(root,  context, info) {
      return watchTime();
    }
  },
  Mutation: {
	createStream(root, {input}, context, info) {
      return createStreamHelper(input);
    },
    updateStream(root, {id, input}, context, info) {
      return updateStreamHelper(id, input);
    },
    deleteStream(root, {id}, context, info) {
      return deleteStreamHelper(id);
    }
  }
};


// Connecting to NoSQL and create table
const client = createNoSQLClient();
createTable(client);


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });


// The `listen` method launches a web server.
server.listen({port:3000}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});


