// Load profile data on page load
document.addEventListener("DOMContentLoaded", function () {
    const storedProfile = JSON.parse(localStorage.getItem("profileData"));
    if (storedProfile) {
        document.getElementById("profile-name").textContent = storedProfile.name;
        document.getElementById("profile-email").textContent = storedProfile.email;
        document.getElementById("profile-bio").textContent = storedProfile.bio;
        if (storedProfile.photo) {
            document.getElementById("profile-photo").src = storedProfile.photo;
        }
    }
    loadPosts();
});

// Toggle Edit Profile Section
function toggleEditProfile() {
    document.getElementById("edit-profile").style.display = "block";
}

// Save Profile Changes
function saveProfile() {
    const newName = document.getElementById("edit-name").value.trim();
    const newEmail = document.getElementById("edit-email").value.trim();
    const newBio = document.getElementById("edit-bio").value.trim();
    const newPhoto = document.getElementById("edit-photo").files[0];

    let profileData = JSON.parse(localStorage.getItem("profileData")) || {};

    if (newName) {
        document.getElementById("profile-name").textContent = newName;
        profileData.name = newName;
    }

    if (newEmail) {
        document.getElementById("profile-email").textContent = newEmail;
        profileData.email = newEmail;
    }

    if (newBio) {
        document.getElementById("profile-bio").textContent = newBio;
        profileData.bio = newBio;
    }

    if (newPhoto) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("profile-photo").src = e.target.result;
            profileData.photo = e.target.result;
            localStorage.setItem("profileData", JSON.stringify(profileData)); // Save after setting image
        };
        reader.readAsDataURL(newPhoto);
    } else {
        localStorage.setItem("profileData", JSON.stringify(profileData)); // Save profile changes
    }

    document.getElementById("edit-profile").style.display = "none"; // Hide edit form
}

// Add a new post
function addPost() {
    const content = document.getElementById("post-content").value.trim();
    const image = document.getElementById("post-image").files[0];

    if (content === "") {
        alert("Post cannot be empty!");
        return;
    }

    const posts = JSON.parse(localStorage.getItem("userPosts")) || [];
    const newPost = { id: Date.now(), content: content, likes: 0 };

    if (image) {
        const reader = new FileReader();
        reader.onload = function (e) {
            newPost.image = e.target.result;
            posts.unshift(newPost);
            localStorage.setItem("userPosts", JSON.stringify(posts));
            loadPosts();
        };
        reader.readAsDataURL(image);
    } else {
        posts.unshift(newPost);
        localStorage.setItem("userPosts", JSON.stringify(posts));
        loadPosts();
    }

    document.getElementById("post-content").value = ""; // Clear input
    document.getElementById("post-image").value = "";  // Clear image input
}

// Load posts
function loadPosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";

    const posts = JSON.parse(localStorage.getItem("userPosts")) || [];

    if (posts.length === 0) {
        postsContainer.innerHTML = "<p>No posts yet. Start sharing your thoughts!</p>";
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        postElement.innerHTML = `
            <p>${post.content}</p>
            ${post.image ? `<img src="${post.image}" alt="Post Image">` : ""}
            <div class="actions">
                <button onclick="likePost(${post.id})">Like (${post.likes})</button>
                <button onclick="editPost(${post.id})">Edit</button>
                <button onclick="deletePost(${post.id})">Delete</button>
            </div>
        `;

        postsContainer.appendChild(postElement);
    });
}

// Like a post
function likePost(postId) {
    let posts = JSON.parse(localStorage.getItem("userPosts")) || [];
    let post = posts.find(p => p.id === postId);

    if (post) {
        post.likes += 1;
        localStorage.setItem("userPosts", JSON.stringify(posts));
        loadPosts();
    }
}

// Edit a post
function editPost(postId) {
    let posts = JSON.parse(localStorage.getItem("userPosts")) || [];
    let post = posts.find(p => p.id === postId);

    if (!post) return;

    const newContent = prompt("Edit your post:", post.content);
    if (newContent !== null) {
        post.content = newContent;
        localStorage.setItem("userPosts", JSON.stringify(posts));
        loadPosts();
    }
}

// Delete a post
function deletePost(postId) {
    let posts = JSON.parse(localStorage.getItem("userPosts")) || [];
    posts = posts.filter(post => post.id !== postId);
    localStorage.setItem("userPosts", JSON.stringify(posts));
    loadPosts();
}
