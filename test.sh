#!/bin/bash

curl -f -X POST \
    -H "X-Parse-Application-Id: app1" \
    -H "X-Parse-Master-Key: 123456" \
    -H "Content-Type: application/json" \
    -d '{"name":"Star Wars"}' \
    http://localhost:1337/app/app1/classes/Movie

curl -f -X POST \
    -H "X-Parse-Application-Id: app1" \
    -H "X-Parse-Master-Key: 123456" \
    -H "Content-Type: application/json" \
    -d '{"name":"Indiana Jones"}' \
    http://localhost:1337/app/app1/classes/Movie
