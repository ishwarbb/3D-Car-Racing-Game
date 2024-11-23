var startMusic = new Audio("../assets/sounds/start.wav")
var overMusic = new Audio("../assets/sounds/over.wav")
var winMusic = new Audio("../assets/sounds/win.wav")
// var levelMusic = new Audio("../assets/sounds/level.wav")
var levelMusic = new Audio("../assets/sounds/party.mp3")
var bonusMusic = new Audio("../assets/sounds/bonus.wav")
var dashMusic = new Audio("../assets/sounds/dash.wav")


var clock = new THREE.Clock();
var fuelDrop = 0.1;


var startc = 0;
var transparentOBB = 1;
const vehicleColors = [
    0xa52523,
    0xef2d56,
    0x0ad3ff,
    0x00ffff /*0xa52523, 0xbdb638, 0x78b14b*/
];

const lawnGreen = "#67C240";

const config = {
    showHitZones: false,
    shadows: true, // Use shadow
    trees: true, // Add trees to the map
    curbs: true, // Show texture on the extruded geometry
    grid: false // Show grid helper
};

const trackRadius = 125;
const trackWidth = 45;
const innerTrackRadius = trackRadius - trackWidth;
const outerTrackRadius = trackRadius + trackWidth;
const arcAngle1 = (1 / 2) * Math.PI;
const arcCenterX = 200;


function sortCars(a, b) {
    if (a.lap != b.lap) return a.lap > b.lap;
    if (a.quadrant != b.quadrant) return a.quadrant > b.quadrant;
    if (a.quadrant == 1) return a.model.position.x < b.model.position.x;
    if (a.quadrant == 2) return a.model.position.y < b.model.position.y;
    if (a.quadrant == 3) return a.model.position.x > b.model.position.x;
    if (a.quadrant == 4) return a.model.position.y > b.model.position.y;
}

function getRank() {
    var Objects = [...enemies];
    var x = Objects.length + 1;

    for (let i = 0; i < Objects.length; i++) {
        if (sortCars(car, Objects[i])) x--;
    }

    return x;
}

function updateStats() {
    const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
    let min = 10000;

    for (let i = 0; i < fuels.length; i++) {
        if (fuels[i].model && fuels[i].collected == false) {
            var dis = distance(fuels[i].model.position.x, fuels[i].model.position.y, car.model.position.x, car.model.position.y);
            if (dis < min) {
                min = dis;
            }
        }
    }

    car.nextfuel = min;
    var rank = getRank();

    if (!over) {
        var y = document.getElementById('2');
        y.innerHTML = "Health = " + car.health + "<br>";
        y.innerHTML += "Fuel Left = " + car.fuel.toFixed(2) + "<br>";
        y.innerHTML += "Score = " + car.score.toFixed(2) + "<br>";
        y.innerHTML += "Time = " + clock.getElapsedTime().toFixed(2) + "<br>";
        y.innerHTML += "Next Fuel in " + car.nextfuel.toFixed(2) + "<br>";

        y.innerHTML += "Rank " + rank + "<br>";
        y.innerHTML += "Lap " + car.lap + "<br>";
    }
}


function track1(car) {

    if (car.quadrant === 1) {
        car.speed = car.speedValue;
        car.handleVehicleMovement();
        car.handleBox();

        if (car.model.position.x < -arcCenterX) {
            car.speed = 0;
            car.quadrant = 2;
        }
    }

    if (car.quadrant == 2) {
        car.qangle += car.speedValue / 100;
        const vehicleX = -(Math.sin(car.qangle) * car.carRadius + arcCenterX);
        const vehicleY = Math.cos(car.qangle) * car.carRadius;

        car.model.position.x = vehicleX;
        car.model.position.y = vehicleY;
        car.model.rotation.y = car.qangle;
        car.handleBox();

        if (car.qangle >= Math.PI) {
            car.qangle = 0;
            car.quadrant = 3;
            car.direction = new THREE.Vector3(-1, 0, 0);
        }

    }

    if (car.quadrant === 3) {
        car.speed = car.speedValue;
        car.handleVehicleMovement();
        car.handleBox();

        if (car.model.position.x > arcCenterX) {
            car.speed = 0;
            car.quadrant = 4;
        }
    }

    if (car.quadrant == 4) {
        car.qangle += car.speedValue / 100;
        const vehicleX = (Math.sin(car.qangle) * car.carRadius + arcCenterX);
        const vehicleY = -1 * Math.cos(car.qangle) * car.carRadius;

        car.model.position.x = vehicleX;
        car.model.position.y = vehicleY;
        car.model.rotation.y = Math.PI + car.qangle;
        car.handleBox();

        if (car.qangle >= Math.PI) {
            car.qangle = 0;
            car.quadrant = 1;
            car.direction = new THREE.Vector3(1, 0, 0);
            car.lap += 1;
        }

    }
}


