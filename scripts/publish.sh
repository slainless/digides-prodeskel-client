#!/bin/bash

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
echo "~ Release preparation for version $version"

echo "~ Bumping package.json and jsr.json"
bunx node-jq --arg version "$version" '.version = $version' package.json > package.json.tmp && mv package.json.tmp package.json
bunx node-jq --arg version "$version" '.version = $version' jsr.json > jsr.json.tmp && mv jsr.json.tmp jsr.json

echo "~ Prepending CHANGELOG.md"
bunx git-cliff --unreleased --tag $version --prepend CHANGELOG.md

echo "~ Committing changes"
git add jsr.json package.json CHANGELOG.md
git commit -m "chore(version): $version"
git tag -a "v$version" -m "$(bunx git-cliff --unreleased --tag $version)"
