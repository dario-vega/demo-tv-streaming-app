#
# UpdateStream
#

cat collection.json | jq '.item[]| select(.name=="UpdateStream") | .request.body.graphql' 

NOSQL_EXAMPLE_STREAMID=$(cat _createStreamId.txt)
cp show.json show-copy.json
sed -z 's/\n/\\r\\n/g' -i show-copy.json
sed -i "s/\"/\\\\\"/g"  show-copy.json
cp collection.json collection-copy.json
sed -i "s/NOSQL_EXAMPLE_STREAMID/$NOSQL_EXAMPLE_STREAMID/g"  collection-copy.json
sed -e "s/NOSQL_EXAMPLE_SHOW/$(<show-copy.json sed -e 's/[\&/]/\\&/g')/g" -i collection-copy.json
cat collection-copy.json | jq '.item[]| select(.name=="UpdateStream") | .request.body.graphql' >  query.json
cat query.json

curl --location --request POST 'http://localhost:3000/' \
--header 'Content-Type: application/json' \
--data @query.json 2>/dev/null | jq
