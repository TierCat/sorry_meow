// ========================================
// STATE
// ========================================

let knocks = 0;
let rejectCount = 0;
let apologyAccepted = false;
let cursorTick = 0;

// ระบบแมวร้องไห้
let cryTimer = null;
let isCrying = false;

// ระบบ YouTube
let youtubePlayer = null;
let youtubeReady = false;
let musicMuted = false;

// จุดเริ่มเพลง
// 1:20 = 80 วินาที
const MUSIC_START_TIME = 80;


// ========================================
// DOM ELEMENTS
// ========================================

const door = document.getElementById("door");
const doorScene = document.getElementById("doorScene");
const mainContent = document.getElementById("mainContent");

const musicToggle = document.getElementById("musicToggle");
const catImage = document.getElementById("catImage");

const mainQuestion = document.getElementById("mainQuestion");
const subQuestion = document.getElementById("subQuestion");

const firstButtons = document.getElementById("firstButtons");
const apologyButtons = document.getElementById("apologyButtons");

const yesBtn = document.getElementById("yesBtn");
const notAngryBtn = document.getElementById("notAngryBtn");

const acceptBtn = document.getElementById("acceptBtn");
const rejectBtn = document.getElementById("rejectBtn");

const scrollCue = document.getElementById("scrollCue");
const letterSection = document.getElementById("letterSection");

const backToTopBtn = document.getElementById("backToTopBtn");
const exitBtn = document.getElementById("exitBtn");

const endScene = document.getElementById("endScene");
const heartRain = document.getElementById("heartRain");


// ========================================
// ข้อความสุ่ม
// ========================================

const notAngryMessages = [
    "รู้น้าว่างอน",
    "ให้โอกาสเค้าง้อนะคะ",
    "เค้าผิดไปแล้ว",
    "ไม่โกหกสิ",
    "หึหึ เค้ารู้น่าาา"
];

const rejectMessages = [
    "รับหน้าน้าาา",
    "กดรับนะคับๆๆ",
    "ตั้งใจมาง้อจริงๆงับ"
];


// ========================================
// YOUTUBE PLAYER
// ========================================

function onYouTubeIframeAPIReady() {

    youtubePlayer = new YT.Player("youtubePlayer", {

        height: "1",
        width: "1",

        videoId: "0-hPRE6-muU",

        playerVars: {
            controls: 0,
            disablekb: 1,
            fs: 0,
            playsinline: 1,
            rel: 0
        },

        events: {

            // เตรียม Player ให้พร้อมตั้งแต่ต้น
            onReady: function () {

                youtubeReady = true;

                youtubePlayer.setVolume(50);

                // เตรียม Player แบบไม่มีเสียง
                youtubePlayer.mute();

                // เริ่มวิดีโอแบบเงียบ
                // เพื่อให้ Player ถูก initialize
                youtubePlayer.playVideo();


                // รอสั้น ๆ แล้วหยุดไว้ที่ 1:20
                setTimeout(() => {

                    youtubePlayer.pauseVideo();

                    youtubePlayer.seekTo(
                        MUSIC_START_TIME,
                        true
                    );

                }, 400);

            },


            // ถ้าเพลงจบหลังจากรับคำขอโทษแล้ว
            // ให้เล่นวนใหม่จาก 1:20
            onStateChange: function (event) {

                if (
                    event.data === YT.PlayerState.ENDED &&
                    apologyAccepted
                ) {

                    youtubePlayer.seekTo(
                        MUSIC_START_TIME,
                        true
                    );

                    youtubePlayer.playVideo();

                }

            }

        }

    });

}


// ========================================
// เริ่มต้นเว็บไซต์
// ========================================

document.body.classList.add("door-mode");

createHeartRain();


// ========================================
// เคาะประตู
// ========================================

door.addEventListener("click", () => {

    door.classList.remove("knock");

    void door.offsetWidth;

    door.classList.add("knock");

    knocks++;


    // เคาะครบ 2 ครั้ง
    if (knocks === 2) {

        door.classList.add("open");


        setTimeout(() => {

            // ซ่อนหน้าประตู
            doorScene.classList.add("hidden");

            // แสดงหน้าหลัก
            mainContent.classList.remove("hidden");

            // เปิด Scroll
            document.body.classList.remove("door-mode");


            // เปิดฝนหัวใจ
            if (heartRain) {

                heartRain.classList.add("active");

            }


            // หัวใจพุ่ง
            createLoveBurst(
                28,
                false
            );

        }, 900);

    }

});


// ========================================
// กด "ไม่ใช่"
// ========================================

notAngryBtn.addEventListener("click", () => {

    mainQuestion.textContent =
        randomItem(
            notAngryMessages
        );


    pulseText(
        mainQuestion
    );

});


// ========================================
// กด "ใช่"
// ========================================

