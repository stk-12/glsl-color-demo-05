varying vec2 vUv;

uniform float uTime;

uniform vec3 uColors[5];
varying vec3 vColor;

#pragma glslify: snoise = require(glsl-noise/simplex/3d);

void main() {
  vUv = uv;
  vec3 pos = position;

  // float noise = snoise(vec3(uv, uTime * 2.5));
  // 頂点zにノイズを反映
  // pos = vec3(pos.x, pos.y, pos.z + noise * 200.0);

  // vec2 noiseCoord = uv * vec2(3.0, 4.0); //uvを調整してノイズを細かく
  // float noise = snoise(vec3(noiseCoord, uTime * 2.5));
  // pos = vec3(pos.x, pos.y, pos.z + noise * 200.0);

  // vec2 noiseCoord = uv * vec2(3.0, 4.0); //uvを調整してノイズを細かく
  //  //noiseCoordを分割してさらに複雑に
  // // float noise = snoise(vec3(noiseCoord.x + uTime * 5.0, noiseCoord.y, uTime * 2.5)); //右から左に流れるように
  // float noise = snoise(vec3(noiseCoord.x, noiseCoord.y - uTime * 5.0, uTime * 2.5)); //下から上に流れるように
  // pos = vec3(pos.x, pos.y, pos.z + noise * 150.0);


  vec2 noiseCoord = uv * vec2(3.0, 4.0); //uvを調整してノイズを細かく
   //noiseCoordを分割してさらに複雑に
  // float noise = snoise(vec3(noiseCoord.x + uTime * 5.0, noiseCoord.y, uTime * 2.5)); //右から左に流れるように
  float noise = snoise(vec3(noiseCoord.x, noiseCoord.y - uTime * 5.0, uTime * 2.5)); //下から上に流れるように
  noise = max(0.0, noise); //ノイズが0以下にならないように
  pos = vec3(pos.x, pos.y, pos.z + noise * 100.0);


  vColor = uColors[0];

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}