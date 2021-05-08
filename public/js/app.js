const btn = document.querySelector('.talk')
let content = document.querySelector('.content')
let p
let parent
let checkbox
let label

const keyStrokes = ['name','symptoms', 'diagnosis','prescription','advice']
let keyStrokesStatus = false
const commands = ['first','second','third','fourth','fifth']
let commandStatus = false
const editCommands = ['delete name','delete symptoms','delete diagnosis','delete prescription','delete advice']
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition 
const recognition = new SpeechRecognition();

// recognition.interimResults = true
recognition.continuous = true

recognition.onstart = function(){
    console.log("voice command activated")
}
let n = false
btn.addEventListener('click',(e)=>{
 if(!n)
{
    recognition.start()
    writeModeEnable()
    console.log("started")
    n = true
}
 else
 {
    recognition.addEventListener('end',(e)=>{
        console.log("listener removed")
    })
    recognition.removeEventListener('result',writeMode)
    recognition.stop()
    console.log("ended")
    n = false
}
})
     function writeModeEnable(){
        recognition.addEventListener('result',writeMode) 
     }

     function writeMode(e){
        
            let current = e.resultIndex
            let transcript = e.results[current][0].transcript
            console.log(transcript)
            for(let j of keyStrokes){
                if(j === transcript.toLowerCase().trim()){
                   //  p = document.createElement('p')
                   // content.appendChild(p)
                   // if(keyStrokesStatus)
                   //  {
                   //      console.log("inverteed")
                   //      parent.classList.add('tail')
                   //  }
           
                   p = document.querySelector(`.${j}`)
                   
                   keyStrokesStatus = true
                   commandStatus = false
                   transcript = ''
                }
            }
            for(let j of commands){
                if(j === transcript.toLowerCase().trim()){
                 
                   label = document.createElement('label')
                   label.setAttribute("for",j)
                   checkbox = document.createElement('input')
                   checkbox.setAttribute("type", "checkbox");
                   checkbox.id = j
                   checkbox.className = `${j}`
                   checkbox.checked = true
                   let br = document.createElement('br')
                   p.parentElement.querySelector('section').appendChild(br)
                   p.parentElement.querySelector('section').appendChild(checkbox)
                   p.parentElement.querySelector('section').appendChild(label)
                   commandStatus = true
                   transcript = ''
                }
            }
            if(keyStrokesStatus === true && commandStatus === true)
              {
                label.textContent = label.textContent + transcript
                checkbox.value = checkbox.value + transcript
              }

             if(keyStrokesStatus === true && commandStatus === false)
               {
                   p.textContent = p.textContent + transcript
                   parent = p.parentElement.querySelector('h4')
                //    parent.classList.add('head')
               }
     }      


// recognition.addEventListener('end',()=>{
//     console.log("eneded")
// })

// let b = false
// document.querySelector('#name').addEventListener('click',()=>{
//     if(!b)
// {
//     recognition.start()
//     console.log("starte")
//     b = true
// }
//  else
//  {
//     recognition.addEventListener('end',(e)=>{
//         console.log("listener removed")
//     })
//     recognition.removeEventListener('result',editContent)
//     recognition.stop()
//     console.log("ended")
//     b = false
// }})

// editContent = function(){
//     let current = e.resultIndex
//     let transcript = e.results[current][0].transcript
//     console.log(transcript)
// }
// let editButton = false
// for(let x of keyStrokes){
//    let p =  document.querySelector(`#${x}`)
//    p.addEventListener('click',(e)=>{
//        if(!editButton)
//         {
//             recognition.start()
//             startEditListner(`#${x}`)
//             console.log("edit recognition started")
//             editButton = true
//         }
//         else
//         {
//             recognition.removeEventListener('result',editContent)
//             recognition.stop()
//             editButton = false
//         }
//    })
// }
// function startEditListner(n){
//   recognition.addEventListener('result',editContent)
// }
// function editContent(e){
//     let current = e.resultIndex
//     let transcript = e.results[current][0].transcript
//     console.log(transcript)
// }

const editButton = document.querySelector('.edit')
let e = false
editButton.addEventListener('click',()=>{
 if(!e){
     recognition.start()
     editModeEnable()
     console.log("edit mode initiated")
 }
 else{
     recognition.removeEventListener('result',editMode)
     recognition.stop()
     console.log("edit mode stopped")
 }
})
function editModeEnable(){
    recognition.addEventListener('result',editMode)
}
function editMode(e){
    let current = e.resultIndex
            let transcript = e.results[current][0].transcript
            console.log(transcript)
}