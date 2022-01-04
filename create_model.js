// import { PlaneGeometry, MeshBasicMaterial } from './build/three2.js';
// importScripts("./build/three2.js");
// importScripts("./build/THREE.MeshLine.js");

var total_frames = [1, 1, 1];
// var group0 = new THREE.Group;
// var group1 = new THREE.Group;
// var group2 = new THREE.Group;

var ball_1D0, ball_1D1, ball_1D2, C_y0, C_z0, C_y1, C_z1, C_y2, C_z2;
var distance1DPulse = -5;
// var resolution = new THREE.Vector2(window.innerWidth, window.innerHeight / 2);

var P1new, P2new, Tnew;


var num = [1, 1, 1];
var zFactor, resolution;

var a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, xx, yy;
// var a1, a2, a3, b1, b2, b3, c1, c2, c3, xx, yy;
var rn_one_beat, sigman_one_beat, thetan_one_beat, xcn_one_beat, ycn_one_beat, frames;
var points;

function cosd(value) {
    input = value / 180 * Math.PI;
    return Math.cos(input);
}

function sind(value) {
    input = value / 180 * Math.PI;
    return Math.sin(input);
}

function prepare_matrix() {
    x_len = 18;
    y_len = 25;

    // xx matrix
    xx = new Array(y_len);
    for (let j = 0; j < y_len; j++) {
        xx[j] = new Array(x_len);
        for (let i = 0; i < x_len; i++) {
            xx[j][i] = i / (x_len - 1);
        }
    }
    // yy matrix
    yy = new Array(y_len);
    for (let j = 0; j < y_len; j++) {
        yy[j] = new Array(x_len);
        yy[j][0] = j / (y_len - 1);
        for (let i = 1; i < x_len; i++) {
            yy[j][i] = yy[j][0];
        }
    }
}

var frame_info, frame_color_info;

function create_model(param, num_model) {
    let arr_res = param.split(';');

    // a1 = Number(arr_res[0]);
    // a2 = Number(arr_res[1]);
    // a3 = Number(arr_res[2]);
    // a4 = Number(arr_res[3]);

    // b1 = Number(arr_res[4]);
    // b2 = Number(arr_res[5]);
    // b3 = Number(arr_res[6]);
    // b4 = Number(arr_res[7]);

    // c1 = Number(arr_res[8]);
    // c2 = Number(arr_res[9]);
    // c3 = Number(arr_res[10]);
    // c4 = Number(arr_res[11]);

    // rn_one_beat = Number(arr_res[12]);
    // sigman_one_beat = Number(arr_res[13]);
    // thetan_one_beat = Number(arr_res[14]);
    // xcn_one_beat = Number(arr_res[15]);
    // ycn_one_beat = Number(arr_res[16]);


    a1 = Number(arr_res[0]);
    a2 = Number(arr_res[1]);
    a3 = Number(arr_res[2]);

    b1 = Number(arr_res[3]);
    b2 = Number(arr_res[4]);
    b3 = Number(arr_res[5]);

    c1 = Number(arr_res[6]);
    c2 = Number(arr_res[7]);
    c3 = Number(arr_res[8]);

    rn_one_beat = Number(arr_res[9]);
    sigman_one_beat = Number(arr_res[10]);
    thetan_one_beat = Number(arr_res[11]);
    xcn_one_beat = Number(arr_res[12]);
    ycn_one_beat = Number(arr_res[13]);


    frames = (Math.trunc(c3) % 10) * 10 + Math.trunc(10 * c2) % 10;
    total_frames[num_model] = frames; //82   b4+c4

    prepare_matrix();

    // var C = new Array();
    C = new Array(total_frames[num_model]);



    // for (let i = 1; i <= total_frames[num_model]; i++) {
    //     eval("obj" + num_model + "_" + i + "= new THREE.Object3D()"); // 隐式声明全局变量
    // }

    createFrame(total_frames[num_model]);

    return 1;
}

var verticesHeight, verticesColorIndex;
// var buffer = new ArrayBuffer(100 * 50 * 37);

