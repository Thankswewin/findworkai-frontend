// Enhanced website generator with guaranteed business-specific styling
// This ensures each business type gets a unique, tailored website

interface BusinessData {
  name: string
  category?: string
  type?: string
  location?: string
  rating?: number
  totalReviews?: number
  phone?: string
  address?: string
  services?: string[]
  description?: string
}

// Map business categories to specific types
function normalizeBusinessType(business: BusinessData): string {
  const category = (business.category || business.type || '').toLowerCase()
  
  // Restaurant variations
  if (category.includes('restaurant') || category.includes('food') || 
      category.includes('dining') || category.includes('cafe') || 
      category.includes('bakery') || category.includes('bar') ||
      category.includes('pizza') || category.includes('burger')) {
    return 'restaurant'
  }
  
  // Medical/Healthcare
  if (category.includes('medical') || category.includes('health') || 
      category.includes('clinic') || category.includes('hospital') ||
      category.includes('dental') || category.includes('doctor')) {
    return 'medical'
  }
  
  // Fitness/Gym
  if (category.includes('fitness') || category.includes('gym') || 
      category.includes('yoga') || category.includes('pilates') ||
      category.includes('crossfit') || category.includes('training')) {
    return 'fitness'
  }
  
  // Beauty/Salon
  if (category.includes('beauty') || category.includes('salon') || 
      category.includes('spa') || category.includes('nail') ||
      category.includes('hair') || category.includes('makeup')) {
    return 'beauty'
  }
  
  // Legal
  if (category.includes('law') || category.includes('legal') || 
      category.includes('attorney') || category.includes('lawyer')) {
    return 'legal'
  }
  
  // Automotive
  if (category.includes('auto') || category.includes('car') || 
      category.includes('mechanic') || category.includes('repair')) {
    return 'automotive'
  }
  
  // Technology
  if (category.includes('tech') || category.includes('software') || 
      category.includes('it ') || category.includes('computer')) {
    return 'technology'
  }
  
  // Retail
  if (category.includes('shop') || category.includes('store') || 
      category.includes('retail') || category.includes('boutique')) {
    return 'retail'
  }
  
  // Real Estate
  if (category.includes('real estate') || category.includes('realty') || 
      category.includes('property')) {
    return 'realestate'
  }
  
  return 'business' // Generic fallback
}

// Get business-specific color schemes
function getBusinessColors(type: string): { primary: string, secondary: string, accent: string } {
  const colors: Record<string, any> = {
    restaurant: {
      primary: '#DC2626', // Red
      secondary: '#F59E0B', // Amber
      accent: '#059669', // Emerald
      gradient: 'from-red-600 to-orange-500'
    },
    medical: {
      primary: '#0EA5E9', // Sky blue
      secondary: '#06B6D4', // Cyan
      accent: '#10B981', // Emerald
      gradient: 'from-blue-500 to-cyan-500'
    },
    fitness: {
      primary: '#16A34A', // Green
      secondary: '#84CC16', // Lime
      accent: '#F59E0B', // Amber
      gradient: 'from-green-600 to-lime-500'
    },
    beauty: {
      primary: '#EC4899', // Pink
      secondary: '#F472B6', // Light pink
      accent: '#A78BFA', // Purple
      gradient: 'from-pink-500 to-purple-500'
    },
    legal: {
      primary: '#1E40AF', // Navy blue
      secondary: '#3730A3', // Indigo
      accent: '#B8860B', // Gold
      gradient: 'from-blue-800 to-indigo-700'
    },
    automotive: {
      primary: '#DC2626', // Red
      secondary: '#1F2937', // Gray
      accent: '#F59E0B', // Amber
      gradient: 'from-red-600 to-gray-800'
    },
    technology: {
      primary: '#6366F1', // Indigo
      secondary: '#8B5CF6', // Purple
      accent: '#10B981', // Emerald
      gradient: 'from-indigo-500 to-purple-600'
    },
    retail: {
      primary: '#7C3AED', // Violet
      secondary: '#EC4899', // Pink
      accent: '#F59E0B', // Amber
      gradient: 'from-violet-600 to-pink-500'
    },
    realestate: {
      primary: '#0891B2', // Cyan
      secondary: '#10B981', // Emerald
      accent: '#F59E0B', // Amber
      gradient: 'from-cyan-600 to-emerald-500'
    },
    business: {
      primary: '#3B82F6', // Blue
      secondary: '#8B5CF6', // Purple
      accent: '#10B981', // Emerald
      gradient: 'from-blue-500 to-purple-500'
    }
  }
  
  return colors[type] || colors.business
}

