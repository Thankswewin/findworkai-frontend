// Business-specific website templates with unique designs
// Each business type gets a completely different layout and style

import { BusinessData } from './ai-website-generator'

export function generateBusinessSpecificWebsite(business: BusinessData): string {
  // Safely handle category with fallback
  const category = (business.category || business.type || 'Business').toLowerCase()
  
  // Select unique template based on business category
  switch(category) {
    case 'hotel':
    case 'lodging':
    case 'accommodation':
      return generateHotelWebsite(business)
    case 'restaurant':
    case 'food':
    case 'cafe':
    case 'bakery':
      return generateRestaurantWebsite(business)
    
    case 'healthcare':
    case 'medical':
    case 'dental':
    case 'clinic':
      return generateHealthcareWebsite(business)
    
    case 'law':
    case 'legal':
    case 'attorney':
      return generateLawFirmWebsite(business)
    
    case 'beauty':
    case 'salon':
    case 'spa':
      return generateBeautySalonWebsite(business)
    
    case 'fitness':
    case 'gym':
    case 'yoga':
      return generateFitnessWebsite(business)
    
    case 'auto':
    case 'automotive':
    case 'mechanic':
      return generateAutoWebsite(business)
    
    case 'real estate':
    case 'realty':
    case 'property':
      return generateRealEstateWebsite(business)
    
    case 'technology':
    case 'it':
    case 'software':
      return generateTechWebsite(business)
    
    default:
      return generateCreativeModernWebsite(business)
  }
}

