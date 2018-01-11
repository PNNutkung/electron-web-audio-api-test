// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const app = require('electron').app
const ipcRenderer = require('electron').ipcRenderer
const ft = require('fourier-transform')

// let frequency = 440
// let size = 1024
// let sampleRate = 44100
// let waveform = new Float32Array()
// for (var i = 0; i < size; i++) {
//     waveform[i] = Math.sin(frequency * Math.PI * 2 * (i / sampleRate))
// }

// let spectrum = ft(waveform)

// let currentWindow = require('electron').remote.getCurrentWindow()
// console.log(currentWindow.audioContext)

// let audioBuffer

ipcRenderer.on('read-audio-file-reply', (event, arg) => {
    console.log('IN renderer process')
    console.log(arg.buffer)
    // audioBuffer = arg
    let div = document.createElement('div')
    div.appendChild(document.createTextNode(arg.length.toString()))
    document.body.appendChild(div)
})

// ipcRenderer.send('read-audio-file')