#
# Query Streams by Id
#

cat collection.json | jq '.item[]| select(.name=="Query Streams by Id") | .request.body.graphql' 

cat collection-copy.json | jq '.item[]| select(.name=="Query Streams by Id") | .request.body.graphql' >  query.json
cat query.json

curl --location --request POST 'http://localhost:3000/' \
--header 'Content-Type: application/json' \
--data @query.json 2>/dev/null | jq
