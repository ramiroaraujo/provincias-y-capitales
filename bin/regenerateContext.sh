DEST_FOLDER=~/Desktop/provincias
mkdir -p "$DEST_FOLDER"
rm -rf "$DEST_FOLDER"/*

tree /Users/ramiroaraujo/Development/provincias-y-capitales/src > "$DEST_FOLDER/src-tree.txt"

# @todo add git log

cp /Users/ramiroaraujo/Development/provincias-y-capitales/src/app/layout.tsx "$DEST_FOLDER/"
cp /Users/ramiroaraujo/Development/provincias-y-capitales/src/app/page.tsx "$DEST_FOLDER/"
cp /Users/ramiroaraujo/Development/provincias-y-capitales/src/lib/game.ts "$DEST_FOLDER/"
cp /Users/ramiroaraujo/Development/provincias-y-capitales/src/lib/provinces.ts "$DEST_FOLDER/"
cp /Users/ramiroaraujo/Development/provincias-y-capitales/src/lib/utils.ts "$DEST_FOLDER/"
cp /Users/ramiroaraujo/Development/provincias-y-capitales/package.json "$DEST_FOLDER/"

open "$DEST_FOLDER"
