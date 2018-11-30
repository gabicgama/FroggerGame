width = window.innerWidth / 16;
height = window.innerHeight / 16;

var div = document.querySelector("#game");
var infoDiv = document.querySelector("#info");
var pauseDiv = document.querySelector("#pause");
var scene = new THREE.Scene();

//Camera
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 8.5, -7);
var a = new THREE.Vector3(0, 0, 0)
camera.lookAt(a);
var addMov = .033;

var renderer = new THREE.WebGLRenderer({
	alpha: true,
	antialias: false //false deixa mais rapido
});
renderer.setSize(window.innerWidth, window.innerHeight);
div.appendChild(renderer.domElement);
camera.updateProjectionMatrix();


window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
	width = window.innerWidth / 16;
	height = window.innerHeight / 16;
	renderer.setSize(width * 16, height * 16);
	camera.left = -width;
	camera.right = width;
	camera.top = height;
	camera.bottom = -height;
	camera.updateProjectionMatrix();
}

//Luzes
var changeLight = false;

var light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

var light2 = new THREE.PointLight(0xffffff, 0.8);
light2.position.set(0, 20, 10);
light2.castShadow = true;
light2.shadow.camera.near = 0.1;
light2.shadow.camera.far = 25;
scene.add(light2);

var light3 = new THREE.AmbientLight(0xF6F627, 0.5);


//Objeto 3D
var frog;
var loader = new THREE.OBJLoader();