function createFrame(num_frame) {

    let i, j, t, h;
    frame_info = new Array(num_frame);
    frame_color_info = new Array(num_frame);

    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    for (t = 1; t <= num_frame; t++) {

        // C[t - 1] = a1 * Math.exp(-Math.pow((t - b1) / c1, 2)) + a2 * Math.exp(-Math.pow((t - b2) / c2, 2)) + a3 * Math.exp(-Math.pow((t - b3) / c3, 2)) + a4 * Math.exp(-Math.pow((t - b4) / c4, 2)) + paramA * Math.sin(paramB * t);
        // C[t - 1] = a1 * Math.exp(-Math.pow((t - b1) / c1, 2)) + a2 * Math.exp(-Math.pow((t - b2) / c2, 2)) + a3 * Math.exp(-Math.pow((t - b3) / c3, 2)) + a4 * Math.exp(-Math.pow((t - b4) / c4, 2));

        C[t - 1] = a1 * Math.exp(-Math.pow((t - b1) / c1, 2)) + a2 * Math.exp(-Math.pow((t - b2) / c2, 2)) + a3 * Math.exp(-Math.pow((t - b3) / c3, 2));
        max = Math.max(max, C[t - 1]);
        min = Math.min(min, C[t - 1]);
    }

    for (let i = 0; i < num_frame; i++) {

        C[i] = (C[i] - min) / (max - min);
    }


    points = new Float32Array(num_frame * 3)
        
    for (let j = 0; j < num_frame * 3; j += 3) {
        points[j] = j / 3 * 0.05 - 2;
        points[j + 1] = 0;
        points[j + 2] = C[j / 3];
    }

    for (t = 1; t <= num_frame; t+=2) {
        
        P1new = new Array(y_len);
        P2new = new Array(y_len);
        Tnew = new Array(y_len);

        for (j = 0; j < y_len; j++) {
            P1new[j] = new Array(x_len);
            P2new[j] = new Array(x_len);
            Tnew[j] = new Array(x_len);
            for (i = 0; i < x_len; i++) {
                P1new[j][i] = (xx[j][i] - xcn_one_beat) * cosd(thetan_one_beat) + (yy[j][i] - ycn_one_beat) * sind(thetan_one_beat);
                P2new[j][i] = (xx[j][i] - xcn_one_beat) * -sind(thetan_one_beat) + (yy[j][i] - ycn_one_beat) * cosd(thetan_one_beat);
                Tnew[j][i] = C[t - 1] * Math.exp((-sigman_one_beat / (1 + Math.pow(rn_one_beat, 2))) * (Math.pow(rn_one_beat * P1new[j][i], 2) + Math.pow(P2new[j][i], 2)));
            }
        }


        let size = 10, segmentX = 50/2, segmentY = 18;
        // var part = size / segmentX;
        // geometry = new THREE.PlaneGeometry(size, size * segmentX / segmentY, segmentY - 1, segmentX - 1);

        //设定每帧各点的高度
        // for (k = 0; k < (segmentX); k++) {
        //     for (j = 0; j < (segmentY); j++) {
        //         // eval("geometry.vertices[(j) + ((segmentY ) * k)].setZ(-20*Tnew" + num_frame + "[k][j])");
        //         geometry.vertices[(j) + ((segmentY) * k)].setZ(size * Tnew[k][j] * zFactor);
        //     }
        // }


        //保存高度为buffer
        frame_info[t - 1] = new Array(segmentX * segmentY);

        for (k = 0; k < (segmentX); k++) {
            for (h = 0; h < (segmentY); h++) {
                // eval("geometry.vertices[(j) + ((segmentY ) * k)].setZ(-20*Tnew" + num_frame + "[k][j])");
                frame_info[t - 1][(h) + ((segmentY) * k)] = size * Tnew[k][h] * zFactor;
            }
        }

        //设定材质
        // let vertexColorMaterial = new THREE.MeshBasicMaterial(
        //     {
        //         vertexColors: THREE.VertexColors,
        //         side: THREE.DoubleSide,
        //         opacity: 0.95
        //     });

        // let color, point, face, numberOfSides, vertexIndex;

        // faces用字母索引
        // let faceIndices = ['a', 'b', 'c', 'd'];

        // let index = 0;
        // let colormap, index_color;


        //保存颜色index为buffer
        frame_color_info[t - 1] = new Array(segmentX * segmentY);
        for (let i = 0; i < segmentX * segmentY; i++) {
            // let point = geometry.vertices[i];
            frame_color_info[t - 1][i] = Math.round((frame_info[t - 1][i] / size / zFactor).toFixed(3) * 500);
            // console.log("frame_color_info", frame_color_info[t - 1][i]);
        }

        

        // 为几何体的每个点设定颜色
        // for (let i = 0; i < geometry.vertices.length; i++) {
        //     point = geometry.vertices[i];
        //     color = new THREE.Color(0xffffff);
        //     index = Math.round((point.z / size / zFactor).toFixed(3) * 500);
        //     if (index < 0) {
        //         index = 0;
        //     }
        //     // color.setRGB( 0.1 + point.z / size, 0, 0.9 - point.z / size );
        //     colormap = jet;
        //     // index_color = interpolateLinearly((point.z/size).toFixed(3), colormap);
        //     // if(point.z/size < 0)
        //     // {

        //     // 	console.log('point.z/size is:' + point.z/size);
        //     // }
        //     // color.setRGB(index_color[0], index_color[1], index_color[2]);
        //     color.setRGB(colormap[index][1][0], colormap[index][1][1], colormap[index][1][2]);

        //     geometry.colors[i] = color; // use this array for convenience
        // }

        // 复制颜色到face的vertexColors数组的不同的position
        // for (let i = 0; i < geometry.faces.length; i++) {
        //     face = geometry.faces[i];
        //     numberOfSides = (face instanceof THREE.Face3) ? 3 : 4;
        //     for (let j = 0; j < numberOfSides; j++) {
        //         vertexIndex = face[faceIndices[j]];
        //         face.vertexColors[j] = geometry.colors[vertexIndex];
        //     }

        // }

        //创建帧
        // frame = new THREE.Mesh(geometry, vertexColorMaterial);
        // frame.rotation.x -= Math.PI * 0.5;
        // frame.scale.set(0.4, 0.4, 0.4);
        // eval("obj" + num_model + "_" + t + "= frame");
    }
    
}


self.addEventListener('message', function (e) {
    let param = e.data.code;
    let num_model = e.data.num;
    zFactor = e.data.zFactor;
    resolution = e.data.resolution;

    create_model(param, num_model);
    // postMessage({
    //     num_model: num_model,
    //     total_frames: total_frames[num_model]
    // });
    // console.log(frame_info[1][1]);
    // const frame_info_buff = frame_info.buffer;
    // const frame_color_info_buff = frame_color_info.buffer;
    // postMessage({frame_info_buff: frame_info,frame_color_info_buff: frame_color_info}, [frame_info_buff,frame_color_info_buff]);
    postMessage({
        current: num_model,
        total_frames: total_frames[num_model],
        frame_info: frame_info,
        frame_color_info: frame_color_info,
        points: points
    });


    // postMessage({
    //     success: 1
    // });
}, false);