function track2(car) {

    if (car.quadrant === 1) {
        car.speed = car.speedValue;
        car.handleVehicleMovement();
        car.handleBox();

        if (car.model.position.x < -arcCenterX) {
            car.speed = 0;
            car.quadrant = 2;
        }
    }

    if (car.quadrant == 2) {
        car.qangle += car.speedValue / 100;
        const vehicleX = -(Math.sin(car.qangle) * car.carRadius + arcCenterX);
        const vehicleY = Math.cos(car.qangle) * car.carRadius;

        car.model.position.x = vehicleX;
        car.model.position.y = vehicleY;
        car.model.rotation.y = car.qangle;
        car.handleBox();

        if (car.qangle >= Math.PI) {
            car.qangle = 0;
            car.quadrant = 3;
            car.direction = new THREE.Vector3(-1, 0, 0);
        }

    }

    if (car.quadrant === 3) {
        car.speed = car.speedValue;
        car.handleVehicleMovement();
        car.handleBox();

        if (car.model.position.x > arcCenterX) {
            car.speed = 0;
            car.quadrant = 4;
        }
    }

    if (car.quadrant == 4) {
        car.qangle += car.speedValue / 100;
        const vehicleX = (Math.sin(car.qangle) * car.carRadius + arcCenterX);
        const vehicleY = -1 * Math.cos(car.qangle) * car.carRadius;

        car.model.position.x = vehicleX;
        car.model.position.y = vehicleY;
        car.model.rotation.y = Math.PI + car.qangle;
        car.handleBox();

        if (car.qangle >= Math.PI) {
            car.qangle = 0;
            car.quadrant = 1;
            car.direction = new THREE.Vector3(1, 0, 0);
            car.lap += 1;
        }

    }
}

function enemyLogic() {
    for (let i = 0; i < enemies.length; i++) {
        track1(enemies[i]);
    }
}

function fuelLogic() {
    let q = Math.floor(Math.random() * 1000) % 4 + 1;
    // let q = 1;
    if (q == 1) {
        let rand_x = (Math.floor(Math.random() * (2 * arcCenterX))) - arcCenterX;
        console.log(rand_x);
        let rand_y = (Math.floor(Math.random() * (outerTrackRadius - 2 - innerTrackRadius))) + innerTrackRadius + 2;

        let fuel = new fuel_gen(new THREE.Vector3(rand_x, rand_y, 1));
        fuels.push(fuel);
    }
    if (q == 2) {
        let angle = (Math.random() * Math.PI);
        let radius = (Math.random()) * (outerTrackRadius - 2 - innerTrackRadius) + innerTrackRadius + 2;
        const vehicleX = -(Math.sin(angle) * radius + arcCenterX);
        const vehicleY = Math.cos(angle) * radius;

        let fuel = new fuel_gen(new THREE.Vector3(vehicleX, vehicleY, 1));
        fuels.push(fuel);
    }
    if (q == 3) {
        let rand_x = (Math.floor(Math.random()) * (2 * arcCenterX)) - arcCenterX;
        let rand_y = (Math.floor(Math.random()) * (outerTrackRadius - 2 - innerTrackRadius)) + innerTrackRadius + 2;
        rand_y = -1 * rand_y;

        let fuel = new fuel_gen(new THREE.Vector3(rand_x, rand_y, 1));
        fuels.push(fuel);
    }
    if (q == 4) {
        let angle = (Math.random() * Math.PI);
        let radius = (Math.random()) * (outerTrackRadius - 2 - innerTrackRadius) + innerTrackRadius + 2;
        const vehicleX = (Math.sin(angle) * radius + arcCenterX);
        const vehicleY = -1 * Math.cos(angle) * radius;

        let fuel = new fuel_gen(new THREE.Vector3(vehicleX, vehicleY, 1));
        fuels.push(fuel);
    }
}

var started = 0;
var over = 0;
var toggled = 0;

var boxes = [];

function gameOver(message) {
    levelMusic.pause();
    over = 1;

    var x = document.getElementById("over");
    x.innerHTML = "<h1>" + "GAME OVER" + "<br /> </h1>" + "<br />" + "\n";
    x.innerHTML += "<h2>" + message + "<br /> </h2>" + "<br />" + "\n";
    x.innerHTML += "Refresh the page to restart";

    var myNode = document.getElementById("1");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }

    var myNode = document.getElementById("2");
    myNode.innerHTML = "";
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }

    var myNode = document.getElementById("3");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }

    startc = 0;

    overMusic.play();
}

function gameWin(message) {
    levelMusic.pause();
    over = 1;

    var x = document.getElementById("over");
    x.innerHTML = "<h1>" + "GAME OVER" + "<br /> </h1>" + "<br />" + "\n";
    x.innerHTML += "<h2>" + message + "<br /> </h2>" + "<br />" + "\n";
    x.innerHTML += "Refresh the page to restart";

    var myNode = document.getElementById("1");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }

    var myNode = document.getElementById("2");
    myNode.innerHTML = "";
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }

    var myNode = document.getElementById("3");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }

    startc = 0;

    winMusic.play();
}

function addBox(position) {

    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 10, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.rotation.x = Math.PI / 2;
    const cube = cylinder;

    for (let i = 0; i < car.vertices; i++) {
        var a = car.vertices[i];
        var position = new THREE.Vector3(car.model.position.x + a.x, car.model.position.y + a.y, car.model.position.z + a.z)

        cube.position.set(position.x, position.y, position.z);
        // cube.position.set(0,-74,285);
        // console.log("adding a cube at",position);
        console.log(scene);
        boxes.push(cube);
        scene.add(cube);
    }

    if (boxes.length > 100) {
        console.log("hey");
        scene.remove(boxes[0]);
        boxes.shift();
    }
}

