import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { jsPDF } from 'jspdf';
import About from '../components/About';
import Button from '../components/Button';
import API from '../api';

import '../donation.css';
import donate1 from "../assets/donate1.jpeg";
import donate2 from "../assets/donate1.jpeg";

const quickAmounts = [20, 50, 100, 200, 500];

const Donations = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides] = useState([{ img: donate1 }, { img: donate2 }]);
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [message, setMessage] = useState('');

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      amount: '',
      name: '',
      campaign: 'Offering',
      anonymous: false
    }
  });

  const watchAnonymous = watch('anonymous');
  const watchAmount = watch('amount');

  // Slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Modal scroll lock
  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'auto';
  }, [showModal]);

  const selectQuickAmount = (amt) => setValue('amount', amt);

  const generatePDF = (data) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: [350, 500] });
    doc.setFontSize(18);
    doc.text('Donation Receipt', 20, 40);
    doc.setFontSize(12);
    doc.text(`Church: Pillar Of Zion Church`, 20, 70);
    doc.text(`Campaign: ${data.campaign}`, 20, 100);
    doc.text(`Amount: ₵${data.amount}`, 20, 130);
    doc.text(`Donor: ${data.name}`, 20, 160);
    doc.text(`Reference: ${data.reference}`, 20, 190);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 220);
    doc.text('Thank you for supporting the work of God.', 20, 260);
    return doc;
  };

  const downloadReceipt = () => {
    if (!receiptData) return;
    const doc = generatePDF(receiptData);
    doc.save(`Donation_Receipt_${receiptData.reference}.pdf`);
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        amount: formData.amount,
        donor_name: formData.anonymous ? 'Anonymous' : formData.name,
        campaign: formData.campaign
      };
      const { data } = await API.post('/api/donations', payload);

      if (!data.authorization_url) {
        setMessage('Donation failed: missing payment URL');
        setLoading(false);
        return;
      }

      setReceiptData({
        amount: payload.amount,
        name: payload.donor_name,
        campaign: payload.campaign,
        reference: data.reference || 'POZ-' + Date.now()
      });

      // Redirect to payment
      window.location.href = data.authorization_url;
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Donation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-page">
      {/* Hero Slider */}
      <section className="parallax-slider-two">
        <div className="slides-container">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.img})` }}
            ></div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="donation-center-cta">
        <Button onClick={() => setShowModal(true)}>Give Now</Button>
      </section>

      {/* About */}
      <section className="about-over-footer">
        <About />
      </section>

      {/* Donation Modal */}
      {showModal && (
        <div className="donation-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="donation-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>Make a Secure Donation</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="donation-form">
              <select {...register('campaign')}>
                <option>Offering</option>
                <option>Tithe</option>
                <option>Seed</option>
                <option>Church Project</option>
              </select>

              <div className="quick-amounts">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className={Number(watchAmount) === amt ? 'active' : ''}
                    onClick={() => selectQuickAmount(amt)}
                  >
                    ₵{amt}
                  </button>
                ))}
              </div>

              <input
                type="number"
                placeholder="Amount (GHS)"
                {...register('amount', { required: true, min: 1 })}
              />
              {errors.amount && <p className="form-error">Please enter a valid amount</p>}

              {!watchAnonymous && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    {...register('name', { required: !watchAnonymous })}
                  />
                  {errors.name && <p className="form-error">Name is required</p>}
                </>
              )}

              <label className="checkbox-row">
                <input type="checkbox" {...register('anonymous')} />
                Give anonymously
              </label>

              <Button type="submit" disabled={loading}>
                {loading ? 'Processing…' : 'Give with Paystack'}
              </Button>

              {message && <p className="page-message">{message}</p>}
              <p className="secure-note">🔒 Secure · Cards · Mobile Money · Bank Transfer</p>
            </form>

            {receiptData && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <Button onClick={downloadReceipt}>Download PDF</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Donations;