yesBtn.addEventListener("click", async () => {

    // เปลี่ยนข้อความ
    mainQuestion.textContent =
        "เค้ามาง้ออะ";


    subQuestion.textContent =
        "เค้าขอโทษได้มุ้ยย";


    subQuestion.classList.remove(
        "hidden"
    );


    // ซ่อน ใช่ / ไม่ใช่
    firstButtons.classList.add(
        "hidden"
    );


    // แสดง รับ / ไม่รับ
    apologyButtons.classList.remove(
        "hidden"
    );


    // เปลี่ยนเป็นแมวถือดอกไม้
    await changeCat(
        "catflower.png"
    );


    // หัวใจเล็ก ๆ
    createLoveBurst(
        14,
        false
    );

});


// ========================================
// กด "ไม่รับ"
// ========================================

rejectBtn.addEventListener("click", async () => {

    rejectCount++;


    // ========================================
    // เปลี่ยนข้อความ
    // ========================================

    if (rejectCount >= 5) {

        mainQuestion.textContent =
            "จะง้อจนกว่าจะหายงอนเลย";

    } else {

        mainQuestion.textContent =
            randomItem(
                rejectMessages
            );

    }


    pulseText(
        mainQuestion
    );


    // ========================================
    // สั่นการ์ด
    // ========================================

    const card =
        document.querySelector(
            ".card"
        );


    if (card) {

        card.classList.remove(
            "shake-soft"
        );


        void card.offsetWidth;


        card.classList.add(
            "shake-soft"
        );


        setTimeout(() => {

            card.classList.remove(
                "shake-soft"
            );

        }, 350);

    }


    // ========================================
    // เอฟเฟกต์น้ำตา
    // ========================================

    createTears();


    // ========================================
    // เปลี่ยนเป็นแมวร้องไห้
    // ========================================

    // ถ้าร้องอยู่แล้ว
    // จะไม่เปลี่ยนรูปซ้ำ
    // ป้องกันอาการกระพริบ

    if (!isCrying) {

        isCrying = true;


        await changeCat(
            "catflowercry.png"
        );

    }


    // ========================================
    // รีเซ็ต Timer เก่า
    // ========================================

    if (cryTimer) {

        clearTimeout(
            cryTimer
        );

    }


    // ========================================
    // รอ 2 วินาทีหลังการกดครั้งล่าสุด
    // แล้วกลับเป็นแมวถือดอกไม้
    // ========================================

    cryTimer = setTimeout(

        async () => {

            await changeCat(
                "catflower.png"
            );


            isCrying = false;

            cryTimer = null;

        },

        2000

    );


    // ========================================
    // กดไม่รับหลายครั้ง
    // ปุ่มรับค่อย ๆ ใหญ่ขึ้น
    // ========================================

    if (rejectCount >= 3) {

        const scale =
            Math.min(

                1 +
                (rejectCount - 2)
                * 0.04,

                1.16

            );


        acceptBtn.style.transform =
            `scale(${scale})`;

    }

});


// ========================================
// กด "รับคำขอโทษ"
// เพลงจะเริ่มตรงนี้
// ========================================

acceptBtn.addEventListener("click", () => {

    apologyAccepted = true;


    // ========================================
    // หยุดระบบแมวร้องไห้
    // ========================================

    if (cryTimer) {

        clearTimeout(
            cryTimer
        );

        cryTimer = null;

    }


    isCrying = false;


    // ========================================
    // เล่นเพลง YouTube
    // ทำงานตอนกด "รับคำขอโทษ" เท่านั้น
    // ========================================

    if (youtubePlayer) {

        try {

            // ไปที่ 1:20
            youtubePlayer.seekTo(
                MUSIC_START_TIME,
                true
            );


            // ตั้งเสียง 50%
            youtubePlayer.setVolume(
                50
            );


            // เปิดเสียง
            youtubePlayer.unMute();


            // เล่นเพลง
            youtubePlayer.playVideo();


            // อัปเดตสถานะปุ่มเสียง
            musicMuted = false;


            if (musicToggle) {

                musicToggle.textContent =
                    "🔊";

            }

        } catch (error) {

            console.log(
                "YouTube Player ยังไม่พร้อม",
                error
            );

        }

    }


    // ========================================
    // หัวใจพุ่ง
    // ========================================

    createLoveBurst(
        35,
        false
    );


    // ========================================
    // เปิดส่วนคำขอโทษและรูป Polaroid
    // ========================================

    if (letterSection) {

        letterSection.classList.remove(
            "hidden"
        );

    }


    // ========================================
    // แสดงลูกศรให้เลื่อนลง
    // ========================================

    if (scrollCue) {

        scrollCue.classList.remove(
            "hidden"
        );

    }


    // ========================================
    // เปิด Scroll Reveal
    // ========================================

    setTimeout(() => {

        document
            .querySelectorAll(
                ".reveal"
            )
            .forEach(element => {

                revealObserver.observe(
                    element
                );

            });

    }, 50);


    // ========================================
    // Auto Scroll ลงนิดหนึ่ง
    // ========================================

    setTimeout(() => {

        smoothScrollBy(
            220,
            1400
        );

    }, 700);

});


