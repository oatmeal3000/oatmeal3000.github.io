
var box2d = {
   b2Vec2 : Box2D.Common.Math.b2Vec2,
   b2BodyDef : Box2D.Dynamics.b2BodyDef,
   b2Body : Box2D.Dynamics.b2Body,
   b2FixtureDef : Box2D.Dynamics.b2FixtureDef,
   b2Fixture : Box2D.Dynamics.b2Fixture,
   b2World : Box2D.Dynamics.b2World,
   b2MassData : Box2D.Collision.Shapes.b2MassData,
   b2PolygonShape : Box2D.Collision.Shapes.b2PolygonShape,
   b2CircleShape : Box2D.Collision.Shapes.b2CircleShape,
   b2DebugDraw : Box2D.Dynamics.b2DebugDraw,
   b2RevoluteJointDef : Box2D.Dynamics.Joints.b2RevoluteJointDef
};

const SCALE = 30;

const STAGE_WIDTH = 1000;
const STAGE_HEIGHT = 700;
const BLOOD_VESSEL_THICKNESS = 170;

const DIALOG_IMAGE_X = 450;
const DIALOG_IMAGE_Y = 350;

const STARTING_LIFE = 10;
const REMOVE_LIFE_ON_PANTH_FINISH = 1;

const STARTING_ENERGY = 200;
const ADD_ENERGY_ON_RED_FINISH = 5;
const WHITE_ENERGY_CREATION_COST = 100;

const END_GAME_ENERGY_NEEDED = 600;

var canvas, stage, world;
var debugCanvas;
var resourcesQueue;
var collisionDetection;
var environment;

var gameStateEnum = {INITIAL: 0, PLAYING: 1, PAUSE: 2};
var gameState;

//var backgroundLevel1;

var backgroundImage;
var darkStage;
var toolbar;
var circle;
var dialogContainer;

var messageField;
var circleSelectedColor;
var movingObject;
var isThereMovingObject;

var isDialogDisplayed;
var dialogTextArray;
var dialogTextCurrentIndex;

var spawnPointY;

var ballsArray;
var ballsContainer;

var whitesArray;
var whitesContainer;

var destroyBodyList;

var panthCreationTickCounter;
var playingTickCounter;

var panthProbabilitiesArray;

var youtubeIcon;

var energy;
var energyTextField;
var life;
var lifeTextField;

var wasFirstLifeLostAlready;

/**
 * TODO:
 *       - fine tune energy/health cifre
 *       - fine tune tick cifre
 */
function init() {
    gameState = gameStateEnum.INITIAL;

	canvas = document.getElementById("canvas");
	stage = new createjs.Stage(canvas);

    debugCanvas = document.getElementById("debugCanvas");
	
	// enable touch interactions if supported on the current device:
	createjs.Touch.enable(stage);



	messageField = new createjs.Text("LOADING...", "bold 24px Arial", "#000000");
	messageField.maxWidth = 1000;
	messageField.textAlign = "center";
	messageField.x = canvas.width / 2;
	messageField.y = canvas.height / 2;
	stage.addChild(messageField);

	stage.update();

	var manifest = [
        {id:"button", src:"Bilder/button.png"},
        {id:"banner", src:"Bilder/banner1.png"},
        {id:"businessWomanStart", src:"Bilder/businessWoman2.png"},
        {id:"neutrophil3D", src:"Bilder/neutrophil3D.png"},
        {id:"eosinophil3D", src:"Bilder/eosinophil3D.png"},
        {id:"virus3D", src:"Bilder/virus3D.png"},

		{id:"backgroundLevel1", src:"Bilder/backgroundLevel1.png"},
        {id:"backgroundLevel2", src:"Bilder/backgroundLevel2.png"},
		{id:"toolbarBackgroundImage", src:"Bilder/Symbolleiste.png"},
        {id:"dunkelHintergrund", src:"Bilder/dunkelHintergrund.png"},
        {id:"dialog", src:"Bilder/dialog5.png"},
        {id:"arrow", src:"Bilder/arrow.png"},
        {id:"youtube", src:"Bilder/youtube.png"},
        {id:"dead", src:"Bilder/dead.png"},
        {id:"win", src:"Bilder/win.png"},

        {id:"bacteria", src:"Bilder/bacteria.png"},
        {id:"parasite", src:"Bilder/parasite.png"},
        {id:"virusInfectedCell", src:"Bilder/virusInfectedCell.png"},
        {id:"redBloodCell", src:"Bilder/redBloodCell.png"},

		{id:"toolbarNeutrophil", src:"Bilder/toolbarNeutrophil.png"},
        {id:"toolbarEosinophil", src:"Bilder/toolbarEosinophil.png"},
        {id:"toolbarLymphocyte", src:"Bilder/toolbarLymphocyte.png"},

		{id:"neutrophil", src:"Bilder/Neutrophil3.png"},
        {id:"eosinophil", src:"Bilder/Eosinophil2.png"},
        {id:"lymphocyte", src:"Bilder/Lymphocyte2.png"},

        // SOUNDS
        {id:"backgroundSound", src:"Sounds/BamaCountry.ogg"},
        {id:"click", src:"Sounds/click.ogg"},
        {id:"error", src:"Sounds/error.ogg"}

	];
	
	resourcesQueue = new createjs.LoadQueue(false);
	resourcesQueue.installPlugin(createjs.Sound);
	resourcesQueue.addEventListener("complete", handleResourcesComplete);
	resourcesQueue.loadManifest(manifest);
}