// Get business-specific content and features
function getBusinessContent(type: string, business: BusinessData) {
  const contents: Record<string, any> = {
    restaurant: {
      hero: `Experience Culinary Excellence at ${business.name}`,
      subhero: 'Savor unforgettable flavors in every bite',
      services: ['Dine-In Experience', 'Takeout & Delivery', 'Private Events', 'Catering Services'],
      features: [
        { icon: '🍽️', title: 'Exquisite Menu', desc: 'Chef-crafted dishes using fresh, local ingredients' },
        { icon: '⭐', title: `${business.rating || 4.5} Star Rating`, desc: `Loved by ${business.totalReviews || 'countless'} satisfied diners` },
        { icon: '🎉', title: 'Perfect Ambiance', desc: 'Ideal for romantic dinners and celebrations' },
        { icon: '📱', title: 'Easy Reservations', desc: 'Book your table online in seconds' }
      ],
      cta: 'Reserve Your Table',
      sections: ['menu', 'reservations', 'gallery', 'reviews']
    },
    medical: {
      hero: `Your Health, Our Priority at ${business.name}`,
      subhero: 'Comprehensive healthcare with a personal touch',
      services: ['Primary Care', 'Specialist Consultations', 'Preventive Health', 'Telehealth Services'],
      features: [
        { icon: '👨‍⚕️', title: 'Expert Physicians', desc: 'Board-certified doctors with years of experience' },
        { icon: '🏥', title: 'Modern Facilities', desc: 'State-of-the-art medical equipment and technology' },
        { icon: '💊', title: 'Comprehensive Care', desc: 'From diagnosis to treatment and follow-up' },
        { icon: '📅', title: 'Flexible Scheduling', desc: 'Same-day appointments available' }
      ],
      cta: 'Book Appointment',
      sections: ['services', 'doctors', 'patient-portal', 'insurance']
    },
    fitness: {
      hero: `Transform Your Body at ${business.name}`,
      subhero: 'Where fitness meets motivation',
      services: ['Personal Training', 'Group Classes', 'Nutrition Coaching', 'Virtual Workouts'],
      features: [
        { icon: '💪', title: 'Expert Trainers', desc: 'Certified professionals dedicated to your success' },
        { icon: '🏋️', title: 'Premium Equipment', desc: 'Latest fitness technology and equipment' },
        { icon: '📊', title: 'Track Progress', desc: 'Monitor your fitness journey with our app' },
        { icon: '🎯', title: 'Custom Programs', desc: 'Tailored workouts for your specific goals' }
      ],
      cta: 'Start Your Journey',
      sections: ['classes', 'trainers', 'membership', 'schedule']
    },
    beauty: {
      hero: `Discover Your Beauty at ${business.name}`,
      subhero: 'Where beauty meets expertise',
      services: ['Hair Styling', 'Skincare Treatments', 'Nail Services', 'Makeup Artistry'],
      features: [
        { icon: '✨', title: 'Expert Stylists', desc: 'Award-winning professionals at your service' },
        { icon: '🌿', title: 'Premium Products', desc: 'Only the finest beauty products and treatments' },
        { icon: '💆', title: 'Relaxing Experience', desc: 'Luxurious spa-like atmosphere' },
        { icon: '📸', title: 'Instagram Worthy', desc: 'Look and feel your absolute best' }
      ],
      cta: 'Book Your Appointment',
      sections: ['services', 'gallery', 'team', 'booking']
    }
  }
  
  return contents[type] || {
    hero: `Welcome to ${business.name}`,
    subhero: 'Excellence in everything we do',
    services: ['Professional Services', 'Consulting', 'Support', 'Solutions'],
    features: [
      { icon: '⭐', title: 'Top Rated', desc: `${business.rating || 5} star service quality` },
      { icon: '🏆', title: 'Industry Leaders', desc: 'Years of experience and expertise' },
      { icon: '🤝', title: 'Customer First', desc: 'Your satisfaction is our priority' },
      { icon: '📞', title: '24/7 Support', desc: 'Always here when you need us' }
    ],
    cta: 'Get Started',
    sections: ['services', 'about', 'testimonials', 'contact']
  }
}

