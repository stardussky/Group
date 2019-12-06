const textureLoader = new THREE.TextureLoader();
const fluffy = textureLoader.load("./fluffy.png");

class Particle {
  constructor(size = 1, range = 500, density = 300) {
    this.size = size;
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
      vertexShader: document.getElementById("vertexshader").textContent,
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
    const colors = {
      r: 1,
      g: 1,
      b: Math.random()
    };
    this.particleSystem.material.uniforms.color.value = colors;
  }
}
export { Particle };