if (!started) {
    var x = document.getElementById("start");
    x.innerHTML = "<h1>" + "Press SPACE to start." + "<br /> </h1>" + "<br />" + "\n";
    x.innerHTML += "<p>"
    x.innerHTML += "Controls - " + "<br />"
    x.innerHTML += "W - Accelerate " + "<br />"
    x.innerHTML += "S - Decelerate" + "<br />"
    x.innerHTML += "A - Left Turn" + "<br />"
    x.innerHTML += "D - Right Turn" + "<br />"
    x.innerHTML += "</p>"
}


let gltf_loader = (file) => {
    return new Promise((resolve) => {
        return new GLTFLoader().load(file, resolve);
    });
};


class fuel_gen {
    constructor(position) {
        let promise = gltf_loader("../assets/fuel2.glb").then(
            (res) => (this.model = res.scene)
        );
        Promise.all([promise]).then(() => {
            scene.add(this.model);
            this.model.scale.set(0.0050, 0.0050, 0.0050);
            this.model.rotation.z = (Math.PI / 180);
            this.model.rotation.y = (Math.PI / 2);
            this.model.rotation.x = (Math.PI / 2);
            this.model.position.set(position.x, position.y, position.z);
            this.width = 0.2;
            this.depth = 0.4;
            this.hitBox = {
                x: this.model.position.x,
                y: this.model.position.y - this.depth / 2,
                width: this.width,
                depth: this.depth,
            };
            this.speed = 0.009;
            this.rotationSpeed = 0.005;
            this.collected = false;
            this.deleted = false;

            const geometry = new THREE.BoxGeometry(1.6, 3.5, 1)
            this.mesh = new THREE.Mesh(
                geometry,
                new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, opacity: 0, transparent: true, depthWrite: false })
                // new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
            )
            if (!transparentOBB) {
                this.mesh = new THREE.Mesh(
                    geometry,
                    // new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, opacity: 0, transparent: true, depthWrite: false})
                    new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
                )
            }

            this.mesh.position.set(this.model.position.x, this.model.position.y, this.model.position.z);
            this.mesh.rotation.set(this.model.rotation.x, this.model.rotation.y, this.model.rotation.z);
            this.mesh.geometry.computeBoundingBox();
            this.mesh.geometry.userData.obb = new OBB();
            scene.add(this.mesh);
            this.box = new THREE.Box3();
            this.box.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);

            this.obb = new OBB().fromBox3(this.box);
        });
    }
}

class Enemy_gen {
    constructor(position, speed) {
        let promise = gltf_loader("../assets/lighting_mcqueen.glb").then(
            (res) => (this.model = res.scene)
        );
        Promise.all([promise]).then(() => {
            scene.add(this.model);
            // this.model.scale.set(30, 30, 30);
            this.model.rotation.x = 90 * (Math.PI / 180);
            // this.model.rotation.z = 90 * (Math.PI / 180);
            // this.model.rotation.y = 90 * (Math.PI / 180);

            this.model.children[0].children[0].children[0].material.color.set(vehicleColors[3]);
            this.model.children[0].children[0].children[1].material.color.set(vehicleColors[3]);


            this.model.position.set(position.x, position.y, position.z);
            this.width = 0.2;
            this.depth = 0.4;
            this.hitBox = {
                x: this.model.position.x,
                y: this.model.position.y - this.depth / 2,
                width: this.width,
                depth: this.depth,
            };
            this.speed = 0;
            this.speedValue = speed;
            this.rotationSpeed = 0.1;
            this.alive = true;
            this.approachtime = Math.random() * 7000 + 2000;

            this.direction = new THREE.Vector3(1, 0, 0);
            // this.right = new THREE.Vector3(0,1,0);
            this.velocity = new THREE.Vector3(0, 0, 0);
            this.turnRate = 1;
            this.topLeft = new THREE.Vector3(-2, 0, 1);
            this.topRight = new THREE.Vector3(-2, 0, -1);
            this.backLeft = new THREE.Vector3(2, 0, 1);
            this.backRight = new THREE.Vector3(2, 0, -1);

            this.vertices = [this.topLeft, this.topRight, this.backLeft, this.backRight];
            // this.vertices = [1,2];
            startc = 1;
            var x = new THREE.Vector3(2, 1, 1);
            // this.obb = new OBB(this.model.position, x, this.rotation);

            const geometry = new THREE.BoxGeometry(4, 2, 1.8)
            this.mesh = new THREE.Mesh(
                geometry,
                new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, opacity: 0, transparent: true, depthWrite: false })
                // new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
            )
            if (!transparentOBB) {
                this.mesh = new THREE.Mesh(
                    geometry,
                    // new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, opacity: 0, transparent: true, depthWrite: false})
                    new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
                )
            }
            //   if(transparentOBB == 0) this.mesh.trans= 0;
            this.mesh.position.set(this.model.position.x, this.model.position.y, this.model.position.z);
            this.mesh.rotation.set(this.model.rotation.x, this.model.rotation.y, this.model.rotation.z);
            this.mesh.geometry.computeBoundingBox();
            this.mesh.geometry.userData.obb = new OBB();
            scene.add(this.mesh);
            this.box = new THREE.Box3();
            this.box.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);

