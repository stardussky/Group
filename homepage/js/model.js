function addShadow(obj) {
  obj.traverse(object => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
}

class Floor {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    let floorGeo = new THREE.PlaneGeometry(this.w, this.h);
    let floorTexture = new THREE.TextureLoader().load("./floorMat2.jpg");
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 1);
    let floorMat = new THREE.MeshLambertMaterial({
      map: floorTexture
    });
    this.floor = new THREE.Mesh(floorGeo, floorMat);
    this.floor.receiveShadow = true;
    this.floor.rotation.x = Math.PI * -0.5;
    this.floor.position.set(0, 0, 0);

    let floorShape = new CANNON.Plane();
    this.floorBody = new CANNON.Body({
      mass: 0,
      shape: floorShape,
      material: floorCM
    });
    this.floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      Math.PI * -0.5
    );
  }
}

class WallWindow {
  constructor(w, h, r, x, z) {
    this.w = w;
    this.h = h;
    this.r = r;
    this.x = x;
    this.z = z;
    this.wallWindow = new THREE.Group();
    let part1Geo = new THREE.BoxGeometry(this.w, 0.5, 0.5);
    let part1 = new THREE.Mesh(part1Geo, silverMat);
    let part2Geo = new THREE.BoxGeometry(this.h, 0.5, 0.5);
    let part2 = new THREE.Mesh(part2Geo, silverMat);
    part2.rotation.z = Math.PI * 0.5;
    part2.position.y = -this.h / 2;
    let part3 = part2.clone();
    part2.position.x = -this.w / 2 + 0.25;
    part3.position.x = this.w / 2 - 0.25;
    let part4Geo = new THREE.BoxGeometry(this.w, 2, 2);
    let part4 = new THREE.Mesh(part4Geo, whiteSilverMat);
    part4.position.y = -this.h;
    let part5Geo = new THREE.BoxGeometry(this.w, this.h, 0.25);
    let part5 = new THREE.Mesh(part5Geo, glassMat);
    part5.position.y = -this.h / 2;
    this.wallWindow.add(part1, part2, part3, part4, part5);
    this.wallWindow.position.set(this.x, this.h + 1, this.z);

    let windowSharp = new CANNON.Box(
      new CANNON.Vec3(this.w / 2, (this.h + 2) / 2, 0.25)
    );
    this.windowBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(this.x, (this.h + 1) / 2, this.z),
      material: objCM
    });
    this.windowBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      Math.PI * this.r
    );
    this.windowBody.addShape(windowSharp);
    this.wallWindow.quaternion.copy(this.windowBody.quaternion);
    addShadow(this.wallWindow);
  }
}

class FloorWindow {
  constructor(w, h, r, x, z) {
    this.w = w;
    this.h = h;
    this.r = r;
    this.x = x;
    this.z = z;
    this.floorWindow = new THREE.Group();
    let part1Geo = new THREE.BoxGeometry(this.w, .5, .5);
    let part1 = new THREE.Mesh(part1Geo, silverMat);
    let part2Geo = new THREE.BoxGeometry(.5, this.h, .5);
    let part2 = new THREE.Mesh(part2Geo, silverMat);
    let part3 = part1.clone();
    let part4 = part2.clone();
    let part5Geo = new THREE.BoxGeometry(this.w, this.h, .25);
    let part5 = new THREE.Mesh(part5Geo, glassMat);
    part1.position.y = this.h / 2;
    part2.position.x = this.w / 2;
    part3.position.y = this.h / 3;
    part4.position.x = -this.w / 2;
    this.floorWindow.add(part1, part2, part3, part4, part5);

    let windowSharp = new CANNON.Box(
      new CANNON.Vec3(this.w / 2, this.h / 2, .5)
    )
    this.windowBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(this.x, this.h / 2, this.z),
      material: objCM
    })
    this.windowBody.addShape(windowSharp);
    this.windowBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      Math.PI * this.r
    );
    this.floorWindow.quaternion.copy(this.windowBody.quaternion);
    this.floorWindow.position.copy(this.windowBody.position);


    addShadow(this.floorWindow);
  }
}

