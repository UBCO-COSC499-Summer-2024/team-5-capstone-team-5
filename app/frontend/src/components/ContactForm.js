import React, { useState } from 'react';
import { useTheme } from '../App';

const ContactForm = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append('service_id', 'service_23da9ct');
    form.append('template_id', 'template_z2t7ws8');
    form.append('user_id', '8nP8DXFpl1ngs-CfD');
    form.append('from_name', formData.name);
    form.append('from_email', formData.email);
    form.append('subject', formData.subject);
    form.append('message', formData.message);

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send-form', {
        method: 'POST',
        body: form,
      });

      if (response.ok) {
        setStateMessage('Message sent!');
      } else {
        const errorData = await response.json();
        setStateMessage(`Something went wrong: ${errorData.error}`);
      }
    } catch (error) {
      setStateMessage('Something went wrong, please try again later');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setStateMessage(null);
      }, 5000); // hide message after 5 seconds
    }

    // Clears the form after sending the email
    e.target.reset();
  };

  return (
    <div className={`contact p-8 shadow rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-4xl font-bold text-blue-900">Contact Us</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-500' : 'bg-gray-200 text-black border-gray-300'}`}
            style={{ color: theme === 'dark' ? 'white' : 'black' }}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-500' : 'bg-gray-200 text-black border-gray-300'}`}
            style={{ color: theme === 'dark' ? 'white' : 'black' }}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-500' : 'bg-gray-200 text-black border-gray-300'}`}
            style={{ color: theme === 'dark' ? 'white' : 'black' }}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-500' : 'bg-gray-200 text-black border-gray-300'}`}
            style={{ color: theme === 'dark' ? 'white' : 'black' }}
          />
        </div>
        <button
          type="submit"
          className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-black'}`}
          disabled={isSubmitting}
        >
          Send Message
        </button>
        {stateMessage && <p>{stateMessage}</p>}
      </form>
    </div>
  );
};

export default ContactForm;