function handleResourcesComplete(event) {

	
	//stage.addEventListener("mousedown", handleDialogClick);
	//canvas.onclick = handleStartClick;
		
	createjs.Ticker.addEventListener("tick", tick);
	createjs.Ticker.setFPS(60);
	createjs.Ticker.useRAF = true;
	
	darkStage = new createjs.Bitmap(resourcesQueue.getResult("dunkelHintergrund"));
	circleSelectedColor = createjs.Graphics.getRGB(255, 244, 68);//(97, 91, 121);
	isThereMovingObject = false;

    stage.removeAllChildren();
    setupStartScreen();
}

function setupStartScreen() {
    var startBackgroundImage = new createjs.Bitmap(resourcesQueue.getResult("backgroundLevel1"));
    startBackgroundImage.x = 0;
    startBackgroundImage.y = 0;
    startBackgroundImage.alpha = 0.5;
    stage.addChild(startBackgroundImage);

    /*
    var businessWoman = new createjs.Bitmap(resourcesQueue.getResult("businessWomanStart"));
    businessWoman.x = 800;
    businessWoman.y = 200;
    stage.addChild(businessWoman);
*/


    var virus3D = new createjs.Bitmap(resourcesQueue.getResult("virus3D"));
    virus3D.x = 800;
    virus3D.y = 520;
    virus3D.scaleX = virus3D.scaleY = 0.4;
    stage.addChild(virus3D);

    var neutrophil3D = new createjs.Bitmap(resourcesQueue.getResult("neutrophil3D"));
    neutrophil3D.x = 180;
    neutrophil3D.y = 205;
    stage.addChild(neutrophil3D);

    var eosinophil3D = new createjs.Bitmap(resourcesQueue.getResult("eosinophil3D"));
    eosinophil3D.x = 520;
    eosinophil3D.y = 190;
    stage.addChild(eosinophil3D);

    var banner = new createjs.Bitmap(resourcesQueue.getResult("banner"));
    banner.x = 120;
    banner.y = 80;
    stage.addChild(banner);

    createButton(180, 500, "开始游戏", handleStartClick);
    createButton(180, 570, "CREDITS", setupCreditsScreen);

    stage.update();

    createjs.Sound.stop();
    createjs.Sound.play("backgroundSound", {loop:-1});
}