class OfficeDesk {
  constructor(l, w, h, r, x, z) {
    this.l = l;
    this.w = w;
    this.h = h;
    this.r = r;
    this.x = x;
    this.z = z;
    this.desk = new THREE.Group();
    let part1Geo = new THREE.BoxGeometry(this.l, this.w, 0.5);
    let part1 = new THREE.Mesh(part1Geo, woodMat1);
    part1.rotation.x = Math.PI * 0.5;
    let part2Geo = new THREE.BoxGeometry(this.l, this.h, 0.5);
    let part2 = new THREE.Mesh(part2Geo, woodMat1);
    part2.position.set(0, -this.h / 2, -this.w / 2 + 0.25);

    let part3Geo = new THREE.BoxGeometry(this.w - 1, this.h, 0.5);
    let part3 = new THREE.Mesh(part3Geo, woodMat3);
    part3.rotation.y = Math.PI * 0.5;
    part3.position.set(-this.l / 2 + 0.5, -this.h / 2, 0);

    let part4Geo = new THREE.BoxGeometry(this.l / 3, this.h - 1, this.w - 1);
    let part4 = new THREE.Mesh(part4Geo, woodMat3);
    part4.position.set(this.l / 2 - this.l / 6, -(this.h + 1) / 2, 0);

    let part5Geo = new THREE.BoxGeometry(1, 0.25, 0.25);
    let part5 = new THREE.Mesh(part5Geo, whiteMat);
    let part6 = part5.clone();
    part5.position.set(this.l / 3, -(this.h + 1) / 4, (this.w - 1) / 2);
    part6.position.set(this.l / 3, -(this.h + 1) / 2, (this.w - 1) / 2);
    this.desk.add(part1, part2, part3, part4, part5, part6);
    this.desk.position.set(this.x, this.h, this.z);

    let deskShape = new CANNON.Box(
      new CANNON.Vec3(this.l / 2, this.h / 2, this.w / 2)
    );
    this.deskBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(this.x, this.h / 2, this.z),
      material: objCM
    });
    this.deskBody.addShape(deskShape);
    this.deskBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      Math.PI * this.r
    );
    this.desk.quaternion.copy(this.deskBody.quaternion);

    addShadow(this.desk);
  }
}

class TeaDesk {
  constructor(radius, h, x, z) {
    this.radius = radius;
    this.h = h;
    this.x = x;
    this.z = z;
    this.desk = new THREE.Group();
    let part1Geo = new THREE.CylinderGeometry(
      this.radius,
      this.radius,
      0.25,
      30
    );
    let part1 = new THREE.Mesh(part1Geo, glassMat);
    let part2Geo = new THREE.CylinderGeometry(0.3, 0.3, this.h, 30);
    let part2 = new THREE.Mesh(part2Geo, silverMat);
    part2.position.y = -this.h / 2;
    let part3Geo = new THREE.CylinderGeometry(1, 1, 0.25, 30);
    let part3 = new THREE.Mesh(part3Geo, silverMat);
    let part4Geo = new THREE.CylinderGeometry(
      this.radius / 2,
      this.radius / 2,
      0.25,
      30
    );
    let part4 = new THREE.Mesh(part4Geo, whiteSilverMat);
    part4.position.y = -this.h;
    this.desk.add(part1, part2, part3, part4);
    this.desk.position.set(this.x, this.h, this.z);

    let deskShape = new CANNON.Box(
      new CANNON.Vec3(this.radius, this.h / 2, this.radius)
    );
    this.deskBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(this.x, this.h / 2, this.z),
      material: objCM
    });
    this.deskBody.addShape(deskShape);
    addShadow(this.desk);
  }
}

