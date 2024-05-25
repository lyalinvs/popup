//Auhtor: Женя Андриканич
//https://www.youtube.com/watch?v=qoO1ZNi1LyI

const popupLinks = document.querySelectorAll('.js-popup-link'); //popup будет открываться по ссылке где есть class="popup-link"
const body = document.querySelector('body'); //нужно чтобы внутри body блокировать скролл
const lockPadding = document.querySelectorAll('.js-lock-padding'); //это для фиксированных объектов (прописать если нужно например в шапку (header))

let unlock = true; //чтобы не было двойных нажатий

const timeout = 800; //эта цифра указана в свойстве transition класса .popup

//бегаем по ссылкам и ищем класс popupLink
if (popupLinks.length > 0){
    for (let index = 0; index < popupLinks.length; index++){
        const popupLink = popupLinks[index];
        popupLink.addEventListener("click", function(e){ //и там где есть popupLink вешаем click
            const popupName = popupLink.getAttribute('href').replace('#', ''); //в ссылках в href убираем #
            const curentPopup = document.getElementById(popupName); //и в переменную curentPopup получаю то что находится в href только без #
            popupOpen(curentPopup); //и далее это название отправляю в функцию popupOpen
            e.preventDefault(); //этим свойством запрещаю перезагружать страницу (обновлять)
        });
    }
}

/*у объекта где есть класс js-close-popup по клике по нему закрвается popup (ссылка, кнопка либо ещё что-нибудь)*/
const popupCloseIcon = document.querySelectorAll('.js-close-popup');
if (popupCloseIcon.length > 0){
    for (let index = 0; index < popupCloseIcon.length; index++){
        const el = popupCloseIcon[index];
        el.addEventListener('click', function(e){ //вешаем клик на этот объект
            popupClose(el.closest('.popup')); //ищет родителя с классом popup и закрывает его
           e.preventDefault(); //этим свойством запрещаю перезагружать страницу (обновлять)
        });
    }
}

function popupOpen(curentPopup){ //функция открытия popup
    if (curentPopup && unlock){ //проверяет есть ли объект id="popup" и открыт ли он unlock = true (вначале прописан)
        const popupActive = document.querySelector('.popup.js-open');
        if (popupActive){
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }
        curentPopup.classList.add('js-open'); //там где id="popup" добавляется класс js-open
        curentPopup.addEventListener("click", function(e){
            if(!e.target.closest('.popup__content')){ //при клике внутри popup__content ничего не происходит
                popupClose(e.target.closest('.popup')); //а если кликнуть за пределы popup то popup закроется
            }
        });
    }
}
function popupClose(popupActive, doUnlock = true){
    if (unlock){
        popupActive.classList.remove('js-open');
        if(doUnlock){
            bodyUnLock();
        }
    }
}

function bodyLock(){ /*высчитывается размер скролла (при открытии popup что бы не было двиганья)*/
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

    if (lockPadding.length > 0){
        for (let index = 0; index < lockPadding.length; index++){
            const el = lockPadding[index];
            el.style.paddingRight = lockPaddingValue; //эту переменную убрать
        }
    }
    body.style.paddingRight = lockPaddingValue; //и эту переменную убрать можно увидеть дёрганье при появлении popup
    body.classList.add('js-lock'); //по этому классу (lock) убирается скролл (прописывается этот класс в body)

    unlock = false;
    setTimeout(function(){
        unlock = true;
    }, timeout);
}

function bodyUnLock(){
    setTimeout(function(){
        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++){
                const el = lockPadding[index];
                el.style.paddingRight = '0px';
            }
        }
        body.style.paddingRight = '0px';
        body.classList.remove('js-lock');
    }, timeout);

    unlock = false;
    setTimeout(function(){
        unlock = true;
    }, timeout);
}
/*
//по esc убирается popup
document.addEventListener('keydown', function(e){
    if(e.which === 27){ //which устарел поэтому не работает
        const popupActive = document.querySelector('.popup.open');
    }
});
*/
/*далее 2 функции для IE11*/
(function(){
    if (!Element.prototype.closest){
        Element.prototype.closest = function(css){
            var node = this;
            while (node){
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        };
    }
})();
(function(){
    if (!Element.prototype.matches){
        Element.prototype.matches = Element.prototype.matchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector;
    }
})();