            this.obb = new OBB().fromBox3(this.box);


            this.friction = 0.01;
            this.speed = 0;
            this.acceleration = 0;

            this.quadrant = 1;
            this.qangle = 0;

            this.carRadius = this.model.position.y;


            this.health = 100;
            this.fuel = 1000;
            this.score = 0;
            this.time = 0;

            this.car = 0;

            this.lap = 0;
        });
    }
    handleVehicleMovement() {
        // position
        var offset = this.direction.clone().multiplyScalar(-this.speed);
        this.model.position.add(offset);
        this.model.position.add(this.velocity);
        this.model.position.set(this.model.position.x, this.model.position.y, this.model.position.z);
    }
    handleBox() {
        this.mesh.position.set(this.model.position.x, this.model.position.y, this.model.position.z);
        this.mesh.rotation.set(this.model.rotation.x, this.model.rotation.y, this.model.rotation.z);

        this.box.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
        // this.obb = new OBB().fromBox3(this.box);
    }
    handleCameraMovement() {

    }

}

class car_gen {
    constructor(position) {
        // let promise = gltf_loader("../assets/lighting_mcqueen.glb").then(
        let promise = gltf_loader("../assets/opponent.glb").then(
            (res) => {
                (this.model = res.scene)
            }
        );
        Promise.all([promise]).then(() => {
            scene.add(this.model);
            // this.model.scale.set(0.02, 0.02, 0.02);
            // this.model.rotation.z = -90 * (Math.PI / 180);
            this.model.rotation.x = 90 * (Math.PI / 180);
            this.model.position.set(position.x, position.y, position.z);
            this.width = 0.2;
            this.depth = 0.4;
            this.hitBox = {
                x: this.model.position.x,
                y: this.model.position.y - this.depth / 2,
                width: this.width,
                depth: this.depth,
            };
            this.hitBox.up = new THREE.Vector3(0, 0, 1);
            this.rotationSpeed = 0.005;
            this.deleted = false;
            // this.direction = {x : 0, y : 0, z : 1};
            this.direction = new THREE.Vector3(1, 0, 0);
            // this.right = new THREE.Vector3(0,1,0);
            this.velocity = new THREE.Vector3(0, 0, 0);
            this.turnRate = 1;
            this.topLeft = new THREE.Vector3(-2, 0, 1);
            this.topRight = new THREE.Vector3(-2, 0, -1);
            this.backLeft = new THREE.Vector3(2, 0, 1);
            this.backRight = new THREE.Vector3(2, 0, -1);

            this.vertices = [this.topLeft, this.topRight, this.backLeft, this.backRight];
            // this.vertices = [1,2];
            var x = new THREE.Vector3(2, 1, 1);
            // this.obb = new OBB(this.model.position, x, this.rotation);

            const geometry = new THREE.BoxGeometry(4, 2, 1.8)
            this.mesh = new THREE.Mesh(
                geometry,
                new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, opacity: 0, transparent: true, depthWrite: false })
                // new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true})
            )
            if (!transparentOBB) {
                this.mesh = new THREE.Mesh(
                    geometry,
                    // new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, opacity: 0, transparent: true, depthWrite: false})
                    new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
                )
            }
            //   if(transparentOBB == 0) this.mesh.trans= 0;
            this.mesh.position.set(this.model.position.x, this.model.position.y, this.model.position.z);
            this.mesh.rotation.set(this.model.rotation.x, this.model.rotation.y, this.model.rotation.z);
            this.mesh.geometry.computeBoundingBox();
            this.mesh.geometry.userData.obb = new OBB();
            scene.add(this.mesh);
            this.box = new THREE.Box3();
            this.box.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);

            this.obb = new OBB().fromBox3(this.box);


            this.friction = 0.01;
            this.speed = 0;
            this.acceleration = 0;

            this.health = 100;
            this.fuel = 1000;
            this.score = 0;
            this.time = 0;
            this.nextfuel = 0;
            // this.maxrot = Math.PI/3;
            this.maxrot = 0.15;
            this.rot = 0;
            this.drift = 0;
            this.driftHold = 0;

            this.originalRot = this.model.rotation.clone();

            this.quadrant = 1;

            startc = 1;

            this.car = 1;