function setupCreditsScreen() {
    stage.removeAllChildren();

    var startBackgroundImage = new createjs.Bitmap(resourcesQueue.getResult("backgroundLevel1"));
    startBackgroundImage.x = 0;
    startBackgroundImage.y = 0;
    startBackgroundImage.alpha = 0.5;
    stage.addChild(startBackgroundImage);

    var credits = "Author (programming, some images):" +
        "\nRok Pov拧i膷 - rok.povsic@gmail.com" +
        "\n\nFrameworks:" +
        "\nCreateJS - www.createjs.com" +
        "\nBox2Dweb - code.google.com/p/box2dweb/" +
        "\n\nImages:" +
        "\nOpenGameArt - www.opengameart.org" +
        "\nWikipedia - en.wikipedia.org/wiki/White_blood_cell" +
        "\nGroovelock - http://www.flickr.com/photos/groovelock/" +
        "\n\nMusic:" +
        "\nBama Country Kevin MacLeod - www.incompetech.com" +
        "\nErokia, RADIY - www.freesound.org" +
        "\n\nThis is open source software! Find source at:" +
        "\nwww.github.com/rok-dev/BloodDefense";

    var txtCredits = new createjs.Text(credits, "bold 30px Monotype Corsiva", "#111111");
    txtCredits.maxWidth = 1000;
    txtCredits.textAlign = "center";
    txtCredits.x = STAGE_WIDTH / 2;
    txtCredits.y = 50;
    txtCredits.alpha = 0.8;
    stage.addChild(txtCredits);

    createButton(180, 630, "返回主屏幕", handleReturnToMainScreen);

    stage.update();
}

function setupDeathScreen() {
    var startBackgroundImage = new createjs.Bitmap(resourcesQueue.getResult("backgroundLevel1"));
    startBackgroundImage.x = 0;
    startBackgroundImage.y = 0;
    startBackgroundImage.alpha = 0.5;
    stage.addChild(startBackgroundImage);

    var deadImage = new createjs.Bitmap(resourcesQueue.getResult("dead"));
    deadImage.x = 200;
    deadImage.y = 200;
    stage.addChild(deadImage);

    createButton(180, 430, "返回主屏幕", handleReturnToMainScreen);

    stage.update();
}

function setupWinScreen() {
    var startBackgroundImage = new createjs.Bitmap(resourcesQueue.getResult("backgroundLevel1"));
    startBackgroundImage.x = 0;
    startBackgroundImage.y = 0;
    startBackgroundImage.alpha = 0.5;
    stage.addChild(startBackgroundImage);

    var banner = new createjs.Bitmap(resourcesQueue.getResult("win"));
    banner.x = 200;
    banner.y = 200;
    stage.addChild(banner);

    var businessWoman = new createjs.Bitmap(resourcesQueue.getResult("businessWomanStart"));
    businessWoman.x = 30;
    businessWoman.y = 200;
    businessWoman.alpha = 1;
    stage.addChild(businessWoman);

    createButton(180, 430, "返回主屏幕", handleReturnToMainScreen);

    stage.update();
}

function createButton(x, y, text, clickListenerFunction) {
    var containerStart = new createjs.Container();
    var imgStart = new createjs.Bitmap(resourcesQueue.getResult("button"));
    imgStart.x = x;
    imgStart.y = y;
    containerStart.addChild(imgStart);

    var txtStart = new createjs.Text(text, "bold 26px Monotype Corsiva", "#FFFFFF");
    txtStart.maxWidth = 1000;
    txtStart.textAlign = "center";
    txtStart.x = x + 300;
    txtStart.y = y + 16;
    txtStart.alpha = 0.8;

    containerStart.addEventListener("click", clickListenerFunction);
    containerStart.addChild(txtStart);

    stage.addChild(containerStart);
}

