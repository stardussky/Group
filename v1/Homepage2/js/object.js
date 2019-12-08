class Desk {
  constructor(x, z, r = 0){
    this.x = x;
    this.z = z;
    this.r = r;
    this.desk = new THREE.Group();
    let part1Geo = new THREE.BoxGeometry(150, 100, 5);
    let part1 = new THREE.Mesh(part1Geo, brownMat);
    let part2 = part1.clone();
    part1.rotation.x = Math.PI * .5;
    let part3 = part1.clone();
    part2.position.set(0, -50, -45);
    part3.position.set(0, -100, 0);
    let part4Geo = new THREE.BoxGeometry(50, 80, 80);
    let part4 = new THREE.Mesh(part4Geo, grayMat);
    part4.position.set(45, -60, 0);
    let part5Geo = new THREE.BoxGeometry(10, 2, 1);
    let part5 = new THREE.Mesh(part5Geo, whiteMat);
    let part6 = part5.clone();
    let part7 = part5.clone();
    part5.position.set(45, -35, 40);
    part6.position.set(45, -55, 40);
    part7.position.set(45, -75, 40);
    let part8Geo = new THREE.BoxGeometry(40, 30, 1);
    let part8 = new THREE.Mesh(part8Geo, silverMat);
    let part9 = part8.clone();
    part8.position.set(-25, 18, 0);
    part9.rotation.x = Math.PI * .5;
    part9.position.set(-25, 3, 14);
    let part10Geo = new THREE.BoxGeometry(35, 25, 1);
    let part10 = new THREE.Mesh(part10Geo, blackMat);
    part10.position.set(-25, 18, .2);
    let part11Geo = new THREE.CylinderGeometry(5, 5, 15, 10);
    let part11 = new THREE.Mesh(part11Geo, whiteMat);
    part11.position.set(25, 5, 10);
    this.desk.add(part1, part2, part3, part4, part5, part6, part7, part8, part9, part10, part11);
    this.desk.position.set(this.x, 100, this.z);
    this.desk.rotation.y = Math.PI * this.r;
  }
}

class BigDesk {
  constructor(x, z, r){
    this.x = x;
    this.z = z;
    this.r = r;
    this.desk = new THREE.Group();
    let part1Geo = new THREE.BoxGeometry(250, 150, 10);
    let part1 = new THREE.Mesh(part1Geo, deepBrownMat);
    let part2Geo = new THREE.BoxGeometry(10, 75, 10);
    let part2 = new THREE.Mesh(part2Geo, silverMat);
    let part3 = part2.clone();
    let part4 = part2.clone();
    let part5 = part2.clone();
    part1.rotation.x = Math.PI * .5;
    part2.position.set(100, -35, 50);
    part3.position.set(-100, -35, 50);
    part4.position.set(100, -35, -50);
    part5.position.set(-100, -35, -50);
    this.desk.add(part1, part2, part3, part4, part5);
    this.desk.position.set(this.x, 75, this.z);
    this.desk.rotation.y = Math.PI * this.r;
  }
}

class Wall {
  constructor(x, z, w, r){
    this.x = x;
    this.z = z;
    this.w = w;
    this.r = r;
    let wallGeo = new THREE.BoxGeometry(this.w, 202.5, 5);
    this.wall = new THREE.Mesh(wallGeo, whiteMat);

    let wallShape = new CANNON.Box(
      new CANNON.Vec3(this.w/2, 202.5/2, 5/2)
    )
    this.wallBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(this.x, 101.25, this.z),
    })
    this.wallBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI * this.r);
    this.wallBody.addShape(wallShape);
    this.wall.position.copy(this.wallBody.position);
    this.wall.quaternion.copy(this.wallBody.quaternion);
  }
}

class FloorWindow{
  constructor(x, z, r, w = 100){
    this.x = x;
    this.z = z;
    this.r = r;
    this.w = w;
    this.floorWindow = new THREE.Group;
    let part1Geo = new THREE.BoxGeometry(5, 200, 2.5);
    let part1 = new THREE.Mesh(part1Geo, blackMat);
    let part2Geo = new THREE.BoxGeometry(this.w, 5, 2.5);
    let part2 = new THREE.Mesh(part2Geo, blackMat);
    part2.rotation.y = Math.PI * -.5;
    let part3 = part1.clone();
    part3.position.set(0, 0, -(this.w - 5));
    let part4 = part2.clone();
    part2.position.set(0, 100, -(this.w / 2 - 2.5));
    part4.position.set(0, -60, -(this.w / 2 - 2.5));
    this.floorWindow.add(part1, part2, part3, part4);
    // this.floorWindow.position.set(this.x, 100, this.z);
    // this.floorWindow.rotation.y = Math.PI * this.r;

    let windowShape = new CANNON.Box(
      new CANNON.Vec3(this.w/2, 200/2, 2.5/2)
    )
    this.windowBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(this.x, 100, this.z),
    })
    this.windowBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI * this.r);
    this.windowBody.addShape(windowShape);
    this.floorWindow.position.copy(this.windowBody.position);
    // this.floorWindow.quaternion.copy(this.windowBody.quaternion);
  }
}

