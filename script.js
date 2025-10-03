let rotorTrayArray = ['0', '1', '2', '3', '4', '5'];
let rotorInUseArray = ['0', '-', '-', '-'];
let ringSettingArray = ['0', '--', '--', '--'];
let rotorPositionArray = ['0', '--', '--', '--'];
let rotorLabelArray = ['0', 'I', 'II', 'III', 'IV', 'V'];
let rotorActiveOne;
let rotorActiveTwo;
let rotorActiveThree;
let plugholePairs = [];
const plateDegrees = [
    "0deg",
    "13.846deg",
    "27.692deg",
    "41.538deg",
    "55.384deg",
    "69.230deg",
    "83.076deg",
    "96.922deg",
    "110.768deg",
    "124.614deg",
    "138.460deg",
    "152.306deg",
    "166.152deg",
    "180.000deg",
    "193.846deg",
    "207.692deg",
    "221.538deg",
    "235.384deg",
    "249.230deg",
    "263.076deg",
    "276.922deg",
    "290.768deg",
    "304.614deg",
    "318.460deg",
    "332.306deg",
    "346.152deg"
]

const label_1 = document.querySelector("#label-1");
const label_2 = document.querySelector("#label-2");
const label_3 = document.querySelector("#label-3");
const label_4 = document.querySelector("#label-4");
const label_5 = document.querySelector("#label-5");
const label_6 = document.querySelector("#label-6");
const label_7 = document.querySelector("#label-7");
const label_8 = document.querySelector("#label-8");
const keys = document.querySelectorAll(".key");
let targetKey = '';
const switchButton = document.querySelector("#switch");
const lid = document.querySelector("#lid-div");
const switchRing = document.querySelector("#switch-ring");
const switchRotor = document.querySelector("#switch-rotor");
const carets = document.querySelectorAll(".caret");
const inUseRotorHolder = document.querySelectorAll("#rotor-in-use-holder > *");
const rotorTray = document.querySelectorAll("#rotor-tray > *");

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

// initialize and disable left tray
$( "#rotor-tray .rotor-holder" ).droppable();
$( "#rotor-tray .rotor-holder" ).droppable("disable");


$( function() {
    $( ".rotor" ).draggable({
        zIndex: 100,
        // revert: "invalid"
        revert: function(dropped) {
            return !dropped; // Revert if not dropped
        },
        revertDuration: 100, // Duration in milliseconds

        // function to make empty holder droppable again
        stop: updateHolderStatus
    });

    $( ".rotor-holder" ).droppable({
        drop: function( event, ui ) {
            // actually move the rotor inside the rotor-holder
            $( this ).append(ui.draggable);

            // make rotors in use spinnable
            // for scrolling when lid is open
            document.querySelectorAll('#rotor-in-use .rotor-holder .rotor').forEach(rotor => {
                rotor.addEventListener('wheel', spinRing);
            });

            // for scrolling when lid is closed
            document.querySelectorAll('#lid-frames > *').forEach(frame => {
                frame.addEventListener('wheel', spinRotor);
            });

            // for clicking caret buttons
            document.querySelectorAll('.caret').forEach(button => {
                button.addEventListener('click', spinRingOneNotch);
                button.addEventListener('click', spinRotorOneNotch);
            });

            // make rotors not in use unspinnable
            document.querySelectorAll('#rotor-tray .rotor-holder .rotor').forEach(rotor => {
                rotor.removeEventListener('wheel', spinRing);
                rotor.removeEventListener('wheel', spinRotor);
            });

            // play sound
            if ($(this).parent().attr('id') == "rotor-in-use-holder") {
                dropInUseSound = new Audio(`sound/drop-in-use.mp3`);
                dropInUseSound.play();
            } else {
                dropInTraySound = new Audio(`sound/drop-in-tray.mp3`);
                dropInTraySound.play();
            }
            // disable busy holder
            if ($(this).children.length > 0) {
                $(this).droppable("disable");
            }
            
            // position the rotor to fit the rotor-holder
            ui.draggable.position({
                my: "left top",
                at: "left top",
                of: $(this)
            }),
            updateRotorOrder();
            updateRingData();
            updateRotorPosition();
        }
    });
} );