// ========================================
// ปุ่มเปิด / ปิดเสียง
// ========================================

if (musicToggle) {

    musicToggle.addEventListener(
        "click",
        () => {

            // ถ้า Player ยังไม่มี
            if (!youtubePlayer) {

                return;

            }


            // สลับสถานะ
            musicMuted =
                !musicMuted;


            // ========================================
            // ปิดเสียง
            // ========================================

            if (musicMuted) {

                youtubePlayer.mute();


                musicToggle.textContent =
                    "🔇";

            }


            // ========================================
            // เปิดเสียง
            // ========================================

            else {

                youtubePlayer.unMute();


                youtubePlayer.setVolume(
                    50
                );


                musicToggle.textContent =
                    "🔊";

            }

        }
    );

}


// ========================================
// กลับขึ้นด้านบน
// ========================================

backToTopBtn.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });


        waitUntilTop();

    }
);


// ========================================
// กด "ออก"
// ========================================

exitBtn.addEventListener(
    "click",
    () => {

        // แสดงหน้าจบ
        endScene.classList.remove(
            "hidden"
        );


        // หยุดเพลง
        if (youtubePlayer) {

            youtubePlayer.stopVideo();

        }


        // รอ 2 วินาที
        // แล้วพยายามปิดหน้าเว็บ
        setTimeout(() => {

            window.close();

        }, 2000);

    }
);


// ========================================
// เปลี่ยนรูปแมว
// ========================================

async function changeCat(src) {

    const currentSrc =
        catImage.getAttribute(
            "src"
        );


    // ถ้ารูปเดียวกัน
    // ไม่เปลี่ยนซ้ำ
    if (currentSrc === src) {

        return;

    }


    // Fade Out
    catImage.classList.add(
        "switching"
    );


    await wait(
        260
    );


    // เปลี่ยนรูป
    catImage.src =
        src;


    // Fade In
    catImage.onload = () => {

        catImage.classList.remove(
            "switching"
        );

    };


    // กรณี Browser Cache รูป
    if (catImage.complete) {

        catImage.classList.remove(
            "switching"
        );

    }

}


// ========================================
// RANDOM
// ========================================

function randomItem(items) {

    return items[

        Math.floor(

            Math.random()
            * items.length

        )

    ];

}


// ========================================
// ANIMATION ข้อความ
// ========================================

function pulseText(element) {

    element.animate(

        [

            {
                transform:
                    "scale(.96)",

                opacity:
                    .65
            },

            {
                transform:
                    "scale(1.04)",

                opacity:
                    1
            },

            {
                transform:
                    "scale(1)",

                opacity:
                    1
            }

        ],

        {

            duration:
                350,

            easing:
                "ease-out"

        }

    );

}


// ========================================
// WAIT
// ========================================

function wait(ms) {

    return new Promise(

        resolve =>

            setTimeout(
                resolve,
                ms
            )

    );

}


// ========================================
// CUSTOM SMOOTH SCROLL
// ========================================

function smoothScrollBy(
    distance,
    duration
) {

    const start =
        window.scrollY;


    const startTime =
        performance.now();


    function easeInOutCubic(t) {

        return t < 0.5

            ? 4 * t * t * t

            : 1 -
                Math.pow(
                    -2 * t + 2,
                    3
                ) / 2;

    }


    function animate(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;


        const progress =
            Math.min(

                elapsed /
                duration,

                1

            );


        const easedProgress =
            easeInOutCubic(
                progress
            );


        window.scrollTo(

            0,

            start +
            distance *
            easedProgress

        );


        if (progress < 1) {

            requestAnimationFrame(
                animate
            );

        }

    }


    requestAnimationFrame(
        animate
    );

}


// ========================================
// หัวใจพุ่ง
// ========================================

function createLoveBurst(
    amount = 40,
    big = false
) {

    const icons = [

        "💖",
        "💕",
        "💗",
        "🌷",
        "💝"

    ];


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "floating-item";


        item.textContent =
            randomItem(
                icons
            );


        item.style.left =
            `${window.innerWidth / 2}px`;


        item.style.top =
            `${window.innerHeight / 2}px`;


        item.style.fontSize =
            `${
                big
                    ? 24 +
                      Math.random() * 28

                    : 20 +
                      Math.random() * 18
            }px`;


        const spread =
            big
                ? 1100
                : 800;


        const x =
            (
                Math.random() -
                .5
            )
            * spread;


        const y =
            (
                Math.random() -
                .5
            )
            *
            (
                big
                    ? 850
                    : 600
            );


        const rotate =
            `${
                Math.random()
                * 720
                - 360
            }deg`;


        item.style.setProperty(
            "--x",
            `${x}px`
        );


        item.style.setProperty(
            "--y",
            `${y}px`
        );


        item.style.setProperty(
            "--rotate",
            rotate
        );


        document.body.appendChild(
            item
        );


        setTimeout(() => {

            item.remove();

        }, 2800);

    }

}