class MeetingDesk {
  constructor(w, h, l, r, x, z, mat){
    this.w = w;
    this.h = h;
    this.l = l;
    this.r = r;
    this.x = x;
    this.z = z;
    this.mat = mat;
    this.desk = new THREE.Group();
    let part1Geo = new THREE.BoxGeometry(this.w, 1, this.l);
    let part1 = new THREE.Mesh(part1Geo, this.mat);
    let part2Geo = new THREE.CylinderGeometry(.5, .5, this.h, 30);
    let part2 = new THREE.Mesh(part2Geo, silverMat);
    let part3Geo = new THREE.BoxGeometry(this.l/1.5, .5, 1);
    let part3 = new THREE.Mesh(part3Geo, whiteSilverMat);
    part3.rotation.y = Math.PI * .5;
    let part4 = part2.clone();
    let part5 = part3.clone();
    part1.position.y = this.h/2;
    part2.position.x = this.w/2.5;
    part4.position.x = -this.w/2.5;
    part3.position.set(this.w/2.5, -this.h/2, 0);
    part5.position.set(-this.w/2.5, -this.h/2, 0);
    this.desk.add(part1, part2, part3, part4, part5);

    let deskShape = new CANNON.Box(
      new CANNON.Vec3(this.w/2, this.h/2, this.l/2)
    )
    this.deskBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(this.x, this.h/2, this.z),
      material: objCM
    })
    this.deskBody.addShape(deskShape);
    this.deskBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      Math.PI * this.r
    );
    this.desk.position.copy(this.deskBody.position);
    this.desk.quaternion.copy(this.deskBody.quaternion);
    addShadow(this.desk);
  }
}
class Wall {
  constructor(w, r, x, z, textureX = 1, textureY = 1, l = 2) {
    this.w = w;
    this.r = r;
    this.x = x;
    this.z = z;
    this.l = l;
    this.textureX = textureX;
    this.textureY = textureY;
    this.wall = new THREE.Group();
    let wallTexture = new THREE.TextureLoader().load("./wallMat1.jpg");
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(this.textureX, this.textureY);
    let wallMat = new THREE.MeshLambertMaterial({ map: wallTexture });
    let part1Geo = new THREE.BoxGeometry(this.w, 22, this.l);
    let part1 = new THREE.Mesh(part1Geo, wallMat);
    this.wall.add(part1);

    let wallSharp = new CANNON.Box(new CANNON.Vec3(this.w / 2, 11, this.l / 2));
    this.wallBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(this.x, 11, this.z),
      material: objCM
    });
    this.wallBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      Math.PI * this.r
    );
    this.wallBody.addShape(wallSharp);
    this.wall.position.copy(this.wallBody.position);
    this.wall.quaternion.copy(this.wallBody.quaternion);
    addShadow(this.wall);
  }
}

class Plant {
  constructor(h, x, z, colorMat, leaf = 2) {
    this.h = h;
    this.x = x;
    this.z = z;
    this.leaf = leaf;
    this.colorMat = colorMat;
    this.plant = new THREE.Group();
    let part1Geo = new THREE.SphereGeometry(this.leaf, 8, 6, 0);
    let part1 = new THREE.Mesh(part1Geo, this.colorMat);
    let part2 = part1.clone();
    let part3 = part1.clone();
    let part4 = part1.clone();
    let part5 = part1.clone();
    part2.position.set(1, 0, 1);
    part3.position.set(1, 0, -1);
    part4.position.set(2, 0, 0);
    part5.position.set(1, 1, 0);
    let part6Geo = new THREE.CylinderGeometry(this.leaf*.3, this.leaf*.3, this.h, 30);
    let part6 = new THREE.Mesh(part6Geo, brownMat);
    part6.position.set(1, -this.h / 2, 0);
    let part7Geo = new THREE.CylinderGeometry(this.leaf, this.leaf/1.5, this.leaf, 30);
    let part7 = new THREE.Mesh(part7Geo, deepBrownMat);
    part7.position.set(1, -this.h + 0.5, 0);
    this.plant.add(part1, part2, part3, part4, part5, part6, part7);
    this.plant.position.set(this.x, this.h+this.leaf/3, this.z);

    let plantShape = new CANNON.Box(
      new CANNON.Vec3(this.leaf, this.h / 2 + 1.25, this.leaf)
    );
    this.plantBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(this.x + 1, this.h / 2 + 1.25, this.z),
      material: objCM
    });
    this.plantBody.addShape(plantShape);
    addShadow(this.plant);
  }
}
class Bookcase {
  constructor(w, h, r, x, z) {
    this.w = w;
    this.h = h;
    this.r = r;
    this.x = x;
    this.z = z;
    this.bookcase = new THREE.Group();
    let part1Geo = new THREE.BoxGeometry(this.w, this.h, 0.25);
    let part1 = new THREE.Mesh(part1Geo, woodMat2);
    let part2Geo = new THREE.BoxGeometry(this.w, 5, 0.25);
    let part2 = new THREE.Mesh(part2Geo, woodMat2);
    part2.rotation.x = Math.PI * 0.5;
    let part3Geo = new THREE.BoxGeometry(0.25, 5, this.h);
    let part3 = new THREE.Mesh(part3Geo, woodMat2);
    part3.rotation.x = Math.PI * 0.5;
    let part4 = part2.clone();
    let part5 = part3.clone();
    part1.position.set(0, 0, -2.25);
    part2.position.set(0, this.h / 2, 0);
    part3.position.set(-this.w / 2 + 0.125, 0, 0);
    part4.position.set(0, -this.h / 2, 0);
    part5.position.set(this.w / 2 - 0.125, 0, 0);

    let parts = [];
    for (let i = 1; i < (this.h / 5).toFixed(0); i++) {
      let part = part2.clone();
      part.position.set(0, -this.h / 2 + i * 5, 0)
      parts.push(part);
    }
    this.bookcase.add(part1, part2, part3, part4, part5, ...parts);

    let bookcaseShape = new CANNON.Box(
      new CANNON.Vec3(this.w / 2, this.h / 2, 2.5)
    )
    this.bookcaseBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(this.x, this.h / 2, this.z + 2.5 - 0.125),
      material: objCM
    })
    this.bookcaseBody.addShape(bookcaseShape);
    this.bookcaseBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      Math.PI * this.r
    );
    this.bookcase.position.copy(this.bookcaseBody.position);
    this.bookcase.quaternion.copy(this.bookcaseBody.quaternion);
    addShadow(this.bookcase);
  }
}

