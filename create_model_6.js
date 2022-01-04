

var total_frames = [1, 1, 1];


var ball_1D0, ball_1D1, ball_1D2, C_y0, C_z0, C_y1, C_z1, C_y2, C_z2;
var distance1DPulse = -5;
// var resolution = new THREE.Vector2(window.innerWidth, window.innerHeight / 2);

var P1new, P2new, Tnew;


var num = [1, 1, 1];
var zFactor, resolution;

var a1, a2, a3, a4, a5, a6, b1, b2, b3, b4, b5, b6, c1, c2, c3, c4, c5, c6, xx, yy;
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

function create_model(param, num_model, pulseType) {
    let arr_res = param.split(';');

    let paramB = Number(arr_res[17]);
    let period = Math.floor(1 / paramB);

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

    if (pulseType === 1) {
        a4 = Number(arr_res[18]);
        a5 = Number(arr_res[19]);
        a6 = Number(arr_res[20]);
    
        b4 = Number(arr_res[21]);
        b5 = Number(arr_res[22]);
        b6 = Number(arr_res[23]);
    
        c4 = Number(arr_res[24]);
        c5 = Number(arr_res[25]);
        c6 = Number(arr_res[26]);
        if (b6 < b5) {
            b6 += 100;
        }
    
        frames = 100 + (Math.trunc(10 * c6) % 10) * 10 + Math.trunc(c5) % 10;
    } else if (pulseType === 2) {
        frames = period * (Math.trunc(c3) % 10) * 10 + Math.trunc(10 * c2) % 10;
    } else {
        frames = (Math.trunc(c3) % 10) * 10 + Math.trunc(10 * c2) % 10;
    }



    total_frames[num_model] = frames; //82   b4+c4

    prepare_matrix();

    C = new Array(total_frames[num_model]);


    createFrame(total_frames[num_model], pulseType, param);

    return 1;
}

var verticesHeight, verticesColorIndex;
// var buffer = new ArrayBuffer(100 * 50 * 37);

function createFrame(num_frame, pulseType, param) {

    let arr_res = param.split(';');

    let paramA = Number(arr_res[16]);
    let paramB = Number(arr_res[17]);
    let period = Math.floor(1 / paramB);

    let i, j, t, h;
    frame_info = new Array(num_frame);
    frame_color_info = new Array(num_frame);
    let Insp = Math.ceil(period / 2);
    let scale_curve = 0;
    let coefficient = 1.2;

    let max = Number.MIN_SAFE_INTEGER;
    let min = Number.MAX_SAFE_INTEGER;
    if (pulseType === 2) {
        for (let i = 0; i < period; i++) {
            if (i < Insp) {
                scale_curve += coefficient * paramA;
            } else if (i === Insp) {
                if (period % 2 === 0) {
                    scale_curve = scale_curve;
                } else {
                    scale_curve -= coefficient * paramA;
                } 
            } else {
                scale_curve -= coefficient * paramA;
            } 
            for (t = 1; t <= num_frame / 4; t++) {

                C[i * (num_frame / 4) + t - 1] = (1 - scale_curve) * (a1 * Math.exp(-Math.pow((t - b1) / c1, 2)) + a2 * Math.exp(-Math.pow((t - b2) / c2, 2)) + a3 * Math.exp(-Math.pow((t - b3) / c3, 2)));

                max = Math.max(max, C[i * (num_frame / 4) + t - 1]);
                min = Math.min(min, C[i * (num_frame / 4) + t - 1]);
            }

        }    

    } else {
        for (t = 1; t <= num_frame; t++) {

            if (pulseType === 1) {
                C[t - 1] = a1 * Math.exp(-Math.pow((t - b1) / c1, 2)) + a2 * Math.exp(-Math.pow((t - b2) / c2, 2)) + a3 * Math.exp(-Math.pow((t - b3) / c3, 2)) + a4 * Math.exp(-Math.pow((t - b4) / c4, 2)) + a5 * Math.exp(-Math.pow((t - b5) / c5, 2)) + a6 * Math.exp(-Math.pow((t - b6) / c6, 2));
            } else {
                C[t - 1] = a1 * Math.exp(-Math.pow((t - b1) / c1, 2)) + a2 * Math.exp(-Math.pow((t - b2) / c2, 2)) + a3 * Math.exp(-Math.pow((t - b3) / c3, 2));
            }   
            max = Math.max(max, C[t - 1]);
            min = Math.min(min, C[t - 1]);
        }
    
    }
    for (let i = 0; i < num_frame; i++) {
    
        C[i] = (C[i] - min) / (max - min);
    }


    points = new Float32Array(num_frame * 3);
    
    for (let j = 0; j < num_frame * 3; j += 3) {
        if (pulseType === 1) {
            points[j] = j / 3 * 0.05 / 2 - 2;
        } else if (pulseType === 2) {
            points[j] = j / 3 * 0.05 / period - 2;
        } else {
            points[j] = j / 3 * 0.05 - 2;
        }
        points[j + 1] = 0;
        points[j + 2] = C[j / 3];
    }

    let size = 10, segmentX = 25, segmentY = 18;
    
    for (t = 1; t <= num_frame; t+=4) {
        
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

        //保存高度为buffer
        frame_info[t - 1] = new Array(segmentX * segmentY);

        for (k = 0; k < (segmentX); k++) {
            for (h = 0; h < (segmentY); h++) {
                // eval("geometry.vertices[(j) + ((segmentY ) * k)].setZ(-20*Tnew" + num_frame + "[k][j])");
                frame_info[t - 1][(h) + ((segmentY) * k)] = size * Tnew[k][h] * zFactor;
            }
        }


        //保存颜色index为buffer
        frame_color_info[t - 1] = new Array(segmentX * segmentY);
        for (let i = 0; i < segmentX * segmentY; i++) {
            // let point = geometry.vertices[i];
            frame_color_info[t - 1][i] = Math.round((frame_info[t - 1][i] / size / zFactor).toFixed(3) * 500);
            // console.log("frame_color_info", frame_color_info[t - 1][i]);
        }


    }
    
}


self.addEventListener('message', function (e) {
    let param = e.data.code;
    let num_model = e.data.num;
    let pulseType = e.data.pulseType;
    zFactor = e.data.zFactor;
    resolution = e.data.resolution;

    create_model(param, num_model, pulseType);

    postMessage({
        current: num_model,
        total_frames: total_frames[num_model],
        frame_info: frame_info,
        frame_color_info: frame_color_info,
        points: points
    });


}, false);