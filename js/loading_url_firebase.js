// loading_url_firebase.js - Updated for modern portfolio
// Firebase config is loaded from environment variables (see .env.example and Netlify env vars).
// Never commit real credentials to the repo.
// https://giphy.com/channel/zixiang1993
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const hasValidConfig = Object.values(firebaseConfig).every(Boolean);
let app, database, mediaRef, urlRef;

if (hasValidConfig) {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  mediaRef = ref(database, "media");
  urlRef = ref(database, "url");
} else {
  console.warn(
    "[Firebase] Missing config. Project list will still show; links/images won't update from Firebase. Set VITE_FIREBASE_* env vars in Netlify (Site settings → Environment variables) and redeploy."
  );
}

// 1a. Project IDs to load
const projectIds = [
  "0019", "0018", "0017", "0016", "0015", "0014", "0013", "0012", "0011", "0010",
  "0009", "0008", "0007", "0006", "0005",
  "0004", "0003", "0002", "0001", "0000"
];

// 1b. Other link IDs to update
const otherLinkIds = [
  "resume", "linkedin", "wordpress", "github",
  "tree", "goodreads", "story1", "story2", "story3", "oldportfolio", "portfolio_design"
];

// 1c. Project IDs to show as "Under Maintenance" (grayed out image + badge)
const underMaintenanceIds = [
  "0000",
  "0014",
  "0015",
];

// Helper function to safely get element and update properties
function updateElement(id, updateFunction) {
  const element = document.getElementById(id);
  if (element) {
    updateFunction(element);
  }
}

// Helper function to safely update link href
function updateLink(linkId, url) {
  updateElement(`link_${linkId}`, (element) => {
    const anchor = element.querySelector("a");
    if (anchor) {
      anchor.href = url;

      // Update link text for project links to be more descriptive
      if (projectIds.includes(linkId)) {
        anchor.textContent = "View Project";
        anchor.className = "project-link";
      }
    }
  });
}

// Helper function to safely update image src
function updateImage(imageId, src) {
  updateElement(`image_${imageId}`, (element) => {
    element.src = src;

    // Add error handling for image loading
    element.onerror = function () {
      this.onerror = null;
      this.src = `images/S${imageId.substring(1)}_${getProjectName(imageId)}.jpg`;
    };
  });
}

// 2. Helper function to get project name from id (placeholder)
function getProjectName(id) {
  const projectNames = {
    "0019": "MalaysianJokesApp",
    "0018": "DadJokesGenerator",
    "0017": "CoolOmniWebsite",
    "0016": "ThinkBoard",
    "0015": "FacialRecognition",
    "0014": "RailsWebsite",
    "0013": "PollingApp",
    "0012": "Kudos",
    "0011": "Particles",
    "0010": "Fishing",
    "0009": "Crypto",
    "0008": "Gala",
    "0007": "MemoryMatch",
    "0006": "FaceBomp",
    "0005": "RPS",
    "0004": "Pizza",
    "0003": "Sub",
    "0002": "DrumKit",
    "0001": "Hover",
    "0000": "Test"
  };

  return projectNames[id] || "Project";
}

// Listen for changes in the "media" node and update the image sources (only if Firebase is configured)
if (mediaRef) {
  onValue(mediaRef, (snapshot) => {
    const mediaData = snapshot.val();
    if (!mediaData) return;
    projectIds.forEach(id => {
      if (mediaData[`image_${id}`]) {
        updateImage(id, mediaData[`image_${id}`]);
      }
    });
  });
}

// Listen for changes in the "url" node and update the links (only if Firebase is configured)
if (urlRef) {
  onValue(urlRef, (snapshot) => {
    const urlData = snapshot.val();
    if (!urlData) return;
    projectIds.forEach(id => {
      if (urlData[`link_${id}`]) {
        updateLink(id, urlData[`link_${id}`]);
      }
    });
    otherLinkIds.forEach(id => {
      if (urlData[`link_${id}`]) {
        updateLink(id, urlData[`link_${id}`]);
      }
    });
  });
}

// Generate project cards dynamically based on the data
function generateProjectCards() {
  const projectsGrid = document.querySelector('.projects-grid');

  // If the grid doesn't exist yet, wait for DOM to be fully loaded
  if (!projectsGrid) {
    document.addEventListener('DOMContentLoaded', generateProjectCards);
    return;
  }

  // Check if cards already exist in HTML
  const existingCards = projectsGrid.querySelectorAll('.project-card');

  // If cards already exist in HTML, just update them instead of replacing
  if (existingCards.length > 0) {
    fetchProjectDetails();
    applyUnderMaintenance();
    return;
  }

  // Otherwise create cards for each project in reverse order (newest first)
  projectsGrid.innerHTML = '';
  projectIds.forEach(id => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-type', 'all'); // Add data attribute for filtering
    card.innerHTML = `
      <div class="project-image">
        <img id="image_${id}" src="images/S${id.substring(1)}_${getProjectName(id)}.jpg" alt="Project">
      </div>
      <div class="project-content">
        <h4>Project Title</h4>
        <p>Project description will be loaded here.</p>
        <div id="link_${id}">
          <a href="#" class="project-link" target="_blank">View Project</a>
        </div>
      </div>
    `;

    projectsGrid.appendChild(card);
  });

  // Once cards are generated, fetch titles and descriptions
  fetchProjectDetails();
  applyUnderMaintenance();
}

