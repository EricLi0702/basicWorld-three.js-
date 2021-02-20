import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {FBXLoader}  from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js'
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

class BasicWorldDemo {
    constructor(){
        console.log('main.js imported')
        this._Initialize();
    }
    _Initialize() {
        console.log('initialize')
        this._threejs = new THREE.WebGLRenderer();
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this._threejs.domElement);

        window.addEventListener('resize', ()=> {
            this._OnWindowResize();
        },false);

        const fov = 60;
        const aspect = window.innerWidth/window.innerHeight;
        const near = 1.0;
        const far = 1000.0;
        this._camera = new THREE.PerspectiveCamera(fov,aspect,near,far)
        this._camera.position.set(75,20,0);

        this._scene = new THREE.Scene();

        let light = new THREE.DirectionalLight(0xFFFFFF);
        light.position.set(100,100,100)
        light.target.position.set(0,0,0);
        light.castShadow = true;
        light.shadow.bias = -0.01;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 1.0;
        light.shadow.camera.far = 500;
        light.shadow.camera.left = 200;
        light.shadow.camera.right = -200;
        light.shadow.camera.top = 200;
        light.shadow.camera.bottom = -200;
        this._scene.add(light);

        light = new THREE.AmbientLight(0x404040);
        this._scene.add(light);

        const controls = new OrbitControls(
            this._camera, this._threejs.domElement
        );
        controls.target.set(0,0,0);
        controls.update();

        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            './resources/posx.jpg',
            './resources/negx.jpg',
            './resources/posy.jpg',
            './resources/negy.jpg',
            './resources/posz.jpg',
            './resources/negz.jpg',
        ]);
        this._scene.background = texture;

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100,100,1,1),
            new THREE.MeshStandardMaterial({
                color:0xFFFFFF
            })
        );
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this._scene.add(plane);

        //box view
        // const box = new THREE.Mesh(
        //     new THREE.BoxGeometry(2,2,2),
        //     new THREE.MeshStandardMaterial({
        //         color: 0x808080
        //     })
        // );
        // box.position.set(3,3,3);
        // box.castShadow = true;
        // box.receiveShadow = true;
        // this._scene.add(box);
        this._mixers = [];
        this._previousRAF = null;

        // this._LoadModel();
        this._LoadAnimatedModel();

        this._RAF();
    }

    _LoadAnimatedModel(){
        const loader = new FBXLoader();
        loader.setPath('./resources/fighting/');
        loader.load('swat.fbx', (fbx) => {
            fbx.scale.setScalar(0.1);
            fbx.traverse(c => {
                c.castShadow = true
            });

            const anim = new FBXLoader();
            anim.setPath('./resources/fighting/');
            anim.load('House.fbx', (anim) => {
                const m = new THREE.AnimationMixer(fbx);
                this._mixers.push(m);
                const idle = m.clipAction(anim.animations[0]);
                idle.play();
            });
            this._scene.add(fbx);
        });
    }

    _LoadModel(){
        const loader = new GLTFLoader();
        loader.load('./resources/Rocket_ship_01.gltf', (gltf) => {
            gltf.scene.traverse(c=> {
                c.castShadow = true;
            });
            this._scene.add(gltf.scene);
        });
    }


    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    _RAF() {
        requestAnimationFrame((t) => {
        if (this._previousRAF === null) {
            this._previousRAF = t;
        }

        this._RAF();

        this._threejs.render(this._scene, this._camera);
        this._Step(t - this._previousRAF);
        this._previousRAF = t;
        });
    }

    _Step(timeElapsed) {
        console.log(timeElapsed)
        const timeElapsedS = timeElapsed * 0.001;
        if (this._mixers) {
            this._mixers.map(m => m.update(timeElapsedS));
        }

        // if (this._controls) {
        // this._controls.Update(timeElapsedS);
        // }
    }
}

class Website3dDemo {
    constructor() {
        this._Initialize();
    }
    _Initialize(){
        this._threejs = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.physicallyCorrectLights = true;
        this._threejs.toneMapping = THREE.ACESFilmicToneMapping;
        this._threejs.outputEncoding = THREE.sRGBEncoding;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this._threejs.domElement);

        window.addEventListener('resize', () => {
            this._OnWindowResize();
        },false);

        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 1000.0;
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        this._scene = new THREE.Scene();

        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(20, 100, 10);
        light.target.position.set(0,0,0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 100;
        light.shadow.camera.right = -100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        this._scene.add(light);

        light = new THREE.AmbientLight(0xFFFFFF);
        this._scene.add(light);

        const controls = new OrbitControls(this._camera, this._threejs.domElement);
        controls.target.set(0, 20, 0);
        controls.update();

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100,100,10,10),
            new THREE.MeshStandardMaterial({
                color:0xFFFFFF
            })
        );
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this._scene.add(plane);
    }

    OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }
}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new Website3dDemo();
});
