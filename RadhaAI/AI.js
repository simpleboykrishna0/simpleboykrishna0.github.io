
const fonts = [
    "Select Font", "Arial", "Verdana", "Times New Roman", "Courier New", "Georgia", "Tahoma", "Trebuchet MS", "Impact", "Comic Sans MS", "Lucida Console",
    "Garamond", "Palatino Linotype", "Book Antiqua", "Arial Black", "Century Gothic", "Franklin Gothic Medium", "Gill Sans", "Lucida Sans Unicode",
    "Copperplate", "Futura", "Brush Script MT", "Monaco", "Candara", "Segoe UI", "Helvetica", "Calibri", "Geneva", "Baskerville"
];
function populateFontPicker() {
    const fontPicker = document.getElementById("fontPicker");
    fonts.forEach(font => {
        let option = document.createElement("option");
        option.value = font;
        option.textContent = font;
        fontPicker.appendChild(option);
    });
}

populateFontPicker();
document.getElementById("fontPicker").addEventListener("change", copyFont);
function copyFont() {
    const fontPicker = document.getElementById("fontPicker");
    const selectedFont = fontPicker.value;
    if (selectedFont) {
        navigator.clipboard.writeText(selectedFont).then(() => {
           
        }).catch(err => {
            console.error("Error copying font: ", err);
        });
    }
}

function copyColor(color) {
    navigator.clipboard.writeText(color).then(() => {
    }).catch(err => {
        console.error("Error copying color: ", err);
    });
}



const apiKey = "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"; // Replace with your OpenAI API key
const input = document.getElementById('input');
const output = document.getElementById('output');
const submit = document.getElementById('submit');
const previewBtn = document.getElementById('preview');

// Apply CodeMirror to output textarea with rainbow syntax highlighting
const editor = CodeMirror.fromTextArea(output, {
mode: "htmlmixed",
theme: "monokai", // Monokai theme for colorful syntax
lineNumbers: true,
autoCloseTags: true,
matchBrackets: true,
readOnly: false 
});

submit.onclick = async () => {
if (input.value.trim() == '') {
    Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'User input cannot be empty!',
    });
    return;
}
editor.setValue("Generating response...");
const iframe = document.getElementById("previewFrame");
const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
const bodyContent = iframeDoc.documentElement.outerHTML;

const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
        model: "gpt-4",
        messages: [
            {role:"system",content:"Respond with only valid HTML content without any markdown or additional text."},
            { role: "user", content: `Modify the following HTML to add or change according to:  "${input.value}" \nExisting HTML: "${bodyContent}"` }
        ],
        temperature: 0.7
    })
});

const data = await response.json();
let result = data.choices[0].message.content;

// Ensure response starts from the first HTML tag
result = result.replace(/^"\s*(<html|<!DOCTYPE)/, '$1');


editor.setValue(result);
// editor.setValue(data.choices[0].message.content);
iframeDoc.open();
iframeDoc.write(editor.getValue());
iframeDoc.close();
input.value = '';
};

previewBtn.onclick = () => {
const iframe = document.getElementById("previewFrame");
const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
iframeDoc.open();
iframeDoc.write(editor.getValue());
iframeDoc.close();
};


function detectLanguage(text) {
    let hindiPattern = /[\u0900-\u097F]/;
    return hindiPattern.test(text) ? "hi-IN" : "en-IN";
}
async function speak() {
const url = "https://api.openai.com/v1/audio/speech";

var text = "";
const iframe = document.getElementById("previewFrame");
const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

if (iframeDoc) {
const textContent = iframeDoc.body.innerText.trim(); // Get only text
text = textContent;
if(text==""){
text = "radha";
}
}
// API request ka data
const requestData = {
    model: "tts-1",  // Model (ya "tts-1-hd" for HD voice)
    input: text,
    voice: "nova"  // Female voice (options: alloy, echo, fable, onyx, nova, shimmer)
};

try {
    speakVoice();
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    });

    if (!response.ok) {
        throw new Error("Failed to fetch audio");
    }

    // Response ko audio me convert karein
    // const audioBlob = await response.blob();
    // const audioUrl = URL.createObjectURL(audioBlob);

    // // Audio play karein
    // let audio = new Audio(audioUrl);
    // audio.play();
    const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);

// Existing <audio> element ko use karein
let audioElement = document.getElementById("audioPlayer");