function updateHolderStatus() {
    document.querySelectorAll("#rotor-tray .rotor-holder").forEach(holder => {
        if (holder.children.length == 0) {
            $( `#${holder.id}` ).droppable("enable");
        }
    });

    document.querySelectorAll("#rotor-in-use-holder .rotor-holder").forEach(holder => {
        if (holder.children.length == 0 && lid.className == "lid-open") {
            $( `#${holder.id}` ).droppable("enable");
        }
    });
}

function updateRotorOrder() {
    // reset orders
    rotorTrayArray = ['0'];
    rotorInUseArray = ['0'];

    // check rotor and update order
    document.querySelectorAll("#rotor-tray .rotor-holder").forEach(holder => {
        if (holder.children.length == 0) {
            rotorTrayArray.push("-");
        } else {
            rotorTrayArray.push(holder.firstElementChild.id[holder.firstElementChild.id.length - 1]);
        }
    });

    document.querySelectorAll("#rotor-in-use .rotor-holder").forEach(holder => {
        if (holder.children.length == 0) {
            rotorInUseArray.push("-");
        } else {
            rotorInUseArray.push(holder.firstElementChild.id[holder.firstElementChild.id.length - 1]);
        }
    });

    // update rotor labels
    label_1.textContent = rotorTrayArray[1] == '-' ? '-' : rotorLabelArray[Number(rotorTrayArray[1])];
    label_2.textContent = rotorTrayArray[2] == '-' ? '-' : rotorLabelArray[Number(rotorTrayArray[2])];
    label_3.textContent = rotorTrayArray[3] == '-' ? '-' : rotorLabelArray[Number(rotorTrayArray[3])];
    label_4.textContent = rotorTrayArray[4] == '-' ? '-' : rotorLabelArray[Number(rotorTrayArray[4])];
    label_5.textContent = rotorTrayArray[5] == '-' ? '-' : rotorLabelArray[Number(rotorTrayArray[5])];

    label_6.textContent = rotorInUseArray[1] == '-' ? '-' : rotorLabelArray[Number(rotorInUseArray[1])];
    label_7.textContent = rotorInUseArray[2] == '-' ? '-' : rotorLabelArray[Number(rotorInUseArray[2])];
    label_8.textContent = rotorInUseArray[3] == '-' ? '-' : rotorLabelArray[Number(rotorInUseArray[3])];

    // assign rotors
    rotorActiveOne = rotorInUseArray[1] == '-' ? undefined : allRotorsDefault[rotorInUseArray[1]];
    rotorActiveTwo = rotorInUseArray[2] == '-' ? undefined : allRotorsDefault[rotorInUseArray[2]];
    rotorActiveThree = rotorInUseArray[2] == '-' ? undefined : allRotorsDefault[rotorInUseArray[3]];

    // update rotor order setting
    document.querySelector('#setting-rotor-detail').textContent = `${rotorInUseArray[1]} ${rotorInUseArray[2]} ${rotorInUseArray[3]}`;
}

function updateRingData() {
    // reset rings
    ringSettingArray = ['0'];

    // check ring and update ring setting
    document.querySelectorAll("#rotor-in-use .rotor-holder").forEach(holder => {
        if (holder.children.length == 0) {
            ringSettingArray.push("--");
        } else {
            ringSettingArray.push(holder.firstElementChild.dataset.ringSetting);
        }
    });

    // update ring setting
    document.querySelector('#setting-ring-detail').textContent = `${ringSettingArray[1]} ${ringSettingArray[2]} ${ringSettingArray[3]}`;
}

function updateRotorPosition() {
    // reset rotor positions
    rotorPositionArray = ['0'];

    // check rotor and update rotor position
    document.querySelectorAll("#rotor-in-use .rotor-holder").forEach(holder => {
        if (holder.children.length == 0) {
            rotorPositionArray.push("--");
        } else {
            rotorPositionArray.push(holder.firstElementChild.dataset.rotorPosition);
        }
    });

    // update rotor positions if the lid is closed
    if (lid.className == "lid-closed") {
        document.querySelector('#setting-position-detail').textContent = `${rotorPositionArray[1]} ${rotorPositionArray[2]} ${rotorPositionArray[3]}`;
    } else {
        document.querySelector('#setting-position-detail').textContent = '-- -- --';
    }
}