// ========================================
// ฝนหัวใจ
// ========================================

function createHeartRain() {

    if (!heartRain) {

        return;

    }


    for (
        let i = 0;
        i < 22;
        i++
    ) {

        const heart =
            document.createElement(
                "span"
            );


        heart.className =
            "rain-heart";


        heart.textContent =
            "♥";


        heart.style.left =
            `${
                Math.random()
                * 100
            }%`;


        heart.style.fontSize =
            `${
                10 +
                Math.random()
                * 20
            }px`;


        heart.style.animationDuration =
            `${
                8 +
                Math.random()
                * 10
            }s`;


        heart.style.animationDelay =
            `${
                -Math.random()
                * 14
            }s`;


        heartRain.appendChild(
            heart
        );

    }

}


// ========================================
// น้ำตาแมว
// ========================================

function createTears() {

    const rect =
        catImage
            .getBoundingClientRect();


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const tear =
            document.createElement(
                "div"
            );


        tear.className =
            "tear-drop";


        tear.textContent =
            "💧";


        tear.style.left =
            `${
                rect.left +
                rect.width *
                (
                    .35 +
                    Math.random()
                    * .3
                )
            }px`;


        tear.style.top =
            `${
                rect.top +
                rect.height
                * .35
            }px`;


        tear.style.animationDelay =
            `${
                Math.random()
                * .25
            }s`;


        document.body.appendChild(
            tear
        );


        setTimeout(() => {

            tear.remove();

        }, 1500);

    }

}


// ========================================
// กลับถึงด้านบน
// ========================================

function waitUntilTop() {

    const check =
        setInterval(

            async () => {

                if (
                    window.scrollY <= 8
                ) {

                    clearInterval(
                        check
                    );


                    // แมวยิ้ม
                    await changeCat(
                        "catflowersmile.png"
                    );


                    // เปลี่ยนข้อความ
                    mainQuestion.textContent =
                        "เย้ ดีกันแล้วนะ";


                    subQuestion.textContent =
                        "ขอบคุณที่รับคำขอโทษเค้าน้า";


                    subQuestion.classList.remove(
                        "hidden"
                    );


                    // ซ่อนปุ่ม รับ / ไม่รับ
                    apologyButtons.classList.add(
                        "hidden"
                    );


                    // ซ่อนลูกศร
                    scrollCue.classList.add(
                        "hidden"
                    );


                    // แสดงปุ่มออก
                    exitBtn.classList.remove(
                        "hidden"
                    );


                    // หัวใจชุดใหญ่
                    createLoveBurst(
                        70,
                        true
                    );

                }

            },

            80

        );

}


// ========================================
// SCROLL REVEAL
// ========================================

const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(

                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add(
                                "visible"
                            );

                    }

                }

            );

        },

        {

            threshold:
                .18

        }

    );


// ========================================
// POLAROID PARALLAX
// ========================================

window.addEventListener(
    "scroll",
    () => {

        if (!apologyAccepted) {

            return;

        }


        const y =
            window.scrollY;


        document
            .querySelectorAll(
                ".polaroid"
            )
            .forEach(

                (
                    photo,
                    index
                ) => {

                    const direction =
                        index % 2 === 0
                            ? 1
                            : -1;


                    const move =
                        Math.min(
                            y * .015,
                            14
                        )
                        * direction;


                    const rotate =
                        photo
                            .classList
                            .contains(
                                "polaroid-left"
                            )

                            ? -6
                            : 6;


                    photo.style.transform =
                        `translateY(${move}px) rotate(${rotate}deg)`;

                }

            );

    }
);


// ========================================
// หัวใจตามเมาส์
// ========================================

document.addEventListener(
    "mousemove",
    e => {

        if (
            !heartRain ||
            !heartRain
                .classList
                .contains(
                    "active"
                )
        ) {

            return;

        }


        cursorTick++;


        if (
            cursorTick % 5 !== 0
        ) {

            return;

        }


        const heart =
            document.createElement(
                "span"
            );


        heart.className =
            "trail-heart";


        heart.textContent =
            "♥";


        heart.style.left =
            `${e.clientX}px`;


        heart.style.top =
            `${e.clientY}px`;


        document.body.appendChild(
            heart
        );


        setTimeout(() => {

            heart.remove();

        }, 800);

    }
);