function newGameInitialization() {
    setupPhysics();
    //setupDebugDraw();

    ballsContainer = new createjs.Container();
    whitesContainer = new createjs.Container();

    ballsArray = [];

    whitesArray = [];

    destroyBodyList = [];

    isDialogDisplayed = false;
    dialogTextArray = [];
    dialogTextCurrentIndex = 0;

    panthCreationTickCounter = 0;
    playingTickCounter = 0;

    youtubeIcon = null;

    wasFirstLifeLostAlready = false;

    stage.removeAllChildren();

    setBackground();
    setToolbar();
    stage.update();

    environment = new Environment(stage);
    environment.drawHills(3, 5);

    stage.addChild(whitesContainer);
    stage.addChild(ballsContainer);

    gameState = gameStateEnum.PLAYING;
    collisionDetection = new CollisionDetection();

    energy = STARTING_ENERGY;
    life = STARTING_LIFE;

    var lifeLabel = new createjs.Text("健康值: ", "bold 20px Verdana", "#CC0000");
    lifeLabel.maxWidth = 1000;
    lifeLabel.x = 810;
    lifeLabel.y = 10;
    stage.addChild(lifeLabel);

    lifeTextField = new createjs.Text("", "20px Arial", "#CC0000");
    lifeTextField.maxWidth = 1000;
    lifeTextField.x = 910;
    lifeTextField.y = 13;
    stage.addChild(lifeTextField);

    var energyLabel = new createjs.Text("能量值: ", "bold 20px Verdana", "#0066FF");
    energyLabel.maxWidth = 1000;
    energyLabel.x = 810;
    energyLabel.y = 30;
    stage.addChild(energyLabel);

    energyTextField = new createjs.Text("", "20px Arial", "#0066FF");
    energyTextField.maxWidth = 1000;
    energyTextField.x = 910;
    energyTextField.y = 33;
    stage.addChild(energyTextField);
}

function handleStartClick(event) {
    newGameInitialization();
}

function handleReturnToMainScreen(event) {
    stage.removeAllChildren();

    setupStartScreen();
}

function setBackground() {
	backgroundImage = new createjs.Bitmap(resourcesQueue.getResult("backgroundLevel2"));
	backgroundImage.regX = backgroundImage.regY = 0;
	backgroundImage.x = 0;
	backgroundImage.y = -75;
	
	stage.addChild(backgroundImage);
}

function setToolbar() {
	toolbar = new createjs.Container();
	toolbar.x = 0;
	toolbar.y = 625;
	
	var toolbarBackgroundImage = new createjs.Bitmap(resourcesQueue.getResult("toolbarBackgroundImage")); 
	toolbarBackgroundImage.x = toolbarBackgroundImage.y = 0;
	toolbar.addChild(toolbarBackgroundImage);
	
	var neutrophilToolbarImage = new createjs.Bitmap(resourcesQueue.getResult("toolbarNeutrophil"));
	neutrophilToolbarImage.x = 20;
	neutrophilToolbarImage.y = 5;
	neutrophilToolbarImage.addEventListener("click", handleClick_NeutrophilToolbarImage);
	toolbar.addChild(neutrophilToolbarImage);

	stage.addChild(toolbar);
}

function addEosinophilToToolbar() {
    var eosinophilToolbarImage = new createjs.Bitmap(resourcesQueue.getResult("toolbarEosinophil"));
    eosinophilToolbarImage.x = 100;
    eosinophilToolbarImage.y = 5;
    eosinophilToolbarImage.addEventListener("click", handleClick_EosinophilToolbarImage);
    toolbar.addChild(eosinophilToolbarImage);
}

function addLymphocyteToToolbar() {
    var lymphocyteToolbarImage = new createjs.Bitmap(resourcesQueue.getResult("toolbarLymphocyte"));
    lymphocyteToolbarImage.x = 180;
    lymphocyteToolbarImage.y = 5;
    lymphocyteToolbarImage.addEventListener("click", handleClick_LymphocyteToolbarImage);
    toolbar.addChild(lymphocyteToolbarImage);
}

function addDialog() {
    gameState = gameStateEnum.PAUSE;

    isDialogDisplayed = true;
    dialogTextCurrentIndex = 0;

    darkenStage();

    dialogContainer = new createjs.Container();

    var dialogImage = new createjs.Bitmap(resourcesQueue.getResult("dialog"));
    dialogImage.x = DIALOG_IMAGE_X;
    dialogImage.y = DIALOG_IMAGE_Y;
    dialogContainer.addChild(dialogImage);

    dialogContainer.addChild(getDialogText(dialogTextArray[dialogTextCurrentIndex]));
    dialogTextCurrentIndex++;

    dialogContainer.addEventListener("click", handleDialogClick);

    stage.addChild(dialogContainer);
}

