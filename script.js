const element = document.querySelector('.plate');
// Get the element's height in pixels
const elementHeight = element.offsetHeight;
// Get the viewport height in pixels
const viewportHeight = window.innerHeight;
// Calculate the height in vh
const heightInVh = (elementHeight / viewportHeight) * 100;
console.log('Element height in vh:', heightInVh);
// const distanceZ = (heightInVh/2)/


const keys = document.querySelectorAll(".key");
let targetKey = '';

// TARGET KEY
function getTargetKey(event) {
    clickedKey = event.target;
    // console.log('clickedKey: ',clickedKey);
    targetKey = clickedKey.id[clickedKey.id.length - 1];
    // console.log(targetKey);
}

keys.forEach(key => {key.addEventListener("mousedown", getTargetKey)});

// PLAY SOUND
function playSound() {
    pressSound = new Audio(`sound/press-${targetKey}.mp3`);
    pressSound.play();
    // console.log('audio played')
}

keys.forEach(key => {key.addEventListener("mousedown", playSound)});

// function spin() {
//     alldivs = document.querySelector("#rotor-x").children;
//     for (i = 0; i < alldivs.length; ++i) {
//         div = alldivs[i];
//         coefficient = alldivs[i].getAttribute('style').slice(4);
//         // console.log(coefficient);
//         if (coefficient == 0) {
//             div.setAttribute('style', "--i:25");
//         } else {
//             div.setAttribute('style', `--i:${Number(coefficient) - 1}`);
//         }
//     }
// }

// window.addEventListener('scroll', () => {
//     const scrollAmount = window.scrollY; // Get the current vertical scroll position
//     console.log(scrollAmount); // Output the amount of scroll in pixels
// });

window.addEventListener('wheel', (event) => {
    event.preventDefault(); // Prevent default scrolling
    console.log(event.deltaY);
});