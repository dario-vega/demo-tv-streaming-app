#
# DeleteStream
#

cat collection.json | jq '.item[]| select(.name=="DeleteStream") | .request.body.graphql' 


cat collection-copy.json | jq '.item[]| select(.name=="DeleteStream") | .request.body.graphql' >  query.json
cat query.json

curl --location --request POST 'http://localhost:3000/' \
--header 'Content-Type: application/json' \
--data @query.json 