function getDialogText(text) {
    var text = new createjs.Text(text, "bold 20px Arial", "#583d4e");
    text.maxWidth = 1000;
    text.textAlign = "center";
    text.x = DIALOG_IMAGE_X + 350;
    text.y = DIALOG_IMAGE_Y + 55;
    return text;
}

function handleClick_NeutrophilToolbarImage(event) {
    createWhiteBloodCellAndGoToPositiongMode("neutrophil");
}

function handleClick_EosinophilToolbarImage(event) {
    createWhiteBloodCellAndGoToPositiongMode("eosinophil");
}

function handleClick_LymphocyteToolbarImage(event) {
    createWhiteBloodCellAndGoToPositiongMode("lymphocyte");
}

function createWhiteBloodCellAndGoToPositiongMode(whiteBloodCellType) {
    if (gameState != gameStateEnum.PLAYING) return;

    if (energy >= WHITE_ENERGY_CREATION_COST) {
        energy -= WHITE_ENERGY_CREATION_COST;

        createjs.Sound.play("click");

        var whiteBloodCell = new WhiteBloodCell();
        whiteBloodCell.createCell(whiteBloodCellType);
        whitesContainer.addChild(whiteBloodCell.view);
        whitesArray.push(whiteBloodCell);

        goToPositioningMode();
    } else {
        createjs.Sound.play("error", {volume:0.3});

        addWarningText("你需要至少 " + WHITE_ENERGY_CREATION_COST + " 的能量来生成一个白细胞");
    }
}

function addWarningText(text) {
    var textLabel = new createjs.Text(text, "bold 20px Arial", "#ffffff");
    textLabel.maxWidth = 1000;
    textLabel.x = 270;
    textLabel.y = 650;
    textLabel.addEventListener("tick", function(event) {
        textLabel.alpha -= 0.01;
        if (textLabel.alpha <= 0) {
            stage.removeChild(textLabel);
        }
    })
    stage.addChild(textLabel);
}

function addCircle() {
    circle = new createjs.Shape();
    circle.graphics.beginFill(circleSelectedColor).drawCircle(0, 0, 100);
    circle.regX = circle.regY = -5;
    circle.alpha = 0.5;
    stage.addChildAt(circle, stage.getChildIndex(whitesContainer));
}

function removeCircle() {
    stage.removeChild(circle);
}

function darkenStage() {
    darkStage.regX = darkStage.regY = 0;
    darkStage.x = 0;
    darkStage.y = 0;
    darkStage.alpha = 0.5;

    stage.addChildAt(darkStage, stage.getChildIndex(backgroundImage) + 1);
}

function removeDarkStage() {
    stage.removeChild(darkStage);
}

function goToPositioningMode() {
    darkenStage();
    addCircle();
}

function goOutOfPositioningMode() {
    removeDarkStage();
    removeCircle();
}

function handleDialogClick() {
    if (isDialogDisplayed) {
        createjs.Sound.play("click");

        if (dialogTextCurrentIndex < dialogTextArray.length) {
            dialogContainer.removeChildAt(1);

            var text;
            if (dialogTextArray[dialogTextCurrentIndex] instanceof Array) {
                text = dialogTextArray[dialogTextCurrentIndex][0];

                var arrowImage = new createjs.Bitmap(resourcesQueue.getResult("arrow"));
                arrowImage.x = dialogTextArray[dialogTextCurrentIndex][1];
                arrowImage.y = dialogTextArray[dialogTextCurrentIndex][2];
                arrowImage.alpha = 0.9;
                dialogContainer.addChild(arrowImage);
            } else {
                text = dialogTextArray[dialogTextCurrentIndex];
            }
            dialogContainer.addChildAt(getDialogText(text), 1); // Text is positioned under the arrow (if it exists).

            dialogTextCurrentIndex++;
        } else {
            stage.removeChild(dialogContainer);
            removeDarkStage();

            if (youtubeIcon) {
                stage.removeChild(youtubeIcon);
                youtubeIcon = null;
            }

            gameState = gameStateEnum.PLAYING;
            dialogTextCurrentIndex = 0;
            isDialogDisplayed = false;
        }
    }
}

