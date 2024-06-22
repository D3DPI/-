let camera, scene, renderer;
let model, videoTexture;
let markerRoot;

function initAR() {
    const video = document.getElementById('video');
    if (!video) {
        console.error("Video element not found");
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            video.srcObject = stream;
            video.play().then(() => {
                setupThreeJS(video);
            }).catch(err => {
                console.error("Error playing video: ", err);
            });
        })
        .catch(err => {
            console.error("Error accessing camera: ", err);
        });
}

function setupThreeJS(video) {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;

    const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
    const videoGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
    const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);

    videoMesh.position.set(0, 0, -1);
    scene.add(videoMesh);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 20, 0);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 20, 10);
    scene.add(directionalLight);

    camera.position.set(0, 0, 20);

    console.log("Three.js setup complete");

    const urlParams = new URLSearchParams(window.location.search);
    const modelNumber = urlParams.get('1');
    if (modelNumber) {
        console.log(`Loading model number: ${modelNumber}`);
        loadModel(`model${modelNumber}.gltf`);
    } else {
        console.error('Model number not found in URL');
    }
    
    markerRoot = new THREE.Group();
    scene.add(markerRoot);

    const arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam',
    });

    arToolkitSource.init(() => {
        arToolkitSource.domElement.addEventListener('canplay', () => {
            onResize();
        });
        window.addEventListener('resize', () => {
            onResize();
        });
    });

    const arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'data/camera_para.dat',
        detectionMode: 'mono'
    });

    arToolkitContext.init(() => {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    const markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
        type: 'pattern',
        patternUrl: 'pattern-marker.patt'
    });

    function onResize() {
        arToolkitSource.onResize();
        arToolkitSource.copySizeTo(renderer.domElement);
        if (arToolkitContext.arController !== null) {
            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
        }
    }

    animate(arToolkitContext, arToolkitSource);
}

function loadModel(url) {
    const loader = new THREE.GLTFLoader();
    loader.load(url, function (gltf) {
        model = gltf.scene;
        model.scale.set(0.1, 0.1, 0.1); // 调整模型的大小
        markerRoot.add(model);
        console.log("Model loaded successfully");
    }, undefined, function (error) {
        console.error("Error loading model: ", error);
    });
}

function animate(arToolkitContext, arToolkitSource) {
    requestAnimationFrame(() => animate(arToolkitContext, arToolkitSource));

    if (arToolkitSource.ready) {
        arToolkitContext.update(arToolkitSource.domElement);
    }

    if (model) {
        model.rotation.y += 0.01;
        const markerPosition = model.position;
        document.getElementById('markerPosition').innerText = 
            `Marker position: x=${markerPosition.x.toFixed(2)}, y=${markerPosition.y.toFixed(2)}, z=${markerPosition.z.toFixed(2)}`;
    }

    renderer.render(scene, camera);
    console.log("Rendering frame");
}

window.addEventListener('load', () => {
    initAR();
});
