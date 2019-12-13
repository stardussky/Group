class CircleButton {
  constructor(x, y, z, id, color = 0xf6ca83, fontColor = "#fff") {
    this.x = x;
    this.y = y;
    this.z = z;
    this.id = id;
    this.color = color;
    this.fontColor = fontColor;
    this.opacity = [];
    this.scale = [];
    this.button = new THREE.Group();
    this.button.name = this.id;
    for (let i = 0; i < 5; i++) {
      let circleGeo = new THREE.SphereBufferGeometry(1, 15, 15);
      let circleMat = new THREE.MeshBasicMaterial({
        color: this.color,
        transparent: true,
        opacity: 0.9
      });
      let mesh = new THREE.Mesh(circleGeo, circleMat);
      this.opacity.unshift(circleMat);
      this.scale.unshift(mesh.scale);
      this.button.add(mesh);
      this.button.position.set(this.x, this.y, this.z);
    }
    let font = document.getElementById(`${this.id}`);
    font.style.color = this.fontColor;
    this.fontLabel = new THREE.CSS2DObject(font);
    this.fontLabel.position.set(this.x, this.y + 20, this.z);

    this.t1 = new TimelineMax();
    this.t2 = new TimelineMax();
    this.t1.staggerTo(this.opacity, 3, { opacity: 0 }, 1).repeat(-1);
    this.t2
      .staggerFromTo(
        this.scale,
        3,
        { x: 0.1, y: 0.1, z: 0.1 },
        { x: 15, y: 15, z: 15 },
        1
      )
      .repeat(-1);
  }
}