export function generateEnhancedBusinessWebsite(business: BusinessData): string {
  // Normalize business type for consistent styling
  const businessType = normalizeBusinessType(business)
  const colors = getBusinessColors(businessType)
  const content = getBusinessContent(businessType, business)
  
  // Ensure we have valid business data
  const businessName = business.name || 'Premium Business'
  const rating = business.rating || 5
  const reviews = business.totalReviews || 0
  const location = business.location || business.address || 'Your Local Area'
  const phone = business.phone || '1-800-BUSINESS'
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName} - ${businessType === 'restaurant' ? 'Restaurant' : businessType.charAt(0).toUpperCase() + businessType.slice(1)} Services</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { font-family: 'Inter', sans-serif; }
        .gradient-bg {
            background: linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}20 100%);
        }
        .text-gradient {
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .btn-primary {
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
        }
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
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
<body>
    <!-- Navigation -->
    <nav class="bg-white shadow-lg sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-gradient">${businessName}</h1>
                    <p class="text-sm text-gray-600">${businessType === 'restaurant' ? '🍽️ Restaurant' : businessType === 'medical' ? '🏥 Healthcare' : businessType === 'fitness' ? '💪 Fitness Center' : businessType === 'beauty' ? '✨ Beauty Salon' : '🏢 ' + businessType.charAt(0).toUpperCase() + businessType.slice(1)}</p>
                </div>
                <div class="hidden md:flex items-center gap-6">
                    <a href="#services" class="hover:text-[${colors.primary}] transition">Services</a>
                    <a href="#about" class="hover:text-[${colors.primary}] transition">About</a>
                    <a href="#reviews" class="hover:text-[${colors.primary}] transition">Reviews</a>
                    <a href="#contact" class="hover:text-[${colors.primary}] transition">Contact</a>
                    <button class="btn-primary text-white px-6 py-2 rounded-full hover:shadow-lg transition">
                        ${content.cta}
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="gradient-bg py-20">
        <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto text-center">
                <div class="inline-flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full mb-6">
                    <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span class="text-sm font-medium">Open Now • ${rating}⭐ (${reviews} reviews)</span>
                </div>
                
                <h1 class="text-5xl md:text-6xl font-bold mb-6">
                    ${content.hero}
                </h1>
                
                <p class="text-xl text-gray-600 mb-8">
                    ${content.subhero}
                </p>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button class="btn-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition">
                        ${content.cta}
                    </button>
                    <button class="bg-white border-2 border-gray-200 px-8 py-4 rounded-lg font-semibold text-lg hover:border-[${colors.primary}] transition">
                        Learn More
                    </button>
                </div>
                
                <!-- Trust Badges -->
                <div class="flex flex-wrap justify-center gap-8 mt-12">
                    <div class="flex items-center gap-2">
                        <span class="text-3xl">⭐</span>
                        <div class="text-left">
                            <p class="font-bold">${rating}/5 Rating</p>
                            <p class="text-sm text-gray-600">${reviews}+ Reviews</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-3xl">📍</span>
                        <div class="text-left">
                            <p class="font-bold">Local Business</p>
                            <p class="text-sm text-gray-600">${location}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-3xl">✅</span>
                        <div class="text-left">
                            <p class="font-bold">Verified</p>
                            <p class="text-sm text-gray-600">Licensed & Insured</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="py-20">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold mb-4">Why Choose ${businessName}?</h2>
                <p class="text-xl text-gray-600">Discover what makes us special</p>
            </div>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${content.features.map((feature: any) => `
                <div class="feature-card bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
                    <div class="text-4xl mb-4">${feature.icon}</div>
                    <h3 class="text-xl font-semibold mb-2">${feature.title}</h3>
                    <p class="text-gray-600">${feature.desc}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-20 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold mb-4">Our Services</h2>
                <p class="text-xl text-gray-600">Professional solutions tailored for you</p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                ${content.services.map((service: string, index: number) => `
                <div class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-lg flex items-center justify-center text-white font-bold">
                            ${index + 1}
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold">${service}</h3>
                            <p class="text-gray-600">Premium quality service guaranteed</p>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-br ${colors.gradient} text-white">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p class="text-xl mb-8 opacity-90">Join ${reviews > 0 ? reviews + '+' : 'our'} happy customers today</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button class="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition">
                    ${content.cta} Now
                </button>
                <button class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition">
                    Call ${phone}
                </button>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20">
        <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold mb-4">Get In Touch</h2>
                    <p class="text-xl text-gray-600">We'd love to hear from you</p>
                </div>
                
                <div class="grid md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div class="text-3xl mb-2">📍</div>
                        <h3 class="font-semibold mb-1">Location</h3>
                        <p class="text-gray-600">${location}</p>
                    </div>
                    <div>
                        <div class="text-3xl mb-2">📞</div>
                        <h3 class="font-semibold mb-1">Phone</h3>
                        <p class="text-gray-600">${phone}</p>
                    </div>
                    <div>
                        <div class="text-3xl mb-2">⏰</div>
                        <h3 class="font-semibold mb-1">Hours</h3>
                        <p class="text-gray-600">Mon-Sat: 9AM-8PM</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8">
        <div class="container mx-auto px-4 text-center">
            <p class="mb-2">&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
            <p class="text-sm text-gray-400">Powered by FindWorkAI</p>
        </div>
    </footer>

    <script>
        // Add smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    </script>
</body>
</html>`
}
