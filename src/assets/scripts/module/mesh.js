import { PlaneBufferGeometry, RawShaderMaterial, Mesh, TextureLoader } from 'three'
import vertexShader from '../shaders/vertexshader.vert';
import fragmentShader from '../shaders/fragmentshader.frag';

export default class Plane {
  constructor(stage, option) {

    this.element = option;
    this.stage = stage;

    console.log(this.element)

    this.mesh = null;

    this.meshSize = {
      x: this.element.width,
      y: this.element.height,
    }

    this.texture = new TextureLoader().load(this.element.img)

    this.textureSize = {
      x: 760,
      y: 560,
    }

    this.windowWidth = 0;
    this.windowHeight = 0;

    this.windowWidthHalf = 0;
    this.windowHeightHalf = 0;

    this.meshWidthHalf = 0;
    this.meshHeightHalf = 0;
  }

  init() {
    this._setWindowSize();
    this._setMesh();
    this._setMeshScale();
    this._setMeshPosition();
  }

  _setWindowSize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.windowWidthHalf = this.windowWidth * 0.5;
    this.windowHeightHalf = this.windowHeight * 0.5;
  }

  _setMeshScale() {
    this.mesh.scale.x = this.element.width;
    this.mesh.scale.y = this.element.height;

    this.mesh.material.uniforms.u_meshsize.value.x = this.mesh.scale.x;
    this.mesh.material.uniforms.u_meshsize.value.y = this.mesh.scale.y;

    this.meshWidthHalf = this.mesh.scale.x * 0.5;
    this.meshHeightHalf = this.mesh.scale.y * 0.5;
  }

  _setMeshPosition() {
    this.mesh.position.y = this.windowHeightHalf - this.meshHeightHalf - this.element.top;
    this.mesh.position.x = -this.windowWidthHalf + this.meshWidthHalf + this.element.left;
  }

  _setStrength(strength) {
    this.mesh.material.uniforms.u_strength.value = strength
  }


  _setMesh() {
    const geometry = new PlaneBufferGeometry(1.0, 1.0, 32, 32);
    const material = new RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        u_texture: {
          type: "t",
          value: this.texture
        },
        u_meshsize: {
          type: "v2",
          value: this.meshSize
        },
        u_texturesize: {
          type: "v2",
          value: this.textureSize
        },
        u_strength: {
          type: "f",
          value: 0.0,
        },
      },
      transparent: true
    });
    this.mesh = new Mesh(geometry, material);
    this.stage.scene.add(this.mesh);
  }

  onResize() {
    this._setWindowSize();
  }

  _render() {
    if (this.mesh) {
      this._setMeshScale();
      this._setMeshPosition();
    }
  }

  onRaf() {
    this._render();
  }
}