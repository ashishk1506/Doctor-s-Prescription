const btn = document.querySelector('.talk')
let content = document.querySelector('.content')
let p = null
let parent
let checkbox
let label
let n = false

//display time

const options = { year: 'numeric', month: 'long', day: 'numeric' };
let today = new Date()
let date = today.toLocaleDateString("en-US", options)
let time = today.toLocaleTimeString()
let dateTime = date+' '+time;
document.querySelector('.time').textContent = dateTime

const keyStrokes = ['name','symptoms', 'diagnosis','prescription','advice']
let keyStrokesStatus = false
const commands = ['first','second','third','fourth','fifth']
let commandStatus = false
const deleteCommands = ['delete name','delete symptoms','delete diagnosis','delete prescription','delete advice']
// const editCommands = ['add name','add symptoms','add diagnosis','add prescription','add advice']

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition 
const recognition = new SpeechRecognition();

// recognition.interimResults = true
recognition.continuous = true

recognition.onstart = function(){
    console.log("voice command activated")
}

btn.addEventListener('click',writeHandler)
    function writeHandler(){

            if(!n)
           {
               n  = true
               recognition.start()
               writeModeEnable()
               console.log("started")
           }
            else
            {
               n = false
               stopWrite()
               p = null
           }
    }

     function writeModeEnable(){
        recognition.addEventListener('result',writeMode) 
     }

     function writeMode(e){
        
            let current = e.resultIndex
            let transcript = e.results[current][0].transcript
            console.log(transcript)
            if(transcript.toLowerCase().trim() === 'stop'){
                stopWrite()
                return
            }
            for(let j of keyStrokes){
                if(j === transcript.toLowerCase().trim()){
                   if(p!=null)
                     p.parentElement.querySelector('label').style.color = 'black'
                   p = document.querySelector(`.${j}`)
                   p.parentElement.querySelector('label').style.color = 'green'
                   keyStrokesStatus = true
                   commandStatus = false
                   transcript = ''
                }
            }
            for(let j of deleteCommands){
                if(j === transcript.toLowerCase().trim()){
                   if(p!=null)
                    p.style.color = 'black'
                   p = document.querySelector(`.${j.split(" ")[1]}`)
                   p.style.color = 'red'
                   p.textContent = " "
                   p.parentElement.querySelector('section').innerHTML = ""
                   console.log(p)
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
               }
     }      
    function stopWrite(){

        recognition.addEventListener('end',()=>{
            console.log("listener removed")
        })
        recognition.removeEventListener('result',writeMode)
        recognition.stop()
        console.log("ended")
    }