            this.lap = 0;

        });
    }
    updateHitbox() {
        this.hitBox = {
            x: this.model.position.x,
            y: this.model.position.y,
            width: this.width,
            depth: this.depth,
        };
        this.hitBox.up = new THREE.Vector3(0, 0, 1);
    }

    handleQuadrant() {
        if ((this.model.position.x < -arcCenterX) && (this.quadrant === 1)) this.quadrant = 2;
        else if ((this.model.position.x > arcCenterX) && (this.quadrant === 3)) this.quadrant = 4;
        else {
            if ((this.model.position.y > 0) && (this.quadrant === 4)) { this.quadrant = 1; this.lap += 1 }
            else if (this.quadrant === 2) this.quadrant = 3;
        }
        var total = enemies.length + 1;
        if (this.lap == 4 && this.quadrant == 1) {
            gameWin("You WIN. Your rank : " + getRank() + "/" + total);
        }
    }

    handleBox() {
        if (this.mesh) {
            this.mesh.position.set(this.model.position.x, this.model.position.y, this.model.position.z);
            this.mesh.rotation.set(this.model.rotation.x, this.model.rotation.y, this.model.rotation.z);

            this.box.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
        }
        // this.obb = new OBB().fromBox3(this.box);
    }

    handleCameraMovement() {
        if (!startc) return;

        let targetPosition = this.model.position.clone();
        camera.rotation.z = Math.PI / 2;


        let cameraPosition = this.model.position.clone();
        let facingDirection = new THREE.Vector3(this.direction.x,
            this.direction.y, 0).normalize();

        facingDirection.negate();
        targetPosition.add(facingDirection);
        let positionOffset = facingDirection.clone().multiplyScalar(3);
        cameraPosition.sub(positionOffset);
        cameraPosition.z += 1.5;
        camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        if (toggled) {
            positionOffset = facingDirection.clone().multiplyScalar(5);
            cameraPosition.sub(positionOffset);
            cameraPosition.z += 1.5;
            camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
            targetPosition.z += 1.5;
        }
        camera2.position.set(this.model.position.x, this.model.position.y, this.model.position.z + 100);

        camera.up.set(0, 0, 1);
        camera.lookAt(targetPosition);
        camera2.lookAt(targetPosition);
    }

    handleVehicleMovement() {
        var offset = this.direction.clone().multiplyScalar(-this.speed);
        this.model.position.add(offset);
        this.model.position.add(this.velocity);
        this.model.position.set(this.model.position.x, this.model.position.y, this.model.position.z);
    }
}


import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBB } from 'three/examples/jsm/math/OBB'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.rotation.set(1, 0, 0);
camera.position.set(0, -70, 285);



const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera2.rotation.set(0, 0, 0);
camera2.position.set(0, 30, 285);


// console.log(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const renderer2 = new THREE.WebGLRenderer();
renderer2.setSize(400, 200);



// export const controls = new OrbitControls(camera, renderer.domElement);
// controls.update();

if (started) {
    var x = document.getElementById('1')
    x.appendChild(renderer.domElement);
    updateStats();
    var z = document.getElementById('3');
    z.appendChild(renderer2.domElement);
}

// export const controls = new OrbitControls(camera, renderer.domElement);
// controls.update();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const light = new THREE.AmbientLight()
light.position.set(0, 0, 1000);
scene.add(light)

const loader = new GLTFLoader();

let car;
let fuels = [];
let enemies = [];

function init() {
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    car = new car_gen({ x: 0, y: trackRadius - trackWidth + 6 * trackWidth / 5, z: 1 });
    let enemy = new Enemy_gen({ x: 1 + Math.random(), y: trackRadius  - trackWidth  + 2 * trackWidth / 5, z: 1 }, 1)
    let enemy2 = new Enemy_gen({ x:2 + Math.random(), y: trackRadius - trackWidth  + 4 * trackWidth / 5, z: 1 }, Math.random())
    let enemy3 = new Enemy_gen({ x:3 + Math.random(), y: trackRadius - trackWidth  + 8 * trackWidth / 5, z: 1 }, Math.random())
    enemies.push(enemy);
    enemies.push(enemy2);
    enemies.push(enemy3);
    // car = JSON.parse((car);
    console.log("car =", car);
    console.log("car.model =", car.model);

    for (let i = 0; i < 5; i++) {
        fuelLogic();
    }

    if (car) {
        if (car.model) {
            var position = new THREE.Vector3(car.model.position.x, car.model.position.y, car.model.position.z);
            addBox(position);
        }
    }

}

var collide = 0;

function trackCollision(car) {
    var carVertices = [];

    for (let i = 0; i < car.vertices.length; i++) {
        var a = car.vertices[i];
        var y = new THREE.Vector3(car.model.position.x + a.x, car.model.position.y + a.y, car.model.position.z + a.z)
        carVertices.push(y);

        for (let i = 0; i < carVertices.length; i++) {
            var point = carVertices[i];
            if (point.x <= arcCenterX && point.x >= -arcCenterX) {
                if (point.y > 0) {
                    if (point.y <= (innerTrackRadius + 1.5) || (point.y >= outerTrackRadius - 1.5)) {
                        console.log("hey");

                        car.velocity.sub(car.direction.clone()
                            .multiplyScalar(-1));
                        //   console.log(car.velocity);
                        car.handleVehicleMovement();
                        car.handleCameraMovement();
                        car.velocity.set(0, 0, 0);
                        car.speed = 0;

                        dashMusic.play();
                    }
                }

                if (point.y < 0) {
                    if (point.y >= -(innerTrackRadius + 1) || (point.y <= -(outerTrackRadius - 1))) {
                        console.log("hey");

                        car.velocity.sub(car.direction.clone()
                            .multiplyScalar(-1));
                        //   console.log(car.velocity);
                        car.handleVehicleMovement();
                        car.handleCameraMovement();
                        car.velocity.set(0, 0, 0);
                        car.speed = 0;
                        dashMusic.play();

                    }
                }
            }

            if (point.x > arcCenterX) {
                const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
                var dis = distance(point.x, point.y, arcCenterX, 0);
                // console.log(dis);
                if (dis >= outerTrackRadius - 2 || dis <= innerTrackRadius + 2) {
                    console.log("hewwo");

                    car.velocity.sub(car.direction.clone()
                        .multiplyScalar(-1));
                    //   console.log(car.velocity);
                    car.handleVehicleMovement();
                    car.handleCameraMovement();
                    car.velocity.set(0, 0, 0);
                    car.speed = 0;
                    dashMusic.play();
                }
            }

            if (point.x < -arcCenterX) {
                const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
                var dis = distance(point.x, point.y, -arcCenterX, 0);
                // console.log(dis);
                if (dis >= outerTrackRadius - 2 || dis <= innerTrackRadius + 2) {
                    console.log("hewwo");

                    car.velocity.sub(car.direction.clone()
                        .multiplyScalar(-1));
                    //   console.log(car.velocity);
                    car.handleVehicleMovement();
                    car.handleCameraMovement();
                    car.velocity.set(0, 0, 0);
                    car.speed = 0;
                    dashMusic.play();
                }
            }
        }
    }
}

