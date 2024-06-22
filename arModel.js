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
            video.addEventListener('loadedmetadata', () => {
                video.play().then(() => {
                    setupThreeJS(video);
                }).catch(err => {
                    console.error("Error playing video: ", err);
                });
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
    const videoGeometry = new THREE.PlaneGeometry(2, 2);
    const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);

    videoMesh.position.set(0, 0, -1);
    scene.add(videoMesh);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 20, 0);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 20, 10);
    scene.add(directionalLight);

    camera.position.set(0, 0, 10);

    console.log("Three.js setup complete");

    const urlParams = new URLSearchParams(window.location.search);
    const modelNumber = urlParams.get('1');
    if (modelNumber) {
        console.log(`Loading model number: ${modelNumber
