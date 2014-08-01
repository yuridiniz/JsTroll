/*
* Variável que verifica se toda a trolagem esta ativa ou não
* TrollDelay: Tempo em minutos para habilitar a proxima trolagem
*/
var JS_VERSION = 4;
var Online = true;
var TrollDelay = 20;

/*
* Array para verificar o metodo para cada site
* url: Teste para verificar se o usuário está no site esperado
* metodo: Referencia do método que será chamado
*/
var listaSites = [
    {url: "facebook.com", metodo : Facebook}
]

/*
* Inicia toda a trolagem
* esse método é responsável por verificar qual url o usuário está
* e qual método corresponde a url
* esse método é chamado no load de cada pagina
*/
function StartTroll() {

//Teste de cache
    if (!TrollagemDisponivel())
        return;

    localStorage.setItem("data", Date.parse(new Date()).toString())

    var local = window.location.href;

    for (var i = 0; i < listaSites.length; i++) {
        if (local.indexOf(listaSites[i].url) != -1) {
            listaSites[i].metodo.call();

            break;
        }
    }
}

/*
* Esse método verifica a hora da ultima trolagem, caso seja muito recente,
* não permite que outra se execute
*/
function TrollagemDisponivel() {
    if (!Online)
        return false;

    var siteDisponiveis = false;
    var local = window.location.href;

    for (var i = 0; i < listaSites.length; i++) {
        if (local.indexOf(listaSites[i].url) != -1) {
            siteDisponiveis = true
        }
    }
 
    if(!siteDisponiveis)
	    return false

    var data = localStorage.getItem("data");

    if (!data)
        return true;


    delayUltimoAcesso = parseInt(data) + (1000 * 60 * TrollDelay)

    if(Date.now() > delayUltimoAcesso)
        return true

    return false;
}


/*
* Método para trolagem do facebook
* Esse método altera a imagem do usuário para uma imagem selecionada
*/
function Facebook() {
    try {
        console.log("retry")
        var arrUrl = [];
        var arrObjetoImagem = [];

        var endereco = document.querySelector("#blueBarNAXAnchor [title='Linha do Tempo']").getAttribute("href");

        var newImage = "https://raw.githubusercontent.com/yuridiniz/JsTroll/master/Analytic/buzz.jpg";
        var nome = document.querySelector(".fbxWelcomeBoxName") || document.querySelector("._8_2");
        if (!nome)
            nome = document.querySelector("._2dpb");

        var srcBusca = "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xfa1";
        var listaImagens = document.querySelectorAll("[src*='" + srcBusca + "']");

        for (var i = 0; i < listaImagens.length; i++) {
            var src = listaImagens[i].getAttribute("src");
            if (listaImagens[i].getAttribute("alt").indexOf(nome.innerText) == 0 && arrUrl.indexOf(src) == -1)
                arrUrl.push(src);
        }

        for (var p = 0; p < arrUrl.length; p++) {
            var imagensEmUmTamanho = document.querySelectorAll("[src*='" + arrUrl[p] + "']");

            for (var a = 0; a < imagensEmUmTamanho.length; a++) {
                arrObjetoImagem.push({ obj: imagensEmUmTamanho[a], img: imagensEmUmTamanho[a].getAttribute("src") });

                var pixel = imagensEmUmTamanho[a].clientWidth;
                imagensEmUmTamanho[a].setAttribute("src", newImage);
                imagensEmUmTamanho[a].style.width = pixel + "px";
            }
        }

        var listaImagensPorParent = document.querySelectorAll("a[href*='" + endereco + "'] img");

        for (var b = 0; b < listaImagensPorParent.length; b++) {
            arrObjetoImagem.push({ obj: listaImagensPorParent[b], img: listaImagensPorParent[b].getAttribute("src") });

            var pixel = listaImagensPorParent[b].clientWidth;
            listaImagensPorParent[b].setAttribute("src", newImage);
            listaImagensPorParent[b].style.width = pixel + "px";
        }

        setTimeout(function() {

alert("voltando")
            for (var s = 0; s < arrObjetoImagem.length; s++) {
                arrObjetoImagem[s].obj.setAttribute("src", arrObjetoImagem[s].img);

            }
        }, 1000);

    } catch (e) {

        setTimeout(function () {
            console.log("Error")
            Facebook();
        },10000)
    }
}

/*
* Inicia a brincadeira
*/
StartTroll();