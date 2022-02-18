const { ceil, random } = Math;

const userVid = document.getElementById('user-vid') as HTMLMediaElement;
const btn = document.querySelector('button');
let active = false;

btn.addEventListener('click', async function () {
    if (active)
        stop();
    else
        record();
    active = !active;
});

var recorder: MediaRecorder;

function onstop(e: Event) {
    console.log('recorder stopped');
}

function ondataavailable(e: BlobEvent) {
    console.log('data available');
    const blob = new Blob([e.data], { type: 'video/webm' });
    const newRecord = new File([blob], ceil(random() * 9e6).toString() + ".webm");
    console.log(newRecord.size);
    upload(newRecord);
    const newVidElm = document.createElement('video');
    newVidElm.src = URL.createObjectURL(blob);
    newVidElm.controls = true;
    document.querySelector('div.records').appendChild(newVidElm);
    newVidElm.play();
}

async function record() {
    console.log('recording...');
    try {
        const userDisplayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        const userAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        btn.innerText = "End recording";
        const userStream = new MediaStream(
            userDisplayStream
                .getVideoTracks()
                .concat(
                    userAudioStream
                        .getAudioTracks()
                )
        );

        userVid.srcObject = userStream;
        userVid.play();
        recorder = new MediaRecorder(userStream, { mimeType: 'video/webm' });
        recorder.start();
        recorder.onstop = onstop;
        recorder.ondataavailable = ondataavailable;
        recorder.onerror = errorHandler;
    } catch (error) {
        active = !active;
        console.error('error at record', error);
        return;
    }
}

function stop() {
    console.log('stopping recorder...');
    recorder.stop();
    userVid.pause();
    btn.innerText = "Start recording";
}

function errorHandler(e: MediaRecorderErrorEvent) {
    console.error('recorder error :', e);
}

async function upload(f: File) {
    console.log('uploading recorded data', f);
    const data = new FormData();
    data.append('f', f)
    try {
        const result = await fetch('http://localhost:3000/record', {
            method: 'POST',
            credentials: 'include',
            body: data
        });
        console.log(result.text());
    } catch (error) {
        console.error('error at upload', error);
    }
}