function generateNewPanth() {
    var pathogenType;
    var pathogenScale;
    var rand = Math.random();
    if (rand < panthProbabilitiesArray["bacteria"]) {
        pathogenType = "bacteria";
        pathogenScale = 0.3;
    } else if (rand < panthProbabilitiesArray["parasite"]) {
        pathogenType = "parasite";
        pathogenScale = 0.3;
    } else if (rand < panthProbabilitiesArray["virusInfectedCell"]) {
        pathogenType = "virusInfectedCell";
        pathogenScale = 0.6;
    } else {
        pathogenType = "redBloodCell";
        pathogenScale = 0.4;
    }

    var posX = -10/SCALE;
    var posY = (spawnPointY + (Math.random() - 0.5) * BLOOD_VESSEL_THICKNESS) / SCALE;

	var b = new Ball();
    b.createPanth(posX, posY, pathogenType, pathogenScale);
	ballsArray.push(b);
	ballsContainer.addChild(b.view); // We add createjs object, not Ball object itself!

	setTimeout(b.applyImpulse(-(Math.random()-0.5)*150, 100), 1);
}

function setupDebugDraw() {
    var debugDraw = new box2d.b2DebugDraw();
    debugDraw.SetSprite(debugCanvas.getContext('2d'));
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
    debugDraw.SetFillAlpha(0.7);
    world.SetDebugDraw(debugDraw);
}

function setupPhysics() {
	var gravity = new box2d.b2Vec2(0, 0);
	world = new box2d.b2World(gravity, true); // Gravity defined here
}

function removePanthCompletly(panthView) {
    panthView.removeEventListener("tick", panthView.eventListenerFunction);
    destroyBodyList.push(panthView.body);
    whitesContainer.removeChild(panthView);
    var index = ballsArray.indexOf(panthView.ballObject);
    ballsArray.splice(index, 1);
}

function addYoutubeIcon(url) {
    youtubeIcon = new createjs.Bitmap(resourcesQueue.getResult("youtube"));
    youtubeIcon.x = 930;
    youtubeIcon.y = 635;
    youtubeIcon.addEventListener("click", function(event) {
        window.open(url);
    });
    stage.addChild(youtubeIcon);
}

