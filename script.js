
const getTranslate = document.querySelector(".translateClass");
const microButton = document.querySelector(".microStyle");
const getMicro = document.querySelector(".microClass");

const ImgGoogle = "./images/google_translate_icon.png";
const ImgGoogleHover = "./images/google_translate_icon_Hover.png";

const ImgMicro = "./images/Microphone-Icon.png";
const ImgMicroHover = "./images/Microphone-Icon_Hover.png";

const reciveText = document.querySelector(".ReciveText");
const valueInText = document.querySelector(".valueUser");

const EscolheOption = document.querySelector("#EscolheOption");
const EscolherEscrita = document.querySelector("#getIdioma")

function EntrarGoogle()
{
getTranslate.src = ImgGoogleHover;
getTranslate.classList.add("animationGoogle");
}
 
function SairGoogle() 
{
getTranslate.src = ImgGoogle;
getTranslate.classList.remove("animationGoogle");
}

function EntrarMicro()
{
microButton.classList.add("BackgroundMicro");
getMicro.src = ImgMicroHover;
getMicro.classList.add("animationMicro");
}

function SairMicro()
{
microButton.classList.remove("BackgroundMicro");
getMicro.src = ImgMicro;
getMicro.classList.remove("animationMicro");
}

let getValue;
let getEscrita;

EscolheOption.addEventListener("change",(e) => { 
getValue = [e.target.value];
})

EscolherEscrita.addEventListener("change",(e) => {
getEscrita = [e.target.value];
})

async function Traduzir()
{

try
{
 
/**não retorna nada caso não tenha conteúdo */
if(!valueInText.value) return;

const search = await fetch(`https://api.mymemory.translated.net/get?q=${valueInText.value}!&langpair=${getEscrita||"pt-br"}|${getValue||"en"}`);
const transformInText = await search.json();
const {responseData} = transformInText;
const {translatedText} = responseData;

reciveText.value = translatedText;
}
catch(err)
{
console.log(`Erro ao traduzir...`)
console.log(`${err}`);
}
}

async function EscutaFala(lenguage)
{
try {
const getURL = await fetch(`https://api.mymemory.translated.net/get?q=${valueInText.value}!&langpair=${lenguage||"pt-br"}|${getValue||"en"}`);
const transformURL = await getURL.json();
const getTextTransform = transformURL.responseData.translatedText;
valueInText.innerText = getTextTransform;
}
catch(err) 
{
console.log(`Erro de reconhecimento de fala ${err}`)
}
}

function ExecutarMicro(){

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition(); // Reconhecimento de Fala

recognition.lang = `${getEscrita||"pt-br"}`; // Define a Lingua de Entrada(english)
recognition.interimResults = false; //Define se quer resultados parciais enquanto fala
recognition.maxAlternatives = 1; //Quantidades de opções de retornos?

recognition.start();
console.log("Escutando...");

recognition.onresult = (event) => {
/**O Texto fica dentro do objeto event**/
const transcript = event.results[0][0].transcript; 
reciveText.value = transcript;

/**Já faz a chamada para api my memmory */
EscutaFala(recognition.lang);

}

recognition.onerror = (event) =>
{
console.log(`Erro: ${event.error} o sistema no pode ouvir sua voz `)
}
}