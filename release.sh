#!/bin/bash

version="$1"
echo ${version}
regex="[0-9]\+\.[0-9]\+\.[0-9]\+"

sed -i "s/\"version\": \"${regex}\"/\"version\": \"${version}\"/g" package.json
sed -i "s/aws-clickstream-react-native-${regex}.tgz/aws-clickstream-react-native-${version}.tgz/g" README.md