// Mark cards as "Under Maintenance" (grayed out image + badge)
function applyUnderMaintenance() {
  underMaintenanceIds.forEach(id => {
    const img = document.getElementById(`image_${id}`);
    const card = img?.closest('.project-card');
    if (!card) return;
    card.classList.add('under-maintenance');
    const imageWrap = card.querySelector('.project-image');
    if (imageWrap && !imageWrap.querySelector('.under-maintenance-badge')) {
      const badge = document.createElement('span');
      badge.className = 'under-maintenance-badge';
      badge.textContent = 'Under Maintenance';
      imageWrap.appendChild(badge);
    }
  });
}

// 3. Fetch project titles and descriptions
function fetchProjectDetails() {
  // This function would typically fetch project details from Firebase
  // For now, we'll use hardcoded data based on your current HTML
  const projectDetails = {
    "0019": {
      title: "Malaysian Jokes App",
      description: "Malaysian Jokes App for Malaysians! Get random jokes and add your own too! Uses Firebase Realtime Database, and basic HTML, CSS and JS. Hosted on Netlify."
    },
    "0018": {
      title: "Dad Jokes Generator",
      description: "Simple one page website, with its backend coded in golang and calling an external public API to generate dad jokes! Hosted on Render. I had to do it 😂"
    },
    "0017": {
      title: "Cool Website",
      description: "Vibe coded website. For testing purposes. Still pretty awesome to see the future!"
    },
    "0016": {
      title: "Mern ThinkBoard",
      description: "My personal notepad app that uses the MERN stack! Uses Render for hosting, Tailwind + DaisyUI for CSS, Redis via Upstash and is mobile friendly! I chose a synthwave theme to give it a distinctive feel and vibe!"
    },
    "0015": {
      title: "Facial Recognition Smart Brain Project",
      description: "My most advance project. Uses Clarifai's Facial Recognition API to detect human faces. Has a frontend (Netlify), backend (Render) and database (Neon's Postgres). To start it, click on the <a href='https://smartbrain-facialrecognition-api.onrender.com/' target='_blank'>backend URL link</a> here. Then, click on the 'View Project' link below. The backend requires between 30 - 60 seconds to start due to free web-hosting limitation. Otherwise, just click on 'Home' and insert an image url. This was actually an old project with unidentifiable errors, but with Claude and Grok's help, I succeeded."
    },
    "0014": {
      title: "Simple Rails Website",
      description: "Rails Website for learning. Uses Neon's Postgres Database and AWS. Hosted on Render. Requires between 30-60 seconds to start the website(due to free web-hosting limitation)."
    },
    "0013": {
      title: "Polling App",
      description: "Simple Polling App to vote on things like lunch, places to go, colours etc. Uses Firebase Realtime Database, and basic HTML, CSS and JS. Hosted on Netlify."
    },
    "0012": {
      title: "Kudos Generator",
      description: "Get a random generator from a person, and add your own too! Uses Firebase Realtime Database, and basic HTML, CSS and JS. Hosted on Netlify."
    },
    "0011": {
      title: "Particles Effect & Changing Background",
      description: "For my own personal use and enjoyment! Pretty cool huh?"
    },
    "0010": {
      title: "Catch the Fishes!",
      description: "My 3rd game attempt! Made this for kids from a special request! Its actually a pretty fun game! Catch the fishes and starfishes! One of my favourites"
    },
    "0009": {
      title: "Cryptocurrency Calculator",
      description: "For calculating profit, ROI and other nifty details. Initially, coded using Python and compiled using pyInstaller pre-ChatGPT era. This version was improved and converted to HTML, CSS and Javascript using Chatgpt"
    },
    "0008": {
      title: "Gala Invite",
      description: "An invitation to the gala with effects. Incorporating Firebase Realtime Database!"
    },
    "0007": {
      title: "Memory Match Game",
      description: "My 4th attempt at a game. Got the idea while looking at Netlify's version!"
    },
    "0006": {
      title: "FaceBomp Game",
      description: "My 2nd attempt at making a more advance game via ChatGPT!"
    },
    "0005": {
      title: "Rock, Paper & Scissors",
      description: "My 1st initial attempt to make a very simple game."
    },
    "0004": {
      title: "Pizza Raffle",
      description: "Input names and a person is randomly chosen to get the lucky draw for pizza!"
    },
    "0003": {
      title: "Subscription",
      description: "Simple subscription page for BarkerBox!"
    },
    "0002": {
      title: "Groovy Soundkit",
      description: "To demonstrate sound effects by clicking on the buttons."
    },
    "0001": {
      title: "HoverChair",
      description: "A site hero project for HoverChair, a hovercraft-inspired desk chair. One of the earliest projects I did using ChatGPT. This was the starting point for all my newer projects!"
    },
    "0000": {
      title: "Test Empty Slide",
      description: "There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain..."
    }
  };

  // Update each card with title and description
  projectIds.forEach(id => {
    const card = document.querySelector(`#image_${id}`).closest('.project-card');
    if (card && projectDetails[id]) {
      const titleEl = card.querySelector('h4');
      const descEl = card.querySelector('p');

      if (titleEl) titleEl.textContent = projectDetails[id].title;
      // textContent treats everything as plain text
      if (descEl) descEl.innerHTML = projectDetails[id].description;
      // innerHTML render HTML tags as well.
    }
  });
}

// Initialize the project cards generation
generateProjectCards();

// Export function for possible future use
export { updateLink, updateImage };