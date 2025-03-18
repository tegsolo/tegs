async function fetchRegisteredUsers() {
    try {
        const response = await fetch('/admin/users');
            if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        const users = await response.json();
        displayRegisteredUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
      // Handle error, e.g., display an error message on the page
    }
}

function displayRegisteredUsers(users) {
    const userList = document.getElementById('registered-users');
    userList.innerHTML = ''; // Clear previous list

    if (users.length === 0) {
        userList.textContent = "No users registered yet.";
        return;
    }

    const ul = document.createElement('ul');
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.username} (${user.email})`;
        ul.appendChild(li);
    });
    userList.appendChild(ul);
}


async function fetchLikes() {
    try {
        const response = await fetch('/admin/likes');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayLikes(data.likes);
    } catch (error) {
        console.error('Error fetching likes:', error);
        // Handle error, e.g., display an error message
    }
}


function displayLikes(likes) {
    const likesDisplay = document.getElementById('likes-count');
    likesDisplay.textContent = `Total Likes: ${likes}`;
}
const likeButton = document.querySelector('.like-button');
const likeCount = document.querySelector('.like-count');
const commentInput = document.querySelector('.comment-input');
const commentButton = document.querySelector('.comment-button');
const commentList = document.querySelector('.comment-list');

let likes = localStorage.getItem('likes') || 0;
likeCount.textContent = likes;

likeButton.addEventListener('click', () => {
    likes++;
    localStorage.setItem('likes', likes);
    likeCount.textContent = likes;
});

// Comment functionality (using local storage)
commentButton.addEventListener('click', () => {
    const commentText = commentInput.value.trim();
    if (commentText) {
        const storedComments = JSON.parse(localStorage.getItem('comments') || '[]');
        storedComments.push(commentText);
        localStorage.setItem('comments', JSON.stringify(storedComments));

        const li = document.createElement('li');
        li.textContent = commentText;
        commentList.appendChild(li);
        commentInput.value = '';
    }
});

// Load comments from local storage on page load
const initialStoredComments = JSON.parse(localStorage.getItem('comments') || '[]');
initialStoredComments.forEach(comment => {
    const li = document.createElement('li');
    li.textContent = comment;
    commentList.appendChild(li);
});

// Generate sparkles in the header
const sparkleContainer = document.querySelector('.sparkle-container');
for (let i = 0; i < 50; i++) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    sparkle.style.setProperty('--x', Math.random() * 100);
    sparkle.style.setProperty('--y', Math.random() * 100);
    sparkle.style.setProperty('--delay', Math.random() * 2);
    sparkleContainer.appendChild(sparkle);
}

const registrationForm = document.getElementById('registration-form');

function toggleRegistrationForm() {
    if (registrationForm.style.display === "none") {
        registrationForm.style.display = "block";
    } else {
        registrationForm.style.display = "none";
    }
}


const regForm = document.getElementById('regForm');

regForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form from submitting normally

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            // Handle errors, e.g., display an error message to the user
            alert(errorData.error);
            return;
        }

        const data = await response.json();
        console.log(data.message); // Log success message
        regForm.reset(); // Reset the form after successful registration
    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred during registration.");
    }
    regForm.reset();
});

