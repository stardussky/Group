const textureLoader = new THREE.TextureLoader();
const fluffy = textureLoader.load("./fluffy.png");
const rain = textureLoader.load("./rain.png");

class Particle {
  constructor(size = 1, colorX, colorY, colorZ, range = 500, density = 300) {
    this.size = size;
    this.colorX = colorX;
    this.colorY = colorY;
    this.colorZ = colorZ;
    this.range = range;
    this.density = density;
    const pointGeo = new THREE.BufferGeometry();
    const vertices = [];
    const uniforms = {
      color: {
        type: "v3",
        value: new THREE.Color(0xffffff)
      },
      texture: {
        value: fluffy
      },
      val: {
        value: 1.0
      }
    };
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `attribute float size;
      uniform float val;
      varying float opacity;
      varying vec3 vColor;
      void main() {
        float border = -150.0;
        float min_border = -160.0;
        float max_opacity = 1.0;
        float min_opacity = 0.01;
        float sizeAdd = 1.0;
  
        vec3 vPos;
        vPos.x = position.x * val;
        vPos.y = position.y * val;
        vPos.z = position.z * val;
        vec4 mvPosition = modelViewMatrix * vec4( vPos, 1.0 );
  
        if(mvPosition.z > border){
          opacity = max_opacity;
          gl_PointSize = size;
        }else if(mvPosition.z < min_border){
          opacity = min_opacity;
          gl_PointSize = size + sizeAdd;
        }else{
          float percent = (border - mvPosition.z)/(border - min_border);
          opacity = (1.0-percent) * (max_opacity - min_opacity) + min_opacity;
          gl_PointSize = percent * (sizeAdd) + size;  
        }
  
        vColor.x = ${this.colorX};
        vColor.y = ${this.colorY};
        vColor.z = ${this.colorZ};
        gl_Position = projectionMatrix * mvPosition;
      }`,
      fragmentShader: document.getElementById("fragmentshader").textContent,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });
    for (let i = 0; i < this.density; i++) {
      let x = THREE.Math.randInt(-this.range, this.range);
      let y = THREE.Math.randInt(-this.range, this.range);
      let z = THREE.Math.randInt(-this.range, this.range);

      vertices.push(x, y, z);
    }
    pointGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    const pointLen = pointGeo.attributes.position.array.length;
    const sizes = new Float32Array(pointLen);
    const velocitys = new Float32Array(pointLen);
    for (let i = 0; i < pointLen; i++) {
      let velocity = THREE.Math.randFloat(-0.25, 0.25);
      velocitys[i] = velocity;
    }
    pointGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    pointGeo.setAttribute("velocity", new THREE.BufferAttribute(velocitys, 1));
    this.particleSystem = new THREE.Points(pointGeo, shaderMaterial);
  }
  update() {
    const time = Date.now() * 0.0025;
    const bufferObj = this.particleSystem.geometry;
    const sizes = bufferObj.attributes.size.array;
    const positions = bufferObj.attributes.position.array;
    const velocitys = bufferObj.attributes.velocity.array;

    const len = sizes.length;
    for (let i = 0; i < len; i++) {
      sizes[i] = this.size * (1 + Math.sin(0.02 * i + time));
      positions[i] += Math.PI * velocitys[i];
      if (positions[i] <= -this.range || positions[i] >= this.range)
        velocitys[i] *= -1;
    }
    bufferObj.attributes.position.needsUpdate = true;
    bufferObj.attributes.size.needsUpdate = true;
  }
}

class RainDrop {
  constructor(size = 3, ranges = 500) {
    this.size = size;
    this.ranges = ranges;
    this.rainGeo = new THREE.Geometry();
    const rainMaterial = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: this.size,
      map: rain,
      transparent: true
    });
    let rainDrop;
    for (let i = 0; i < 1500; i++) {
      rainDrop = new THREE.Vector3(
        THREE.Math.randInt(-this.ranges, this.ranges),
        THREE.Math.randInt(-this.ranges, this.ranges),
        THREE.Math.randInt(-this.ranges, this.ranges)
      );
      rainDrop.velocity = 0;
      this.rainGeo.vertices.push(rainDrop);
    }
    this.rain = new THREE.Points(this.rainGeo, rainMaterial);
    this.flashLight = new THREE.PointLight(0x062d89, 30, 500, 1.7);
    this.flashLight.position.set(200, 100, 100);
    // console.log(rainMaterial);
  }
  update() {
    this.rainGeo.vertices.forEach(p => {
      p.velocity -= 0.1 + Math.random() * 0.1;
      p.y += p.velocity;
      if (p.y < -this.ranges) {
        p.y = this.ranges;
        p.velocity = 0;
      }
    });
    this.rainGeo.verticesNeedUpdate = true;
    this.rain.rotation.y += 0.002;

    if (Math.random() > 0.93 || this.flashLight.power > 100) {
      if (this.flashLight.power < 100)
        this.flashLight.position.set(
          Math.random() * 400,
          150 + Math.random() * 200,
          100
        );
      this.flashLight.power = 50 + Math.random() * 500;
    }
  }
}
export { Particle, RainDrop };
