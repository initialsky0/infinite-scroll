// Global image ready to load state, have to be global in this case
let LOAD_READY = false;


// Helper function to set attributes for DOM element
function setAttributes(element, attributes) {
   for(const key in attributes) {
      element.setAttribute(key, attributes[key]);
   }
}


// Display photos by generating elements of links and photos and add to DOM
function displayPhotos(photoArray) {
   const imageContainer = document.getElementById('image-container');
   const totalImages = photoArray.length;
   let imageLoaded = 0;

   // Run for each in photoArray
   photoArray.forEach(photo => {
      //  create <a> to link to Unsplash
      const item = document.createElement('a');
      const itemAttribute = {
         href : photo.links.html, 
         target : '_blank'
      };
      setAttributes(item, itemAttribute);

      // create <img> for photo
      const img = document.createElement('img');
      const imgAttributes = {
         src : photo.urls.regular,
         alt : photo.alt_description,
         title : photo.alt_description
      }
      setAttributes(img, imgAttributes);
      
      // Event listener, check if loading is done
      img.addEventListener('load', () => {
         // check if all image is loaded
         imageLoaded++;
         if(imageLoaded === totalImages) {
            LOAD_READY = true;

            // hide loader after first load
            document.getElementById('loader').hidden = true;
         }
      });
      
      // put <img> inside <a>, then put both inside imageContainer element
      item.appendChild(img);
      imageContainer.appendChild(item); 
   })
}


// Get photos from Unsplash API
async function getPhotos(photosOnLoad) {
   // Unsplash API, need proper api key for it to work
   const apiKey ='';
   const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${photosOnLoad}`;
   try {
      const resp = await fetch(apiUrl);
      const photoArray = await resp.json();
      displayPhotos(photoArray);
   } catch(err) {
      console.log('Error Occured:', err);
   }
}


function main() {
   const photoCount = 30;
   window.addEventListener('scroll', () => {
      if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && LOAD_READY) {
         LOAD_READY = false;
         getPhotos(photoCount);
      }
   })
   // get 10 photos from beginning
   getPhotos(10);
}

main();