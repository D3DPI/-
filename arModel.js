let camera, scene, renderer;
let model;

function initAR() {
    const video = document.getElementById('video');
    if (!video) {
        console.error("Video element not found");
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            video.srcObject = stream;
            video.play();
            setupThreeJS();
        })
        .catch(err => {
            console.error("Error accessing camera: ", err);
        });
}

function setupThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 20, 0);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 20, 10);
    scene.add(directionalLight);

    camera.position.set(0, 0, 10);

    console.log("Three.js setup complete");
    animate();
}

function loadModel(url) {
    if (!scene) {
        console.error("Scene is not initialized");
        return;
    }

    const loader = new THREE.GLTFLoader();
    loader.load(url, function (gltf) {
        model = gltf.scene;
        model.position.set(0, 0, -10);
        scene.add(model);
        console.log("Model loaded successfully");
    }, undefined, function (error) {
        console.error("Error loading model: ", error);
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (model) {
        model.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
    console.log("Rendering frame");
}

initAR();
