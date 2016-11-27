.SUFFIXES: .png .svg
.PHONY: all clean

BATIK:=java -cp batik-all.jar:xml-apis-ext.jar org.apache.batik.apps.rasterizer.Main -scriptSecurityOff

all: Map1.js Map2.js Map3.js Map4.js Map5.js Map6.js Map7.js Map8.js Map9.js Map10.js Map11.js Map12.js

clean:
	rm -f Map1.js Map2.js Map3.js Map4.js Map5.js Map6.js Map7.js Map8.js Map9.js Map10.js Map11.js Map12.js

Map1.js: Tile.js IVector.js World.js compileMap.js Map1.tilemap
	rhino -f IVector.js -f Tile.js -f World.js compileMap.js Map1.tilemap > Map1.js || rm -f Map1.js
Map2.js: Tile.js IVector.js World.js compileMap.js Map2.tilemap
	rhino -f IVector.js -f Tile.js -f World.js compileMap.js Map2.tilemap > Map2.js || rm -f Map2.js
Map3.js: Tile.js IVector.js World.js compileMap.js Map3.tilemap
	rhino -f IVector.js -f Tile.js -f World.js compileMap.js Map3.tilemap > Map3.js || rm -f Map3.js
Map4.js: Tile.js IVector.js World.js compileMap.js Map4.tilemap
	rhino -f IVector.js -f Tile.js -f World.js compileMap.js Map4.tilemap > Map4.js || rm -f Map4.js
Map5.js: Tile.js IVector.js World.js compileMap.js Map5.tilemap
	rhino -f IVector.js -f Tile.js -f World.js compileMap.js Map5.tilemap > Map5.js || rm -f Map5.js
Map6.js: Tile.js IVector.js World.js compileMap.js Map6.tilemap
	rhino -f IVector.js -f Tile.js -f World.js compileMap.js Map6.tilemap > Map6.js || rm -f Map6.js
Map7.js: Tile.js IVector.js World.js compileMap.js Map7.tilemap
	rhino -f IVector.js -f Tile.js -f World.js compileMap.js Map7.tilemap > Map7.js || rm -f Map7.js
Map8.js: Tile.js IVector.js World.js compileMap.js Map8.tilemap
	rhino -f IVector.js -f Tile.js -f World.js compileMap.js Map8.tilemap > Map8.js || rm -f Map8.js
Map9.js: Tile.js IVector.js World.js compileMap.js Map9.tilemap
	rhino -f IVector.js -f Tile.js -f World.js compileMap.js Map9.tilemap > Map9.js || rm -f Map9.js
Map10.js: Tile.js IVector.js World.js compileMap.js Map10.tilemap
	rhino -f IVector.js -f Tile.js -f World.js compileMap.js Map10.tilemap > Map10.js || rm -f Map10.js
Map11.js: Tile.js IVector.js World.js compileMap.js Map11.tilemap
	rhino -f IVector.js -f Tile.js -f World.js compileMap.js Map11.tilemap > Map11.js || rm -f Map11.js
Map12.js: Tile.js IVector.js World.js compileMap.js Map12.tilemap
	rhino -f IVector.js -f Tile.js -f World.js compileMap.js Map12.tilemap > Map12.js || rm -f Map12.js
menu.js: Tile.js IVector.js World.js compileMap.js menu.tilemap
	rhino -f IVector.js -f Tile.js -f World.js compileMap.js menu.tilemap > menu.js || rm -f menu.js
princess.js: Tile.js IVector.js World.js compileMap.js princess.tilemap
	rhino -f IVector.js -f Tile.js -f World.js compileMap.js princess.tilemap > princess.js || rm -f princess.js