// Hotel Website - Luxurious, booking-focused, amenity-rich
function generateHotelWebsite(business: BusinessData): string {
  const name = business.name || 'Luxury Hotel'
  const location = business.location || 'Prime Location'
  const rating = business.rating || 5
  const reviews = business.totalReviews || 0
  const phone = business.phone || '1-800-HOTEL'
  const description = business.description || 'Experience luxury and comfort at its finest'
  
  // Use actual business hours if available
  const hours = business.hours || {
    monday: '24 Hours',
    tuesday: '24 Hours',
    wednesday: '24 Hours',
    thursday: '24 Hours',
    friday: '24 Hours',
    saturday: '24 Hours',
    sunday: '24 Hours'
  }
  
  // Use actual amenities if available
  const amenities = business.amenities || [
    'Free WiFi',
    'Swimming Pool',
    'Fitness Center',
    'Restaurant',
    'Room Service',
    'Spa',
    'Business Center',
    'Parking'
  ]
  
  // Use actual services if available
  const services = business.services || [
    'Concierge',
    'Airport Shuttle',
    'Laundry',
    'Valet Parking'
  ]
  
  // Use actual photos if available
  const photos = business.photos || [
    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600', caption: 'Hotel Exterior' },
    { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600', caption: 'Luxury Room' },
    { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600', caption: 'Pool Area' }
  ]
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Luxury Accommodation in ${location}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        .hero-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .luxury-shadow {
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        .float-animation {
            animation: float 6s ease-in-out infinite;
        }
    </style>
</head>
<body class="font-montserrat">
    <!-- Premium Navigation -->
    <nav class="fixed w-full z-50 bg-white/95 backdrop-blur-lg shadow-xl">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center gap-2">
                    <svg class="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                    </svg>
                    <span class="font-cormorant text-3xl font-bold text-gray-800">${name}</span>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#rooms" class="text-gray-700 hover:text-purple-600 transition">Rooms</a>
                    <a href="#amenities" class="text-gray-700 hover:text-purple-600 transition">Amenities</a>
                    <a href="#dining" class="text-gray-700 hover:text-purple-600 transition">Dining</a>
                    <a href="#contact" class="text-gray-700 hover:text-purple-600 transition">Contact</a>
                    <a href="#book" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition">Book Now</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section with Image Carousel -->
    <section class="relative min-h-screen flex items-center">
        <div class="absolute inset-0">
            <img src="${photos[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600'}" 
                 alt="${name}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div class="container mx-auto px-4 relative z-10">
            <div class="max-w-3xl">
                <h1 class="font-cormorant text-6xl md:text-8xl text-white font-bold mb-4">
                    Welcome to ${name}
                </h1>
                <p class="text-2xl text-white/90 mb-8">${description}</p>
                <div class="flex items-center gap-4 mb-8">
                    <div class="flex text-yellow-400">
                        ${Array(5).fill('★').join('')}
                    </div>
                    <span class="text-white">${rating} Stars • ${reviews} Reviews</span>
                </div>
                <div class="flex flex-col sm:flex-row gap-4">
                    <button class="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition">
                        Check Availability
                    </button>
                    <button class="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition">
                        Virtual Tour
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Amenities Section -->
    <section id="amenities" class="py-20 bg-gray-50">
        <div class="container mx-auto px-4">
            <h2 class="font-cormorant text-5xl text-center mb-12">Hotel Amenities</h2>
            <div class="grid md:grid-cols-4 gap-6">
                ${amenities.map(amenity => `
                <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                    <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h3 class="font-semibold text-lg">${amenity}</h3>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Contact & Location -->
    <section id="contact" class="py-20 bg-gray-900 text-white">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-2 gap-12">
                <div>
                    <h3 class="font-cormorant text-4xl mb-6">Contact Us</h3>
                    <div class="space-y-4">
                        <p class="flex items-center gap-3">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                            </svg>
                            ${phone}
                        </p>
                        <p class="flex items-center gap-3">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                            </svg>
                            ${location}
                        </p>
                    </div>
                    
                    <h4 class="font-cormorant text-2xl mt-8 mb-4">Reception Hours</h4>
                    <p>Our reception is available 24/7 for your convenience</p>
                </div>
                
                <div>
                    <h3 class="font-cormorant text-4xl mb-6">Book Your Stay</h3>
                    <form class="space-y-4">
                        <input type="text" placeholder="Your Name" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60">
                        <input type="email" placeholder="Email Address" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60">
                        <input type="date" placeholder="Check-in Date" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                        <input type="date" placeholder="Check-out Date" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                        <button type="submit" class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition">
                            Check Availability
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</body>
</html>`
}

// Restaurant Website - Warm, inviting, menu-focused
function generateRestaurantWebsite(business: BusinessData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Delicious Food & Memorable Experiences</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-open { font-family: 'Open Sans', sans-serif; }
        .parallax-bg {
            background-image: url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1600');
            background-attachment: fixed;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            position: relative;
        }
        .parallax-bg::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.4);
        }
        .menu-card {
            background: linear-gradient(135deg, #fff 0%, #fafafa 100%);
            transition: all 0.3s ease;
        }
        .menu-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body class="font-open">
    <!-- Elegant Navigation -->
    <nav class="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-lg">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <div class="font-playfair text-3xl font-bold text-amber-800">${business.name}</div>
                <div class="hidden md:flex space-x-8">
                    <a href="#home" class="text-gray-700 hover:text-amber-600 transition">Home</a>
                    <a href="#menu" class="text-gray-700 hover:text-amber-600 transition">Menu</a>
                    <a href="#about" class="text-gray-700 hover:text-amber-600 transition">About</a>
                    <a href="#reservations" class="bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition">Reserve Table</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero with Parallax -->
    <section id="home" class="parallax-bg min-h-screen flex items-center">
        <div class="container mx-auto px-4 relative z-10 text-center text-white">
            <h1 class="font-playfair text-6xl md:text-8xl font-bold mb-4 animate-fade-in">
                Welcome to ${business.name}
            </h1>
            <p class="text-2xl mb-8 font-light">Where Every Meal is a Celebration</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button class="bg-amber-600 text-white px-8 py-4 rounded-full text-lg hover:bg-amber-700 transition transform hover:scale-105">
                    View Our Menu
                </button>
                <button class="border-2 border-white text-white px-8 py-4 rounded-full text-lg hover:bg-white hover:text-gray-900 transition">
                    Make Reservation
                </button>
            </div>
            <div class="mt-12">
                <p class="text-yellow-300">★★★★★ ${business.rating} Stars • ${business.totalReviews} Reviews</p>
            </div>
        </div>
    </section>

    <!-- Signature Dishes -->
    <section id="menu" class="py-20 bg-amber-50">
        <div class="container mx-auto px-4">
            <h2 class="font-playfair text-5xl text-center mb-4">Our Signature Dishes</h2>
            <p class="text-center text-gray-600 mb-12">Crafted with passion, served with love</p>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="menu-card rounded-2xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <h3 class="font-playfair text-2xl mb-2">Chef's Special</h3>
                        <p class="text-gray-600 mb-4">Our award-winning signature dish that brings flavors from around the world</p>
                        <div class="flex justify-between items-center">
                            <span class="text-3xl font-bold text-amber-600">$24</span>
                            <button class="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700">Order Now</button>
                        </div>
                    </div>
                </div>
                
                <div class="menu-card rounded-2xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <h3 class="font-playfair text-2xl mb-2">Gourmet Delight</h3>
                        <p class="text-gray-600 mb-4">Fresh ingredients combined in perfect harmony for an unforgettable taste</p>
                        <div class="flex justify-between items-center">
                            <span class="text-3xl font-bold text-amber-600">$28</span>
                            <button class="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700">Order Now</button>
                        </div>
                    </div>
                </div>
                
                <div class="menu-card rounded-2xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <h3 class="font-playfair text-2xl mb-2">Sweet Finale</h3>
                        <p class="text-gray-600 mb-4">Indulgent desserts to perfectly end your dining experience</p>
                        <div class="flex justify-between items-center">
                            <span class="text-3xl font-bold text-amber-600">$12</span>
                            <button class="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700">Order Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Opening Hours & Location -->
    <section class="py-20 bg-gray-900 text-white">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-2 gap-12">
                <div>
                    <h3 class="font-playfair text-4xl mb-6">Opening Hours</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between py-2 border-b border-gray-700">
                            <span>Monday - Thursday</span>
                            <span>11:00 AM - 10:00 PM</span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-gray-700">
                            <span>Friday - Saturday</span>
                            <span>11:00 AM - 11:00 PM</span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-gray-700">
                            <span>Sunday</span>
                            <span>12:00 PM - 9:00 PM</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 class="font-playfair text-4xl mb-6">Visit Us</h3>
                    <p class="text-xl mb-4">${business.location}</p>
                    <p class="mb-4">Experience fine dining in the heart of the city</p>
                    <button class="bg-amber-600 text-white px-6 py-3 rounded-full hover:bg-amber-700 transition">
                        Get Directions
                    </button>
                </div>
            </div>
        </div>
    </section>
</body>
</html>`
}

// Healthcare Website - Clean, professional, trustworthy
function generateHealthcareWebsite(business: BusinessData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Your Health, Our Priority</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .health-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .float-animation { animation: float 6s ease-in-out infinite; }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }
        .medical-card {
            background: white;
            border-radius: 20px;
            transition: all 0.3s ease;
        }
        .medical-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Professional Navigation -->
    <nav class="fixed w-full z-50 bg-white shadow-md">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span class="text-white text-2xl">+</span>
                    </div>
                    <div>
                        <h1 class="text-xl font-bold text-gray-900">${business.name}</h1>
                        <p class="text-xs text-gray-600">Healthcare Excellence</p>
                    </div>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#services" class="text-gray-700 hover:text-blue-600">Services</a>
                    <a href="#doctors" class="text-gray-700 hover:text-blue-600">Our Doctors</a>
                    <a href="#contact" class="text-gray-700 hover:text-blue-600">Contact</a>
                    <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Book Appointment
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-20 min-h-screen flex items-center health-gradient">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div class="text-white">
                    <h1 class="text-5xl md:text-6xl font-bold mb-6">
                        Your Health Journey Starts Here
                    </h1>
                    <p class="text-xl mb-8 opacity-90">
                        Providing compassionate, comprehensive healthcare with ${business.rating}-star rated service
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button class="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100">
                            Schedule Consultation
                        </button>
                        <button class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
                            Emergency Care
                        </button>
                    </div>
                    <div class="mt-8 flex items-center space-x-6">
                        <div>
                            <p class="text-3xl font-bold">${business.totalReviews}+</p>
                            <p class="text-sm opacity-90">Happy Patients</p>
                        </div>
                        <div>
                            <p class="text-3xl font-bold">24/7</p>
                            <p class="text-sm opacity-90">Emergency Care</p>
                        </div>
                        <div>
                            <p class="text-3xl font-bold">15+</p>
                            <p class="text-sm opacity-90">Years Experience</p>
                        </div>
                    </div>
                </div>
                <div class="float-animation">
                    <img src="https://images.unsplash.com/photo-1559328007-7862302062f0?w=600" 
                         class="rounded-2xl shadow-2xl">
                </div>
            </div>
        </div>
    </section>

    <!-- Services Grid -->
    <section id="services" class="py-20">
        <div class="container mx-auto px-4">
            <h2 class="text-4xl font-bold text-center mb-4">Our Medical Services</h2>
            <p class="text-center text-gray-600 mb-12">Comprehensive care for all your health needs</p>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="medical-card p-8 text-center">
                    <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-4xl">🏥</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-3">Primary Care</h3>
                    <p class="text-gray-600">Comprehensive health assessments and preventive care</p>
                </div>
                
                <div class="medical-card p-8 text-center">
                    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-4xl">💊</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-3">Specialized Treatment</h3>
                    <p class="text-gray-600">Expert care for specific health conditions</p>
                </div>
                
                <div class="medical-card p-8 text-center">
                    <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-4xl">🔬</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-3">Diagnostics</h3>
                    <p class="text-gray-600">State-of-the-art testing and imaging services</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-blue-50">
        <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto">
                <h2 class="text-4xl font-bold text-center mb-12">Get In Touch</h2>
                <div class="bg-white rounded-2xl shadow-xl p-8">
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-xl font-semibold mb-4">Contact Information</h3>
                            <div class="space-y-4">
                                <p class="flex items-center">
                                    <span class="text-2xl mr-3">📍</span>
                                    ${business.location}
                                </p>
                                ${business.phone ? `<p class="flex items-center">
                                    <span class="text-2xl mr-3">📞</span>
                                    ${business.phone}
                                </p>` : ''}
                                <p class="flex items-center">
                                    <span class="text-2xl mr-3">⏰</span>
                                    Mon-Fri: 8AM-6PM
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold mb-4">Book Appointment</h3>
                            <form class="space-y-4">
                                <input type="text" placeholder="Your Name" class="w-full px-4 py-3 border rounded-lg">
                                <input type="tel" placeholder="Phone Number" class="w-full px-4 py-3 border rounded-lg">
                                <select class="w-full px-4 py-3 border rounded-lg">
                                    <option>Select Service</option>
                                    <option>Primary Care</option>
                                    <option>Specialized Treatment</option>
                                    <option>Diagnostics</option>
                                </select>
                                <button class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                                    Schedule Appointment
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</body>
</html>`
}

// Law Firm Website - Professional, authoritative, trustworthy
function generateLawFirmWebsite(business: BusinessData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Legal Excellence & Trust</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        .law-gradient { background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); }
        .scale-image { 
            transition: transform 0.5s ease;
        }
        .scale-image:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body class="font-montserrat bg-gray-50">
    <!-- Prestigious Navigation -->
    <nav class="fixed w-full z-50 bg-white shadow-lg">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-5">
                <div>
                    <h1 class="font-cormorant text-3xl font-bold text-gray-900">${business.name}</h1>
                    <p class="text-xs text-gray-600 tracking-widest">ATTORNEYS AT LAW</p>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#practice" class="text-gray-700 hover:text-blue-900 font-medium">Practice Areas</a>
                    <a href="#team" class="text-gray-700 hover:text-blue-900 font-medium">Our Team</a>
                    <a href="#results" class="text-gray-700 hover:text-blue-900 font-medium">Case Results</a>
                    <button class="bg-blue-900 text-white px-6 py-3 rounded hover:bg-blue-800">
                        Free Consultation
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-24 law-gradient text-white">
        <div class="container mx-auto px-4 py-20">
            <div class="max-w-4xl">
                <h1 class="font-cormorant text-6xl md:text-7xl font-bold mb-6">
                    Fighting For Justice.<br>
                    Protecting Your Rights.
                </h1>
                <p class="text-xl mb-8 opacity-90 font-light">
                    With over 20 years of experience and ${business.totalReviews}+ successful cases, 
                    we provide exceptional legal representation you can trust.
                </p>
                <div class="flex flex-col sm:flex-row gap-4">
                    <button class="bg-white text-blue-900 px-8 py-4 rounded font-semibold hover:bg-gray-100">
                        Schedule Consultation
                    </button>
                    <button class="border-2 border-white text-white px-8 py-4 rounded font-semibold hover:bg-white hover:text-blue-900">
                        Call ${business.phone || '1-800-LAW-FIRM'}
                    </button>
                </div>
                <div class="mt-12 flex items-center space-x-8">
                    <div>
                        <p class="text-3xl font-bold">${business.rating}★</p>
                        <p class="text-sm opacity-80">Client Rating</p>
                    </div>
                    <div>
                        <p class="text-3xl font-bold">95%</p>
                        <p class="text-sm opacity-80">Success Rate</p>
                    </div>
                    <div>
                        <p class="text-3xl font-bold">$50M+</p>
                        <p class="text-sm opacity-80">Recovered</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Practice Areas -->
    <section id="practice" class="py-20">
        <div class="container mx-auto px-4">
            <h2 class="font-cormorant text-5xl text-center mb-4">Practice Areas</h2>
            <p class="text-center text-gray-600 mb-12">Comprehensive Legal Services</p>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="group cursor-pointer">
                    <div class="overflow-hidden rounded-lg mb-4">
                        <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400" 
                             class="w-full h-64 object-cover scale-image">
                    </div>
                    <h3 class="font-cormorant text-2xl font-semibold mb-2">Personal Injury</h3>
                    <p class="text-gray-600">Maximum compensation for accident victims</p>
                </div>
                
                <div class="group cursor-pointer">
                    <div class="overflow-hidden rounded-lg mb-4">
                        <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400" 
                             class="w-full h-64 object-cover scale-image">
                    </div>
                    <h3 class="font-cormorant text-2xl font-semibold mb-2">Business Law</h3>
                    <p class="text-gray-600">Protecting your business interests</p>
                </div>
                
                <div class="group cursor-pointer">
                    <div class="overflow-hidden rounded-lg mb-4">
                        <img src="https://images.unsplash.com/photo-1593115057322-e94b77572f20?w=400" 
                             class="w-full h-64 object-cover scale-image">
                    </div>
                    <h3 class="font-cormorant text-2xl font-semibold mb-2">Family Law</h3>
                    <p class="text-gray-600">Compassionate family legal services</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact CTA -->
    <section class="py-20 bg-gray-900 text-white">
        <div class="container mx-auto px-4 text-center">
            <h2 class="font-cormorant text-5xl mb-6">Need Legal Assistance?</h2>
            <p class="text-xl mb-8 opacity-90">Get a free consultation with our experienced attorneys</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button class="bg-white text-gray-900 px-8 py-4 rounded font-semibold hover:bg-gray-100">
                    Schedule Free Consultation
                </button>
                <button class="border-2 border-white px-8 py-4 rounded font-semibold hover:bg-white hover:text-gray-900">
                    24/7 Emergency Line
                </button>
            </div>
            <p class="mt-8 text-lg">Located in ${business.location}</p>
        </div>
    </section>
</body>
</html>`
}

// Beauty Salon Website - Elegant, modern, luxurious
function generateBeautySalonWebsite(business: BusinessData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Beauty & Wellness</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Italiana&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        .font-italiana { font-family: 'Italiana', serif; }
        .font-poppins { font-family: 'Poppins', sans-serif; }
        .beauty-gradient { 
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        .service-card {
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            transition: all 0.4s ease;
        }
        .service-card:hover {
            transform: translateY(-10px) rotate(-2deg);
        }
        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }
        .shimmer {
            background: linear-gradient(90deg, #fff 0%, #f0f0f0 50%, #fff 100%);
            background-size: 1000px 100%;
            animation: shimmer 3s infinite;
        }
    </style>
</head>
<body class="font-poppins">
    <!-- Elegant Navigation -->
    <nav class="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-lg">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <h1 class="font-italiana text-3xl text-pink-600">${business.name}</h1>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#services" class="text-gray-700 hover:text-pink-600">Services</a>
                    <a href="#gallery" class="text-gray-700 hover:text-pink-600">Gallery</a>
                    <a href="#team" class="text-gray-700 hover:text-pink-600">Our Team</a>
                    <button class="beauty-gradient text-white px-6 py-2 rounded-full hover:shadow-lg">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-20 min-h-screen flex items-center beauty-gradient">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div class="text-white">
                    <h1 class="font-italiana text-6xl md:text-7xl mb-6">
                        Discover Your<br>
                        True Beauty
                    </h1>
                    <p class="text-xl mb-8 opacity-90">
                        Where luxury meets expertise. ${business.rating}-star rated salon 
                        with ${business.totalReviews}+ happy clients
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button class="bg-white text-pink-600 px-8 py-4 rounded-full font-semibold hover:shadow-lg">
                            Book Appointment
                        </button>
                        <button class="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-pink-600">
                            View Services
                        </button>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300" 
                         class="rounded-2xl shadow-2xl transform rotate-3">
                    <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300" 
                         class="rounded-2xl shadow-2xl transform -rotate-3 mt-8">
                </div>
            </div>
        </div>
    </section>

    <!-- Services -->
    <section id="services" class="py-20 bg-pink-50">
        <div class="container mx-auto px-4">
            <h2 class="font-italiana text-5xl text-center mb-12">Our Services</h2>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="service-card rounded-2xl p-8 text-white">
                    <h3 class="font-italiana text-3xl mb-4">Hair Styling</h3>
                    <p class="mb-6">Transform your look with our expert stylists</p>
                    <p class="text-3xl font-bold">From $50</p>
                </div>
                
                <div class="service-card rounded-2xl p-8 text-white">
                    <h3 class="font-italiana text-3xl mb-4">Spa & Wellness</h3>
                    <p class="mb-6">Relax and rejuvenate with our spa treatments</p>
                    <p class="text-3xl font-bold">From $80</p>
                </div>
                
                <div class="service-card rounded-2xl p-8 text-white">
                    <h3 class="font-italiana text-3xl mb-4">Makeup Artistry</h3>
                    <p class="mb-6">Professional makeup for any occasion</p>
                    <p class="text-3xl font-bold">From $60</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Special Offers -->
    <section class="py-20 bg-white">
        <div class="container mx-auto px-4">
            <div class="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-12 text-center">
                <h2 class="font-italiana text-5xl mb-6">Special Offer</h2>
                <p class="text-2xl mb-8">First Visit? Get 20% Off All Services!</p>
                <button class="beauty-gradient text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg">
                    Claim Your Discount
                </button>
            </div>
        </div>
    </section>

    <!-- Location -->
    <section class="py-20 bg-gray-900 text-white">
        <div class="container mx-auto px-4 text-center">
            <h2 class="font-italiana text-5xl mb-6">Visit Our Salon</h2>
            <p class="text-xl mb-4">${business.location}</p>
            <p class="mb-8">Open Monday - Saturday | 9:00 AM - 8:00 PM</p>
            <button class="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100">
                Get Directions
            </button>
        </div>
    </section>
</body>
</html>`
}

// Fitness/Gym Website - Energetic, motivational, dynamic
function generateFitnessWebsite(business: BusinessData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Transform Your Life</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        .font-bebas { font-family: 'Bebas Neue', cursive; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .fitness-gradient { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .pulse-animation {
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        .diagonal-section {
            clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
        }
    </style>
</head>
<body class="font-inter bg-black text-white">
    <!-- Dynamic Navigation -->
    <nav class="fixed w-full z-50 bg-black/90 backdrop-blur-md">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <h1 class="font-bebas text-4xl text-white">${business.name}</h1>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#programs" class="text-gray-300 hover:text-white">Programs</a>
                    <a href="#trainers" class="text-gray-300 hover:text-white">Trainers</a>
                    <a href="#membership" class="text-gray-300 hover:text-white">Membership</a>
                    <button class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 pulse-animation">
                        Start Free Trial
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="min-h-screen flex items-center relative overflow-hidden"
             style="background-image: url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600'); background-size: cover; background-position: center;">
        <div class="absolute inset-0 bg-black/60"></div>
        <div class="container mx-auto px-4 relative z-10">
            <div class="max-w-3xl">
                <h1 class="font-bebas text-7xl md:text-9xl mb-4">
                    NO PAIN<br>
                    <span class="text-red-600">NO GAIN</span>
                </h1>
                <p class="text-2xl mb-8">
                    Join ${business.totalReviews}+ members already transforming their lives
                </p>
                <div class="flex flex-col sm:flex-row gap-4">
                    <button class="bg-red-600 text-white px-8 py-4 rounded text-lg font-bold hover:bg-red-700">
                        Join Now - 7 Days Free
                    </button>
                    <button class="border-2 border-white text-white px-8 py-4 rounded text-lg hover:bg-white hover:text-black">
                        Watch Tour Video
                    </button>
                </div>
                <div class="mt-12 flex items-center space-x-8">
                    <div>
                        <p class="font-bebas text-4xl">${business.rating}★</p>
                        <p class="text-sm">Member Rating</p>
                    </div>
                    <div>
                        <p class="font-bebas text-4xl">24/7</p>
                        <p class="text-sm">Always Open</p>
                    </div>
                    <div>
                        <p class="font-bebas text-4xl">50+</p>
                        <p class="text-sm">Classes/Week</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Training Programs -->
    <section id="programs" class="py-20 bg-gray-900">
        <div class="container mx-auto px-4">
            <h2 class="font-bebas text-6xl text-center mb-12">Training Programs</h2>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-gradient-to-br from-red-600 to-orange-600 rounded-lg p-8 transform hover:scale-105 transition">
                    <h3 class="font-bebas text-3xl mb-4">STRENGTH TRAINING</h3>
                    <p class="mb-6">Build muscle and increase power with our comprehensive strength program</p>
                    <button class="bg-white text-black px-6 py-2 rounded font-bold">Learn More</button>
                </div>
                
                <div class="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-8 transform hover:scale-105 transition">
                    <h3 class="font-bebas text-3xl mb-4">CARDIO BLAST</h3>
                    <p class="mb-6">High-intensity cardio workouts to burn calories and boost endurance</p>
                    <button class="bg-white text-black px-6 py-2 rounded font-bold">Learn More</button>
                </div>
                
                <div class="bg-gradient-to-br from-green-600 to-teal-600 rounded-lg p-8 transform hover:scale-105 transition">
                    <h3 class="font-bebas text-3xl mb-4">YOGA & WELLNESS</h3>
                    <p class="mb-6">Find balance and flexibility with our mind-body wellness classes</p>
                    <button class="bg-white text-black px-6 py-2 rounded font-bold">Learn More</button>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-red-600">
        <div class="container mx-auto px-4 text-center">
            <h2 class="font-bebas text-6xl mb-6">Ready to Transform?</h2>
            <p class="text-2xl mb-8">Join ${business.name} in ${business.location} Today!</p>
            <button class="bg-black text-white px-12 py-5 rounded text-xl font-bold hover:bg-gray-900">
                Start Your Journey
            </button>
        </div>
    </section>
</body>
</html>`
}

// Auto/Mechanic Website - Trustworthy, technical, reliable
function generateAutoWebsite(business: BusinessData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Expert Auto Service</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Russo+One&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        .font-russo { font-family: 'Russo One', sans-serif; }
        .font-roboto { font-family: 'Roboto', sans-serif; }
        .auto-gradient { 
            background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
        }
        .gear-spin {
            animation: spin 10s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="font-roboto bg-gray-100">
    <!-- Navigation -->
    <nav class="fixed w-full z-50 bg-gray-900 text-white">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-red-600 rounded flex items-center justify-center">
                        <span class="text-2xl">🔧</span>
                    </div>
                    <h1 class="font-russo text-2xl">${business.name}</h1>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#services" class="hover:text-red-500">Services</a>
                    <a href="#specials" class="hover:text-red-500">Specials</a>
                    <a href="#contact" class="hover:text-red-500">Contact</a>
                    <button class="bg-red-600 px-6 py-2 rounded hover:bg-red-700">
                        Get Quote
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero -->
    <section class="pt-20 auto-gradient text-white">
        <div class="container mx-auto px-4 py-20">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h1 class="font-russo text-5xl md:text-6xl mb-6">
                        YOUR CAR'S<br>
                        BEST FRIEND
                    </h1>
                    <p class="text-xl mb-8">
                        Trusted by ${business.totalReviews}+ drivers in ${business.location}. 
                        ${business.rating}-star rated service you can count on.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button class="bg-white text-gray-900 px-8 py-4 rounded font-bold hover:bg-gray-100">
                            Schedule Service
                        </button>
                        <button class="border-2 border-white px-8 py-4 rounded font-bold hover:bg-white hover:text-gray-900">
                            Call Now
                        </button>
                    </div>
                </div>
                <div class="relative">
                    <img src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600" 
                         class="rounded-lg shadow-2xl">
                    <div class="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center gear-spin">
                        <span class="text-4xl">⚙️</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Grid -->
    <section id="services" class="py-20">
        <div class="container mx-auto px-4">
            <h2 class="font-russo text-4xl text-center mb-12">Our Services</h2>
            
            <div class="grid md:grid-cols-4 gap-6">
                <div class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">
                    <span class="text-4xl mb-4 block">🛢️</span>
                    <h3 class="font-bold text-lg mb-2">Oil Change</h3>
                    <p class="text-gray-600">Quick & affordable</p>
                </div>
                
                <div class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">
                    <span class="text-4xl mb-4 block">🔧</span>
                    <h3 class="font-bold text-lg mb-2">Brake Service</h3>
                    <p class="text-gray-600">Safety first</p>
                </div>
                
                <div class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">
                    <span class="text-4xl mb-4 block">⚡</span>
                    <h3 class="font-bold text-lg mb-2">Engine Repair</h3>
                    <p class="text-gray-600">Expert diagnostics</p>
                </div>
                
                <div class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">
                    <span class="text-4xl mb-4 block">🚗</span>
                    <h3 class="font-bold text-lg mb-2">Full Service</h3>
                    <p class="text-gray-600">Complete care</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Special Offer -->
    <section class="py-20 bg-red-600 text-white">
        <div class="container mx-auto px-4 text-center">
            <h2 class="font-russo text-5xl mb-6">SPECIAL OFFER</h2>
            <p class="text-3xl mb-8">$50 OFF Any Service Over $200</p>
            <button class="bg-white text-red-600 px-8 py-4 rounded font-bold hover:bg-gray-100">
                Claim Offer Now
            </button>
        </div>
    </section>
</body>
</html>`
}

// Real Estate Website - Luxury, professional, trustworthy
function generateRealEstateWebsite(business: BusinessData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Your Dream Home Awaits</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .luxury-gradient {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }
        .property-card {
            transition: all 0.4s ease;
        }
        .property-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body class="font-inter bg-gray-50">
    <!-- Luxury Navigation -->
    <nav class="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-lg">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-5">
                <h1 class="font-playfair text-3xl font-bold">${business.name}</h1>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#properties" class="text-gray-700 hover:text-blue-900">Properties</a>
                    <a href="#services" class="text-gray-700 hover:text-blue-900">Services</a>
                    <a href="#agents" class="text-gray-700 hover:text-blue-900">Agents</a>
                    <button class="bg-blue-900 text-white px-6 py-3 rounded hover:bg-blue-800">
                        Schedule Viewing
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero -->
    <section class="pt-20 min-h-screen flex items-center luxury-gradient text-white">
        <div class="container mx-auto px-4">
            <div class="max-w-3xl">
                <h1 class="font-playfair text-6xl md:text-7xl mb-6">
                    Find Your Perfect Home in ${business.location}
                </h1>
                <p class="text-xl mb-8 opacity-90">
                    With ${business.totalReviews}+ successful transactions and ${business.rating}-star service, 
                    we make your real estate dreams come true.
                </p>
                <div class="flex flex-col sm:flex-row gap-4">
                    <button class="bg-white text-gray-900 px-8 py-4 rounded font-semibold hover:bg-gray-100">
                        Browse Properties
                    </button>
                    <button class="border-2 border-white px-8 py-4 rounded font-semibold hover:bg-white hover:text-gray-900">
                        Get Home Valuation
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Properties -->
    <section id="properties" class="py-20">
        <div class="container mx-auto px-4">
            <h2 class="font-playfair text-5xl text-center mb-12">Featured Properties</h2>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="property-card bg-white rounded-lg overflow-hidden shadow-lg">
                    <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400" 
                         class="w-full h-64 object-cover">
                    <div class="p-6">
                        <p class="text-3xl font-bold mb-2">$850,000</p>
                        <p class="text-gray-600 mb-4">4 bed • 3 bath • 2,500 sqft</p>
                        <button class="text-blue-900 font-semibold">View Details →</button>
                    </div>
                </div>
                
                <div class="property-card bg-white rounded-lg overflow-hidden shadow-lg">
                    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400" 
                         class="w-full h-64 object-cover">
                    <div class="p-6">
                        <p class="text-3xl font-bold mb-2">$1,200,000</p>
                        <p class="text-gray-600 mb-4">5 bed • 4 bath • 3,200 sqft</p>
                        <button class="text-blue-900 font-semibold">View Details →</button>
                    </div>
                </div>
                
                <div class="property-card bg-white rounded-lg overflow-hidden shadow-lg">
                    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400" 
                         class="w-full h-64 object-cover">
                    <div class="p-6">
                        <p class="text-3xl font-bold mb-2">$650,000</p>
                        <p class="text-gray-600 mb-4">3 bed • 2 bath • 1,800 sqft</p>
                        <button class="text-blue-900 font-semibold">View Details →</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</body>
</html>`
}

// Tech/Software Company - Modern, innovative, cutting-edge
function generateTechWebsite(business: BusinessData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Innovation Delivered</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Space Grotesk', sans-serif; }
        .tech-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .glow {
            box-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
        }
        .cyber-grid {
            background-image: linear-gradient(rgba(102, 126, 234, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(102, 126, 234, 0.1) 1px, transparent 1px);
            background-size: 50px 50px;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        .float { animation: float 4s ease-in-out infinite; }
    </style>
</head>
<body class="bg-gray-900 text-white">
    <!-- Futuristic Navigation -->
    <nav class="fixed w-full z-50 bg-gray-900/90 backdrop-blur-md border-b border-purple-500/20">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    ${business.name}
                </h1>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#solutions" class="hover:text-purple-400 transition">Solutions</a>
                    <a href="#tech" class="hover:text-purple-400 transition">Technology</a>
                    <a href="#about" class="hover:text-purple-400 transition">About</a>
                    <button class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-lg hover:shadow-lg glow transition">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-20 min-h-screen flex items-center relative cyber-grid">
        <div class="container mx-auto px-4 relative z-10">
            <div class="text-center">
                <div class="inline-block mb-6 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/50">
                    <span class="text-purple-400">⚡ Next-Gen Technology</span>
                </div>
                <h1 class="text-6xl md:text-8xl font-bold mb-6">
                    <span class="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Build The Future
                    </span>
                </h1>
                <p class="text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
                    Cutting-edge solutions trusted by ${business.totalReviews}+ businesses. 
                    ${business.rating}-star rated innovation.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button class="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-lg font-semibold hover:shadow-xl glow transition">
                        Start Free Trial
                    </button>
                    <button class="border border-purple-500 px-8 py-4 rounded-lg font-semibold hover:bg-purple-500/20 transition">
                        Watch Demo
                    </button>
                </div>
                
                <!-- Floating Tech Icons -->
                <div class="mt-20 flex justify-center space-x-12">
                    <div class="float" style="animation-delay: 0s;">
                        <div class="w-20 h-20 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <span class="text-3xl">🚀</span>
                        </div>
                    </div>
                    <div class="float" style="animation-delay: 1s;">
                        <div class="w-20 h-20 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <span class="text-3xl">💡</span>
                        </div>
                    </div>
                    <div class="float" style="animation-delay: 2s;">
                        <div class="w-20 h-20 bg-pink-500/20 rounded-lg flex items-center justify-center">
                            <span class="text-3xl">⚙️</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features -->
    <section id="solutions" class="py-20 bg-gray-800">
        <div class="container mx-auto px-4">
            <h2 class="text-5xl font-bold text-center mb-12">Our Solutions</h2>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition">
                    <div class="text-4xl mb-4">🔐</div>
                    <h3 class="text-2xl font-bold mb-4">Enterprise Security</h3>
                    <p class="text-gray-400">Advanced protection for your digital assets</p>
                </div>
                
                <div class="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition">
                    <div class="text-4xl mb-4">☁️</div>
                    <h3 class="text-2xl font-bold mb-4">Cloud Solutions</h3>
                    <p class="text-gray-400">Scalable infrastructure for modern business</p>
                </div>
                
                <div class="bg-gradient-to-br from-pink-500/10 to-blue-500/10 rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition">
                    <div class="text-4xl mb-4">🤖</div>
                    <h3 class="text-2xl font-bold mb-4">AI Integration</h3>
                    <p class="text-gray-400">Intelligent automation that drives results</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="py-20 tech-gradient">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-5xl font-bold mb-6">Ready to Transform?</h2>
            <p class="text-2xl mb-8">Join the innovation revolution in ${business.location}</p>
            <button class="bg-white text-gray-900 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition">
                Get Started Today
            </button>
        </div>
    </section>
</body>
</html>`
}

// Creative Modern Website for other categories
function generateCreativeModernWebsite(business: BusinessData): string {
  // This uses creative layouts with asymmetric designs, bold typography, and unique animations
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Excellence Redefined</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
    <style>
        .font-archivo { font-family: 'Archivo', sans-serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
        .creative-gradient {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }
        .blob {
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            animation: blob 8s ease-in-out infinite;
        }
        @keyframes blob {
            0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
            50% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; }
        }
        .reveal {
            animation: reveal 1s ease-out;
        }
        @keyframes reveal {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="font-dm bg-gray-50">
    <!-- Creative Navigation -->
    <nav class="fixed w-full z-50 bg-white/80 backdrop-blur-lg">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-5">
                <h1 class="font-archivo text-2xl font-bold">${business.name}</h1>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#about" class="text-gray-700 hover:text-pink-600">About</a>
                    <a href="#services" class="text-gray-700 hover:text-pink-600">Services</a>
                    <a href="#contact" class="text-gray-700 hover:text-pink-600">Contact</a>
                    <button class="creative-gradient text-white px-6 py-3 rounded-full font-semibold">
                        Let's Talk
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Asymmetric Hero -->
    <section class="pt-20 min-h-screen flex items-center relative overflow-hidden">
        <div class="absolute top-20 right-0 w-96 h-96 creative-gradient opacity-30 blob"></div>
        <div class="absolute bottom-20 left-0 w-80 h-80 bg-purple-400 opacity-20 blob" style="animation-delay: 4s;"></div>
        
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div class="reveal">
                    <h1 class="font-archivo text-6xl md:text-7xl font-bold mb-6">
                        We Make<br>
                        <span class="creative-gradient bg-clip-text text-transparent">Amazing</span><br>
                        Happen
                    </h1>
                    <p class="text-xl mb-8 text-gray-600">
                        ${business.totalReviews}+ happy clients • ${business.rating}★ rated service
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button class="creative-gradient text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition">
                            Start Your Journey
                        </button>
                        <button class="border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition">
                            Learn More
                        </button>
                    </div>
                </div>
                <div class="relative">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-4">
                            <div class="bg-yellow-200 rounded-2xl p-8 transform rotate-3">
                                <p class="font-archivo text-4xl font-bold">${business.rating}</p>
                                <p>Star Rating</p>
                            </div>
                            <div class="bg-pink-200 rounded-2xl p-8 transform -rotate-3">
                                <p class="font-archivo text-4xl font-bold">100%</p>
                                <p>Satisfaction</p>
                            </div>
                        </div>
                        <div class="space-y-4 mt-12">
                            <div class="bg-purple-200 rounded-2xl p-8 transform -rotate-3">
                                <p class="font-archivo text-4xl font-bold">${business.totalReviews}+</p>
                                <p>Happy Clients</p>
                            </div>
                            <div class="bg-blue-200 rounded-2xl p-8 transform rotate-3">
                                <p class="font-archivo text-4xl font-bold">24/7</p>
                                <p>Support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Creative Services -->
    <section id="services" class="py-20">
        <div class="container mx-auto px-4">
            <h2 class="font-archivo text-5xl font-bold text-center mb-12">What We Do</h2>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="group">
                    <div class="bg-gradient-to-br from-yellow-200 to-orange-200 rounded-3xl p-8 h-64 flex flex-col justify-end transform group-hover:scale-105 transition">
                        <h3 class="font-archivo text-2xl font-bold">Excellence</h3>
                        <p class="mt-2">Delivering outstanding results every time</p>
                    </div>
                </div>
                
                <div class="group">
                    <div class="bg-gradient-to-br from-pink-200 to-purple-200 rounded-3xl p-8 h-64 flex flex-col justify-end transform group-hover:scale-105 transition">
                        <h3 class="font-archivo text-2xl font-bold">Innovation</h3>
                        <p class="mt-2">Creative solutions for modern challenges</p>
                    </div>
                </div>
                
                <div class="group">
                    <div class="bg-gradient-to-br from-blue-200 to-green-200 rounded-3xl p-8 h-64 flex flex-col justify-end transform group-hover:scale-105 transition">
                        <h3 class="font-archivo text-2xl font-bold">Partnership</h3>
                        <p class="mt-2">Working together for your success</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="py-20 bg-gray-900 text-white">
        <div class="container mx-auto px-4 text-center">
            <h2 class="font-archivo text-5xl font-bold mb-6">Let's Create Something Amazing</h2>
            <p class="text-xl mb-8">Located in ${business.location} • Available Worldwide</p>
            <button class="creative-gradient text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition">
                Start Conversation
            </button>
        </div>
    </section>
</body>
</html>`
}