function checkCollision() {

    if (car.health <= 0) {
        car.health = 0;
        gameOver("You ran out of Health");
    }

    if (car.fuel <= 0) {
        car.fuel = 0;
        gameOver("You ran out of fuel");
    }

    if (car.speed > 0) car.speed -= car.friction;

    for (let i = 0; i < fuels.length; i++) {
        if (fuels[i].model && fuels[i].collected == false) {

            if (car.obb) {
                var x = car.obb.clone();
                var y = fuels[i].obb.clone();

                if (x.applyMatrix4(car.mesh.matrixWorld).intersectsOBB(y.applyMatrix4(fuels[i].mesh.matrixWorld))) {
                    car.fuel += 100;
                    fuels[i].collected = true
                    scene.remove(fuels[i].model);

                    fuelLogic();
                    bonusMusic.play();

                    collide == 1;
                }
            }
        }
    }

    trackCollision(car);


    for (let i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];

        trackCollision(enemy);

        if (car.obb) {

            var x = car.obb.clone();
            var y = enemy.obb.clone();

            if (x.applyMatrix4(car.mesh.matrixWorld).intersectsOBB(y.applyMatrix4(enemy.mesh.matrixWorld))) {
                car.mesh.material.color.set(0xff0000)
                dashMusic.play();

                car.velocity.sub(car.direction.clone()
                    .multiplyScalar(-5));
                //   console.log(car.velocity);
                car.handleVehicleMovement();
                car.handleCameraMovement();
                car.handleBox();
                car.velocity.set(0, 0, 0);
                car.speed = 0;
                car.health -= 15;
                enemy.health = -15;

            } else {
                car.mesh.material.color.set(0x00ff00)
            }
        }

        for (let i = 0; i < enemies.length; i++) {
            for (let j = i + 1; j < enemies.length; j++) {
                var enemy1 = enemies[i];
                var enemy2 = enemies[i];

                if (enemy1.obb && enemy2.obb) {
                    var x = enemy1.obb.clone();
                    var y = enemy2.obb.clone();
                    collide == x.applyMatrix4(enemy1.mesh.matrixWorld).intersectsOBB(y.applyMatrix4(enemy2.mesh.matrixWorld));

                    if (collide) {
                        dashMusic.play();

                        enemy1.velocity.sub(enemy2.direction.clone()
                            .multiplyScalar(-5));
                        enemy1.handleVehicleMovement();
                        enemy1.handleCameraMovement();
                        enemy1.handleBox();
                        enemy1.velocity.set(0, 0, 0);
                        enemy1.speed = 0;
                        enemy1.health -= 15;
                        enemy2.health = -15;
                    }
                }


                // if (enemy1.health <= 0) {
                //     scene.remove(enemy1.model);
                // }

                // if (enemy2.health <= 0) {
                //     scene.remove(enemy2.model);
                // }
            }
        }
    }
}


function Stadium1(x, y, z, rot) {
    loader.load('../assets/stadium2.glb', function (gltf) {
        // gltf.scene.rotation.x = -5;
        gltf.scene.name = "stadium";
        gltf.scene.position.x = x;
        gltf.scene.rotation.x = rot;
        gltf.scene.position.y = y;
        gltf.scene.position.z = z;
        gltf.scene.scale.set(100, 100, 100);
        scene.add(gltf.scene);

    }, undefined, function (error) {

        console.error(error);
    });
}

Stadium1(arcCenterX / 2, outerTrackRadius + 20, 1, Math.PI / 2);
Stadium1(-arcCenterX / 2, outerTrackRadius + 20, 1, Math.PI / 2);

function Stadium2(x, y, z, rot) {
    loader.load('../assets/stadium2.glb', function (gltf) {
        // gltf.scene.rotation.x = -5;
        gltf.scene.name = "stadium";
        gltf.scene.position.x = x;
        gltf.scene.rotation.x = rot;
        gltf.scene.rotation.y = Math.PI;
        gltf.scene.position.y = y;
        gltf.scene.position.z = z;
        gltf.scene.scale.set(100, 100, 100);
        scene.add(gltf.scene);

    }, undefined, function (error) {

        console.error(error);
    });
}

Stadium2(arcCenterX / 2, -1 * (outerTrackRadius + 20), 1, Math.PI / 2);
Stadium2(-arcCenterX / 2, -1 * (outerTrackRadius + 20), 1, Math.PI / 2);

// controls.update();
renderer.render(scene, camera2);
renderer2.render(scene, camera2);