class Forcer {
  constructor(w, h, r, x, z) {
    this.w = w;
    this.h = h;
    this.r = r;
    this.x = x;
    this.z = z;
    this.forcer = new THREE.Group();

    let part1Geo = new THREE.BoxGeometry(this.w, this.h, 5);
    let part1 = new THREE.Mesh(part1Geo, woodMat3);
    let part2Geo = new THREE.BoxGeometry(this.w + .5, .25, 5.5);
    let part2 = new THREE.Mesh(part2Geo, silverMat);
    part2.position.y = this.h / 2;
    let part3Geo = new THREE.BoxGeometry(1, .125, .25);
    let part3 = new THREE.Mesh(part3Geo, whiteSilverMat);
    let part4 = part3.clone();
    let part5 = part3.clone();
    let part6 = part3.clone();
    part3.position.set(-this.w / 3.5, this.h / 2 - 1.5, 2.5);
    part4.position.set(this.w / 3.5, this.h / 2 - 1.5, 2.5);
    part5.position.set(-this.w / 3.5, this.h / 2 - 2.5, 2.5);
    part6.position.set(this.w / 3.5, this.h / 2 - 2.5, 2.5);
    this.forcer.add(part1, part2, part3, part4, part5, part6);

    let forcerShape = new CANNON.Box(
      new CANNON.Vec3(this.w / 2, this.h / 2, 2.5)
    )
    this.forcerBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(this.x, this.h / 2, this.z),
      material: objCM
    })
    this.forcerBody.addShape(forcerShape);
    this.forcerBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      Math.PI * this.r
    );
    this.forcer.position.copy(this.forcerBody.position);
    this.forcer.quaternion.copy(this.forcerBody.quaternion);
    addShadow(this.forcer);
  }
}