function updateSettings() {
    // get rotor order
    rotorOrder = `${rotorInUseArray[1]}${rotorInUseArray[2]}${rotorInUseArray[3]}`;
    // get ring setting (wheel cuộn xuống thì nhanh tới notch hơn => +1)
    ringSetting = `${ringSettingArray[1]}${ringSettingArray[2]}${ringSettingArray[3]}`;
    // get rotor positions
    rotorPosition = `${rotorPositionArray[1]}${rotorPositionArray[2]}${rotorPositionArray[3]}`;
    // get plugboard connections
    console.log(rotorOrder);
    console.log(ringSetting);
}

function spinRing(event) {
    // get rotor when scrolling on rotor
    rotorTargetId = event.target.id;
    rotorTargetParentId = event.target.parentElement.id;

    // get rotor when scrolling on plate
    if (event.target.className.includes('plate')) {
        rotorTargetId = event.target.parentNode.parentNode.id;
    }

    // Prevent default scrolling
    event.preventDefault(); 
    
    // Each notch can be considered as an event
    mouseNotchCount = 0;
    degreeToRotate = 0;

    mouseNotchCount += Math.sign(event.deltaY); // 1 if scroll down, -1 if scroll up
    degreeToRotate = mouseNotchCount * 13.846;

    ringSpinSound = new Audio(`sound/ring-spin.mp3`);
    ringSpinSound.play();

    // Update the rotation for each plate visually
    plates = document.querySelectorAll(`#${rotorTargetId} .axis .plate`);
    plates.forEach(plate => {
        plateCurrentPosition = Number(plate.dataset.platePosition);
        plateNewPosition = (plateCurrentPosition + mouseNotchCount) % 26 >= 0 ? (plateCurrentPosition + mouseNotchCount) % 26 : 26 + (plateCurrentPosition + mouseNotchCount) % 26;
        plateNewDeg = plateDegrees[plateNewPosition];
        plate.dataset.platePosition = String(plateNewPosition);
        plate.style.transform = `rotateX(${plateNewDeg}) translateZ(10.83vh)`;

        // Update rotor position dataset
        if (plateNewPosition == 0) {
            document.querySelector(`#${rotorTargetId}`).dataset.rotorPosition = plate.textContent.match(/\d+/)[0];
        }
    });

    // Update ring dataset for rotor
    currentRingSetting = Number(document.querySelector(`#${rotorTargetId}`).dataset.ringSetting);
    newRingSetting = String(((mouseNotchCount + currentRingSetting) % 26) < 0 ? 26 + ((mouseNotchCount + currentRingSetting) % 26) : ((mouseNotchCount + currentRingSetting) % 26)).padStart(2, '0');
    document.querySelector(`#${rotorTargetId}`).dataset.ringSetting = newRingSetting;

    // Update ring data
    updateRingData();
};


function spinRotor(event) {
    // get rotor when scrolling on rotor
    rotorTargetId = event.target.id;
    rotorTargetParentId = event.target.parentElement.id;

    // get rotor when scrolling on lid frame
    if (rotorTargetId == "lid-frame-1") {
        rotorTargetId = document.querySelector("#rotor-holder-6").firstElementChild.id;
    }
    else if (rotorTargetId == "lid-frame-2") {
        rotorTargetId = document.querySelector("#rotor-holder-7").firstElementChild.id;
    }
    else if (rotorTargetId == "lid-frame-3") {
        rotorTargetId = document.querySelector("#rotor-holder-8").firstElementChild.id;
    }

    // Prevent default scrolling
    event.preventDefault(); 
    
    // Each notch can be considered as an event
    mouseNotchCount = 0;

    mouseNotchCount += Math.sign(event.deltaY); // 1 if scroll down, -1 if scroll up

    // play sound if spinning rotor
    rotorSpinSound = new Audio(`sound/rotor-spin.mp3`);
    rotorSpinSound.play();

    // Update the rotation for each plate visually
    plates = document.querySelectorAll(`#${rotorTargetId} .axis .plate`);
    plates.forEach(plate => {
        plateCurrentPosition = Number(plate.dataset.platePosition);
        plateNewPosition = (plateCurrentPosition + mouseNotchCount) % 26 >= 0 ? (plateCurrentPosition + mouseNotchCount) % 26 : 26 + (plateCurrentPosition + mouseNotchCount) % 26;
        plateNewDeg = plateDegrees[plateNewPosition];
        plate.dataset.platePosition = String(plateNewPosition);
        plate.style.transform = `rotateX(${plateNewDeg}) translateZ(10.83vh)`;

        // Update rotor position dataset
        if (plateNewPosition == 0) {
            document.querySelector(`#${rotorTargetId}`).dataset.rotorPosition = plate.textContent.match(/\d+/)[0];
        }
    });

    // Update ring data
    updateRotorPosition();
};

