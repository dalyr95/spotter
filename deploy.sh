#!/bin/sh
pushd `dirname $0` > /dev/null
SCRIPTPATH=`pwd -P`
DIR="$SCRIPTPATH"

DIST=$DIR/public
REGION="eu-west-1"
BUCKET="app.spotter.online"
TARGET="s3://$BUCKET/"
CLOUDFRONT_DIST_ID=E3LMETTWTDO9HQ

echo "Deploying from: '$DIR' to $TARGET"
INDEX_FILE=public/index.html
INDEX_FILE_BACKUP_EXTENSION=".release"
INDEX_FILE_BACKUP=$INDEX_FILE$INDEX_FILE_BACKUP_EXTENSION
TS=`date +"%s"`
echo "Updating bundle.js url in " $INDEX_FILE
SED_RULE='s#bundle/js/bundle.js#bundle/js/bundle.js?v='$TS'#g'
sed -i$INDEX_FILE_BACKUP_EXTENSION -e $SED_RULE $INDEX_FILE
aws --profile=spotter s3 sync $DIST $TARGET
echo "reverting back" $INDEX_FILE
mv $INDEX_FILE_BACKUP $INDEX_FILE

echo "Invalidating cloudfront distribution E3LMETTWTDO9HQ"
aws --profile=spotter cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths '/*'