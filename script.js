
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
const EscolherEscrita = document.querySelector("#getIdioma");

let contador = 0;
let i = 0;

/*função que muda a imagem ao passar o mouse por cima e adiciona e remove animação da imagem do google*/
function EntrarSair_Google(Value,adc_rmv)
{
getTranslate.src = Value == "Entrar" ? ImgGoogleHover : ImgGoogle;

adc_rmv == "add" ? 
getTranslate.classList.add("animationGoogle")
:
getTranslate.classList.remove("animationGoogle")
}
 
/*Função que chama um background e uma imagem de um microfone e a retira */
function EntrarSair_Micro(enter_leave)
{

if(enter_leave == "Entrar" || enter_leave == "Ativar")
{
getMicro.src = ImgMicroHover;
getMicro.classList.add("animationMicro");
microButton.classList.add("BackgroundMicro");
}
else if(enter_leave == "Sair")
{
getMicro.src = ImgMicro;
getMicro.classList.remove("animationMicro");
microButton.classList.remove("BackgroundMicro");
}

}

/**Variáveis para pegar valores */
let getValue;
let getEscrita;

let Active = "Ativar";
let Enter = "Entrar";
let Leave = "Sair";

let controlStart = "Start"; 

microButton.addEventListener("mouseenter",() => EntrarSair_Micro(Enter));
microButton.addEventListener("mouseleave",() => EntrarSair_Micro(Leave));
 
/**Escolher em qual idioma vai traduzir */
EscolheOption.addEventListener("change",(e) => getValue = [e.target.value])

/**Escolher em qual idioma que vai escrever*/
EscolherEscrita.addEventListener("change",(e) => getEscrita = [e.target.value])

/**Função que traduz escrita */
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

/**Função que coloca fala do usuário dentro do campo de tradução*/
async function EscutaFala(lenguage)
{
try {
const getURL = await fetch(`https://api.mymemory.translated.net/get?q=${valueInText.value}!&langpair=${lenguage||"pt-br"}|${getValue||"en"}`);
const transformURL = await getURL.json();
const getTextTransform = transformURL.responseData.translatedText;
reciveText.innerText = getTextTransform;
}
catch(err) 
{
console.log(`Erro de reconhecimento de fala ${err}`)
}
}

/**Função que executa microfone para escutar usuário*/
function ExecutarMicro(){

getMicro.src = ImgMicroHover;
getMicro.classList.add("notSpeak");
microButton.classList.add("BackgroundMicro");
microButton.classList.add("MovimentosCirculares");

Enter = "";
Leave = "";

i++

let Live = setInterval(() => {
 
if(i === 1 && contador < 9)
{
contador++;
 
getMicro.src = ImgMicroHover;
getMicro.classList.add("notSpeak");
microButton.classList.add("BackgroundMicro");
microButton.classList.add("MovimentosCirculares");

controlStart = "Stop";
}
else 
{
i = 0;
contador = 0;
clearInterval(Live);
getMicro.src = ImgMicro;
getMicro.classList.remove("notSpeak");
microButton.classList.remove("BackgroundMicro");
microButton.classList.remove("MovimentosCirculares");
Enter = "Entrar";
Leave = "Sair"
controlStart = "Start"
}

},1000)

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition(); // Reconhecimento de Fala

recognition.lang = `${getEscrita||"pt-br"}`; // Define a Lingua de Entrada(english)
recognition.interimResults = false; //Define se quer resultados parciais enquanto fala
recognition.maxAlternatives = 1; //Quantidades de opções de retornos?

if(controlStart === "Start")
{
recognition.start();
}
else 
{
recognition.abort();
}

recognition.onresult = (event) => {

/**O Texto fica dentro do objeto event**/
const transcript = event.results[0][0].transcript; 

valueInText.value = transcript;
/**Já faz a chamada para api my memmory */
EscutaFala(recognition.lang);
}

recognition.onerror = (event) =>
{
console.log(`Erro: ${event.error} o sistema não pode ouvir sua voz`);
}

}