import '../css/style.scss'
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import vertexSource from "./shader/vertexShader.glsl";
import fragmentSource from "./shader/fragmentShader.glsl";

import palettes from 'nice-color-palettes';



class Main {
  constructor() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.canvas = document.querySelector("#canvas");
    this.renderer = null;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.cameraFov = 45;
    this.cameraFovRadian = (this.cameraFov / 2) * (Math.PI / 180);
    this.cameraDistance = (this.viewport.height / 2) / Math.tan(this.cameraFovRadian);
    // this.controls = null;
    this.gui = new GUI();
    this.geometry = null;
    this.material = null;
    this.mesh = null;

    // this.pallets = palettes[2].map((color) => new THREE.Color(color));

    // console.log(this.pallets);

    this.indexPallets = 96;
    this.pallets = null;
    this._setPallets(this.indexPallets);


    this.uniforms = {
      uTime: {
        value: 0.0
      },
      uResolution: {
        value: new THREE.Vector2(this.viewport.width, this.viewport.height)
      },
      uTexResolution: {
        value: new THREE.Vector2(2048, 1024)
      },
      uColors: {
        value: this.pallets
      },
      uNoiseLoudness: {
        value: new THREE.Vector2(4.0, 7.0)
      },
    };

    this.clock = new THREE.Clock();

    this.init();
    // this._init();
    // this._update();
    // this._addEvent();
  }

  _setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }

  _setCamera() {
    this.camera = new THREE.PerspectiveCamera(this.cameraFov, this.viewport.width / this.viewport.height, 1, this.cameraDistance * 2);
    this.camera.position.z = this.cameraDistance;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);
  }

  _setPallets(index) {
    this.pallets = palettes[index].map((color) => new THREE.Color(color));
  }

  // _setControlls() {
  //   this.controls = new OrbitControls(this.camera, this.canvas);
  //   this.controls.enableDamping = true;
  // }

  _setGui() {
    const colorGuiObj = {
      changeColor: ()=> {
        this.indexPallets = Math.floor(Math.random() * 100);
        console.log(this.indexPallets);
        this._setPallets(this.indexPallets);
        // console.log(this.pallets);

        this.uniforms.uColors.value = this.pallets;
      }
    }

    this.gui.add(this.uniforms.uNoiseLoudness.value, 'x').min(0.0).max(25.0).step(0.2).name('ノイズ X軸')
    this.gui.add(this.uniforms.uNoiseLoudness.value, 'y').min(0.0).max(25.0).step(0.2).name('ノイズ Y軸')
    // this.gui.add(this.uniforms.uTimeSpeed, 'value').min(0.001).max(5.0).step(0.001).name('スピード')
    this.gui.add(colorGuiObj, 'changeColor').name('配色を変更').listen()

    
  }

  _setLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(1, 1, 1);
    this.scene.add(light);
  }

  _addMesh() {
    //ジオメトリ
    this.geometry = new THREE.PlaneGeometry(this.viewport.width * 2.0, this.viewport.height * 2.0, 200, 200);

    //マテリアル
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexSource,
      fragmentShader: fragmentSource,
      side: THREE.DoubleSide,
      // wireframe: true,
    });

    //メッシュ
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    
    this.mesh.rotation.x -= 0.5;

    this.scene.add(this.mesh);
  }

  init() {
    this._setRenderer();
    this._setCamera();
    this._setGui();
    // this._setControlls();
    this._setLight();
    this._addMesh();

    this._update();
    this._addEvent();
  }

  _update() {
    const elapsedTime = this.clock.getElapsedTime();
    this.uniforms.uTime.value = elapsedTime * 0.05;

    //レンダリング
    this.renderer.render(this.scene, this.camera);
    // this.controls.update();
    requestAnimationFrame(this._update.bind(this));
  }

  _onResize() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    // レンダラーのサイズを修正
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    // カメラのアスペクト比を修正
    this.camera.aspect = this.viewport.width / this.viewport.height;
    this.camera.updateProjectionMatrix();
    // カメラの位置を調整
    this.cameraDistance = (this.viewport.height / 2) / Math.tan(this.cameraFovRadian); //ウインドウぴったりのカメラ距離
    this.camera.position.z = this.cameraDistance;
    // uniforms変数に反映
    this.mesh.material.uniforms.uResolution.value.set(this.viewport.width, this.viewport.height);
    // meshのscale設定
    const scaleX = Math.round(this.viewport.width * 2.0 / this.mesh.geometry.parameters.width * 100) / 100 + 0.01;
    const scaleY = Math.round(this.viewport.height * 2.0 / this.mesh.geometry.parameters.height * 100) / 100 + 0.01;
    this.mesh.scale.set(scaleX, scaleY, 1);
  }

  _addEvent() {
    window.addEventListener("resize", this._onResize.bind(this));
  }
}

const main = new Main();