class Photo{
  constructor (x, y, z, w, h, r, p = 0){
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.h = h;
    this.r = r;
    this.p = p;
    this.photo = new THREE.Group();
    let textures = [
      'https://images.unsplash.com/photo-1573835541303-fb7832c2b959?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1573936798709-9162e0ea1bd7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1573844077939-8eabe5be728f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1573951925888-9c0c45604fae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1573965086665-f4f51faf95d2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    ]
    let texture = new THREE.TextureLoader().load(textures[this.p]);
    let mat = new THREE.MeshLambertMaterial({map: texture});
    let part1Geo = new THREE.BoxGeometry(this.w, this.h, 1);
    let part1 = new THREE.Mesh(part1Geo, mat);
    part1.position.z = 1;
    let part2Geo = new THREE.BoxGeometry(this.w + 5, this.h + 5, 1);
    let part2 = new THREE.Mesh(part2Geo, blackMat);
    this.photo.add(part1, part2);
    this.photo.position.set(this.x, this.y, this.z);
    this.photo.rotation.y = Math.PI * this.r;
  }
}

class Chair{
  constructor(x, z, r = 0){
    this.x = x;
    this.z = z;
    this.r = r;
    this.chair = new THREE.Group();
    let shape = new THREE.Shape();
    shape.moveTo( 0,0 );
    shape.lineTo( 0, 50 );
    shape.lineTo( 50, 50 );
    shape.lineTo( 50, 0 );
    shape.lineTo( 0, 0 );

    let extrudeSettings = {
      steps: 1,
      depth: 1,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: -4,
      bevelSegments: 5
    };
    let part1Geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    let part1 = new THREE.Mesh(part1Geo, blueMat);
    let part2 = part1.clone();
    part2.rotation.x = Math.PI * .5;
    part2.position.set(0, 5, -5);
    let part3Geo = new THREE.BoxGeometry(5, 25, 5);
    let part3 = new THREE.Mesh(part3Geo, silverMat);
    let part4 = new THREE.Mesh(part3Geo, silverMat);
    let part5 = new THREE.Mesh(part3Geo, silverMat);
    let part6 = new THREE.Mesh(part3Geo, silverMat);
    part3.position.set(10, -10, 5);
    part4.position.set(40, -10, 5);
    part5.position.set(40, -10, 35);
    part6.position.set(10, -10, 35);
    this.chair.add(part1, part2, part3, part4, part5, part6);
    this.chair.position.set(this.x, 22.5 ,this.z);
    this.chair.rotation.y = Math.PI * this.r;
  }
}


  // class Chair{
  //   constructor(){
  //     this.chair = new THREE.Group();
  //     GLTFloader.setDRACOLoader(new THREE.DRACOLoader())
  //     GLTFloader.load('./model/chair2.glb', (gltf) => {
  //       gltf.scene.position.set(1.9, 0, -3);
  //       this.chair.add(gltf.scene);
  //     })
  //   }
  // }


class Plant {
  constructor(x, z){
    this.x = x;
    this.z = z;
    this.plant = new THREE.Group();
    let part1Geo = new THREE.SphereGeometry(20, 8, 6, 0);
    let part1 = new THREE.Mesh(part1Geo, greenMat);
    part1.position.set(-10, 0, -10);
    let part2 = part1.clone();
    let part3 = part1.clone();
    let part4 = part1.clone();
    part2.position.set(15, 0, 0);
    part3.position.set(0, 0, 15);
    part4.position.set(0, 20, 0);
    let part5Geo = new THREE.CylinderGeometry(8, 10, 30, 10, 1);
    let part5 = new THREE.Mesh(part5Geo, deepBrownMat);
    part5.position.set(0, -30, 0);
    let points = [];
    for ( let i = 0; i < 10; i ++ ) {
      points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 15, ( i - 5 ) * 3 ) );
    }
    let part6Geo = new THREE.LatheGeometry( points );
    let part6 = new THREE.Mesh(part6Geo, whiteMat);
    part6.position.set(0, -40, 0);
    this.plant.add(part1, part2, part3, part4, part5, part6);
    this.plant.position.set(this.x, 55, this.z);

  }
}

function leftWall(){
  let leftWall = new THREE.Group();
  let part1 = new Wall(-477.5, -400, 50, .5);
  let part2 = new FloorWindow(0, -277.5, .5);
  let part3 = new Wall(-477.5, -250, 50, .5);
  let part4 = new FloorWindow(0, -127.5, 0).floorWindow;
  let part5 = new Wall(-477.5, -100, 50, .5);
  let part6 = new FloorWindow(0, 22.5, 0).floorWindow;
  let part7 = new Wall(-477.5, 225, 400, .5);
  leftWall.add(part1.wall, part2.floorWindow, part3.wall, part4, part5.wall, part6, part7.wall);
  scene.add(leftWall);
  world.add(part1.wallBody);
  world.add(part2.windowBody);
  world.add(part3.wallBody);
  world.add(part5.wallBody);
  world.add(part7.wallBody);
}