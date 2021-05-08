const btn = document.querySelector('.talk')
let content = document.querySelector('.content')
let p = null
let parent
let checkbox
let label
let n = false
let ex = false

//display time
let today = new Date()
let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
let dateTime = date+' '+time;
document.querySelector('.time').textContent = dateTime

const keyStrokes = ['name','symptoms', 'diagnosis','prescription','advice']
let keyStrokesStatus = false
const commands = ['first','second','third','fourth','fifth']
let commandStatus = false
const deleteCommands = ['delete name','delete symptoms','delete diagnosis','delete prescription','delete advice']
const editCommands = ['add name','addsymptoms','add diagnosis','add prescription','add advice']

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition 
const recognition = new SpeechRecognition();

// recognition.interimResults = true
recognition.continuous = true

recognition.onstart = function(){
    console.log("voice command activated")
}

btn.addEventListener('click',()=>{
 if(ex === true){
     stopEdit()
 }
 if(!n)
{
    recognition.start()
    writeModeEnable()
    console.log("started")
    n = true
}
 else
 {
    stopWrite()
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
                   p = document.querySelector(`.${j}`)
                   console.log(p.parentElement.querySelector('label'))
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
    function stopWrite(){
        recognition.addEventListener('end',()=>{
            console.log("listener removed")
        })
        recognition.removeEventListener('result',writeMode)
        recognition.stop()
        console.log("ended")
        n = false
    }

const editButton = document.querySelector('.edit')

editButton.addEventListener('click',(e)=>{
 if(n === true){
    stopWrite()
 }
 if(!ex){
     recognition.start()
     editModeEnable()
     ex= true
 }
 else{
    stopEdit()
 }
})
    function editModeEnable(){
        recognition.addEventListener('result',editMode)
    }
    function editMode(e){
    
            let current = e.resultIndex
            let transcript = e.results[current][0].transcript
            for(let j of deleteCommands){
                if(j === transcript.toLowerCase().trim()){
              
                   p = document.querySelector(`.${j.split(" ")[1]}`)
                   p.textContent = " "
                   p.parentElement.querySelector('section').innerHTML = ""
                   console.log(p)
                   transcript = ''
                }
            }
            if(p!=null)
            p.textContent = p.textContent + transcript
    }
    function stopEdit(){
        recognition.addEventListener('end',()=>{
            console.log("listener removed")
         })
         recognition.removeEventListener('result',editMode)
         recognition.stop()
         console.log("edit mode stopped")
         ex = false
    }


