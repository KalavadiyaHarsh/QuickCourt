import React from 'react';
import { FaUsers, FaTrophy, FaHeart, FaStar } from 'react-icons/fa';

const About = () => {
  const stats = [
    { number: '500+', label: 'Happy Customers', icon: FaUsers },
    { number: '50+', label: 'Sports Venues', icon: FaTrophy },
    { number: '1000+', label: 'Bookings Made', icon: FaHeart },
    { number: '4.8', label: 'Average Rating', icon: FaStar },
  ];

  const team = [
    {
      name: 'John Smith',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Passionate about making sports accessible to everyone.'
    },
    {
      name: 'Sarah Johnson',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Ensuring smooth operations and customer satisfaction.'
    },
    {
      name: 'Mike Chen',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Building the technology that powers QuickCourt.'
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About QuickCourt
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Revolutionizing sports venue booking with seamless technology and exceptional service
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary">
                Our Mission
              </h2>
              <p className="text-lg mb-6">
                At QuickCourt, we believe that sports should be accessible to everyone. Our mission is to connect sports enthusiasts with quality venues through an intuitive, reliable, and user-friendly platform.
              </p>
              <p className="text-lg mb-6">
                We're committed to fostering a community where people can easily discover, book, and enjoy their favorite sports activities, creating lasting memories and promoting healthy lifestyles.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="feature-card">
                  <FaUsers className="feature-icon" />
                  <h3 className="text-xl font-bold mb-2">Community First</h3>
                  <p className="text-neutral-600">Building a vibrant sports community</p>
                </div>
                <div className="feature-card">
                  <FaTrophy className="feature-icon" />
                  <h3 className="text-xl font-bold mb-2">Quality Venues</h3>
                  <p className="text-neutral-600">Curated selection of premium facilities</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"
                alt="Sports Community"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-sm bg-neutral-50">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <stat.icon className="text-4xl text-primary mb-4 mx-auto" />
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              These core values guide everything we do at QuickCourt
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="feature-icon">
                <FaHeart />
              </div>
              <h3 className="text-xl font-bold mb-3">Passion</h3>
              <p className="text-neutral-600">
                We're passionate about sports and technology, and it shows in everything we build.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaStar />
              </div>
              <h3 className="text-xl font-bold mb-3">Excellence</h3>
              <p className="text-neutral-600">
                We strive for excellence in every interaction, from our platform to our customer service.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3 className="text-xl font-bold mb-3">Community</h3>
              <p className="text-neutral-600">
                We believe in the power of community and fostering connections through sports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-sm bg-neutral-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              The passionate individuals behind QuickCourt's success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <div className="card-body">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-primary-100"
                  />
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-primary font-semibold mb-3">{member.role}</p>
                  <p className="text-neutral-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="card bg-gradient-to-r from-primary-600 to-accent-600 text-white text-center">
            <div className="card-body">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-6 opacity-90">
                Join thousands of sports enthusiasts who trust QuickCourt for their venue bookings
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="/venues" className="btn btn-secondary btn-lg">
                  Browse Venues
                </a>
                <a href="/contact" className="btn btn-outline btn-lg">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 