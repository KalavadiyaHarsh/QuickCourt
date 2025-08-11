import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: FaPhone,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      link: 'tel:+15551234567'
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      details: ['hello@quickcourt.com', 'support@quickcourt.com'],
      link: 'mailto:hello@quickcourt.com'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Address',
      details: ['123 Sports Avenue', 'New York, NY 10001', 'United States'],
      link: 'https://maps.google.com'
    },
    {
      icon: FaClock,
      title: 'Business Hours',
      details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM', 'Sunday: Closed'],
      link: null
    }
  ];

  const socialLinks = [
    { icon: FaFacebook, name: 'Facebook', url: 'https://facebook.com' },
    { icon: FaTwitter, name: 'Twitter', url: 'https://twitter.com' },
    { icon: FaInstagram, name: 'Instagram', url: 'https://instagram.com' },
    { icon: FaLinkedin, name: 'LinkedIn', url: 'https://linkedin.com' }
  ];

  const faqs = [
    {
      question: 'How do I book a venue?',
      answer: 'Simply browse our venue listings, select your preferred time slot, and complete the booking process. You\'ll receive instant confirmation.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and digital wallets including PayPal, Apple Pay, and Google Pay.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking up to 24 hours before the scheduled time. Cancellations are subject to our refund policy.'
    },
    {
      question: 'Do you offer group bookings?',
      answer: 'Absolutely! We support group bookings for teams and events. Contact our support team for special arrangements.'
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Get in touch with our team. We're here to help with any questions or support you need.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  <info.icon />
                </div>
                <h3 className="text-xl font-bold mb-3">{info.title}</h3>
                {info.link ? (
                  <a href={info.link} className="block hover:text-primary-600 transition-colors">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-neutral-600 mb-1">{detail}</p>
                    ))}
                  </a>
                ) : (
                  info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-neutral-600 mb-1">{detail}</p>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="section-sm bg-neutral-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="What is this about?"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-input form-textarea"
                    placeholder="Tell us more about your inquiry..."
                    rows="6"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg w-full"
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading"></div>
                      Sending Message...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Find Us</h2>
              <div className="card h-96">
                <div className="card-body p-0">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2154567890123!2d-74.00601508459372!3d40.71277597933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a165bedccab%3A0x2cb2ddf003b5ae01!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1234567890123"
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: '12px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="QuickCourt Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Find answers to common questions about our services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <div className="card-body">
                  <h3 className="text-xl font-bold mb-3 text-primary">{faq.question}</h3>
                  <p className="text-neutral-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="section-sm bg-neutral-50">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Follow Us</h2>
            <p className="text-lg text-neutral-600">
              Stay connected with QuickCourt on social media
            </p>
          </div>
          <div className="flex justify-center gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl hover:bg-primary-600 transition-colors"
                aria-label={social.name}
              >
                <social.icon />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="card bg-gradient-to-r from-primary-600 to-accent-600 text-white text-center">
            <div className="card-body">
              <h2 className="text-3xl font-bold mb-4">Need Immediate Help?</h2>
              <p className="text-xl mb-6 opacity-90">
                Our support team is available 24/7 to assist you with any urgent matters
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="tel:+15551234567" className="btn btn-secondary btn-lg">
                  Call Now
                </a>
                <a href="mailto:support@quickcourt.com" className="btn btn-outline btn-lg">
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 