function spinRingOneNotch(event) {
    // only execute when the lid is open
    if (lid.className == "lid-open") {
        // Each notch can be considered as an event
        mouseNotchCount = 0;

        // get rotor when scrolling on rotor
        rotorTargetId = event.target.id;
        rotorTargetParentId = event.target.parentElement.id;

        // get rotor when clicking on spin button
        if (rotorTargetParentId == "spin-up-button-1" || rotorTargetId == "spin-up-button-1") {
            rotorTargetId = document.querySelector("#rotor-holder-6").firstElementChild.id;
            mouseNotchCount = 1;
        }
        else if (rotorTargetParentId == "spin-up-button-2" || rotorTargetId == "spin-up-button-2") {
            rotorTargetId = document.querySelector("#rotor-holder-7").firstElementChild.id;
            mouseNotchCount = 1;
        }
        else if (rotorTargetParentId == "spin-up-button-3" || rotorTargetId == "spin-up-button-3") {
            rotorTargetId = document.querySelector("#rotor-holder-8").firstElementChild.id;
            mouseNotchCount = 1;
        }
        else if (rotorTargetParentId == "spin-down-button-1" || rotorTargetId == "spin-down-button-1") {
            rotorTargetId = document.querySelector("#rotor-holder-6").firstElementChild.id;
            mouseNotchCount = -1;
        }
        else if (rotorTargetParentId == "spin-down-button-2" || rotorTargetId == "spin-down-button-2") {
            rotorTargetId = document.querySelector("#rotor-holder-7").firstElementChild.id;
            mouseNotchCount = -1;
        }
        else if (rotorTargetParentId == "spin-down-button-3" || rotorTargetId == "spin-down-button-3") {
            rotorTargetId = document.querySelector("#rotor-holder-8").firstElementChild.id;
            mouseNotchCount = -1;
        }
        // Prevent default scrolling
        event.preventDefault();

        // play sound if spinning ring
        ringSpinSound = new Audio(`sound/ring-spin.mp3`);
        ringSpinSound.play();

        // Update the rotation for each plate visually
        plates = document.querySelectorAll(`#${rotorTargetId} .axis .plate`);
        plates.forEach(plate => {
            plateCurrentPosition = Number(plate.dataset.platePosition);
            plateNewPosition = (plateCurrentPosition + mouseNotchCount) % 26 >= 0 ? (plateCurrentPosition + mouseNotchCount) % 26 : 26 + (plateCurrentPosition + mouseNotchCount) % 26;
            plateNewDeg = plateDegrees[plateNewPosition];
            plate.dataset.platePosition = String(plateNewPosition);
            plate.style.transform = `rotateX(${plateNewDeg}) translateZ(10.83vh)`;

            // Update rotor position dataset
            if (plateNewPosition == 0) {
                document.querySelector(`#${rotorTargetId}`).dataset.rotorPosition = plate.textContent.match(/\d+/)[0];
            }
        });

        // Change the ring dataset
        currentRingSetting = Number(document.querySelector(`#${rotorTargetId}`).dataset.ringSetting);
        newRingSetting = String(((mouseNotchCount + currentRingSetting) % 26) < 0 ? 26 + ((mouseNotchCount + currentRingSetting) % 26) : ((mouseNotchCount + currentRingSetting) % 26)).padStart(2, '0');
        document.querySelector(`#${rotorTargetId}`).dataset.ringSetting = newRingSetting;

        // Update ring data
        updateRingData();
    }
}

