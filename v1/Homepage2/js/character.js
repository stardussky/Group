class Ear{
  constructor(x, z, y, rx = -.5, ry = 0, rz){
    this.x = x;
    this.y = y;
    this.z = z;
    this.rx = rx;
    this.ry = ry;
    this.rz = rz
    this.ear = new THREE.Group();
    let outEarGeo = new THREE.CylinderGeometry(0, 8, 8, 3, 1);
    let insideEarGo = new THREE.CylinderGeometry(0, 5, 1, 3, 1);
    let outEar = new THREE.Mesh(outEarGeo, whiteMat);
    let insideEar = new THREE.Mesh(insideEarGo, pinkMat);
    insideEar.position.y = -3.6;
    this.ear.add(outEar, insideEar);
    this.ear.position.set(this.x, this.y, this.z);
    this.ear.rotation.x = Math.PI * this.rx;
    this.ear.rotation.z = Math.PI * this.rz;
  }
}

class Face{
  constructor(l, w, h, x=0, y=0, z=0, r=-.75){
    this.l = l;
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = r;
    let faceGeo = new THREE.BoxGeometry(this.l, this.w, this.h);
    this.face = new THREE.Mesh(faceGeo, whiteMat);
    this.face.position.set(this.x, this.y, this.z);
    this.face.rotation.y = Math.PI * this.r;
  }
}

class Eye{
  constructor(x, y, z, ry, isx){
    this.x = x;
    this.y = y;
    this.z = z;
    this.ry = ry;
    this.isx = isx;
    this.eye = new THREE.Group();
    let outEyeGeo = new THREE.CircleGeometry(5, 32, 0, 6.3);
    let insideEyeGeo = new THREE.CircleGeometry(2, 32, 0, 6.3);
    let outEye = new THREE.Mesh(outEyeGeo, blackMat);
    let insideEye = new THREE.Mesh(insideEyeGeo, whiteMat);
    insideEye.position.z = .1;
    insideEye.position.x = this.isx;
    this.eye.add(outEye, insideEye);
    this.eye.position.set(this.x, this.y, this.z);
    this.eye.rotation.y = Math.PI * this.ry;
  }
}

class Nose {
  constructor(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
    let noseGeo = new THREE.SphereGeometry(2, 20, 20);
    this.nose = new THREE.Mesh(noseGeo, pinkMat);
    this.nose.position.set(this.x, this.y, this.z);
  }
}

class Character{
  constructor(x, y, z, dx = 1, dz = 1){
    this.x = x;
    this.y = y;
    this.z = z;
    this.dx = dx;
    this.dz = dz;
    let nose = new Nose(0, -2, 20);
    let rightEye = new Eye(10.5, 8, 12, .3, -1);
    let leftEye = new Eye(-10.5, 8, 12, -.3, 1);
    this.face = new Face(30, 25, 30, 0, 2.3); 
    let leftEar = new Ear(12, 1.5, 15, -.5, 0, .3);
    let rightEar = new Ear(-12, 1.5, 15, -.5, 0, -.3);
    this.character = new THREE.Group();
    this.character.add(nose.nose, rightEye.eye, leftEye.eye, this.face.face, leftEar.ear, rightEar.ear);
    // this.character.position.set(this.x, this.y, this.z);

    this.characterShape = new CANNON.Box(
      new CANNON.Vec3(this.face.l-5, this.face.w/2, this.face.h-5)
    );
    this.characterBody = new CANNON.Body({
      mass: 5,
      position: new CANNON.Vec3(this.x, this.y*2, this.z)
    })
    this.characterBody.addShape(this.characterShape);
  }
  updateMesh(){
    this.character.position.copy(this.characterBody.position);
    this.character.quaternion.copy(this.characterBody.quaternion);
  }
  moveLeft(){
    this.characterBody.position.x -= this.dx;
  }
  moveRight(){
    this.characterBody.position.x += this.dx;
  }
  moveTop(){
    this.characterBody.position.z -= this.dz;
  }
  moveDown(){
    this.characterBody.position.z += +this.dz;
  }
}