const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const photoButton = document.querySelector("button")
const ghostEffect = document.querySelector("[name=ghostEffect]");
const redFilter = document.querySelector("[name=redFilter]");   
const blueFilter = document.querySelector("[name=blueFilter]");
let id = 0;
let counter = 1;

photoButton.onclick  = () => {
    snap.currentTime = 0;
    snap.play();
    const data  = canvas.toDataURL("image/jpeg");
    strip.innerHTML +=
    `
    <a href="${data} class="photo">
        <img src="${data}" id="image${id}"}/>
    </a>
    `;
}

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream)
            video.srcObject = localMediaStream
        })
        .catch(err => {
            console.error("OHH NOOO!!", err)
        })
}

function moveVideoToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    console.log(width, height);
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height)
        let pixels = ctx.getImageData(0, 0, width, height)
/*         switch(counter){
            case 1:
                pixels.data = redEffect(pixels.data);
                ctx.putImageData(pixels, 0, 0);
            break;

            case 2:
                pixels.data = greenEffect(pixels.data);
                ctx.putImageData(pixels, 0, 0);
            break;

            case 3:
                pixels.data = blueEffect(pixels.data);
                ctx.putImageData(pixels, 0, 0);
                counter = 0;
            break
        }
        counter++; */

        if(ghostEffect.value == 0) ctx.globalAlpha = 0.1;
        else{
            ctx.globalAlpha = (ghostEffect.value * 0.01);
        }
        if(redFilter.value > 0) {
            console.log(redFilter.value)
            pixels.data = redEffect(pixels.data, redFilter.value);
        }
        ctx.putImageData(pixels, 0, 0);
    },2)
}
getVideo();
setTimeout(() => {
    moveVideoToCanvas();
}, 1000)

function redEffect(pixels, intensity){
    for(let i = 0; i < pixels.length; i += 4){

        pixels[i] += intensity; // RED
        pixels[i + 1] = pixels[i + 1] - 50; //GREEN
        pixels[i + 2] = pixels[i + 2]  * 0.5; //BLUE
    }
    return pixels;
}
function greenEffect(pixels) {
    for(let i = 0; i < pixels.length; i += 4){
        pixels[i - 1] = pixels[i - 1] - 100;//red
        pixels[i] += 50;//green
        pixels[i + 1] = pixels[i + 1] * 0.1//blue
    }
    return pixels;
}

function blueEffect(pixels) {
    for(let i = 2; i < pixels.length; i += 4){
        pixels[i - 2] = pixels[i - 2] * 0.3;//red
        pixels[i - 1] = pixels[i - 1] - 100;//green
        pixels[i] += 50; //blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for(let i = 0;i < pixels.length; i+=4) {
        pixels[i - 150] = pixels[i + 0];
        pixels[i + 100] = pixels[i + 1];
        pixels[i - 150] = pixels[i + 2];
    }
    return pixels;
}

