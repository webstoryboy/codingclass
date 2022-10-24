const allMusic = [
    {
        name : "1. Average",
        artist : "Patrick Patrikios",
        img: "music_view01",
        audio: "music_audio01"
    },
    {
        name : "2. Bird Food",
        artist : "DJ Freedem",
        img: "music_view02",
        audio: "music_audio02"
    },
    {
        name : "3. Cat Shat in the Box",
        artist : "josh pan",
        img: "music_view03",
        audio: "music_audio03"
    },
    {
        name : "4. First Of 3",
        artist : "Jeremy Black",
        img: "music_view04",
        audio: "music_audio04"
    },
    {
        name : "5. Forget Me Not",
        artist : "Patrick Patrikios",
        img: "music_view05",
        audio: "music_audio05"
    },
    {
        name : "6. Getaway Powder",
        artist : "DJ Freedem",
        img: "music_view06",
        audio: "music_audio06"
    },
    {
        name : "7. Nocturne",
        artist : "Asher Fulero",
        img: "music_view07",
        audio: "music_audio07"
    },
    {
        name : "8. Our Planet",
        artist : "Jeremy Black",
        img: "music_view08",
        audio: "music_audio08"
    },
    {
        name : "9. Pluckandplay",
        artist : "Kwon",
        img: "music_view09",
        audio: "music_audio09"
    },
]

const musicWrap = document.querySelector(".music__wrap");
const musicView = musicWrap.querySelector(".music__view .img img");
const musicName = musicWrap.querySelector(".music__view .title h3");
const musicArtist = musicWrap.querySelector(".music__view .title p");
const musicAudio = musicWrap.querySelector("#main-audio");
const musicPlay = musicWrap.querySelector("#control-play");
const musicPrevBtn = musicWrap.querySelector("#control-prev");
const musicNextBtn = musicWrap.querySelector("#control-next");
const musicProgress = musicWrap.querySelector(".progress");
const musicProgressBar = musicWrap.querySelector(".progress .bar");
const musicProgressCurrent = musicWrap.querySelector(".progress .timer .current");
const musicProgressDuration = musicWrap.querySelector(".progress .timer .duration");
const musicRepeat = musicWrap.querySelector("#control-repeat");
const musicListBtn = musicWrap.querySelector("#control-list");
const musicList = musicWrap.querySelector(".music__list");
const musicListUl = musicWrap.querySelector(".music__list ul");
const musicListClose = musicWrap.querySelector(".music__list h3 .close");

let musicIndex = 1;     //현재 음악 인덱스

// 음악 재생
function loadMusic(num){
    musicName.innerText = allMusic[num-1].name;                         //뮤직 이름 로드
    musicArtist.innerText = allMusic[num-1].artist;                     //뮤직 아티스트 로드
    musicView.src = `../assets/img/${allMusic[num-1].img}.png`;         //뮤직 이미지 로드
    musicView.alt = allMusic[num-1].name;                               //뮤직 이미지 alt 로드
    musicAudio.src = `../assets/audio/${allMusic[num-1].audio}.mp3`;    //뮤직 로드
}

// 재생 버튼
function playMusic(){
    musicWrap.classList.add("paused");
    musicPlay.setAttribute("title", "정지");
    musicPlay.setAttribute("class", "stop");
    musicAudio.play();
}

// 정지 버튼
function pauseMusic(){
    musicWrap.classList.remove("paused");
    musicPlay.setAttribute("title", "재생");
    musicPlay.setAttribute("class", "play");
    musicAudio.pause();
}

// 이전 곡 듣기 버튼(
function prevMusic(){
    musicIndex == 1 ? musicIndex = allMusic.length : musicIndex--;      
    loadMusic(musicIndex);
    playMusic();
    playListMusic();
}

// 다음 곡 듣기 버튼(
function nextMusic(){
    musicIndex == allMusic.length ? musicIndex = 1 : musicIndex++;
    loadMusic(musicIndex);
    playMusic();
    playListMusic();
}

// 뮤직 진행바
musicAudio.addEventListener("timeupdate", e => {
    // console.log(e)

    const currentTime = e.target.currentTime;           //현재 재생되는 시간
    const duration = e.target.duration;                 //오디오의 총 길이
    let progressWidth = (currentTime/duration) * 100;   //전체 길에이서 현재 진행되는 시간을 백분위로 나눔

    musicProgressBar.style.width = `${progressWidth}%`;

    // 전체시간
    musicAudio.addEventListener("loadeddata", () => {
        let audioDuration = musicAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);          //전체 시간(초)을 분단위로 쪼갬
        let totalSec = Math.floor(audioDuration % 60);          //남은 초를 저장
        if(totalSec < 10) totalSec = `0${totalSec}`;            //초가 한 자릿수 일때 앞에 0을 붙임
        musicProgressDuration.innerText = `${totalMin}:${totalSec}`;    //완성된 시간 문자열을 출력
    })

    // 진행시간
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10) currentSec = `0${currentSec}`;
    musicProgressCurrent.innerText = `${currentMin}:${currentSec}`;
});

// 진행 버튼 클릭
musicProgress.addEventListener("click", (e) => {
    let progressWidth = musicProgress.clientWidth;  //진행바 전체 길이
    let clickedOffsetX = e.offsetX;                 //진행바 기준으로 측정되는 X좌표
    let songDuration = musicAudio.duration;         //오디오 전체 길이

    musicAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;   //백분위로 나눈 숫자에 다시 전체 길이를 곱해서 현재 재생값으로 바꿈
});

