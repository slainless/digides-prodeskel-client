#!/bin/bash

# check argument
case $1 in
    "patch" | "minor" | "major" | "")
        version=$(git describe --abbrev=0 --tags)
        version=${version:1}

        IFS='.' read -ra VERSION_PARTS <<< "$version"
        case $1 in
            "patch" | "")
                VERSION_PARTS[2]=$((VERSION_PARTS[2] + 1))
                ;;
            "minor")
                VERSION_PARTS[1]=$((VERSION_PARTS[1] + 1))
                VERSION_PARTS[2]=0
                ;;
            "major")
                VERSION_PARTS[0]=$((VERSION_PARTS[0] + 1))
                VERSION_PARTS[1]=0
                VERSION_PARTS[2]=0
                ;;
        esac
        version="${VERSION_PARTS[0]}.${VERSION_PARTS[1]}.${VERSION_PARTS[2]}"
        ;;
    "v"*)
        version=${1:1}
        ;;
    *)
        echo "Invalid argument. Possible values are: patch | minor | major | \"v*\""
        exit 1
esac

# bump version
bunx node-jq --arg version "$version" '.version = $version' package.json > package.json.tmp && mv package.json.tmp package.json
bunx node-jq --arg version "$version" '.version = $version' jsr.json > jsr.json.tmp && mv jsr.json.tmp jsr.json

# prepend CHANGELOG
bunx git-cliff --unreleased --tag $version --prepend CHANGELOG.md

# stage jsr.json and package.json
git add jsr.json package.json

# commit then tag
git commit -m "chore(version): $version"
git tag -a "v$version" -m "$(bunx git-cliff --unreleased --tag $version)"