var keyState = {};

window.addEventListener(
    "keydown",
    function (e) {
        keyState[e.keyCode || e.which] = true;
    },
    true
);

window.addEventListener(
    "keyup",
    function (e) {
        keyState[e.keyCode || e.which] = false;
        if(e.keyCode == 84) {
            if (toggled == 1) toggled = 0;
            else toggled = 1;
            car.handleCameraMovement();
        }
    },
    true
);

function toggle() {

    if (keyState[84]) {
        // if (toggled == 1) toggled = 0;
        // else toggled = 1;
        // car.handleCameraMovement();
    }

    setTimeout(toggle, 200);
}

var up = new THREE.Vector3(0, 0, 1);
var angle = 0.005;



function gameLoop() {
    if ((keyState[87] && keyState[83]) || (keyState[68] && keyState[65])) {
        // W and S pressed
        // do nothing
        // return;
    }
    else {
        if (keyState[32]) { // space pressed
            if (!started) {
                car.handleCameraMovement();

                started = 1;
                clock.start();

                var x = document.getElementById('1')
                x.appendChild(renderer.domElement);
                updateStats();
                var z = document.getElementById('3');
                z.appendChild(renderer2.domElement);

                var s = document.getElementById("start");
                s.innerHTML = ""

                startMusic.play();
            }
        }

        if (keyState[65]) {
            // A pressed

            car.model.rotation.y += angle;
            car.direction.applyAxisAngle(up, angle);
            car.originalRot = car.model.rotation.clone();
            car.handleCameraMovement();
            car.handleBox();

            car.fuel -= fuelDrop;
        }

        if (keyState[66]) {
            var position = new THREE.Vector3(car.model.position.x, car.model.position.y, car.model.position.z);
            addBox(position);
        }

        if (keyState[67]) {
            console.log(car.model.position);
        }

        if (keyState[87]) {
            // W pressed

            car.speed += 0.01;
            car.fuel -= fuelDrop;
            car.score += 0.01;

        }

        if (keyState[68]) {
            // D pressed

            car.model.rotation.y -= angle;
            car.direction.applyAxisAngle(up, -angle);
            car.originalRot = car.model.rotation.clone();
            car.handleCameraMovement();
            car.handleBox();
            // car.handleVehicleMovement();

            car.fuel -= fuelDrop;

        }
        if (keyState[83]) {
            // S pressed

            if (car.speed > 0) car.speed -= 0.005;
            var position = new THREE.Vector3(car.model.position.x, car.model.position.y, car.model.position.z);
            addBox(position);

        }

        if (keyState[83] && keyState[68]) {
            // S and D pressed
            car.drift = 1;
            //   if(car.rot >= -1*car.maxrot)
            if (!car.driftHold) {
                car.rot -= 0.005;
                car.model.rotation.y -= 0.005;
                if (car.rot <= -1 * car.maxrot) {
                    car.driftHold = 1;
                }
            }
            // console.log("S and D pressed");
        }
        if (keyState[83] && keyState[65]) {
            // S and A pressed
            car.drift = 2;
            //   if(car.rot >= -1*car.maxrot)
            if (!car.driftHold) {
                car.rot += 0.005;
                car.model.rotation.y += 0.005;
                if (car.rot >= car.maxrot) {
                    car.driftHold = 1;
                }
            }
            // console.log("S and A pressed");
        }
        if (!keyState[83]) {
            if (startc) {
                if (car.drift == 1) {
                    car.rot = 0;
                    car.drift = 0;
                    car.driftHold = 0;
                    car.model.rotation.y += car.maxrot;
                    // car.model.rotation.set(car.originalRot.clone());
                }
                if (car.drift == 2) {
                    car.rot = 0;
                    car.drift = 0;
                    car.driftHold = 0;
                    car.model.rotation.y -= car.maxrot;
                    // car.model.rotation.set(car.originalRot.clone());
                }
            }
        }

        if (keyState[37]) {
            // left arrow pressed
            car.model.rotation.y += car.rotationSpeed;
            // console.log("left arrow pressed");
        }
        if (keyState[39]) {
            // right arrow pressed
            car.model.rotation.y -= car.rotationSpeed;
            // console.log("right arrow pressed");
        }
        if (keyState[37] && keyState[39]) {
            // right and left arrow pressed
            // do nothing
        }
    }
    setTimeout(gameLoop, 2);
}

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    renderer2.render(scene, camera2);

    if (startc && started) {
        car.handleVehicleMovement();
        car.handleCameraMovement();
        car.handleBox();
        car.handleQuadrant();
        
        checkCollision();
        enemyLogic();
        updateStats();
    }

    if (started && !over) {
        levelMusic.play();
    }

}

toggle();
gameLoop();
init();
animate();
renderMap(10000, 10000);










function getLeftIsland() {
    const islandLeft = new THREE.Shape();

    islandLeft.absarc(
        -arcCenterX,
        0,
        innerTrackRadius,
        arcAngle1,
        -arcAngle1,
        false
    );

    islandLeft.lineTo(-arcCenterX, innerTrackRadius);


    return islandLeft;
}