// 반복 버튼 클릭
musicRepeat.addEventListener("click", () => {
    let getAttr = musicRepeat.getAttribute("class");

    switch(getAttr){
        case "repeat" :
            musicRepeat.setAttribute("class", "repeat_one");
            musicRepeat.setAttribute("title", "한곡 반복");
        break;
        case "repeat_one" :
            musicRepeat.setAttribute("class", "shuffle");
            musicRepeat.setAttribute("title", "랜덤 반복");
        break;
        case "shuffle" :
            musicRepeat.setAttribute("class", "repeat");
            musicRepeat.setAttribute("title", "전체 반복");
        break;
    }
});

// 오디오가 끝나면
musicAudio.addEventListener("ended", () => {
    let getAttr = musicRepeat.getAttribute("class");

    switch(getAttr){
        case "repeat" :
            nextMusic();
        break;
        case "repeat_one" :
            playMusic();
        break;
        case "shuffle" :
            let randomIndex = Math.floor(Math.random() * allMusic.length + 1);  //랜던 인덱스 생성
            do {
                randomIndex = Math.floor(Math.random() * allMusic.length + 1);
            } while ( musicIndex == randomIndex)
            musicIndex = randomIndex;       // 현재 인덱스를 랜덤 인덱스 변경
            loadMusic(musicIndex);          // 랜덤 인덱스가 반영된 현재 인덱스 값으로 음악을 다시 로드
            playMusic();                    // 로드한 음악을 재생
        break;
    }
    playListMusic();        //재생목록 업데이트
});

// 플레이 버튼 클릭
musicPlay.addEventListener("click", () => {
    const isMusicPauesd = musicWrap.classList.contains("paused");   //음악이 재생중
    isMusicPauesd ? pauseMusic() : playMusic();
})

// 이전곡 버튼 클릭
musicPrevBtn.addEventListener("click", () => {
    prevMusic();
})

// 다음곡 버튼 클릭
musicNextBtn.addEventListener("click", () => {
    nextMusic();
})

// 뮤직 리스트 버튼
musicListBtn.addEventListener("click", () => {
    musicList.classList.add("show");
});

// 뮤직 리스트 닫기 버튼
musicListClose.addEventListener("click", () => {
    musicList.classList.remove("show");
});


// 뮤직 리스트 구현하기
for(let i=0; i<allMusic.length; i++){
    let li = `
        <li data-index="${i+1}">
            <strong>${allMusic[i].name}</strong>
            <em>${allMusic[i].artist}</em>
            <audio class="${allMusic[i].audio}" src="../assets/audio/${allMusic[i].audio}.mp3"></audio>
            <span class="audio-duration" id="${allMusic[i].audio}">재생시간</span>
        </li>
    `;

    //musicListUl.innerHTML += li;
    musicListUl.insertAdjacentHTML("beforeend", li)

    //리스트에 음악 시간 불러오기
    let liAudioDuration = musicListUl.querySelector(`#${allMusic[i].audio}`);   //리스트에서 시간을 표시할 선택자를 가져옴
    let liAudio = musicListUl.querySelector(`.${allMusic[i].audio}`);           //리스트에서 오디오를 가져옴
    liAudio.addEventListener("loadeddata", () => {
        let audioDuration = liAudio.duration;                                       //오디오 전체 길이
        let totalMin = Math.floor(audioDuration / 60);                              //전체 길이를 분 단위 쪼갬
        let totalSec = Math.floor(audioDuration % 60);                              //초 계산
        if(totalSec < 10) totalSec = `0${totalSec}`;                                //앞 자리에 0 추가
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;                      //문자열 출력
        liAudioDuration.setAttribute("data-duration", `${totalMin}:${totalSec}`);   //속성에 오디오 길이 기록
    });
}

// 뮤직 리스트를 클리하면 재생
function playListMusic(){
    const musicListAll = musicListUl.querySelectorAll("li");    //뮤직 리스트 목록

    for(let i=0; i<musicListAll.length; i++){
        let audioTag = musicListAll[i].querySelector(".audio-duration");

        if(musicListAll[i].classList.contains("playing")){                  
            musicListAll[i].classList.remove("playing");                //클래스가 존재하면 삭제
            let adDuration = audioTag.getAttribute("data-duration");    //오디오 길이 값 가져오기
            audioTag.innerText = adDuration;                            //오디오 길이 값 출력
        }

        if(musicListAll[i].getAttribute("data-index") == musicIndex){   //현재 뮤직인덱스랑 리스트 인덱스 값이 같으면
            musicListAll[i].classList.add("playing");                   //클래스 playing 추가
            audioTag.innerText = "재생중";                                //재생중일 경우 재생중 멘트 추가
        }
        musicListAll[i].setAttribute("onclick", "clicked(this)");
    }
}

// 뮤직 리스트를 클릭하면...
function clicked(el){
    let getLiIndex = el.getAttribute("data-index");     //클릭한 리스트의 인덱스값을 저장
    musicIndex = getLiIndex;                            //클릭한 인덱스 값을 뮤직 인덱스 저장
    loadMusic(musicIndex);                              //해당 인덱스 뮤직 로드
    playMusic();                                        //음악 재생         
    playListMusic();                                    //음악 리스트 업데이트
}

window.addEventListener("load", () => {
    loadMusic(musicIndex);      //음악 재생
    playListMusic();            //리스트 초기화
})
