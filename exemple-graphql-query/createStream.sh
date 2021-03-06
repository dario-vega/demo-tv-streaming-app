#
# CreateStream
#

cat collection.json | jq '.item[]| select(.name=="CreateStream") | .request.body.graphql'

cp user.json user-copy.json
sed -z 's/\n/\\r\\n/g' -i user-copy.json
sed -i "s/\"/\\\\\"/g"  user-copy.json
cp collection.json collection-copy.json
sed -e "s/NOSQL_EXAMPLE_USER/$(<user-copy.json sed -e 's/[\&/]/\\&/g')/g" -i collection-copy.json
cat collection-copy.json | jq '.item[]| select(.name=="CreateStream") | .request.body.graphql' >  query.json
cat query.json

NOSQL_EXAMPLE_STREAMID=$(curl --location --request POST 'http://localhost:3000/' \
--header 'Content-Type: application/json' \
--data @query.json 2>/dev/null | jq '.data.createStream.id')
echo $NOSQL_EXAMPLE_STREAMID > _createStreamId.txt
echo "createStream.id=$NOSQL_EXAMPLE_STREAMID"