class Door {
  constructor(w, h, r, x, z) {
    this.w = w;
    this.h = h;
    this.r = r;
    this.x = x;
    this.z = z;
    this.door = new THREE.Group();
    let part1Geo = new THREE.BoxGeometry(this.w, this.h, .25);
    let part1 = new THREE.Mesh(part1Geo, whiteSilverMat);
    let part2Geo = new THREE.CylinderGeometry(.5, .5, 0.125, 30);
    let part2 = new THREE.Mesh(part2Geo, silverMat);
    let part3Geo = new THREE.BoxGeometry(1.5, .25, 0.25);
    let part3 = new THREE.Mesh(part3Geo, silverMat);
    let part4Geo = new THREE.CylinderGeometry(.25, .25, 0.125, 30);
    let part4 = new THREE.Mesh(part4Geo, silverMat);
    part2.rotation.x = Math.PI * .5;
    part4.rotation.x = Math.PI * .5;
    part2.position.set(this.w / 2.5, 0, .125);
    part3.position.set(this.w / 2.5 - .5, 0, .25);
    part4.position.set(this.w / 2.5, -.75, .25);
    this.door.add(part1, part2, part3, part4);

    let doorShape = new CANNON.Box(
      new CANNON.Vec3(this.w / 2, this.h / 2, .125)
    )
    this.doorBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(this.x, this.h / 2, this.z),
      material: objCM
    });
    this.doorBody.addShape(doorShape);
    this.doorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      Math.PI * this.r
    );
    this.door.position.copy(this.doorBody.position);
    this.door.quaternion.copy(this.doorBody.quaternion);
    addShadow(this.door);
  }
}

class Photo {
  constructor(w, h, r, x, y, z, picture) {
    this.w = w;
    this.h = h;
    this.r = r;
    this.x = x;
    this.y = y;
    this.z = z;
    this.picture = picture;
    this.photo = new THREE.Group();
    let texture = new THREE.TextureLoader().load(this.picture);
    let pictureMat = new THREE.MeshLambertMaterial({map: texture});
    let part1Geo = new THREE.BoxGeometry(this.w, this.h, .25);
    let part1 = new THREE.Mesh(part1Geo, blackMat);
    let part2Geo = new THREE.BoxGeometry(this.w-.5, this.h-.5, .25);
    let part2 = new THREE.Mesh(part2Geo, whiteMat);
    let part3Geo = new THREE.BoxGeometry(this.w-1, this.h-1, .25);
    let part3 = new THREE.Mesh(part3Geo, pictureMat);
    part2.position.z = .01;
    part3.position.z = .02;
    this.photo.add(part1, part2, part3);

    let photoSharp = new CANNON.Box(
      new CANNON.Vec3(this.w/2, this.h/2, .125)
    )
    this.photoBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(this.x, this.y, this.z),
      material: objCM
    })
    this.photoBody.addShape(photoSharp);
    this.photoBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      Math.PI * this.r
    );
    this.photo.position.copy(this.photoBody.position);
    this.photo.quaternion.copy(this.photoBody.quaternion);
    addShadow(this.photo);
  }
}

class Computer{
  constructor(r, x, y, z){
    this.r = r;
    this.x = x;
    this.y = y;
    this.z = z;
    this.computer = new THREE.Group();
    let part1Geo = new THREE.BoxGeometry(5, 4, .25);
    let part1 = new THREE.Mesh(part1Geo, blackMat);
    let part2Geo = new THREE.BoxGeometry(1, 2.5, .25);
    let part2 = new THREE.Mesh(part2Geo, blackMat);
    let part3Geo = new THREE.CylinderGeometry(1, 1, .125, 30);
    let part3 = new THREE.Mesh(part3Geo, blackMat);
    let part4Geo = new THREE.BoxGeometry(4, 2, .125);
    let part4 = new THREE.Mesh(part4Geo, blackMat);
    let part5Geo = new THREE.BoxGeometry(1.5, 1.5, .01);
    let part5 = new THREE.Mesh(part5Geo, whiteMat);
    let part6Geo = new THREE.BoxGeometry(.35, .125, .5);
    let part6 = new THREE.Mesh(part6Geo, blackMat);
    part1.rotation.x = Math.PI * -.1;
    part2.position.y = -1.75;
    part2.rotation.x = Math.PI * .05;
    part3.position.y = -3;
    part4.rotation.x = Math.PI * .5;
    part4.position.set(0, -3, 2.5);
    part5.rotation.x = Math.PI * .5;
    part5.position.set(3.5, -3, 3);
    part6.position.set(3.25, -2.925, 3);
    this.computer.add(part1, part2, part3, part4, part5, part6);
    this.computer.position.set(this.x, this.y, this.z);
    this.computer.rotation.y = Math.PI * this.r;
  }
}