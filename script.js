document.addEventListener('DOMContentLoaded', function() {
  // Gestion de la carte d'intro
  var introCard = document.getElementById('introCard');
  var closeIntroBtn = document.getElementById('closeIntro');
  closeIntroBtn.addEventListener('click', function() {
    introCard.style.display = 'none';
  });

  var menuBtn = document.getElementById('menuBtn');
  var sidebar = document.getElementById('sidebar');
  var closeSidebar = document.getElementById('closeSidebar');
  var cityItems = document.querySelectorAll('.sidebar ul li');

  var map = null;
  var cityCircle = null;
  var cityMarker = null;
  var villageMarkers = []; // pour stocker les marqueurs de villages

  // Centres des grandes villes (mise à jour de Tinchebray)
  var cityCenters = {
    "Tinchebray": {lat: 48.76667, lon: -0.73333},
    "Argentan": {lat: 48.7300, lon: 0.0000},
    "Sées": {lat: 48.4330, lon: 0.0340},
    "Alençon": {lat: 48.4320, lon: 0.0960},
    "Flers": {lat: 48.5560, lon: 0.0740}
  };

  // Définition des villages pour chaque ville avec leurs coordonnées, chemins d'images et description
  var villages = {
    "Tinchebray": [
      {
        name: "Montscret",
        lat: 48.799999,
        lon: -0.675,
        gallery: [
          "images/montscret-1.jpg",
          "images/montscret-2.jpg"
        ],
        description: "Historique du calvaire de Montscret. Ce monument remarquable date de [année] et représente [détails historiques]."
      },
      {
        name: "Frênes",
        lat: 48.783329,
        lon: -0.68333,
        gallery: [
          "images/frenes-1.jpg",
          "images/frenes-2.jpg"
        ],
        description: "Historique du calvaire de Frênes. Ce calvaire est connu pour [informations complémentaires]."
      },
      {
        name: "Landisacq",
        lat: 48.75,
        lon: -0.65,
        gallery: [
          "images/landisacq-1.jpg",
          "images/landisacq-2.jpg"
        ],
        description: "Historique du calvaire de Landisacq. Découvrez l'histoire et l'architecture de ce monument unique."
      }
    ],
    "Argentan": [
      {
        name: "Fontenai-les-Louvets",
        lat: 48.7350,
        lon: -0.0150,
        gallery: [
          "images/fontenai-les-louvets-1.jpg",
          "images/fontenai-les-louvets-2.jpg"
        ],
        description: "Historique du calvaire de Fontenai-les-Louvets."
      },
      {
        name: "Saint-Martin-des-Besaces",
        lat: 48.7450,
        lon: 0.0050,
        gallery: [
          "images/saint-martin-des-besaces-1.jpg",
          "images/saint-martin-des-besaces-2.jpg"
        ],
        description: "Historique du calvaire de Saint-Martin-des-Besaces."
      },
      {
        name: "Les Loges d'Argentan",
        lat: 48.7200,
        lon: -0.0100,
        gallery: [
          "images/les-loges-d-argentan-1.jpg",
          "images/les-loges-d-argentan-2.jpg"
        ],
        description: "Historique du calvaire des Loges d'Argentan."
      },
      {
        name: "La Houssaye",
        lat: 48.7300,
        lon: 0.0200,
        gallery: [
          "images/la-houssaye-1.jpg",
          "images/la-houssaye-2.jpg"
        ],
        description: "Historique du calvaire de La Houssaye."
      }
    ],
    "Sées": [
      {
        name: "Le Ménil-Broût",
        lat: 48.4400,
        lon: 0.0500,
        gallery: [
          "images/le-menil-brou-t-1.jpg",
          "images/le-menil-brou-t-2.jpg"
        ],
        description: "Historique du calvaire du Ménil-Broût."
      },
      {
        name: "La Chapelle-d'Estrées",
        lat: 48.4250,
        lon: 0.0200,
        gallery: [
          "images/la-chapelle-d-estrees-1.jpg",
          "images/la-chapelle-d-estrees-2.jpg"
        ],
        description: "Historique du calvaire de La Chapelle-d'Estrées."
      },
      {
        name: "Saint-Martin-des-Loges",
        lat: 48.4350,
        lon: 0.0400,
        gallery: [
          "images/saint-martin-des-loges-1.jpg",
          "images/saint-martin-des-loges-2.jpg"
        ],
        description: "Historique du calvaire de Saint-Martin-des-Loges."
      },
      {
        name: "Les Ormes",
        lat: 48.4300,
        lon: 0.0300,
        gallery: [
          "images/les-ormes-1.jpg",
          "images/les-ormes-2.jpg"
        ],
        description: "Historique du calvaire des Ormes."
      }
    ],
    "Alençon": [
      {
        name: "La Chapelle-sous-Alençon",
        lat: 48.4370,
        lon: 0.1050,
        gallery: [
          "images/la-chapelle-sous-alencon-1.jpg",
          "images/la-chapelle-sous-alencon-2.jpg"
        ],
        description: "Historique du calvaire de La Chapelle-sous-Alençon."
      },
      {
        name: "Saint-Pierre-de-Lamotte",
        lat: 48.4250,
        lon: 0.0900,
        gallery: [
          "images/saint-pierre-de-lamotte-1.jpg",
          "images/saint-pierre-de-lamotte-2.jpg"
        ],
        description: "Historique du calvaire de Saint-Pierre-de-Lamotte."
      },
      {
        name: "Vieux-Moulin",
        lat: 48.4400,
        lon: 0.0850,
        gallery: [
          "images/vieux-moulin-1.jpg",
          "images/vieux-moulin-2.jpg"
        ],
        description: "Historique du calvaire du Vieux-Moulin."
      },
      {
        name: "La Garenne",
        lat: 48.4280,
        lon: 0.1000,
        gallery: [
          "images/la-garenne-1.jpg",
          "images/la-garenne-2.jpg"
        ],
        description: "Historique du calvaire de La Garenne."
      }
    ],
    "Flers": [
      {
        name: "La Chapelle-au-Moine",
        lat: 48.5620,
        lon: 0.0800,
        gallery: [
          "images/la-chapelle-au-moine-1.jpg",
          "images/la-chapelle-au-moine-2.jpg"
        ],
        description: "Historique du calvaire de La Chapelle-au-Moine."
      },
      {
        name: "Le Vassoult",
        lat: 48.5500,
        lon: 0.0650,
        gallery: [
          "images/le-vassoult-1.jpg",
          "images/le-vassoult-2.jpg"
        ],
        description: "Historique du calvaire de Le Vassoult."
      },
      {
        name: "Saint-Aubin-du-Perron",
        lat: 48.5650,
        lon: 0.0700,
        gallery: [
          "images/saint-aubin-du-perron-1.jpg",
          "images/saint-aubin-du-perron-2.jpg"
        ],
        description: "Historique du calvaire de Saint-Aubin-du-Perron."
      },
      {
        name: "Le Coudray",
        lat: 48.5580,
        lon: 0.0850,
        gallery: [
          "images/le-coudray-1.jpg",
          "images/le-coudray-2.jpg"
        ],
        description: "Historique du calvaire de Le Coudray."
      }
    ]
  };

  // Variables de la galerie
  var galleryModal = document.getElementById('galleryModal');
  var galleryImage = document.getElementById('galleryImage');
  var closeGallery = document.getElementById('closeGallery');
  var prevSlide = document.getElementById('prevSlide');
  var nextSlide = document.getElementById('nextSlide');
  var currentVillageGallery = [];
  var currentSlideIndex = 0;

  // Gestion du panel d'information
  var infoPanel = document.getElementById('infoPanel');
  var infoContent = document.getElementById('infoContent');
  var closeInfo = document.getElementById('closeInfo');
  closeInfo.addEventListener('click', function() {
    infoPanel.style.display = 'none';
  });

  // Gestion du sidebar
  menuBtn.addEventListener('click', function(event) {
    sidebar.classList.toggle('active');
    event.stopPropagation();
  });
  closeSidebar.addEventListener('click', function(event) {
    sidebar.classList.remove('active');
    event.stopPropagation();
  });
  document.addEventListener('click', function(event) {
    if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && event.target !== menuBtn) {
      sidebar.classList.remove('active');
    }
  });

  // Gestion du clic sur une ville dans le sidebar
  cityItems.forEach(function(item) {
    item.addEventListener('click', function(event) {
      var cityName = this.getAttribute('data-city');
      var center = cityCenters[cityName];
      if (!center) return;

      // Initialisation ou mise à jour de la carte
      if (map === null) {
        map = L.map('map').setView([center.lat, center.lon], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
      } else {
        map.setView([center.lat, center.lon], 12);
      }

      // Supprime le cercle, le marqueur central et les marqueurs de villages existants
      if (cityCircle) { map.removeLayer(cityCircle); }
      if (cityMarker) { map.removeLayer(cityMarker); }
      villageMarkers.forEach(function(marker) { map.removeLayer(marker); });
      villageMarkers = [];

      // Ajoute le cercle de 15 km autour du centre
      cityCircle = L.circle([center.lat, center.lon], {
        radius: 15000,
        color: 'blue',
        fillColor: 'lightblue',
        fillOpacity: 0.2
      }).addTo(map);

      // Ajoute un marqueur pour le centre de la ville
      cityMarker = L.marker([center.lat, center.lon]).addTo(map)
        .bindPopup("<strong>" + cityName + "</strong>")
        .openPopup();

      // Ajoute les marqueurs des villages pour la ville sélectionnée
      if (villages[cityName]) {
        villages[cityName].forEach(function(village) {
          var greenIcon = new L.Icon({
            iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          });
          var marker = L.marker([village.lat, village.lon], {icon: greenIcon}).addTo(map);
          marker.bindPopup("<strong>" + village.name + "</strong>");
          marker.on('click', function() {
            currentVillageGallery = village.gallery;
            // Affiche le panel d'info avec la description du calvaire et ajoute un bouton pour voir les photos
            var desc = village.description || "Historique du calvaire de " + village.name + ".";
            openInfoPanel(desc);
          });
          villageMarkers.push(marker);
        });
      }
      
      // Masque le welcome overlay si présent
      var welcomeOverlay = document.getElementById('welcomeOverlay');
      if (welcomeOverlay) {
        welcomeOverlay.style.display = "none";
      }
      
      sidebar.classList.remove('active');
      event.stopPropagation();
    });
  });

  // Fonctions de la galerie
  function showSlide(index) {
    if (currentVillageGallery.length === 0) return;
    if (index >= currentVillageGallery.length) { index = 0; }
    if (index < 0) { index = currentVillageGallery.length - 1; }
    currentSlideIndex = index;
    galleryImage.src = currentVillageGallery[currentSlideIndex];
  }

  function openGallery() {
    galleryModal.style.display = "block";
    showSlide(currentSlideIndex);
  }

  function closeGalleryModal() {
    galleryModal.style.display = "none";
  }

  closeGallery.addEventListener('click', closeGalleryModal);
  prevSlide.addEventListener('click', function() {
    showSlide(currentSlideIndex - 1);
  });
  nextSlide.addEventListener('click', function() {
    showSlide(currentSlideIndex + 1);
  });
  galleryModal.addEventListener('click', function(e) {
    if (e.target == galleryModal) {
      closeGalleryModal();
    }
  });

  // Fonction pour ouvrir le panel d'information avec le texte de description
  // et ajouter un bouton "Voir les photos" si des images sont disponibles
  function openInfoPanel(text) {
    infoContent.innerHTML = "<p>" + text + "</p>";
    if (currentVillageGallery.length > 0) {
      infoContent.innerHTML += "<button id='openGalleryBtn' class='photo-btn'>Voir les photos</button>";
      var openGalleryBtn = document.getElementById('openGalleryBtn');
      openGalleryBtn.addEventListener('click', function() {
        openGallery();
      });
    }
    infoPanel.style.display = "block";
  }
  
});
