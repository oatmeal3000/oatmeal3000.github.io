var GameView = (function () {
  var tileToImage = {
    "Block": "Stone%20Block",
    "Grass": "Grass%20Block",
    "Dirt": "Dirt%20Block",
    "Washout": "Rock",
    "PushBlock": "Wall%20Block",
    "RampN": "Ramp%20South",
    "RampE": "Ramp%20West",
    "RampS": "Ramp%20North",
    "RampW": "Ramp%20East",

    "RoofNorth": "Roof%20South",
    "RoofSouth": "Roof%20North",
    "RoofEast": "Roof%20West",
    "RoofWest": "Roof%20East",
    "RoofNorthEast": "Roof%20South%20West",
    "RoofNorthWest": "Roof%20South%20East",
    "RoofSouthEast": "Roof%20North%20West",
    "RoofSouthWest": "Roof%20North%20East",

    "Player": "Character%20Boy",
    "PlayerWon": "Character%20Boy",
    "Water": "Water%20Block",
    "WaterNew": "Water%20Block",
    "Gem1": "Gem%20Blue",
    "Gem2": "Gem%20Green",
    "Gem3": "Gem%20Orange",
    "GemWall1": "Block%20Blue",
    "GemWall2": "Block%20Green",
    "GemWall3": "Block%20Orange",
    "Exit": "Selector",
    "Brown": "Brown%20Block",
    "CatGirl": "Character%20Cat%20Girl",
    "HornGirl": "Character%20Horn%20Girl",
    "PinkGirl": "Character%20Pink%20Girl",
    "Princess": "Character%20Princess%20Girl",
    "ChestClosed": "Chest%20Closed",
    "ChestLid": "Chest%20Lid",
    "ChestOpen": "Chest%20Open",
    "DoorClosed": "Door%20Tall%20Closed",
    "DoorOpen": "Door%20Tall%20Open",
    "Bug": "Enemy%20Bug",
    "Heart": "Heart",
    "Key": "Key",
    "SpeechBubble": "SpeechBubble",
    "TreeShort": "Tree%20Short",
    "TreeTall": "Tree%20Tall",
    "TreeUgly": "Tree%20Ugly",
    "PushTall": "Wall%20Block%20Tall",
    "Window": "Window%20Tall",
    "Wood": "Wood%20Block",
    "StoneTall": "Stone%20Block%20Tall",

    "WindowShort": "Window%20Short",
    "Empty": "Empty"
  };

  function toPx(cssLength) {
 //   return Number(/^(\d+)px/.exec(cssLength)[1]);
       var oL = cssLength.lastIndexOf("px");
       return cssLength.substr(0, oL);    
  }

  function GameView(state, playfield, viewport, stateView, inventoryView) {
    var world = state.world;
    while (playfield.firstChild) {
      playfield.removeChild(playfield.firstChild);
    }
    
    // Image size. XXX get from image
    var rawTileWidth = 101;
    var rawTileHeight = 171;
    //      Image pixel width corresponding to a                 tile width.
    var rawTileXStep = rawTileWidth;             // "left-right"
    var rawTileYStep = rawTileHeight * 82 / 171; // "front-back"
    var rawTileZStep = rawTileHeight * 42 / 171; // "up-down"
    // These values are calculated in this way so that the image can be rescaled and 
    // get the same results.
    
    // View parameters:
    // Width and height of area tiles are displayed in
    var fieldWidth;
    var fieldHeight;
    // px dimensions to scale tiles to
    var drawWidth;
    var drawHeight;
    // Conversions from tile counts to document px
    var xUnit;
    var yUnit;
    var zUnit;
    // document px offsets for the origin of the scene
    var xOrigin;
    var yOrigin;
    // world bounding box
    var worldBBNX;
    var worldBBPX;
    var worldBBNY;
    var worldBBPY;
    // offset of display origin independent of bounding box
    var offsetX;
    var offsetY;
    
    // player position noted, used for scrolling
    var playerPos;
    
    function calcView() {
      if(isIE = navigator.userAgent.indexOf("MSIE")!=-1) { 
        var computedStyle = viewport.currentStyle; 
      } else {
        var computedStyle = window.getComputedStyle(viewport, null);
      }
      fieldWidth = toPx(computedStyle.width);
      fieldHeight = toPx(computedStyle.height);

      console.log("fieldWidth" + fieldWidth);
      console.log("fieldHeight" + fieldHeight)

      var viewScale = Math.min(fieldWidth  / (world.xw * rawTileXStep),
                               fieldHeight / (world.yw * rawTileYStep + world.zw * rawTileZStep + rawTileHeight));

      if(fieldWidth > 1500){
        viewScale = 1;
      }else{
        viewScale = Math.max(viewScale, 0.6); // XXX less arbitrary stop; compare to em unit size
      }

      // Pixel width and height an individual tile is drawn at
      drawWidth  = Math.max(1, Math.floor(viewScale * rawTileWidth));
      drawHeight = Math.max(1, Math.floor(viewScale * rawTileHeight));

      // 1 world x step = xUnit pixels, and so on
      xUnit = Math.max(1, Math.floor(viewScale * rawTileXStep));
      yUnit = Math.max(1, Math.floor(viewScale * rawTileYStep));
      zUnit = Math.max(1, Math.floor(viewScale * rawTileZStep));

      worldBBNX = 0;
      worldBBPX = xUnit * world.xw;
      worldBBNY = -zUnit * world.zw;
      worldBBPY = yUnit * (world.yw + 1);
      
      offsetX = Math.max(-worldBBNX, (fieldWidth - (worldBBPX - worldBBNX)) / 2);
      offsetY = Math.max(-worldBBNY, (fieldHeight - (worldBBPY - worldBBNY)) / 2);
    }
    
    function scroll() {
      var vp;
      if (playerPos == undefined) {
        vp = {x:0,y:0};
      } else {
         vp = calcViewPos(playerPos);
      }
      fieldHeight = 200;
      window.scrollTo(vp.x - (fieldWidth - drawWidth) / 2,
                      vp.y - (fieldHeight - drawHeight) / 2);
    }
    
    calcView();
    setTimeout(scroll, 0);
    
    // Create tile images
    var tileElems = [];
    var tileAnims = [];
    var tileShadows = [];
    for (var x = 0; x < world.xw; x++) {
      for (var y = 0; y < world.yw; y++) {
        for (var z = 0; z < world.zw; z++) {
          var tile = world.get(new IVector(x, y, z));
          
          var tileElem = document.createElement("img");
          tileElems.push(tileElem);
          tileAnims.push(null);
          tileShadows.push([]); // dynamically created later
          playfield.appendChild(tileElem);
          tileElem.style.position="absolute";
          update(new IVector(x,y,z));
        }
      }
    }
    
    
    // Update an arbitrary tile element from tile (used for inventory and world)
    function updateImage(tileElem, tile) {
      tileElem.style.visibility = (tile.name === "Empty") ? "hidden" : "visible";
    // var image = tileToImage[tile.name] || "Rock";
      var image = tileToImage[tile.name];  
      tileElem.src = "resources/"+image+".png";
    }
    
    function shadow(shadows, image, pos, fudge) {
      var shadow = document.createElement("img");
      shadow.style.position="absolute";
      shadow.src = "resources/"+image+".png";
      setViewPos(shadow, pos, fudge);
      setViewScale(shadow);

      shadows.push(shadow);
      playfield.appendChild(shadow);
    }
    
    // Update tile image from world
    function update(pos) {
      var x = pos.x;
      var y = pos.y;
      var z = pos.z;
      var tile = world.get(pos);          
      var tileElem = tileElems[x*world.yw*world.zw + y*world.zw + z];
      
      if (tile.toString() == "Tile.Player" || tile.toString() == "Tile.PlayerWon") {
        playerPos = pos;
        scroll();
      }
      
      updateImage(tileElem, tile);
      updateShadows(pos);
    }
    
    function updateShadows(pos) {
      var x = pos.x;
      var y = pos.y;
      var z = pos.z;
      var index = x*world.yw*world.zw + y*world.zw + z;
      var shadows = tileShadows[index];
      while (shadows.length > 0)
        playfield.removeChild(shadows.pop());
      if (world.get(pos).isShadowing() && tileAnims[index] == null) {
        var s;
        if (!world.get(new IVector(x,y+1,z)).isShadowing()
            && world.get(s=new IVector(x,y+1,z-1)).isShadowing())
          shadow(shadows, "Shadow North", s, 1);

        if (!world.get(new IVector(x,y-1,z)).isShadowing()
            && world.get(s=new IVector(x,y-1,z-1)).isShadowing())
          shadow(shadows, "Shadow South", s, 1);

        if (!world.get(new IVector(x-1,y,z)).isShadowing()
            && world.get(s=new IVector(x-1,y,z-1)).isShadowing())
          shadow(shadows, "Shadow East", s, 1);

        if (!world.get(new IVector(x+1,y,z)).isShadowing()
            && world.get(s=new IVector(x+1,y,z-1)).isShadowing())
          shadow(shadows, "Shadow West", s, 1);

        if (!world.get(new IVector(x+1,y+1,z)).isShadowing()
            && !world.get(new IVector(x+1,y,z)).isShadowing()
            && !world.get(new IVector(x,y+1,z)).isShadowing()
            && world.get(s=new IVector(x+1,y+1,z-1)).isShadowing())
          shadow(shadows, "Shadow North West", s, 1);

        if (!world.get(new IVector(x-1,y+1,z)).isShadowing()
            && !world.get(new IVector(x-1,y,z)).isShadowing()
            && !world.get(new IVector(x,y+1,z)).isShadowing()
            && world.get(s=new IVector(x-1,y+1,z-1)).isShadowing())
          shadow(shadows, "Shadow North East", s, 1);

        if (!world.get(new IVector(x+1,y-1,z)).isShadowing()
            && !world.get(new IVector(x+1,y,z)).isShadowing()
            && !world.get(new IVector(x,y-1,z)).isShadowing()
            && world.get(s=new IVector(x+1,y-1,z-1)).isShadowing())
          shadow(shadows, "Shadow South West", s, 1);

        if (!world.get(new IVector(x-1,y-1,z)).isShadowing()
            && !world.get(new IVector(x-1,y,z)).isShadowing()
            && !world.get(new IVector(x,y-1,z)).isShadowing()
            && world.get(s=new IVector(x-1,y-1,z-1)).isShadowing())
          shadow(shadows, "Shadow South East", s, 1);

        if (world.get(new IVector(x-1,y+1,z)).isShadowing()
            && world.get(s=pos).isShadowing()
            && !world.get(new IVector(x,y+1,z)).isShadowing())
          shadow(shadows, "Shadow Side West", s, 1);
      }
    }
    
    function calcViewPos(pos) {
      return {
        x: pos.x * xUnit + offsetX,
        y: pos.y * yUnit - pos.z * zUnit + offsetY, 
        zIndex: 1 + (pos.y + pos.z) * 1000
      };
    }
    
    function setViewPos(tileElem, pos, fudge) {
      var vp = calcViewPos(pos);
      tileElem.style.zIndex = vp.zIndex + (fudge || 0);
      tileElem.style.left = vp.x + "px";
      tileElem.style.top = vp.y + "px";
    }
    
    function setViewScale(tileElem) {
      tileElem.style.width = drawWidth + "px";
      tileElem.style.height = drawHeight + "px";
    }
    
    function GiveHints() {
          var hintsArea = document.getElementById('hints');
          if(hintsArea == null) return;
          hintsArea.style.display='block';
          hintsArea.style.filter="Alpha(Opacity=100)";
          hintsArea.style.opacity=1;
          var m;
          i = 100;
          var c = function()
          {   
              if(i == 0) i = 100;
              var ad = document.getElementById("hints");

              with(ad.style)        
              {
                  filter = "Alpha(Opacity=" + i + ")"; //for IE 
                  opacity = i/100; //for FF
                  i--;
                  if (parseInt(i) < 1){
                      clearInterval(m);
                      ad.style.display = "none";
                  }
              }
     
          }
          setTimeout(function(){m = setInterval(c,1);},3000);
    }

    // Set layout styles
    function layout() {
      for (var z = 0; z < world.zw; z++) {
        for (var y = 0; y < world.yw; y++) {
          for (var x = 0; x < world.xw; x++) {
            var vec = new IVector(x, y, z);
            var tile = world.get(vec);
            var tileElem = tileElems[x*world.yw*world.zw + y*world.zw + z];
            setViewPos(tileElem, vec);
            setViewScale(tileElem);
            updateShadows(vec); // incidentally updates shadow pos
          }
        }
      }      
    }
    
    layout();

    var animate = {
      moveFrom: function (pos, oldPos) {
        var offset = (oldPos.sub(pos));
        var index = pos.x*world.yw*world.zw + pos.y*world.zw + pos.z;
        if (tileAnims[index]) clearInterval(tileAnims[index]);
        var tileElem = tileElems[index];
        var t = 1;
        var interval;
        function anim() {
          t -= 0.2;
          if (t <= 0) {
            t = 0;
            clearInterval(interval);
            tileAnims[index] = null;
            updateShadows(pos);
          }
          var animPos = pos.add(new IVector(offset.x * t, offset.y * t, offset.z * t)); // XXX abuse of IVector
          var vp = calcViewPos(animPos);
          tileElem.style.zIndex = vp.zIndex;
          tileElem.style.left = vp.x + "px";
          tileElem.style.top = vp.y + "px";
          
          var tile = world.get(pos);
          if (tile.toString() == "Tile.Player" || tile.toString() == "Tile.PlayerWon") {
            playerPos = animPos;
            scroll();
          }
          
          //console.log("animation", vp.x, (vp.x + (1 - t) * xUnit));
        }
        interval = setInterval(anim, 10);
        tileAnims[index] = interval;
        updateShadows(pos); // clears shadows when it notices the anim
        anim();
      }
    };
    
    var playListener = {
      take: function (tile) {
        var tileElem = document.createElement("img");
        inventoryView.appendChild(tileElem);
        updateImage(tileElem, tile);
      },
      status: function (status) {
        var text = "<error>";
        switch (status) {
          case "exitable":
            text = "到星门那里去吧!";
            // XXX enable exit highlight
            break;
          case "playing":
            text = "想办法收集宝石!";
            break;
          case "won":
            text = "天才! 过关啦!";
            document.getElementById('start').pause();
            var sound_win = document.getElementById('win').play();
              // XXX win animation
            setTimeout("window.location.href='index.html'",5000);
            break;
          case "drowned":
            text = "被洪水淹没了!";
            document.getElementById('start').pause();
            var sound_fail = document.getElementById('fail').play();
            setTimeout("document.location.reload()", 2000);
            break;
          case "other-loss":
            text = "不知道怎么回事你给挂掉了!";
            break;
        }
        if(text != stateView.innerHTML){
            stateView.innerHTML = text;
            GiveHints();
        }
      }
    };
    
    function movePlayerKey(x,y) {
      state.movePlayer(new IVector(x, y, 0));
    }
    
    function changed(pos) {
      var x = pos.x;
      var y = pos.y;
      var z = pos.z;
      var np;
      update(pos);
      for (var nx = x - 1; nx <= x + 1; nx++)
        for (var ny = y - 1; ny <= y + 1; ny++)
          for (var nz = z - 1; nz <= z; nz++)
            if (world.inBounds(np = new IVector(nx, ny, nz)))
              updateShadows(np);
    }
    
    world.addChangeListener(changed);
    state.addAnimationListener(animate);
    state.addPlayListener(playListener);
    playListener.status(state.getGameStatus());
    
    return {
      onresize: function () {
        calcView();
        layout();
      },
      onkeydown: function (event) {
        switch (event.keyCode) {
          case 37: movePlayerKey(-1,  0); break; // left
          case 38: movePlayerKey( 0, -1); break; // up
          case 39: movePlayerKey( 1,  0); break; // right
          case 40: movePlayerKey( 0,  1); break; // down
          default:
            console.log("Ignoring keyCode " + event.keyCode);
            return true;
        }
        return false;
      },
      playerMove: movePlayerKey
    };
  }
  return GameView;
})();


  function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        var i = 0;
        for (var len = obj.length; i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
     if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
     }
     throw new Error("Unable to copy obj! Its type isn't supported.");
   }

   function getType(o)
    {
        var _t;
        return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();
    }

    function extend(destination,source)
    {
        for(var p in source)
        {
            if(getType(source[p])=="array"||getType(source[p])=="object")
            {
                destination[p]=getType(source[p])=="array"?[]:{};
                arguments.callee(destination[p],source[p]);
            }
            else
            {
                destination[p]=source[p];
            }
        }
    }
  