function spinRotorOneNotch(event) {
    if (lid.className == "lid-closed") {
        // Each notch can be considered as an event
        mouseNotchCount = 0;

        // get rotor when scrolling on rotor
        rotorTargetId = event.target.id;
        rotorTargetParentId = event.target.parentElement.id;

        // get rotor when clicking on spin button
        if (rotorTargetParentId == "spin-up-button-1" || rotorTargetId == "spin-up-button-1") {
            rotorTargetId = document.querySelector("#rotor-holder-6").firstElementChild.id;
            mouseNotchCount = 1;
        }
        else if (rotorTargetParentId == "spin-up-button-2" || rotorTargetId == "spin-up-button-2") {
            rotorTargetId = document.querySelector("#rotor-holder-7").firstElementChild.id;
            mouseNotchCount = 1;
        }
        else if (rotorTargetParentId == "spin-up-button-3" || rotorTargetId == "spin-up-button-3") {
            rotorTargetId = document.querySelector("#rotor-holder-8").firstElementChild.id;
            mouseNotchCount = 1;
        }
        else if (rotorTargetParentId == "spin-down-button-1" || rotorTargetId == "spin-down-button-1") {
            rotorTargetId = document.querySelector("#rotor-holder-6").firstElementChild.id;
            mouseNotchCount = -1;
        }
        else if (rotorTargetParentId == "spin-down-button-2" || rotorTargetId == "spin-down-button-2") {
            rotorTargetId = document.querySelector("#rotor-holder-7").firstElementChild.id;
            mouseNotchCount = -1;
        }
        else if (rotorTargetParentId == "spin-down-button-3" || rotorTargetId == "spin-down-button-3") {
            rotorTargetId = document.querySelector("#rotor-holder-8").firstElementChild.id;
            mouseNotchCount = -1;
        }
        // Prevent default scrolling
        event.preventDefault();

        // play sound if spinning rotor
        rotorSpinSound = new Audio(`sound/rotor-spin.mp3`);
        rotorSpinSound.play();


        // Update the rotation for each plate visually
        plates = document.querySelectorAll(`#${rotorTargetId} .axis .plate`);
        plates.forEach(plate => {
            plateCurrentPosition = Number(plate.dataset.platePosition);
            plateNewPosition = (plateCurrentPosition + mouseNotchCount) % 26 >= 0 ? (plateCurrentPosition + mouseNotchCount) % 26 : 26 + (plateCurrentPosition + mouseNotchCount) % 26;
            plateNewDeg = plateDegrees[plateNewPosition];
            plate.dataset.platePosition = String(plateNewPosition);
            plate.style.transform = `rotateX(${plateNewDeg}) translateZ(10.83vh)`;

            // Update rotor position dataset
            if (plateNewPosition == 0) {
                document.querySelector(`#${rotorTargetId}`).dataset.rotorPosition = plate.textContent.match(/\d+/)[0];
            }
        });

        // Update rotor data
        updateRotorPosition();
    }
}

function toggleLid() {
    // if lid is open, close it
    if (switchButton.className == "at-ring") {
        switchButton.className = "at-rotor";
        lidCloseSound = new Audio(`sound/lid-close.mp3`);
        lidCloseSound.play();
    }
    // if lid is closed, open it
    else if (switchButton.className == "at-rotor") {
        switchButton.className = "at-ring";
        lidOpenSound = new Audio(`sound/lid-open.mp3`);
        lidOpenSound.play();
    }

    // if (lid.className == "lid-open" || lid.className == "lid-start") {
    if (lid.className == "lid-open") {
        lid.className = "lid-closed";
        $( "#rotor-in-use .rotor-holder" ).droppable("disable");
    }
    else if (lid.className == "lid-closed") {
        lid.className = "lid-open";
        $( "#rotor-in-use .rotor-holder" ).droppable("enable");
    }
    // disable busy holder
    inUseRotorHolder.forEach(holder => {
        if (holder.children.length > 0) {
            $(holder).droppable("disable");
        }
    });

    if (switchRing.className == "ready") {
        switchRing.className = "";
        switchRotor.className = "ready";
    }
    else if (switchRotor.className == "ready") {
        switchRotor.className = "";
        switchRing.className = "ready";
    }

    updateRotorPosition();
}

