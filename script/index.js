console.log('connected to server')

function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username) {
        Swal.fire({
            icon: "error",
            title: "Invalid username.",
            text: "Write correct username",
          });
        return;
    }
    if (password !== '123456') {
        Swal.fire({
            icon: "error",
            title: "Wrong password",
            text: "Write correct password",
          });
        return;
    }

    Swal.fire({
        title: "Success",
        text: "You logged in successfully",
        icon: "success"
    });

    // Hide Banner
    document.getElementById('banner').classList.add('hidden');

    // Show Navbar, Vocabulary, FAQ
    document.getElementById('nav-bar').classList.remove('hidden');
    document.getElementById('learn').classList.remove('hidden');
    document.getElementById('faq').classList.remove('hidden');
}
function handleLogout() {

    Swal.fire({
        title: "Success",
        text: "You logged out successfully",
        icon: "success"
    });

    // Show Navbar, Vocabulary, FAQ
    document.getElementById('nav-bar').classList.add('hidden');
    document.getElementById('learn').classList.add('hidden');
    document.getElementById('faq').classList.add('hidden');

    document.getElementById('banner').classList.remove('hidden');
}

const showLoader = () => {
    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
};
const hideLoader = () => {
    document.getElementById("loader").classList.add("hidden");
    document.getElementById("word-container").classList.remove("hidden");
};
function loadLessons() {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(data => {
            displayLessons(data.data)
        })

}
function removeActiveClass() {
    const activeButtons = document.getElementsByClassName("active");
    for (let btn of activeButtons) {
      btn.classList.remove("active");
    }
  }
function displayLessons(lessons) {

    const lessonContainer = document.getElementById('lesson-container')

    lessonContainer.classList.add('flex', 'flex-wrap', 'gap-4', 'justify-center');

    for(let les of lessons){
        const lessonDiv = document.createElement('div')
        lessonDiv.classList.add('lesson-container')
        lessonDiv.innerHTML = `

        <button id="btn-${les.id}" onClick="lessonLoader(${les.id})" class="btn btn-outline btn-primary text-lg font-semibold"><i class="ti ti-book"></i>Leasson-${les.level_no}</button>

        `
        lessonContainer.append(lessonDiv)
    }
}


const lessonLoader = (id) => {
    removeActiveClass();

    const lessonBtn = document.getElementById(`btn-${id}`);
    if (lessonBtn) {
        lessonBtn.classList.add('active');
    }

    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = '';

    console.log(lessonBtn)

    const lesson_no = lessonBtn.innerText.split('-')[1] ;
    loadWords(lesson_no);
};

function loadWords(level_no) {
    showLoader();
    fetch(`https://openapi.programming-hero.com/api/level/${level_no}`)
        .then(res => res.json())
        .then(data => {
            displayWords(data.data);
        })
}

const loadmodal = (id) => {
    console.log('Loading modal')
    fetch(`https://openapi.programming-hero.com/api/word/${id}`)
        .then(res => res.json())
        .then(data => displayWordDetail(data.data))
}

const displayWordDetail = (word) => {
    console.log(word)
    document.getElementById('word_detail').showModal()
    const wordDetailsContainer = document.getElementById('word-detail-container')
    wordDetailsContainer.innerHTML = `
        <div class="border-2 border-solid border-[#EDF7FF] p-6 rounded-lg">
            <h3 class="text-3xl font-bold mb-6">${word.word}(<i class="ti ti-microphone"></i>:${word.pronunciation})</h3>
            <p class="font-bold text-xl mb-2">Meaning</p>
            <p class="text-xl">${word.meaning || "No meaning available"}</p>

            <h1 class="font-bold text-xl mt-4 mb-2">Example</h1>
            <p class="text-xl font-normal">${word.sentence || "No example available"}</p>
            <p class="font-semibold text-xl mt-4">সমার্থক শব্দ গুলো</p>
            <div class="flex gap-4 mt-2 text-xl flex-wrap">
                ${word.synonyms && word.synonyms.length > 0
                    ? word.synonyms.map(syn => `<button class="btn text-xl font-normal">${syn}</button>`).join('') : "<p>No synonyms available</p>"
                }
            </div>
        </div>

    `
}

const displayWords = (words) => {
    const wordContainer = document.getElementById('word-container')
    wordContainer.innerHTML = ''

    if(words.length === 0){

        const wordDiv = document.createElement('div')
        wordDiv.classList.add('col-span-3')
        wordDiv.innerHTML = `
        <div class="flex flex-col gap-6 bg-gray-100 items-center text-center rounded-xl py-12 justify-center mt-8">
            <img class="size-28" src="assets/alert-error.png" alt="">
            <p>এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h1 class="font-bold text-3xl">নেক্সট Lesson এ যান</h1>
        </div>
        `
        wordContainer.append(wordDiv);
        hideLoader();
        return;
    }
    words.forEach(word => {

        const wordDiv = document.createElement('div')
        wordDiv.innerHTML = `
        <div class="p-8 shadow-lg rounded-lg font-semibold">
                <div class="text-center flex flex-col gap-2">
                    <h1 class="text-3xl mb-2">${word.word}</h1>
                    <p class="text-lg">Meaning / Pronunciation</p>
                    <h1 class="mt-4 text-3xl text-gray-700">${word.meaning || "No meaning available"} / ${word.pronunciation}</h1>
                </div>
                <div class="flex justify-between mt-4">
                    <div onClick="loadmodal(${word.id})" class="hover:bg-gray-200 bg-gray-100 p-4 rounded-lg flex gap-2 cursor-pointer">
                        <i class="ti ti-info-circle"></i>
                    </div>
                    <div onClick=pronounceWord('${word.word}') class="hover:bg-gray-200 bg-gray-100 p-4 rounded-lg flex gap-2 cursor-pointer">
                        <i class="ti ti-volume"></i>
                    </div>
                </div>
            </div>
        `
        wordContainer.append(wordDiv)
    })
    hideLoader()
}
function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-EN';
    window.speechSynthesis.speak(utterance);
}

loadLessons()