// carregando o sapo
loader.load(
	'models/frog.obj',

	function ( object ) {
		object.scale.set(0.01, 0.01, 0.01);
		object.traverse( function ( child )
		{
			if ( child instanceof THREE.Mesh ){
				child.material.color.setRGB (0.24, 0.56, 0.25);
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
		frog = object;
		scene.add(frog);
	}
);

////////////////////////////////////////////////////

var dead = true;
var score = 0;

var resetDiv = document.querySelector("#reset");
var scoreDiv = document.querySelector("#score");

resetDiv.style.visibility = "visible";

function endScore() {
	resetDiv.style.visibility = "visible";
}

function newScore() {
	pauseDiv.style.visibility = "hidden";
	resetDiv.style.visibility = "hidden";
	dead = false;
	init();
}

/////////////////////////////////////////////////////

//Lista de keycodes
document.addEventListener("keyup", keyUp);

LEFT = 37;
UP = 38;
RIGHT = 39;
DOWN = 40;
PRESSONE = 49;
PRESSTWO = 50;
PRESSP = 80;
PRESSL = 76;

//Loop e lógica do jogo

function keyUp(e) {
	e.preventDefault();
	onLog = false;
	if (!dead) {

		switch (e.keyCode) {
			case UP:
			hero.position.x = Math.round(hero.position.x);
			if (!treeCollision("up")) {
				hero.position.z++;
			}
			break;
			case DOWN:
			hero.position.x = Math.round(hero.position.x);
			if (!treeCollision("down")) {
				hero.position.z--;
			}
			break;

			case LEFT:
			if (!treeCollision("left")) {
				if (hero.position.x !== 4) {
					hero.position.x++;
				}
			}
			break;

			case RIGHT:
			if (!treeCollision("right")) {
				if (hero.position.x !== -4) {
					hero.position.x--;
				}
			}
			break;

			case PRESSP:
			if(dead == false){
				dead = true;
				pauseDiv.style.visibility = "visible";
				controls.enabled = true;
			}
			break;

			case PRESSONE:
			camera.zoom = 1;
			camera.position.y = 8.5;
			camera.updateProjectionMatrix();
			break;

			case PRESSTWO:
			camera.zoom = 1.5
			camera.position.y = 5.5;
			camera.updateProjectionMatrix();
			break;

			case PRESSL:
			if(changeLight == false){
				scene.remove(light);
				scene.add(light3);
				changeLight = true;
			}else{
				scene.remove(light3);
				scene.add(light);
				changeLight = false;
			}
			break;
		}

	} else {
		if (e.keyCode == 13) {
			newScore();
		}

		if (e.keyCode == PRESSP){
			if(dead == true){
				dead = false;
				resetDiv.style.visibility = "hidden";
				pauseDiv.style.visibility = "hidden";
				controls.reset();
				controls.enabled = false;
			}
		}

	}
	frog.position.set(hero.position.x, hero.position.y, hero.position.z);
}

/////////////////////////////////////////////////////////////////////////////

//Variáveis do ambiente
var grass = [], grassCount = 0;
var water = [], waterCount = 0;
var road = [], roadCount = 0;
//Variáveis dos obstáculos
var deadTrees = [], deadCount = 0; //
var trees = [], treeCount = 0; //
var logs = [], logCount = 0; //
var cars = [], carCount = 0; //
var logSpeed = [], carSpeed = []; //
var onLog = true;
//Variáveis linhas dos obstáculos
var rowCount = 0;
var camCount = 0,
camSpeed = .02;
//Variáveis de largura usadas para colisão
var heroWidth = .7, carWidth = 1.5, logWidth = 2;
var cCollide = heroWidth / 2 + carWidth / 2 - .1;
var lCollide = (heroWidth / 4 + logWidth / 4) + .5;

////////////////////////////////////////////////////////////////////////////
//Obstáculos

heroGeo = new THREE.BoxGeometry(heroWidth, .69, heroWidth);
var heroTexture =  new THREE.TextureLoader().load('texturas/cube.png');
heroMat = new THREE.MeshPhongMaterial({ map: heroTexture });

terrainGeo = new THREE.PlaneGeometry(19, 1);

var grassTexture =  new THREE.TextureLoader().load('texturas/grama.jpg');
grassMat = new THREE.MeshPhongMaterial({ map: grassTexture });

var waterTexture =  new THREE.TextureLoader().load('texturas/water.jpg');
waterMat = new THREE.MeshPhongMaterial({ map: waterTexture });

var roadTexture =  new THREE.TextureLoader().load('texturas/road.jpg');
roadMat = new THREE.MeshPhongMaterial({ map: roadTexture });

shadeGeo = new THREE.PlaneGeometry(6, 500);
shadeMat = new THREE.MeshPhongMaterial({
	color: 0x000000,
	transparent: true,
	opacity: .5
});
blindMat = new THREE.MeshPhongMaterial({
	color: 0xffffff
});

var treeTexture =  new THREE.TextureLoader().load('texturas/tree.jpg');
treeGeo = new THREE.BoxGeometry(heroWidth, 1, heroWidth);
treeMat = new THREE.MeshPhongMaterial({ map: treeTexture });

var carTexture =  new THREE.TextureLoader().load('texturas/bus.jpg');
carMat = new THREE.MeshPhongMaterial({ map: carTexture });
carGeo = new THREE.BoxGeometry(carWidth, .5, .7);

var logTexture =  new THREE.TextureLoader().load('texturas/log.png');
logGeo = new THREE.BoxGeometry(logWidth, .25, .6);
logMat = new THREE.MeshPhongMaterial({ map: logTexture });

// Mesh
hero = new THREE.Mesh(heroGeo, heroMat);
hero.position.y = .25;
//scene.add(hero);

leftShade = new THREE.Mesh(shadeGeo, shadeMat);
rightShade = new THREE.Mesh(shadeGeo, shadeMat);
leftBlind = new THREE.Mesh(shadeGeo, blindMat);
rightBlind = new THREE.Mesh(shadeGeo, blindMat);

grass[0] = new THREE.Mesh(terrainGeo, grassMat);
water[0] = new THREE.Mesh(terrainGeo, waterMat);
road[0] = new THREE.Mesh(terrainGeo, roadMat);

trees[0] = new THREE.Mesh(treeGeo, treeMat);
cars[0] = new THREE.Mesh(carGeo, carMat);
logs[0] = new THREE.Mesh(logGeo, logMat);

//orientação
leftShade.rotation.x = 270 * Math.PI / 180;
leftShade.position.set(6.65, 1, 248.47);
rightShade.rotation.x = 270 * Math.PI / 180;
rightShade.position.set(-7.35, 1, 248.47);
leftBlind.rotation.x = 270 * Math.PI / 180;
leftBlind.position.set(11.8, .6, 248.9);
rightBlind.rotation.x = 270 * Math.PI / 180;
rightBlind.position.set(-12.2, .6, 248.9);
scene.add(leftShade);
scene.add(rightShade);
scene.add(leftBlind);
scene.add(rightBlind);

grass[0].rotation.x = 270 * Math.PI / 180;
water[0].rotation.x = 270 * Math.PI / 180;
road[0].rotation.x = 270 * Math.PI / 180;

grass[0].position.z = -30;
water[0].position.z = -30;
road[0].position.z = -30;

trees[0].position.set(0, .5, -30);
cars[0].position.set(0, .25, -30);
logs[0].position.set(0, 0, -30);

///////////////////////////////////////////////////////////////////////////////
//Adicionando os obstáculos e ambiente a cena
for (i = 0; i < 15; i++) {
	grass[i] = grass[0].clone();
	water[i] = water[0].clone();
	road[i] = road[0].clone();

	scene.add(grass[i]);
	scene.add(water[i]);
	scene.add(road[i]);
}

for (i = 0; i < 55; i++) {
	trees[i] = trees[0].clone();
	scene.add(trees[i]);
}

//Criando árvores mortas
deadTreeGeo = new THREE.Geometry();
for (x = 0; x < 5; x++) {
	trees[0].position.set(x + 5, .4, 0);
	THREE.GeometryUtils.merge(deadTreeGeo, trees[0]);
	trees[0].position.set(-(x + 5), .4, 0);
	THREE.GeometryUtils.merge(deadTreeGeo, trees[0]);
}

deadTrees[0] = new THREE.Mesh(deadTreeGeo, treeMat);

for (x = 0; x < 15; x++) {
	deadTrees[x] = deadTrees[0].clone();
	scene.add(deadTrees[x]);
}

for (i = 0; i < 40; i++) {
	cars[i] = cars[0].clone();
	scene.add(cars[i]);
}
for (i = 0; i < 40; i++) {
	logs[i] = logs[0].clone();
	scene.add(logs[i]);
}

/////////////////////////////////////////////////////////////////////////////
//Iniciando a cena
function init() {
	score = 0;
	camera.position.z = -2.9;
	hero.position.set(0, .25, 0);
	hero.scale.y = 1;
	grassCount = 0;
	waterCount = 0;
	roadCount = 0;

	deadCount = 0;
	treeCount = 0;
	roadCount = 0;
	rowCount = 0;

	for (i = 0; i < 15; i++) {
		grass[i].position.z = -30;
		water[i].position.z = -30;
		road[i].position.z = -30;
		deadTrees[i].position.z = -30;
	}
	for (i = 0; i < 55; i++) {
		trees[i].position.z = -30;
	}
	for (i = 0; i < 40; i++) {
		cars[i].position.z = -30;
		carSpeed[i] = 0;

		logs[i].position.z = -30;
		logSpeed[i] = 0;
	}

	treeGen();
	grass[grassCount].position.z = rowCount;
	deadTrees[grassCount].position.z = rowCount;
	grassCount++;
	rowCount++;
	for (i = 1; i < 15; i++) {
		newRow();
	}
}

//Geradores de cena
function newRow() {
	if (grassCount == 15) {
		grassCount = 0;
	}
	if (roadCount == 15) {
		roadCount = 0;
	}
	if (waterCount == 15) {
		waterCount = 0;
	}

	switch (Math.floor(Math.random() * (4 - 1)) + 1) {
		case 1:
		treeGen();
		grass[grassCount].position.z = rowCount;
		deadTrees[grassCount].position.z = rowCount;
		grassCount++;
		break;

		case 2:
		carGen();
		road[roadCount].position.z = rowCount;
		roadCount++;
		break;

		case 3:
		logGen();
		water[waterCount].position.z = rowCount;
		waterCount++;
		break;
	}
	rowCount++;

}

function treeGen() {
	for (x = 0; x < 9; x++) {
		if (x !== 4 && Math.random() > .6) {
			if (treeCount < 54) {
				treeCount++;
			} else {
				treeCount = 0;
			}
			trees[treeCount].position.set(x - 4, .4, rowCount);
		}
	}
}

function carGen() {
	// Velocidade entre .01 a .08
	// Num de carros entre 1 a 3
	speed = (Math.floor(Math.random() * (5 - 1)) + 1) / 80;
	numCars = Math.floor(Math.random() * (4 - 2)) + 2;
	xDir = 1;

	if (Math.random() > .5) {
		xDir = -1;
	}

	xPos = -6 * xDir;

	for (x = 0; x < numCars; x++) {
		if (carCount < 39) {
			carCount++;
		} else {
			carCount = 0;
		}

		cars[carCount].position.set(xPos, .25, rowCount);
		carSpeed[carCount] = speed * xDir;

		xPos -= 5 * xDir;
	}
}

function logGen() {
	// velocidade entre .01 a .08
	// quantidade entre 1 e 3
	speed = (Math.floor(Math.random() * (3 - 1)) + 1) / 70;
	numLogs = Math.floor(Math.random() * (4 - 3)) + 3;
	xDir = 1;

	if (Math.random() > .5) {
		xDir = -1;
	}
	if (logSpeed[logCount] == speed * xDir) {
		speed /= 1.5;
	}

	xPos = -6 * xDir;

	for (x = 0; x < numLogs; x++) {
		if (logCount < 39) {
			logCount++;
		} else {
			logCount = 0;
		}

		logs[logCount].position.set(xPos, 0, rowCount);
		logSpeed[logCount] = speed * xDir;

		xPos -= 5 * xDir;
	}
}

//Movimentação dos carros e madeiras
function drive() {

	if(!dead){

		for (d = 0; d < cars.length; d++) {
			cars[d].position.x += carSpeed[d];
			logs[d].position.x += logSpeed[d];

			if (cars[d].position.x > 11 && carSpeed[d] > 0) {
				cars[d].position.x = -11;
			} else if (cars[d].position.x < -11 && carSpeed[d] < 0) {
				cars[d].position.x = 11;
			}
			if (logs[d].position.x > 11 && logSpeed[d] > 0) {
				logs[d].position.x = -10;
			} else if (logs[d].position.x < -11 && logSpeed[d] < 0) {
				logs[d].position.x = 10;
			}
		}

	}

}

//Detecta colisoes
function treeCollision(dir) {
	var zPos = 0;
	var xPos = 0;
	if (dir == "up") {
		zPos = 1;
	} else if (dir == "down") {
		zPos = -1;
	} else if (dir == "left") {
		xPos = 1;
	} else if (dir == "right") {
		xPos = -1;
	}

	for (x = 0; x < trees.length; x++) {
		if (hero.position.z + zPos == trees[x].position.z) {
			if (hero.position.x + xPos == trees[x].position.x) {
				return true;
			}
		}
	}
}

function carCollision() {
	for (c = 0; c < cars.length; c++) {
		if (hero.position.z == cars[c].position.z) {
			if (hero.position.x < cars[c].position.x + cCollide &&
				hero.position.x > cars[c].position.x - cCollide) {
					hero.scale.y = 0;
					//sapo.scale.y = 0;
					hero.position.y = .1;
					frog.position.y = .1;
					gameOver();
				}
			}
		}
	}

	function logCollision() {
		for (l = 0; l < logs.length; l++) {
			if (hero.position.z == logs[l].position.z) {
				if (hero.position.x < logs[l].position.x + lCollide &&
					hero.position.x > logs[l].position.x - lCollide) {
						onLog = true;
						if (hero.position.x > logs[l].position.x) {
							hero.position.x = logs[l].position.x + .5;
							frog.position.x = logs[l].position.x + .5;
						} else {
							hero.position.x = logs[l].position.x - .5;
							frog.position.x = logs[l].position.x - .5;
						}
						if (hero.position.x > 5 || hero.position.x < -5) {
							gameOver();
						}
					}
				}
			}
		}

		function waterCollision() {
			if (onLog == false) {
				for (w = 0; w < water.length; w++) {
					if (hero.position.z == water[w].position.z) {
						gameOver();

						y = Math.sin( sineCount ) * .08-.2;
						sineCount += sineInc;
						hero.position.y = y;
						frog.position.y = y;
						for (w = 0; w < logSpeed.length; w++) {
							if (hero.position.z == logs[w].position.z) {
								hero.position.x += logSpeed[w] / 3;
								frog.position.x += logSpeed[w] / 3;
							}
						}
					}
				}
			}
		}

		//Movimento da camera

		function forwardScene() {
			if (!dead) {

				if (Math.floor(camera.position.z) < hero.position.z - 4) {
					camera.position.z += addMov;
					if (camCount > 1.8) {
						camCount = 0;
						newRow();
						newRow();
						newRow();
						newRow();
					} else {
						camCount += camSpeed;
					}
				}
			}
		}


		function gameOver() {
			dead = true;
			endScore();
		}

		var sineCount = 0;
		var sineInc = Math.PI / 50;

		function render() {
			requestAnimationFrame(render);
			drive();
			carCollision();
			logCollision();
			waterCollision();
			forwardScene();

			if (score < hero.position.z) {
				score = hero.position.z;
			}
			scoreDiv.innerHTML = score;
			renderer.render(scene, camera);
		}


		///////////////////////////////////////////////////

		//Controles de movimentação da câmera
		var controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.maxPolarAngle = Math.PI * 0.5;
		controls.minDistance = 10;
		controls.maxDistance = 50;
		controls.keyPanSpeed = 20.0;
		controls.enabled = false;


		//controls = new THREE.MapControls( camera, renderer.domElement );
		//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
		//controls.enableDamping = true;
		//controls.dampingFactor = 0.25;
		//controls.screenSpacePanning = false;
		//controls.minDistance = 10;
		//controls.maxDistance = 50;
		//controls.maxPolarAngle = Math.PI / 2;
		//controls.enabled = false;

		/////////////////////////////////////////////////////
		//Músicas e sons do jogo

		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( 'sounds/ES_That_is_Fine.mp3', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume( 0.1 );
			sound.play();
		});


		init();
		render();
