(function(messaging) {
    let blockCanvasCtx = new OffscreenCanvas(80, 20).getContext('2d', {willReadFrequently: true});
    let renderCtx = new OffscreenCanvas(1088, 1088).getContext('2d');

    messaging.onmessage = async function(event) {
        let [renderId, config, frame, scale, prevRot] = event.data;
        if (frame instanceof VideoFrame) {
            let bmp = await createImageBitmap(frame);
            frame.close()
            frame = bmp;
        }

        const blockSize = config.blockSize;
        const frameWidth = frame.width - config.cropL - config.cropR;
        const frameHeight = frame.height - config.cropT - config.cropB;

        if (blockCanvasCtx?.canvas.height !== blockSize)
            blockCanvasCtx = new OffscreenCanvas(blockSize*4, blockSize).getContext('2d', {willReadFrequently: true});

        blockCanvasCtx.drawImage(frame, config.cropL, config.cropT,
            blockSize, blockSize, blockSize * config.orientation[0], 0, blockSize, blockSize);
        blockCanvasCtx.drawImage(frame, config.cropL + frameWidth - blockSize, config.cropT,
            blockSize, blockSize, blockSize * config.orientation[1], 0, blockSize, blockSize);
        blockCanvasCtx.drawImage(frame, config.cropL, config.cropT + frameHeight - blockSize,
            blockSize, blockSize, blockSize * config.orientation[2], 0, blockSize, blockSize);
        blockCanvasCtx.drawImage(frame, config.cropL + frameWidth - blockSize, config.cropT + frameHeight - blockSize,
            blockSize, blockSize, blockSize * config.orientation[3], 0, blockSize, blockSize);

        const blocks = blockCanvasCtx.getImageData(0, 0, blockSize * 4, blockSize).data;

        const rotPx = Array.from({length:4}, (_, block) => {
            return Array.from({length: blockSize}, (_, row) => {
                return Array.from({length: blockSize}, (_, col) => {
                    const px = row * blockSize * 4 + block * blockSize + col;
                    return blocks.slice(px*4, px*4+3);
                }).reduce((a, b) => a.map((v, i) => v + b[i]), [0, 0, 0]);
            }).reduce((a, b) => a.map((v, i) => v + b[i]), [0, 0, 0]);
        }).flat(1).map(v => v / blockSize / blockSize);

        const stdDiv = Array.from({length:4}, (_, block) => {
            return Array.from({length: blockSize}, (_, row) => {
                return Array.from({length: blockSize}, (_, col) => {
                    const px = row * blockSize * 4 + block * blockSize + col;
                    const pxDat = blocks.slice(px*4, px*4+3);
                    return pxDat.map((v, i) => v-rotPx[block*3+i]).map(v => v*v);
                }).reduce((a, b) => a.map((v, i) => v + b[i]), [0, 0, 0]);
            }).reduce((a, b) => a.map((v, i) => v + b[i]), [0, 0, 0]);
        }).flat(1).map(v => Math.sqrt(v / blockSize / blockSize));

        const thr = Math.max(...stdDiv);
        let rot;
        if (thr > config.sensitivity) {
            if (typeof prevRot === 'number') {
                rot = prevRot;
            } else {
                messaging.postMessage([renderId, 0, frame, thr, scale, rotPx], [frame]);
                return;
            }
        } else {
            rot = rotPx.map(v => v < config.threshold ? 0 : 1).reduce((a, b) => a * 2 + b, 0);
        }

        const outputDim = config.outputDim;
        if (renderCtx?.canvas.width !== outputDim)
            renderCtx = new OffscreenCanvas(outputDim, outputDim).getContext('2d');

        renderCtx.clearRect(0, 0, outputDim, outputDim);
        renderCtx.translate(outputDim / 2, outputDim / 2);
        renderCtx.scale(scale, scale);
        renderCtx.rotate(-Math.PI * 2 * (rot + config.orientation[4]) / 4096);

        if (config.ringStroke && config.ringRadius) {
            renderCtx.strokeStyle = 'white';
            renderCtx.lineWidth = config.ringStroke;
            renderCtx.beginPath();
            renderCtx.ellipse(0,0,config.ringRadius,config.ringRadius,0,0,Math.PI*2);
            renderCtx.stroke();
        }

        renderCtx.drawImage(frame, config.cropL, config.cropT, frameWidth, frameHeight,
            -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight);
        renderCtx.clearRect(-frameWidth / 2, -frameHeight / 2, blockSize, blockSize);
        renderCtx.clearRect(frameWidth / 2-blockSize, -frameHeight / 2, blockSize, blockSize);
        renderCtx.clearRect(-frameWidth / 2, frameHeight / 2-blockSize, blockSize, blockSize);
        renderCtx.clearRect(frameWidth / 2-blockSize, frameHeight / 2-blockSize, blockSize, blockSize);
        renderCtx.resetTransform();

        const renderFrame = await createImageBitmap(renderCtx.canvas);
        const blockImage = await createImageBitmap(blockCanvasCtx.canvas);
        messaging.postMessage([renderId, blockImage, renderFrame, thr, rot, rotPx], [blockImage, renderFrame]);
        frame.close();
    }
})(self.renderWorkerCompat ?? self);