switchButton.addEventListener("click", toggleLid);

// start default patchbay
let patchbay;
document.addEventListener("DOMContentLoaded", function () {
    patchbay = new Patchbay({
    snapRadius: 100,
    });
});

cableConfig = {
    container: document.querySelector("#plugboard"),
    iterations: 6,
    color: "#2e2e2e",
    slack: 1,
    segments: 20,
    snapRadius: 50,
    dragHandleSize: 20,
    lineThickness: 7,
    snapElementSelector: ".plughole",
    zIndex: 0,
}

// add eventlistent to all plugholes
document.querySelectorAll(".plughole").forEach((plughole) => {
    plughole.addEventListener("click", () => {
        patchbay.startCable(plughole, cableConfig);
        patchbay.start(); // keep this to animate the cable
    });
})

// this function is added in cables.js
function updatePlugholePairings() {
    plugholePairs = [];
    document.querySelectorAll('.cable').forEach(cable => {
        plugholePairs.push([cable.dataset.startingPlug, cable.dataset.endingPlug]);
    });
    console.log(plugholePairs);
};


// key input > plubboard > first rotor > second rotor > third rotor > reflector > third rotor > second rotor > first rotor > plubboard > bulb
const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const rotorOneDefault = {
    left: [5, 15, 10, 12, 6, 17, 2, 18, 21, 9, 3, 20, 22, 0, 8, 23, 19, 4, 14, 16, 24, 1, 7, 13, 25, 11], 
    right: [11, 23, 5, 19, 13, 22, 1, 12, 21, 16, 18, 4, 14, 9, 25, 0, 3, 8, 17, 6, 10, 24, 2, 7, 20, 15],
    notch: 10
};

const rotorTwoDefault = {
    left: [3, 16, 1, 2, 20, 13, 12, 22, 17, 0, 15, 23, 9, 6, 18, 8, 24, 4, 5, 10, 7, 19, 25, 21, 14, 11], 
    right: [21, 0, 25, 2, 13, 4, 6, 19, 15, 3, 12, 9, 8, 1, 16, 11, 22, 23, 5, 18, 10, 17, 14, 24, 20, 7],
    notch: 14
};

const rotorThreeDefault = {
    left: [2, 20, 19, 7, 17, 14, 12, 0, 4, 11, 10, 6, 8, 24, 3, 9, 15, 1, 5, 25, 22, 16, 21, 13, 23, 18], 
    right: [7, 21, 3, 19, 1, 24, 22, 6, 11, 14, 4, 13, 0, 25, 18, 9, 20, 23, 12, 15, 10, 8, 16, 17, 2, 5],
    notch: 2
};

const rotorFourDefault = {
    left: [22, 13, 2, 1, 3, 10, 14, 21, 4, 7, 19, 12, 20, 9, 24, 11, 18, 6, 8, 15, 16, 17, 5, 23, 25, 0], 
    right: [15, 9, 21, 1, 25, 13, 10, 2, 22, 14, 0, 16, 24, 20, 6, 12, 3, 7, 4, 18, 8, 11, 23, 5, 17, 19],
    notch: 20
};

const rotorFiveDefault = {
    left: [18, 10, 21, 15, 8, 20, 22, 3, 24, 13, 1, 23, 0, 6, 14, 16, 17, 7, 9, 11, 5, 25, 2, 12, 19, 4], 
    right: [21, 10, 2, 6, 7, 24, 0, 18, 14, 25, 1, 13, 20, 4, 5, 17, 8, 9, 23, 15, 12, 11, 3, 16, 19, 22],
    notch: 16
};

const allRotorsDefault = ['0', rotorOneDefault, rotorTwoDefault, rotorThreeDefault, rotorFourDefault, rotorFiveDefault];

const reflector = [24, 12, 6, 9, 22, 14, 2, 15, 21, 3, 19, 20, 1, 17, 5, 7, 23, 13, 25, 10, 11, 8, 4, 16, 0, 18];

let plugboard = {"H" : "N", "L": "S"};