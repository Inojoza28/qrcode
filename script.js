// Elementos do DOM
const download = document.querySelector(".download"); 
const dark = document.querySelector(".dark"); 
const light = document.querySelector(".light"); 
const qrContainer = document.querySelector("#qr-code"); 
const qrText = document.querySelector(".qr-text");
const shareBtn = document.querySelector(".share-btn"); 
const sizes = document.querySelector(".sizes"); 

// Adiciona event listeners aos inputs e botões
dark.addEventListener("input", handleDarkColor); 
light.addEventListener("input", handleLightColor); 
qrText.addEventListener("input", handleQRText);
sizes.addEventListener("change", handleSize); 
shareBtn.addEventListener("click", handleShare); 

// Configurações padrão do QR Code
const defaultUrl = "https://www.instagram.com/dev_inojoza_/"; 
let colorLight = "#fff", 
    colorDark = "#000", 
    text = defaultUrl, // Texto/URL padrão
    size = 300; 

// Função para atualizar a cor escura do QR Code
function handleDarkColor(e) {
    colorDark = e.target.value; // Atualiza a cor escura com o valor selecionado
    generateQRCode(); 
}

// Função para atualizar a cor clara do QR Code
function handleLightColor(e) {
    colorLight = e.target.value; // Atualiza a cor clara
    generateQRCode(); 
}

// Função para atualizar o texto/URL do QR Code
function handleQRText(e) {
    const value = e.target.value;
    text = value; // Atualiza o texto/URL com o valor inserido
    if (!value) {
        text = defaultUrl; // Se o campo estiver vazio, usa a URL padrão
    }
    generateQRCode(); 
}

// Função para gerar o QR Code
async function generateQRCode() {
    qrContainer.innerHTML = ""; // Limpa o contêiner do QR Code
    new QRCode("qr-code", { // Gera um novo QR Code com as configurações atuais
        text,
        height: size,
        width: size,
        colorLight,
        colorDark,
    });
    download.href = await resolveDataUrl(); // Atualiza o link de download com o novo QR Code gerado
}

// Função para compartilhar o QR Code
async function handleShare() {
    setTimeout(async () => { // Atraso para garantir que o QR Code foi gerado
        try {
            const base64url = await resolveDataUrl(); 
            const blob = await (await fetch(base64url)).blob();
            const file = new File([blob], "QRCode.png", {
                type: blob.type,
            });
            await navigator.share({
                files: [file], // Compartilha o QR Code como um arquivo
                title: text,
            });
        } catch (error) {
            alert("Seu navegador não suporta compartilhamento."); 
        }
    }, 100);
}

// Função para atualizar o tamanho do QR Code
function handleSize(e) {
    size = e.target.value; // Atualiza o tamanho com o valor selecionado
    generateQRCode(); // Regenera o QR Code com as novas configurações
}

// Função para converter o QR Code em Data URL
function resolveDataUrl() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const img = document.querySelector("#qr-code img"); // Seleciona a imagem do QR Code gerado
            if (img.currentSrc) {
                resolve(img.currentSrc); // Retorna a imagem em base64 se disponível
                return;
            }
            const canvas = document.querySelector("canvas"); // Seleciona o canvas (caso o QR Code seja gerado nele)
            resolve(canvas.toDataURL()); // Retorna o canvas em base64
        }, 50); // Atraso para garantir que a imagem/canvas foi carregada
    });
}

// Gera o QR Code inicial ao carregar o script
generateQRCode();
