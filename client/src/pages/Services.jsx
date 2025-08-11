import React from 'react';
import { FaSearch, FaCalendarAlt, FaCreditCard, FaStar, FaUsers, FaShieldAlt, FaMobileAlt, FaHeadset } from 'react-icons/fa';

const Services = () => {
  const services = [
    {
      icon: FaSearch,
      title: 'Smart Venue Discovery',
      description: 'Find the perfect sports venue near you with our intelligent search and filtering system.',
      features: ['Location-based search', 'Advanced filters', 'Real-time availability', 'Venue ratings & reviews']
    },
    {
      icon: FaCalendarAlt,
      title: 'Instant Booking',
      description: 'Book your preferred time slot instantly with our streamlined booking process.',
      features: ['Real-time availability', 'Instant confirmation', 'Flexible scheduling', 'Booking management']
    },
    {
      icon: FaCreditCard,
      title: 'Secure Payments',
      description: 'Multiple payment options with bank-grade security for worry-free transactions.',
      features: ['Multiple payment methods', 'Secure transactions', 'Instant receipts', 'Refund protection']
    },
    {
      icon: FaStar,
      title: 'Venue Reviews',
      description: 'Make informed decisions with authentic reviews and ratings from real users.',
      features: ['Verified reviews', 'Photo galleries', 'Detailed ratings', 'User feedback']
    },
    {
      icon: FaUsers,
      title: 'Community Features',
      description: 'Connect with fellow sports enthusiasts and build your sports community.',
      features: ['Player matching', 'Group bookings', 'Social features', 'Event organization']
    },
    {
      icon: FaShieldAlt,
      title: 'Trust & Safety',
      description: 'Your safety and satisfaction are our top priorities with comprehensive protection.',
      features: ['Verified venues', 'Insurance coverage', '24/7 support', 'Dispute resolution']
    }
  ];

  const features = [
    {
      icon: FaMobileAlt,
      title: 'Mobile App',
      description: 'Book venues on the go with our user-friendly mobile application.',
      comingSoon: false
    },
    {
      icon: FaHeadset,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help you with any questions or issues.',
      comingSoon: false
    },
    {
      icon: FaUsers,
      title: 'Team Management',
      description: 'Organize team events and manage group bookings with ease.',
      comingSoon: true
    },
    {
      icon: FaCalendarAlt,
      title: 'Recurring Bookings',
      description: 'Set up regular bookings for consistent training schedules.',
      comingSoon: true
    }
  ];

  const pricing = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for casual players',
      features: [
        'Browse venues',
        'Basic booking',
        'Standard support',
        'Venue reviews'
      ],
      popular: false
    },
    {
      name: 'Premium',
      price: '$9.99/month',
      description: 'For regular players',
      features: [
        'Everything in Basic',
        'Priority booking',
        'Premium support',
        'Advanced filters',
        'Booking history',
        'Favorite venues'
      ],
      popular: true
    },
    {
      name: 'Pro',
      price: '$19.99/month',
      description: 'For teams and organizers',
      features: [
        'Everything in Premium',
        'Team management',
        'Bulk bookings',
        'Analytics dashboard',
        'Custom scheduling',
        'API access'
      ],
      popular: false
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Everything you need to discover, book, and enjoy sports venues
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Comprehensive solutions designed to make sports venue booking seamless and enjoyable
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="feature-card">
                <service.icon className="feature-icon" />
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-neutral-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-neutral-600">
                      <FaStar className="text-primary text-xs mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-sm bg-neutral-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover the tools and features that make QuickCourt the preferred choice
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <feature.icon className="text-3xl text-primary mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{feature.title}</h3>
                        {feature.comingSoon && (
                          <span className="bg-accent-100 text-accent-700 text-xs px-2 py-1 rounded-full font-semibold">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-neutral-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Flexible pricing options to suit every type of sports enthusiast
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <div key={index} className={`card ${plan.popular ? 'ring-2 ring-primary-500 relative' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="card-body text-center">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-primary mb-2">{plan.price}</div>
                  <p className="text-neutral-600 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <FaStar className="text-primary text-sm mr-3" />
                        <span className="text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`btn btn-lg w-full ${plan.popular ? 'btn-primary' : 'btn-outline'}`}>
                    {plan.price === 'Free' ? 'Get Started' : 'Choose Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-sm bg-neutral-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Get started with QuickCourt in just three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Search Venues</h3>
              <p className="text-neutral-600">
                Use our smart search to find sports venues near you. Filter by sport, location, price, and availability.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Book Your Slot</h3>
              <p className="text-neutral-600">
                Choose your preferred time slot and book instantly. Get immediate confirmation and payment options.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Enjoy Your Game</h3>
              <p className="text-neutral-600">
                Arrive at the venue and enjoy your game! Leave reviews and book again for future sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="card bg-gradient-to-r from-primary-600 to-accent-600 text-white text-center">
            <div className="card-body">
              <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
              <p className="text-xl mb-6 opacity-90">
                Join thousands of sports enthusiasts who trust QuickCourt for their venue bookings
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="/venues" className="btn btn-secondary btn-lg">
                  Browse Venues
                </a>
                <a href="/register" className="btn btn-outline btn-lg">
                  Sign Up Free
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services; 