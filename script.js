let rotorTrayArray = ['0', '1', '2', '3', '4', '5'];
let rotorInUseArray = ['0', '-', '-', '-'];
let ringSettingArray = ['0', '--', '--', '--'];
let rotorLabelArray = ['0', 'I', 'II', 'III', 'IV', 'V'];
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
                rotor.addEventListener('wheel', spinRingOrRotor);
            });

            // for scrolling when lid is closed
            document.querySelectorAll('#lid-frames > *').forEach(frame => {
                frame.addEventListener('wheel', spinRingOrRotor);
            });

            // for clicking caret buttons
            document.querySelectorAll('.caret').forEach(button => {
                button.addEventListener('click', spinRingOrRotorOneNotch);
            });

            // make rotors not in use unspinnable
            document.querySelectorAll('#rotor-tray .rotor-holder .rotor').forEach(rotor => {
                rotor.removeEventListener('wheel', spinRingOrRotor);
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
            updateRotorData();
            updateRingData();

            // show readiness of rotors in use
            // if (rotorInUseArray[1] != "-" && rotorInUseArray[2] != "-" && rotorInUseArray[3] != "-") {
            //     document.querySelector("#rotor-label-right").classList.add("ready");
            //     document.querySelector("#setting-rotor-label").classList.add("ready");
            // } else {
            //     document.querySelector("#rotor-label-right").classList.remove("ready");
            //     document.querySelector("#setting-rotor-label").classList.remove("ready");
            // }
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

function updateRotorData() {
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

    // update rotor order
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

function updateSettings() {
    // get rotor order
    rotorOder = `${rotorInUseArray[1]}${rotorInUseArray[2]}${rotorInUseArray[3]}`;
    // get ring setting (wheel cuộn xuống thì nhanh tới notch hơn => +1)
    ringSetting = `${ringSettingArray[1]}${ringSettingArray[2]}${ringSettingArray[3]}`;
    // get rotor positions
    // get plugboard connections
    console.log(rotorOder);
    console.log(ringSetting);
}

function spinRingOrRotor(event) {
    // get rotor when scrolling on rotor
    rotorTargetId = event.target.id;
    rotorTargetParentId = event.target.parentElement.id;

    // get rotor when scrolling on plate
    if (event.target.className.includes('plate')) {
        rotorTargetId = event.target.parentNode.parentNode.id;
    }
    // get rotor when scrolling on lid frame
    else if (rotorTargetId == "lid-frame-1") {
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
    degreeToRotate = 0;

    mouseNotchCount += Math.sign(event.deltaY); // 1 if scroll down, -1 if scroll up
    degreeToRotate = mouseNotchCount * 13.846;

    if (lid.className == "lid-open") {
        ringSpinSound = new Audio(`sound/ring-spin.mp3`);
        ringSpinSound.play();
    }
    else {
        // play sound if spinning rotor
        rotorSpinSound = new Audio(`sound/rotor-spin.mp3`);
        rotorSpinSound.play();
    }

    // Update the rotation for each plate visually
    plates = document.querySelectorAll(`#${rotorTargetId} .axis .plate`);
    plates.forEach(plate => {
        plateCurrentDeg = plate.getAttribute('style').match(/rotateX\(([-+]?\d*\.?\d+)deg\)/)[1];
        plate.style.transform = `rotateX(${degreeToRotate + Number(plateCurrentDeg)}deg) translateZ(10.83vh)` ;
    });

    // Change the ring dataset for rotor
    // this is for ring so we need to add a condition
    currentRingSetting = Number(document.querySelector(`#${rotorTargetId}`).dataset.ringSetting);
    newRingSetting = String(((mouseNotchCount + currentRingSetting) % 26) < 0 ? 26 + ((mouseNotchCount + currentRingSetting) % 26) : ((mouseNotchCount + currentRingSetting) % 26)).padStart(2, '0');
    document.querySelector(`#${rotorTargetId}`).dataset.ringSetting = newRingSetting;

    // Update ring data
    updateRingData();
};

function spinRingOrRotorOneNotch(event) {
    // Each notch can be considered as an event
    mouseNotchCount = 0;
    degreeToRotate = 13.846;

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
        degreeToRotate = -13.846;
        mouseNotchCount = -1;
    }
    else if (rotorTargetParentId == "spin-down-button-2" || rotorTargetId == "spin-down-button-2") {
        rotorTargetId = document.querySelector("#rotor-holder-7").firstElementChild.id;
        degreeToRotate = -13.846;
        mouseNotchCount = -1;
    }
    else if (rotorTargetParentId == "spin-down-button-3" || rotorTargetId == "spin-down-button-3") {
        rotorTargetId = document.querySelector("#rotor-holder-8").firstElementChild.id;
        degreeToRotate = -13.846;
        mouseNotchCount = -1;
    }
    // Prevent default scrolling
    event.preventDefault();

    // play sound if spinning ring
    if (lid.className == "lid-open") {
        ringSpinSound = new Audio(`sound/ring-spin.mp3`);
        ringSpinSound.play();
    }
    else {
        // play sound if spinning rotor
        rotorSpinSound = new Audio(`sound/rotor-spin.mp3`);
        rotorSpinSound.play();
    }

    // Update the rotation for each plate visually
    plates = document.querySelectorAll(`#${rotorTargetId} .axis .plate`);
    plates.forEach(plate => {
        plateCurrentDeg = plate.getAttribute('style').match(/rotateX\(([-+]?\d*\.?\d+)deg\)/)[1];
        plate.style.transform = `rotateX(${degreeToRotate + Number(plateCurrentDeg)}deg) translateZ(10.83vh)` ;
    });

    // Change the ring dataset for rotor
    currentRingSetting = Number(document.querySelector(`#${rotorTargetId}`).dataset.ringSetting);
    newRingSetting = String(((mouseNotchCount + currentRingSetting) % 26) < 0 ? 26 + ((mouseNotchCount + currentRingSetting) % 26) : ((mouseNotchCount + currentRingSetting) % 26)).padStart(2, '0');
    document.querySelector(`#${rotorTargetId}`).dataset.ringSetting = newRingSetting;

    // Update ring data
    updateRingData();
}

function toggleLid() {
    if (switchButton.className == "at-ring") {
        switchButton.className = "at-rotor";
        lidCloseSound = new Audio(`sound/lid-close.mp3`);
        lidCloseSound.play();
    }
    else if (switchButton.className == "at-rotor") {
        switchButton.className = "at-ring";
        lidOpenSound = new Audio(`sound/lid-open.mp3`);
        lidOpenSound.play();
    }

    if (lid.className == "lid-open" || lid.className == "lid-start") {
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
    color: "#bd1a1aff",
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