if (!audioElement) {
    // Agar <audio> element nahi mila, toh ek create karen
    audioElement = document.createElement("audio");
    audioElement.id = "audioPlayer";
    document.body.appendChild(audioElement);
}

// Agar koi dusra audio chal raha hai, toh use stop karein
audioElement.pause();
audioElement.currentTime = 0;

// Naya audio set karein aur play karein
audioElement.src = audioUrl;
audioElement.play();

   
    aiText.classList.remove("fade-in");
    aiText.classList.add("fade-out");
    aiText.style.display = "none";
   

      
} catch (error) {
    console.error("Error:", error);
}
}

// listning function
const wakeWord = "krishna"; // Sirf "Radhu" sunke response dega
let isActive = false; // Initially AI inactive hoga

function startListening() {
console.log("Start Listning ....")
let recognition = new webkitSpeechRecognition() || new SpeechRecognition();
recognition.lang = "auto";  // Multi-language support ke liye "auto" bhi kar sakte hain
recognition.continuous = true;  // AI har time listen karega
recognition.interimResults = false;  // Sirf final results store karega

recognition.start();
console.log("Start Recognize");
recognition.onresult = function(event) {
    let command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();

    if (!isActive) {
        if (command.includes(wakeWord)) {
            isActive = true;
            console.log("👂 AI Activated: Waiting for command...");
            recognizeVoice();
            //speak("yes krishna say");
        }
    } else {
        //executeCommand(command);
        correctText(command);
        isActive = false; 
        setTimeout(() => {
    aiText.classList.remove("fade-in");
    aiText.classList.add("fade-out");
    setTimeout(() => {
        aiText.style.display = "none";
    }, 500); // Wait for fade-out animation to complete
}, 500);
       
    }
};

recognition.onerror = function(event) {
    console.error("Speech Recognition Error:", event);
    
    if (event.error === "no-speech") {
        console.warn("⚠ No speech detected! Restarting recognition...");
        recognition.stop();
        setTimeout(startListening, 1000);  // 1 sec ke baad dubara start karega
    }
};

recognition.onend = function() {
    console.warn("🎙 Speech recognition stopped! Restarting...");
    setTimeout(startListening, 100);  // 0.5 sec ke baad firse start karega
};
}


async function correctText(text) {
if(text.includes("speak")){
    document.getElementById("speakAI").click();
}
else if(text.includes("wiki")){
    document.getElementById("input").value=text;   
    searchWikipedia();
}
else{
    document.getElementById("input").value=text;   
    document.getElementById("submit").click();
}
      
}
startListening();


function recognizeVoice() {
let aiText = document.getElementById("aiText");
aiText.innerHTML = "Recognizing ... 👀";
// Show Animation
aiText.style.display = "block";
aiText.classList.remove("fade-out");
aiText.classList.add("fade-in");

}

function speakVoice() {
let aiText = document.getElementById("aiText");
aiText.innerHTML = "Speaking please wait....";
// Show Animation
aiText.style.display = "block";
aiText.classList.remove("fade-out");
aiText.classList.add("fade-in");

}

async function searchWikipedia() {
    var query = document.getElementById("input").value.trim();
   
    query = query.replace(/wikipedia|wiki/gi, "");
    if (!query) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please Try Again',
        });
        return;
    }
    console.log(query);
    let url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages|extracts&titles=${encodeURIComponent(query)}&exintro=true&explaintext=true&pithumbsize=500`;

    try {
        let response = await fetch(url);
        let data = await response.json();
        let pages = data.query.pages;
        let page = Object.values(pages)[0];

        if (page.missing) {
            updateIframe("<h3>No results found!</h3>");
            return;
        }

        let title = page.title || "No Title Found";
        let summary = page.extract || "No summary available";
        let image = page.thumbnail ? `<img src="${page.thumbnail.source}" alt="${title}" style="max-width: 300px;">` : "";

        let content = `
            <div style="font-family: Arial, sans-serif; padding: 10px;">
                <h2>${title}</h2>
                ${image}
                <p>${summary}</p>
            </div>
        `;

        updateIframe(content);
        document.getElementById("input").value="";
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function updateIframe(content) {
    let iframe = document.getElementById("previewFrame");
    let doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(content);
    doc.close();
    editor.setValue(content);
}