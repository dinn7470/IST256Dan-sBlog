
let loggedIn =false;

let userId;

window.addEventListener('DOMContentLoaded',async ()=> {
await fetchAndDisplayBlogPosts();

})


async function fetchAndDisplayBlogPosts(){
    try{
        const blogPostResponse =await fetch('/blogs/');
        if(!blogPostResponse.ok){
            throw new Error('Failed to fetch blog posts');
        }
        const blogPosts = await blogPostResponse.json();

        await Promise.all(blogPosts.map(async (blogPost)=>{
            const authorResponse =await fetch(`/users/getUserByID/${blogPost.author}`);
            if(!authorResponse.ok){
                throw new Error ('Failed to fetch author details');
            }
            const authData=await authorResponse.json();
            blogPost.authorName=authData.name;
        }));
        await Promise.all(blogPosts.map(async (blogPost) => {
            await Promise.all(blogPost.comments.map(async (comment)=>{
                const userResponse =await fetch(`/users/getUserByID/${comment.user}`);
                if(!userResponse.ok){
                    throw new Error('Failed to fetch user details');
                }
                const userData =await userResponse.json();
                comment.userName= userData.name;
            }));
        }));

        await displayBlogPost(blogPosts);
    } catch(error){
        console.error('Error fetching content', error.message);
    }
}
async function displayBlogPost(blogPosts) {
    const blogPostContainer = document.getElementById('blogPosts');
    blogPostContainer.innerHTML = '';

    blogPosts.forEach(blogPost => {
        const cardElement = createBlogPostCard(blogPost);
        blogPostContainer.appendChild(cardElememnt);
    })
}

function createBlogPostCard(blogPost){
    const cardElement = document.createElement('div');
    cardElement.classList.add('blog-post-card');

    const titleElement = document.createElement('h5');
    titleElement.textContent = blogPost.title;

    const authorElement = document.createElement('p');
    authorElement.textContent = blogPost.authorName;

    const contentElement = document.createElement('p');
    contentElement.textContent = blogPost.content;

    const postLikesButton = createLikeButton(blogPost.likes);

    postLikesButton.addEventListener('click', async() => {
        if(blogPost.liked || !loggedIn)
        {
            return;
        }
        try{
            const response = await fetch(`/blogs/like/${blogPost.id}`,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(!response.ok){
                throw new Error('Failed to like the blog post. Please try again.');
            }
            blogPost.likes++;
            postLikesButton.querySelector('.likes-count').textContent = `${blogPost.likes}`;
            blogPost.liked = true;
        }
        catch(error){
            console.error('Error', error.message);
        }
    })

    cardElement.appendChild(titleElement);
    cardElement.appendChild(authorElement);
    cardElement.appendChild(postLikesButton);
    cardElement.appendChild(contentElement);

    return cardElement;
}


document.getElementById('loginForm').addEventListener('submit', async(event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Retrieve username and password from the form
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
        // Send a fetch request to the login endpoint
        const response = await fetch('/users/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });

        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Login failed. Try again');
        }

        // Extract data from the response
        const data = await response.json();
        userId = data._id;
        loggedIn = true;

        // Update the UI to reflect successful login
        document.getElementById('LoginFormContainer').style.display = 'none';
        document.getElementById('BlogFormContainer').style.display = 'block';
        document.getElementById('userGreeting').innerHTML = `<h4>Hello, ${data.name}</h4>`;
        document.getElementById('validation').innerHTML = ''; // Clear any previous validation errors

        // Fetch and display blog posts
        await fetchAndDisplayBlogPosts();
    } catch (error) {
        // Handle errors by logging them and displaying error messages
        console.error('Error:', error.message);
        document.getElementById('validation').innerHTML = `<p>${error.message}</p>`;
    } finally {
        // Reset the form after submission
        event.target.reset();
    }
});


function createLikeButton(likes)
{
    const likesButton = document.createElement('button');
    likesButton.classList.add('likes-button');

    const heartIcon = document.createElement('img')
    heartIcon.classList.add('heart-icon');
    heartIcon.src = 'resources/like.png'
    heartIcon.alt = "Like";

    const likesCount = document.createElement('span');
    likesCount.textContent = `${likes}`;
    likesCount.classList.add('likes-count');

    likesButton.appendChild(heartIcon);
    likesButton.appendChild(likesCount);

    return likesButton;






























}