function getMiddleIsland() {
    const islandMiddle = new THREE.Shape();

    islandMiddle.moveTo(-arcCenterX, innerTrackRadius);
    islandMiddle.lineTo(arcCenterX, innerTrackRadius);
    islandMiddle.lineTo(arcCenterX, -innerTrackRadius);
    islandMiddle.lineTo(-arcCenterX, -innerTrackRadius);
    islandMiddle.lineTo(-arcCenterX, innerTrackRadius);

    return islandMiddle;
}

function getRightIsland() {
    const islandRight = new THREE.Shape();

    islandRight.absarc(
        arcCenterX,
        0,
        innerTrackRadius,
        Math.PI - arcAngle1,
        Math.PI + arcAngle1,
        true
    );

    islandRight.lineTo(arcCenterX, innerTrackRadius);


    return islandRight;
}

function getOuterField(mapWidth, mapHeight) {
    const field = new THREE.Shape();

    field.moveTo(-mapWidth / 2, -mapHeight / 2);
    field.lineTo(- arcCenterX, -mapHeight / 2);

    field.absarc(-arcCenterX, 0, outerTrackRadius, -Math.PI / 2, Math.PI / 2, true);

    field.lineTo(outerTrackRadius, outerTrackRadius);

    field.absarc(
        arcCenterX,
        0,
        outerTrackRadius,
        Math.PI / 2,
        3 * Math.PI / 2,
        true
    );

    field.lineTo(- arcCenterX, -outerTrackRadius);

    field.lineTo(- arcCenterX, -mapHeight / 2);
    field.lineTo(mapWidth / 2, -mapHeight / 2);
    field.lineTo(mapWidth / 2, mapHeight / 2);
    field.lineTo(-mapWidth / 2, mapHeight / 2);

    return field;
}

function getLineMarkings(mapWidth, mapHeight) {
    const canvas = document.createElement("canvas");
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    const context = canvas.getContext("2d");

    context.fillStyle = "#546E90";
    context.fillRect(0, 0, mapWidth, mapHeight);

    context.lineWidth = 1;
    context.strokeStyle = "#E0FFFF";
    context.setLineDash([10, 14]);

    // Left circle
    context.beginPath();
    context.arc(
        mapWidth / 2 - arcCenterX,
        mapHeight / 2,
        trackRadius,
        Math.PI / 2,
        -Math.PI / 2
    );
    context.stroke();

    // Right circle
    context.beginPath();
    context.arc(
        mapWidth / 2 + arcCenterX,
        mapHeight / 2,
        trackRadius,
        -Math.PI / 2,
        Math.PI / 2
    );
    context.stroke();

    context.beginPath();
    context.moveTo(mapWidth / 2 - arcCenterX, mapHeight / 2 + trackRadius);
    context.lineTo(mapWidth / 2 + arcCenterX, mapHeight / 2 + trackRadius);
    context.stroke();

    context.beginPath();
    context.moveTo(mapWidth / 2 - arcCenterX, mapHeight / 2 - trackRadius);
    context.lineTo(mapWidth / 2 + arcCenterX, mapHeight / 2 - trackRadius);
    context.stroke();

    return new THREE.CanvasTexture(canvas);
}

function renderMap(mapWidth, mapHeight) {
    const lineMarkingsTexture = getLineMarkings(mapWidth, mapHeight);

    const planeGeometry = new THREE.PlaneBufferGeometry(mapWidth, mapHeight);
    const planeMaterial = new THREE.MeshLambertMaterial({
        map: lineMarkingsTexture
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.matrixAutoUpdate = false;
    scene.add(plane);

    // Extruded geometry with curbs
    const islandLeft = getLeftIsland();
    const islandMiddle = getMiddleIsland();
    const islandRight = getRightIsland();
    const outerField = getOuterField(mapWidth, mapHeight);

    // Mapping a texture on an extruded geometry works differently than mapping it to a box
    // By default it is mapped to a 1x1 unit square, and we have to stretch it out by setting repeat
    // We also need to shift it by setting the offset to have it centered
    const curbsTexture = getCurbsTexture(mapWidth, mapHeight);
    curbsTexture.offset = new THREE.Vector2(0.5, 0.5);
    curbsTexture.repeat.set(1 / mapWidth, 1 / mapHeight);

    // An extruded geometry turns a 2D shape into 3D by giving it a depth
    const fieldGeometry = new THREE.ExtrudeBufferGeometry(
        [islandLeft, islandRight, islandMiddle, outerField],
        //   [islandLeft, islandRight, outerField],
        { depth: 1.5, bevelEnabled: true }
    );

    const fieldMesh = new THREE.Mesh(fieldGeometry, [
        new THREE.MeshLambertMaterial({
            // Either set a plain color or a texture depending on config
            color: !config.curbs && lawnGreen,
            map: config.curbs && curbsTexture
        }),
        new THREE.MeshLambertMaterial({ color: 0x23311c })
    ]);
    fieldMesh.receiveShadow = true;
    fieldMesh.matrixAutoUpdate = false;
    scene.add(fieldMesh);

    // positionScoreElement();
}

function getCurbsTexture(mapWidth, mapHeight) {
    const canvas = document.createElement("canvas");
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    const context = canvas.getContext("2d");

    context.fillStyle = lawnGreen;
    context.fillRect(0, 0, mapWidth, mapHeight);

    return new THREE.CanvasTexture(canvas);
}

renderMap(1000, 1000);