function tick(evt) {
    if (gameState == gameStateEnum.PLAYING) {

        /**
         * MAIN STORY
         */
        //console.log(playingTickCounter);

        if (playingTickCounter == 0) {
            // TODO: remove when finished
            playingTickCounter = 1 - 1;

            panthProbabilitiesArray = {bacteria: 0.0, parasite: 0.0, virusInfectedCell: 0.0};
        } else if (playingTickCounter == 200) {
            dialogTextArray = [
                "Hey there!" +
                    "\n欢迎来到Blood Defense,一个在快乐中" +
                    "\n了解人类免疫系统的游戏！" +
                    "\n\n点我或者旁边的气泡继续。 " ,
                "在我身后你看到的是一条" +
                    "\n人类的血管. 在其中通过的 " +
                    "\n是红细胞." +
                    "\n\n同样的, 点我或者旁边的气泡" +
                    "\n继续.",
                "红细胞给身体的其他细胞运送氧气" +
                    "\n. 红细胞在医学术语称作" +
                    "\nerythrocytes." +
                    "\n\n红细胞含有一种称为血红蛋白" +
                    "\n的蛋白质。血红蛋白是红色的，所以" +
                    "\n人类的血液也是红色的.",
                "当血液经过肺的时候，" +
                    "\n氧分子吸附到血红蛋白上。" +
                    "\n 之后, " +
                    "\n血红蛋白会把氧释放给其他细胞 " +
                    "\n." +
                    "\n\n注意观察：红细胞正在经过血管."];
            addDialog();
        } else if (playingTickCounter == 500) {
            dialogTextArray = [
                "很有趣吧? 我希望是这样!" +
                    "\n\n人体内另外一种很重要的细胞" +
                    "\n是白细胞. 它们是你身体里" +
                    "\n抗击细菌和其他入侵者的卫士.",
                "这些入侵者总是尝试进入你的体内，" +
                    "\n有一些还会引起疾病." +
                    "\n\n你将会看到一个蓝色的小东西" +
                    "\n穿过血管，那就是细菌. ",
                ["看到箭头指向的图标了吗? " +
                    "\n这就是一个称为中性白细胞的白细胞. " +
                    "\n\n关闭这个对话框后, 点击它来创建它，" +
                    "\n再次点击来放置这个白细胞. " +
                    "\n你可以把它放在" +
                    "\n血管外的任何地方.", 0, 480]];
            addDialog();

            panthProbabilitiesArray = {bacteria: 0.15, parasite: 0.0, virusInfectedCell: 0.0};
        } else if (playingTickCounter == 2000) {
            dialogTextArray = [
                "中性白细胞 是人体内最常见的" +
                    "\n白细胞." +
                    "\n他们保护我们，抵御细菌和" +
                    "\n真菌.",
                "要想创造一个白细胞，你需要" +
                    "\n " + WHITE_ENERGY_CREATION_COST + "点能量." +
                    "\n\n但是不要担心. 每一次一个红细胞" +
                    "\n穿过血管," +
                    "\n你会得到 " + ADD_ENERGY_ON_RED_FINISH + " 点能量.",
                "另外，确保细菌不会深入体内."];
            addDialog();

            panthProbabilitiesArray = {bacteria: 0.2, parasite: 0.0, virusInfectedCell: 0.0};

        } else if (playingTickCounter == 3000) {
            dialogTextArray = [
                "点击下面的YouKu图标" +
                    "\n来观看 现实中中性" +
                    "\n白细胞是如何追逐" +
                    "\n.和吞食细菌的" +
                    "\n\n不用担心, 视频会在" +
                    "\n新的窗口中打开.",
                "你能看到 中性白细胞" +
                    "\n真的完全吞食" +
                    "\n了细菌." +
                    "\n\n这个过程称作吞噬作用."];
            addDialog();

            addYoutubeIcon("http://v.youku.com/v_show/id_XMjY5OTI1NTQw.html");
        } else if (playingTickCounter == 5000) {
            var additionalEnergy = 200;
            energy += additionalEnergy;

            addEosinophilToToolbar();

            dialogTextArray = [
                "到现在做的很好! 我刚刚" +
                    "\n给了你 " + additionalEnergy + " 点额外的能量." +
                    "\n\让我们继续讲解!",
                "嗜酸性粒细胞 是另外一种白细胞" +
                    "\n. 它们保护你远离" +
                    "\n多细胞的寄生虫." +
                    "\n",
                ["这是嗜酸性粒细胞.把它" +
                    "\n放在血管外面来抵御" +
                    "\n即将到来的寄生虫." +
                    "\n\n在游戏中,寄生虫 " +
                    "\n涂成了紫色.", 80, 480]];
            addDialog();

            panthProbabilitiesArray = {bacteria: 0.1, parasite: 0.3, virusInfectedCell: 0.0};
        } else if (playingTickCounter == 7000) {
            dialogTextArray = [
                "点击YouKu图标来" +
                    "\n来看真实的嗜酸性粒细胞."];
            addDialog();

            addYoutubeIcon("http://v.youku.com/v_show/id_XMjE4OTkzODky.html");
        } else if (playingTickCounter == 8000) {
            var additionalEnergy = 300;
            energy += additionalEnergy;

            addLymphocyteToToolbar();

            dialogTextArray = [
                "很好，到目前为止都做的很好." +
                    "\n我给了你 " + additionalEnergy + " 点" +
                    "\n额外的能量.",
                "我们将会看到这个游戏里的" +
                    "\n最后一种白细胞：" +
                    "\n自然杀伤细胞." +
                    "\n\n它们属于淋巴细胞这一大类中" +
                    "\n的一部分.",
                "自然杀手细胞 能快速的响应" +
                    "\n被病毒感染的细胞和" +
                    "\n癌细胞." +
                    "\n\n它们对人体很重要，" +
                    "\n因为它们允许更快的" +
                    "\n免疫反应.",
                ["这是一个自然杀伤细胞. 把它" +
                    "\n放在血管外面来" +
                    "\n拦截即将到来的被病毒感染的" +
                    "\n细胞." +
                    "\n\n在游戏里, 这些被病毒感染的细胞" +
                    "\n涂成了绿色.", 163, 480]];
            addDialog();

            panthProbabilitiesArray = {bacteria: 0.1, parasite: 0.3, virusInfectedCell: 0.5};
        } else if (playingTickCounter == 10000) {
            dialogTextArray = [
                "点击下面的YouKu图标来" +
                    "\n观看一段动画：" +
                    "\n自然杀伤细胞如何杀死 " +
                    "\n被病毒感染的细胞."];
            addDialog();

            addYoutubeIcon("http://v.youku.com/v_show/id_XNjA5NjQyNDI0.html");
        } else if (playingTickCounter == 11000) {
            dialogTextArray = [
                "你干的很好!" +
                    "\n\n我们再复述一遍: " +
                    "\n在人体抵御微生物的进攻中，" +
                    "\n白细胞很重要.",
                "在这个游戏里我们看到了三种类型" +
                    "\n的白细胞:" +
                    "\n中性白细胞, 嗜酸性粒细胞和" +
                    "\n自然杀手细胞." +
                    "\n\n他们在人体内都发挥着不同" +
                    "\n的作用.",
                "中性白细胞杀死细菌和" +
                    "\n真菌, 嗜酸性粒细胞保护你" +
                    "\n远离大的寄生虫 ，" +
                    "\n以及自然杀手细胞猎杀" +
                    "\n被病毒感染的细胞.",
                "另外两种白细胞是：" +
                    "\n可以释放组织胺引起" +
                    "\n炎症反应的嗜碱细胞， " +
                    "\n和可以迁移到其它组织的单核细胞， " +
                    "\n其中单核细胞还会分化为" +
                    "\n在组织定居的的巨噬细胞.",
                "现在你要靠自己了." +
                    "\n\n要在游戏中获胜," +
                    "\n你需要增加能量值" +
                    "\n直到 " + END_GAME_ENERGY_NEEDED + "." +
                    "\n\n祝你好运!"];
            addDialog();

            panthProbabilitiesArray = {bacteria: 0.2, parasite: 0.4, virusInfectedCell: 0.6};
        }

        playingTickCounter++;

        /**
         * UPDATE INFO TEXT FIELDS
         */
        energyTextField.text = energy;
        lifeTextField.text = life;

        /**
         * CHECK END
         */

        if (life <= 0) {
            stage.removeAllChildren();

            gameState = gameStateEnum.INITIAL;
            setupDeathScreen();
        }

        if (energy >= END_GAME_ENERGY_NEEDED) {
            stage.removeAllChildren();

            gameState = gameStateEnum.INITIAL;
            setupWinScreen();
        }

        /**
         * CREATING PANTHOGENS
         */
        panthCreationTickCounter++;
        if (panthCreationTickCounter > 50) {
            panthCreationTickCounter = 0;

            generateNewPanth();
        }

        if (isThereMovingObject) {
            circle.x = stage.mouseX;
            circle.y = stage.mouseY;
        }

        /**
         * UPDATING BOX2D
         */
        world.Step(1/60, 10, 10);
        world.ClearForces();

        /**
         * DESTROY NOT NEEDED BODIES
         */
        for (var i = 0; i < destroyBodyList.length; i++) {
            world.DestroyBody(destroyBodyList[i]);
        }
        destroyBodyList = [];
    }

	stage.update();
}
