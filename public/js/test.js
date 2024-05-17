window.onload = () => {
    document.querySelector("form").reset();
}

function addParticipant() {
    const participantValue = document.getElementById("participantInp").value;
    if (participantValue === "") {
        return;
    } else {
        const newParticipant = document.createElement("li");
        newParticipant.textContent = participantValue;
        document.getElementById("participantList").appendChild(newParticipant);
        document.getElementById("participantInp").value = "";
    }
}

const billImageInp = document.getElementById('billImageInp');

billImageInp.addEventListener('change', function() {
    console.log(URL.createObjectURL(this.files[0]));
    const newImg = document.createElement('img');
    newImg.src = URL.createObjectURL(this.files[0]);
    document.body.appendChild(newImg);
});

const addParticipantBtn = document.getElementById("addParticipantBtn");

addParticipantBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addParticipant();
});

const mainForm = document.querySelector("#mainForm")

mainForm.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addParticipant();
    }
})

mainForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(mainForm);
    const participantList = document.querySelectorAll("#participantList li");
    const participants = [];
    participantList.forEach(participant => {
        participants.push(participant.textContent);
    });
    formData.append("participants", JSON.stringify(participants));
    console.log(formData);

    await fetch("/", {
        method: "POST",
        body: formData,
        redirect: "follow"
    }).then(res => {
        window.location.href = res.url;
    }).catch(err => {
        console.log(err);
    });
});