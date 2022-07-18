// img tag
let img = document.querySelector("#imageUploaded");

// to append childs
const container = document.querySelector(".container");

// to get file dinamically
const imageUploaded = document.querySelector("#img_upload");

// to show information
const resultParagraph = document.createElement("p");

const loading = document.createElement("p");

const spinner = document.createElement("span");
// class that adds the spinner style
spinner.className = 'loader';

loading.innerText = "Carregando o modelo...";

document.addEventListener("DOMContentLoaded", () => {
    
    // initially it's loading the result
    container.appendChild(loading);
    container.append(spinner);

    imageUploaded.addEventListener('change', (event) => {
        // if there's change, another image was inserted, then
        // loading.innerText = "Carregando..."
        container.append(loading);
        container.append(spinner);
        
        if (container.contains(resultParagraph))
            container.removeChild(resultParagraph);

        const file = event.target.files[0];
        // para ler o arquivo
        const reader = new FileReader();
        // When reader is ready
        reader.addEventListener("load", () => {
            const dataUrl = reader.result;
            img.src = dataUrl;
            classify();
        });

        reader.readAsDataURL(file);
    });

    console.log('ml5 version:', ml5.version);

    classifier = ml5.imageClassifier('MobileNet', () => {
        console.log("Modelo carregado");
        loading.innerText = "Selecione uma imagem para classificação"
        if(container.contains(spinner))
            container.removeChild(spinner);
    });

    const classify = () => {
        // para usar o tamanho original da imagem ao inves da redimensionada
        const imgCopy = document.createElement("img");
        imgCopy.src = img.src;
        imgCopy.height = img.naturalHeight;
        imgCopy.width = img.naturalWidth;
        
        classifier.classify(imgCopy, (err, results) => {
            
            if (err) {
                console.error(err);
                return;
            }

            if (results) {
                // if there's result, then remove loading
                if (container.contains(spinner))
                    container.removeChild(spinner);

                if (container.contains(loading))
                    container.removeChild(loading);

                console.log(results);
            }

            // showing label and confidence
            
            resultParagraph.style.fontWeight = "bold"
            resultParagraph.innerHTML = "<span>Label:</span> " 
                                            + results[0].label 
                                            + "<br/> <span>Confiança:</span> " 
                                            + Math.round(results[0].confidence * 100) + "%";
            
            

            container.appendChild(resultParagraph);
        });
    }
});